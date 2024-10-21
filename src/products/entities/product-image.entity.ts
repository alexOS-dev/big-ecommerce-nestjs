import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from '.';

@Entity()
export class ProductImage {
  @PrimaryColumn()
  id: number;

  //   @Column('text', { array: true, default: [] })
  @Column('text')
  url: string[];

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
