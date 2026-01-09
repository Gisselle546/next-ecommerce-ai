import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: TreeRepository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Generate slug if not provided
    const slug =
      createCategoryDto.slug || this.generateSlug(createCategoryDto.name);

    // Check if slug already exists
    const existing = await this.categoriesRepository.findOne({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException('Category with this slug already exists');
    }

    let parent: Category | undefined;
    if (createCategoryDto.parentId) {
      const foundParent = await this.categoriesRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!foundParent) {
        throw new NotFoundException('Parent category not found');
      }
      parent = foundParent;
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      slug,
      ...(parent && { parent }),
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(query?: { isActive?: boolean }): Promise<Category[]> {
    // Get category tree structure
    const where =
      query?.isActive !== undefined ? { isActive: query.isActive } : {};

    const roots = await this.categoriesRepository.find({
      where: { ...where, parent: null as any },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    // Load children for each root recursively
    const trees = await Promise.all(
      roots.map((root) => this.categoriesRepository.findDescendantsTree(root)),
    );

    return trees;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // Update slug if name changed
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const newSlug =
        updateCategoryDto.slug || this.generateSlug(updateCategoryDto.name);
      const existing = await this.categoriesRepository.findOne({
        where: { slug: newSlug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Category with this slug already exists');
      }
      updateCategoryDto.slug = newSlug;
    }

    // Update parent if parentId changed
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId) {
        // Prevent setting self as parent
        if (updateCategoryDto.parentId === id) {
          throw new ConflictException('Category cannot be its own parent');
        }

        const parent = await this.categoriesRepository.findOne({
          where: { id: updateCategoryDto.parentId },
        });
        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }
        category.parent = parent;
      } else {
        // Remove parent relationship by setting to null
        category.parent = null;
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has children
    const children = await this.categoriesRepository.findDescendants(category);
    if (children.length > 1) {
      // More than 1 means it has children (includes itself)
      throw new ConflictException(
        'Cannot delete category with subcategories. Delete subcategories first.',
      );
    }

    // Check if category has products (optional - you might want to reassign products)
    // const productCount = await this.productsRepository.count({ where: { categories: { id } } });
    // if (productCount > 0) {
    //   throw new ConflictException('Cannot delete category with associated products');
    // }

    await this.categoriesRepository.remove(category);
  }

  async getCategoryProducts(
    id: string,
    _paginationQuery: PaginationQueryDto,
  ): Promise<any> {
    const category = await this.findOne(id);

    // Get all descendant categories
    const descendants =
      await this.categoriesRepository.findDescendants(category);
    const categoryIds = descendants.map((cat) => cat.id);

    // This would require the ProductsRepository - simplified example
    // In real implementation, inject ProductsService and call its method
    return {
      message: 'Use ProductsService to query products by categoryIds',
      categoryIds,
    };
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
