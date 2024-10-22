import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProduct();
    return 'Seed executed successfully';
  }

  private async insertNewProduct() {
    await this.productsService.deleteAllProducts();
    return true;
  }
}
