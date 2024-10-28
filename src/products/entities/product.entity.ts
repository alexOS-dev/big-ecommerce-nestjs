import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '.';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({
    example: '087100cf-b431-48da-a237-bc4900a6e13b',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Lenovo ThinkPad X1 Carbon Gen 11 (14” Intel) Laptop',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({ example: 0, description: 'Product Price' })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example:
      'Ipsum proident exercitation nisi voluptate et eiusmod magna adipisicing aliquip duis ea id nostrud est.',
    description: 'Product Description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'lenovo_thinkpad_x1_carbon_gen_11_(14”_intel)_laptop',
    description: 'Product Slug to generate the URL',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0,
    minimum: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'XL', 'XXL'],
    description: 'Product Sizes',
    isArray: true,
    type: [String],
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    description: 'Product Stock',
    example: 'men',
  })
  @Column('text')
  gender: string;

  // tags
  @ApiProperty({
    description: 'Product Tags for SEO',
    example: ['laptop', 'pc', 'computer', 'lenovo', 'tech', 'technology'],
    isArray: true,
    type: [String],
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  // images
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
