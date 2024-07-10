import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req } from '@nestjs/common';
import { Dev } from './entity/dev.Schema';
import { LoginDevDto } from "./dto/login-dev.dto"
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { DevService } from './dev.service';
import { TokenRefreshInterceptor } from './interceptor/token-refresh.interceptor';
import { CustomRequest } from './interfaces/accessToken.interface';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) { }

  // Register a dev
  @Post("/register")
  create(@Body() createDevDto: CreateDevDto): Promise<Dev> {
    return this.devService.create(createDevDto);
  }

  //Login a dev
  @Post("/login")
  login(@Body() loginDevDto: LoginDevDto) {
    return this.devService.login(loginDevDto);
  }

  // Get all dev
  @Get('all')
  findAll(): Promise<Dev[]> {
    return this.devService.findAll();
  }

  // Get a dev
  @Get(':devId')
  findOne(@Param('devId') devId: string): Promise<Dev> {
    return this.devService.findOne(devId);
  }

  //Update a dev
  @Patch(':devId')
  update(@Param('devId') devId: string, @Body() updateDevDto: UpdateDevDto): Promise<Dev> {
    return this.devService.update(devId, updateDevDto);
  }

  // Delete a dev
  @Delete(':devId')
  remove(@Param('devId') devId: string): Promise<Dev> {
    return this.devService.remove(devId);
  }

  // Logout
  @Get("logout/:devId")
  logout(@Param('devId') devId: string) {
    return this.devService.logout(devId);
  }

  // Generate new access token from refresh token
  @Post("/refresh-token")
  @UseInterceptors(TokenRefreshInterceptor)
  async refreshToken(@Body() refreshToken: string, @Req() req: CustomRequest) {
    const newAccessToken = req.accessToken;
    return newAccessToken;
  }
}
