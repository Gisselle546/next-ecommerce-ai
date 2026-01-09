import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  rating: number; // 1-5

  @Column({ type: 'text' })
  comment: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ type: 'int', default: 0 })
  helpfulCount: number;

  @Column({ default: false })
  isVerifiedPurchase: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'text', nullable: true })
  adminResponse: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
