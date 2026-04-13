import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { LoginDTO } from '../dto/createEmpleado.dto';
import { RolesGuard } from './roles.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDTO) {
    console.log('Datos recibidos en el backend:', body);
    return this.authService.login(body.dni, body.password);
  }

  @Get('me')
  @UseGuards(RolesGuard)  
  getMe(@Request() req) {
    return req.user; // viene del JWT decodificado por el guard
  }
}