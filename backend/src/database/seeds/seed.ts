import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { categoriesData, productsData, variantsData } from './seed.data';
import { User, UserRole } from '../../users/entities/user.entity';

export async function runSeed(dataSource: DataSource) {
  console.log('🌱 Starting database seed...');

  const categoryRepository = dataSource.getTreeRepository(Category);
  const productRepository = dataSource.getRepository(Product);
  const variantRepository = dataSource.getRepository(ProductVariant);
  const userRepository = dataSource.getRepository(User);

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  
  // Use raw query to truncate with CASCADE (clears all related data)
  await dataSource.query('TRUNCATE TABLE "product_variants", "products", "categories", "users" RESTART IDENTITY CASCADE');

  // Create admin user if doesn't exist
  console.log('👤 Creating admin user...');
  let adminUser = await userRepository.findOne({
    where: { email: 'admin@ecomrest.com' },
  });

  if (!adminUser) {
    adminUser = userRepository.create({
      email: 'admin@ecomrest.com',
      password: 'Admin123!', // Plain password - will be hashed by @BeforeInsert
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
    });
    await userRepository.save(adminUser);
    console.log('✅ Admin user created: admin@ecomrest.com / Admin123!');
  } else {
    console.log('✅ Admin user already exists');
  }

  // Create demo user if doesn't exist
  let demoUser = await userRepository.findOne({
    where: { email: 'demo@ecomrest.com' },
  });

  if (!demoUser) {
    demoUser = userRepository.create({
      email: 'demo@ecomrest.com',
      password: 'Demo123!', // Plain password - will be hashed by @BeforeInsert
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.CUSTOMER,
      isVerified: true,
      isActive: true,
    });
    await userRepository.save(demoUser);
    console.log('✅ Demo user created: demo@ecomrest.com / Demo123!');
  } else {
    console.log('✅ Demo user already exists');
  }

  // Step 1: Create categories
  console.log('📁 Creating categories...');
  const categoryMap = new Map<string, Category>();

  // First pass: Create all categories without parents
  for (const catData of categoriesData) {
    const category = categoryRepository.create({
      name: catData.name,
      slug: catData.slug,
      description: catData.description || undefined,
      isActive: true,
    });
    const savedCategory = await categoryRepository.save(category);
    categoryMap.set(catData.slug, savedCategory as Category);
  }

  // Second pass: Set up parent-child relationships
  for (const catData of categoriesData) {
    if (catData.parent) {
      const category = categoryMap.get(catData.slug);
      const parent = categoryMap.get(catData.parent);
      if (category && parent) {
        category.parent = parent;
        await categoryRepository.save(category);
      }
    }
  }

  console.log(`✅ Created ${categoryMap.size} categories`);

  // Step 2: Create products
  console.log('🛍️  Creating products...');
  const productMap = new Map<string, Product>();

  for (const prodData of productsData) {
    const category = categoryMap.get(prodData.category);
    if (!category) {
      console.warn(`⚠️  Category not found: ${prodData.category}`);
      continue;
    }

    const product = productRepository.create({
      name: prodData.name,
      slug: prodData.slug,
      description: prodData.description,
      price: prodData.price,
      compareAtPrice: prodData.compareAtPrice || undefined,
      sku: prodData.sku,
      stock: prodData.stock,
      category: category,
      images: prodData.images,
      tags: prodData.tags,
      isFeatured: prodData.isFeatured || false,
      isActive: true,
      specifications: prodData.specifications || undefined,
      averageRating: 0,
      reviewCount: 0,
      salesCount: 0,
    });

    const savedProduct = await productRepository.save(product);
    productMap.set(prodData.sku, savedProduct as Product);
  }

  console.log(`✅ Created ${productMap.size} products`);

  // Step 3: Create product variants
  console.log('🎨 Creating product variants...');
  let variantCount = 0;

  for (const varData of variantsData) {
    const product = productMap.get(varData.productSku);
    if (!product) {
      console.warn(`⚠️  Product not found: ${varData.productSku}`);
      continue;
    }

    const variant = variantRepository.create({
      name: varData.name,
      sku: varData.sku,
      price: product.price, // Use same price as product by default
      stock: varData.stock,
      attributes: varData.attributes,
      isActive: true,
      product: product,
    });

    await variantRepository.save(variant);
    variantCount++;
  }

  console.log(`✅ Created ${variantCount} product variants`);

  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Categories: ${categoryMap.size}`);
  console.log(`   - Products: ${productMap.size}`);
  console.log(`   - Variants: ${variantCount}`);
  console.log(`   - Admin User: admin@ecomrest.com / Admin123!`);
  console.log(`   - Demo User: demo@ecomrest.com / Demo123!`);
}
