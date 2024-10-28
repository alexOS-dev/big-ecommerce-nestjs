import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Auth, GetUser } from 'src/auth/decorators';

import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';

import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({ status: 201, description: 'Product created', type: Product })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiOkResponse({
    description: 'Products found',
    type: Product,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @ApiOkResponse({ description: 'Product found', type: Product })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Product with id [id] not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { default: 404, type: 'integer', example: 404 },
      },
    },
  })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiOkResponse({
    description: 'Product with id [id] was deleted',
    schema: {
      type: 'string',
      example: 'Product with id [id] was deleted',
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'integer',
          example: 401,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Product with id '[id]' not found",
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Product with id [id] not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { default: 404, type: 'integer', example: 404 },
      },
    },
  })
  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
