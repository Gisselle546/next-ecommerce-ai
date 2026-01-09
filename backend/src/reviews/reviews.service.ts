import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Order, PaymentStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { paginate } from '../common/helpers/pagination.helper';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    // Check if product exists
    await this.productsService.findOne(createReviewDto.productId);

    // Check if user already reviewed this product
    const existingReview = await this.reviewsRepository.findOne({
      where: {
        userId,
        productId: createReviewDto.productId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Check if user has purchased this product with a completed payment
    const isVerifiedPurchase = await this.hasUserPurchasedProduct(
      userId,
      createReviewDto.productId,
    );

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      userId,
      isVerifiedPurchase,
    });

    const savedReview = await this.reviewsRepository.save(review);

    // Update product average rating
    await this.updateProductRating(createReviewDto.productId);

    return savedReview;
  }

  async findAll(query: ReviewQueryDto): Promise<any> {
    const qb = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .where('review.isApproved = :isApproved', { isApproved: true });

    if (query.rating) {
      qb.andWhere('review.rating = :rating', { rating: query.rating });
    }

    if (query.sortBy) {
      const order = query.order || 'DESC';
      qb.orderBy(`review.${query.sortBy}`, order);
    } else {
      qb.orderBy('review.createdAt', 'DESC');
    }

    return paginate(qb, query);
  }

  async findByProduct(productId: string, query: ReviewQueryDto): Promise<any> {
    const qb = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.productId = :productId', { productId })
      .andWhere('review.isApproved = :isApproved', { isApproved: true });

    if (query.rating) {
      qb.andWhere('review.rating = :rating', { rating: query.rating });
    }

    if (query.sortBy) {
      const order = query.order || 'DESC';
      qb.orderBy(`review.${query.sortBy}`, order);
    } else {
      qb.orderBy('review.createdAt', 'DESC');
    }

    return paginate(qb, query);
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async findUserReviews(userId: string, query: ReviewQueryDto): Promise<any> {
    const qb = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .where('review.userId = :userId', { userId })
      .orderBy('review.createdAt', 'DESC');

    return paginate(qb, query);
  }

  async update(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.findOne(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    Object.assign(review, updateReviewDto);
    review.isApproved = false; // Reset approval after edit

    const updated = await this.reviewsRepository.save(review);

    // Update product rating
    await this.updateProductRating(review.productId);

    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.findOne(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const productId = review.productId;
    await this.reviewsRepository.remove(review);

    // Update product rating
    await this.updateProductRating(productId);
  }

  async markHelpful(id: string): Promise<Review> {
    const review = await this.findOne(id);
    review.helpfulCount += 1;
    return this.reviewsRepository.save(review);
  }

  // Admin methods
  async approveReview(id: string): Promise<Review> {
    const review = await this.findOne(id);
    review.isApproved = true;
    return this.reviewsRepository.save(review);
  }

  async addAdminResponse(
    id: string,
    adminResponseDto: AdminResponseDto,
  ): Promise<Review> {
    const review = await this.findOne(id);
    review.adminResponse = adminResponseDto.adminResponse;
    return this.reviewsRepository.save(review);
  }

  async findPendingReviews(query: ReviewQueryDto): Promise<any> {
    const qb = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .where('review.isApproved = :isApproved', { isApproved: false })
      .orderBy('review.createdAt', 'DESC');

    return paginate(qb, query);
  }

  private async updateProductRating(productId: string): Promise<void> {
    await this.productsService.updateAverageRating(productId);
  }

  /**
   * Check if a user has purchased a specific product with a completed payment.
   * Returns true if the user has at least one completed order containing this product.
   */
  private async hasUserPurchasedProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const purchaseCount = await this.orderItemsRepository
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .where('order.userId = :userId', { userId })
      .andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: PaymentStatus.COMPLETED,
      })
      .andWhere('item.productId = :productId', { productId })
      .getCount();

    return purchaseCount > 0;
  }
}
