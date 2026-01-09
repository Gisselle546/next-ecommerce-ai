import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { paginate } from '../common/helpers/pagination.helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantsRepository: Repository<ProductVariant>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const slug =
      createProductDto.slug || this.generateSlug(createProductDto.name);

    // Check if slug or SKU already exists
    const existingSlug = await this.productsRepository.findOne({
      where: { slug },
    });
    if (existingSlug) {
      throw new ConflictException('Product with this slug already exists');
    }

    const existingSku = await this.productsRepository.findOne({
      where: { sku: createProductDto.sku },
    });
    if (existingSku) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      slug,
    });

    return this.productsRepository.save(product);
  }

  async findAll(query: ProductQueryDto): Promise<any> {
    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants');

    // Filters
    if (query.q) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        {
          search: `%${query.q}%`,
        },
      );
    }

    if (query.categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    if (query.rating !== undefined) {
      qb.andWhere('product.averageRating >= :rating', { rating: query.rating });
    }

    if (query.inStock === true) {
      qb.andWhere('product.stock > 0');
    }

    qb.andWhere('product.isActive = :isActive', { isActive: true });

    // Sorting
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'DESC';
    qb.orderBy(`product.${sortBy}`, order);

    // Pagination
    return paginate(qb, {
      page: query.page,
      limit: query.limit,
    });
  }

  async findOne(id: string): Promise<Product> {
    // Try cache first
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'variants', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache for 1 hour (3600000ms)
    await this.cacheManager.set(cacheKey, product, 3600000);

    return product;
  }

  private async invalidateProductCache(id: string): Promise<void> {
    await this.cacheManager.del(`product:${id}`);
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: ['category', 'variants', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findFeatured(limit: number = 10): Promise<Product[]> {
    return this.productsRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['category'],
      take: limit,
      order: { salesCount: 'DESC' },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const newSlug =
        updateProductDto.slug || this.generateSlug(updateProductDto.name);
      const existing = await this.productsRepository.findOne({
        where: { slug: newSlug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Product with this slug already exists');
      }
      updateProductDto.slug = newSlug;
    }

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existing = await this.productsRepository.findOne({
        where: { sku: updateProductDto.sku },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    Object.assign(product, updateProductDto);

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.invalidateProductCache(id);
    await this.productsRepository.remove(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock = quantity;
    return this.productsRepository.save(product);
  }

  async incrementSalesCount(id: string, count: number = 1): Promise<void> {
    await this.productsRepository.increment({ id }, 'salesCount', count);
  }

  async updateAverageRating(productId: string): Promise<void> {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('product.id = :productId', { productId })
      .getRawOne();

    await this.productsRepository.update(productId, {
      averageRating: result.avgRating || 0,
      reviewCount: parseInt(result.reviewCount) || 0,
    });
  }

  // Product Variant Methods
  async createVariant(
    productId: string,
    variantData: {
      name: string;
      sku: string;
      price: number;
      stock: number;
      attributes?: Record<string, string>;
      image?: string;
    },
  ): Promise<ProductVariant> {
    await this.findOne(productId);

    // Check if variant SKU already exists
    const existingSku = await this.variantsRepository.findOne({
      where: { sku: variantData.sku },
    });
    if (existingSku) {
      throw new ConflictException('Variant with this SKU already exists');
    }

    const variant = this.variantsRepository.create({
      ...variantData,
      productId,
    });

    return this.variantsRepository.save(variant);
  }

  async updateVariant(
    variantId: string,
    variantData: Partial<{
      name: string;
      sku: string;
      price: number;
      stock: number;
      attributes: Record<string, string>;
      image: string;
      isActive: boolean;
    }>,
  ): Promise<ProductVariant> {
    const variant = await this.variantsRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (variantData.sku && variantData.sku !== variant.sku) {
      const existing = await this.variantsRepository.findOne({
        where: { sku: variantData.sku },
      });
      if (existing && existing.id !== variantId) {
        throw new ConflictException('Variant with this SKU already exists');
      }
    }

    Object.assign(variant, variantData);
    return this.variantsRepository.save(variant);
  }

  async removeVariant(variantId: string): Promise<void> {
    const variant = await this.variantsRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    await this.variantsRepository.remove(variant);
  }

  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return this.variantsRepository.find({
      where: { productId },
      order: { name: 'ASC' },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
