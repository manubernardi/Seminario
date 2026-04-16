import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { LoginDTO } from '../dto/createEmpleado.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDTO) {
    console.log('Datos recibidos en el backend:', body);
    return this.authService.login(body.dni, body.password);
  }

  @Get('me')
  @UseGuards(AuthGuard)  
  getMe(@Request() req) {
    console.log('Usuario autenticado:', req.user); //Undefined
    return req.user; // viene del JWT decodificado por el guard
  }
}