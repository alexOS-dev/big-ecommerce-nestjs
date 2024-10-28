import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { RawHeaders, GetUser, Auth } from './decorators';

import { User } from './entities/user.entity';

import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto, description: 'User registration data' })
  @ApiOkResponse({
    description: 'User successfully registered',
    type: User, // Asumiendo que `User` es la entidad de respuesta
  })
  @ApiUnauthorizedResponse({ description: 'Bad request' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto, description: 'User login data' })
  @ApiOkResponse({
    description: 'User successfully logged in, token returned',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'jwt-token-here' },
        user: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User is authenticated, status returned',
    type: User, // Asumiendo que `User` es la entidad de respuesta
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Accessed private route',
    schema: {
      type: 'object',
      properties: {
        ok: { type: 'boolean', example: true },
        message: { type: 'string', example: 'private route' },
        user: { $ref: '#/components/schemas/User' },
        userEmail: { type: 'string', example: 'user@example.com' },
        rawHeaders: {
          type: 'array',
          items: { type: 'string' },
          example: ['Authorization: Bearer token'],
        },
        headers: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'private route',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Accessed private route with role-based permissions',
    schema: {
      type: 'object',
      properties: {
        ok: { type: 'boolean', example: true },
        user: { $ref: '#/components/schemas/User' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  privateRoute2(@GetUser() user: User) {
    return { ok: true, user };
  }
}
