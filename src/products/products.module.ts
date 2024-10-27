import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

import { PostgresExceptionHandler } from 'src/common/exceptions/postgres-handler.exception';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PostgresExceptionHandler],
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
