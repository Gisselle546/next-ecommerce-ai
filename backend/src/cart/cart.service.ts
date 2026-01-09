import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantsRepository: Repository<ProductVariant>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartsRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product', 'items.variant'],
    });

    if (!cart) {
      cart = this.cartsRepository.create({ userId, items: [] });
      await this.cartsRepository.save(cart);
    }

    return cart;
  }

  async getCart(userId: string): Promise<Cart> {
    // Try cache first
    const cacheKey = `cart:${userId}`;
    const cached = await this.cacheManager.get<Cart>(cacheKey);
    if (cached) {
      return cached;
    }

    const cart = await this.getOrCreateCart(userId);
    cart.calculateTotals();

    // Cache for 10 minutes
    await this.cacheManager.set(cacheKey, cart, 600000);
    return cart;
  }

  private async invalidateCartCache(userId: string): Promise<void> {
    await this.cacheManager.del(`cart:${userId}`);
  }

  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    // Validate product exists and is active
    const product = await this.productsRepository.findOne({
      where: { id: addToCartDto.productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive');
    }

    // Check stock availability
    let availableStock = product.stock;
    let price = product.price;

    if (addToCartDto.variantId) {
      const variant = await this.variantsRepository.findOne({
        where: {
          id: addToCartDto.variantId,
          productId: addToCartDto.productId,
        },
      });

      if (!variant || !variant.isActive) {
        throw new NotFoundException('Product variant not found or inactive');
      }

      availableStock = variant.stock;
      price = variant.price;
    }

    if (availableStock < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) =>
        item.productId === addToCartDto.productId &&
        item.variantId === addToCartDto.variantId,
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += addToCartDto.quantity;
      existingItem.calculateSubtotal();
      await this.cartItemsRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.cartItemsRepository.create({
        cartId: cart.id,
        productId: addToCartDto.productId,
        variantId: addToCartDto.variantId,
        quantity: addToCartDto.quantity,
        price,
      });
      cartItem.calculateSubtotal();
      cart.items.push(await this.cartItemsRepository.save(cartItem));
    }

    cart.calculateTotals();
    await this.cartsRepository.save(cart);
    await this.invalidateCartCache(userId);

    return this.getCart(userId);
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock
    const product = await this.productsRepository.findOne({
      where: { id: item.productId },
    });

    let availableStock = product?.stock || 0;
    if (item.variantId) {
      const variant = await this.variantsRepository.findOne({
        where: { id: item.variantId },
      });
      availableStock = variant?.stock || 0;
    }

    if (availableStock < updateCartItemDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    item.quantity = updateCartItemDto.quantity;
    item.calculateSubtotal();
    await this.cartItemsRepository.save(item);

    cart.calculateTotals();
    await this.cartsRepository.save(cart);

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getCart(userId);

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemsRepository.remove(item);

    cart.calculateTotals();
    await this.cartsRepository.save(cart);

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    await this.cartItemsRepository.remove(cart.items);
    cart.items = [];
    cart.calculateTotals();
    await this.cartsRepository.save(cart);
    return cart;
  }

  async applyCoupon(
    userId: string,
    applyCouponDto: ApplyCouponDto,
  ): Promise<Cart> {
    const cart = await this.getCart(userId);

    // TODO: Validate coupon with CouponsService
    // const coupon = await this.couponsService.validate(applyCouponDto.code, cart.subtotal);
    // cart.discount = coupon.calculateDiscount(cart.subtotal);
    // cart.couponCode = applyCouponDto.code;

    // Placeholder
    cart.couponCode = applyCouponDto.code;
    cart.discount = cart.subtotal * 0.1; // 10% discount example

    cart.calculateTotals();
    await this.cartsRepository.save(cart);

    return cart;
  }

  async removeCoupon(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.couponCode = undefined as any;
    cart.discount = 0;
    cart.calculateTotals();
    await this.cartsRepository.save(cart);
    return cart;
  }
}
