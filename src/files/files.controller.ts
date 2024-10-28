import { Response } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files - Get & Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  @ApiOkResponse({ description: 'Image found and returned successfully' })
  @ApiBadRequestResponse({ description: 'Image not found' })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
    return path;
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        secureUrl: {
          type: 'string',
          example: 'http://localhost:3000/files/product/imagen.jpg',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Make sure the file is an image' })
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure the file is an image');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }
}
