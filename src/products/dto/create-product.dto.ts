import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    default: 'Your Product Title (unique)',
    nullable: false,
    minLength: 1,
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    default: 0,
    minimum: 0,
    nullable: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    default: 'Product description',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description:
      'Product slug for SEO & URL/routing. If not provided, title will be used to generate it',
    example: 'product_slug_1',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    default: 0,
    minimum: 0,
    nullable: true,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    type: [String],
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    name: 'Gender',
    enum: ['men', 'women', 'unisex', 'kid'],
  })
  @IsIn(['men', 'women', 'unisex', 'kid'])
  gender: string;

  @ApiProperty({
    type: [String],
    isArray: true,
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    type: [String],
    isArray: true,
    nullable: true,
    example: ['http://image1.jpg', 'http://image2.jpg'],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
