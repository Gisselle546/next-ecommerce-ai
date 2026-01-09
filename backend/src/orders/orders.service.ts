import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/pagination.helper';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private dataSource: DataSource,
    private cartService: CartService,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('order') private orderQueue: Queue,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get user's cart
      const cart = await this.cartService.getCart(userId);

      if (!cart.items || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // TODO: Get shipping address from ShippingService
      const shippingAddress = {
        fullName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
      };

      // Generate order number
      const orderNumber = this.generateOrderNumber();

      // Calculate totals
      const subtotal = cart.subtotal;
      const discount = cart.discount;
      const shippingFee = this.calculateShippingFee(subtotal);
      const tax = this.calculateTax(subtotal - discount);
      const total = subtotal - discount + shippingFee + tax;

      // Create order
      const order = this.ordersRepository.create({
        orderNumber,
        userId,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        couponCode: cart.couponCode,
        shippingAddress,
        notes: createOrderDto.notes,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Create order items (snapshots from cart)
      const orderItems = cart.items.map((cartItem) =>
        this.orderItemsRepository.create({
          orderId: savedOrder.id,
          productId: cartItem.productId,
          variantId: cartItem.variantId,
          productName: cartItem.product.name,
          variantName: cartItem.variant?.name,
          sku: cartItem.variant?.sku || cartItem.product.sku,
          quantity: cartItem.quantity,
          price: cartItem.price,
          subtotal: cartItem.subtotal,
        }),
      );

      await queryRunner.manager.save(orderItems);

      // TODO: Deduct inventory
      // TODO: Create payment intent

      // Queue order confirmation email
      await this.emailQueue.add('order-confirmation', {
        userId,
        orderId: savedOrder.id,
        orderNumber: savedOrder.orderNumber,
        total: savedOrder.total,
      });

      // Queue order processing job
      await this.orderQueue.add('process-order', {
        orderId: savedOrder.id,
      });

      // NOTE: Cart should only be cleared AFTER successful payment confirmation
      // The cart clearing is now moved to handlePaymentSuccess webhook handler
      // await this.cartService.clearCart(userId);

      await queryRunner.commitTransaction();

      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string, query: PaginationQueryDto): Promise<any> {
    const qb = this.ordersRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC');

    return paginate(qb, query);
  }

  async findAllAdmin(query: any): Promise<any> {
    const qb = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .orderBy('order.createdAt', 'DESC');

    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }

    if (query.paymentStatus) {
      qb.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: query.paymentStatus,
      });
    }

    return paginate(qb, query);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOneByUser(id: string, userId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    order.status = updateStatusDto.status;

    if (updateStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
      // Queue shipping notification email
      await this.emailQueue.add('order-shipped', {
        userId: order.userId,
        orderId: order.id,
        trackingNumber: order.trackingNumber,
      });
    } else if (updateStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
      // Queue delivery notification email
      await this.emailQueue.add('order-delivered', {
        userId: order.userId,
        orderId: order.id,
      });
    } else if (updateStatusDto.status === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();
      // TODO: Restore inventory
      // TODO: Process refund if payment completed
      // Queue cancellation notification
      await this.emailQueue.add('order-cancelled', {
        userId: order.userId,
        orderId: order.id,
      });
    }

    if (updateStatusDto.notes) {
      order.notes = updateStatusDto.notes;
    }

    return this.ordersRepository.save(order);
  }

  async updateTracking(
    id: string,
    updateTrackingDto: UpdateTrackingDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    order.trackingNumber = updateTrackingDto.trackingNumber;
    order.carrier = updateTrackingDto.carrier;
    order.status = OrderStatus.SHIPPED;
    order.shippedAt = new Date();

    return this.ordersRepository.save(order);
  }

  async cancelOrder(id: string, userId: string): Promise<Order> {
    const order = await this.findOneByUser(id, userId);

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PROCESSING
    ) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();

    // TODO: Restore inventory
    // TODO: Process refund if payment completed

    return this.ordersRepository.save(order);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  private calculateShippingFee(subtotal: number): number {
    // Free shipping over $100
    if (subtotal >= 100) return 0;
    return 9.99;
  }

  private calculateTax(amount: number): number {
    // 8% tax rate example
    return amount * 0.08;
  }
}
