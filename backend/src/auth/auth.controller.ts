import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { dni: string; isSupervisor?: boolean }) {
    const { dni, isSupervisor } = body;

    // Validar que el DNI esté presente
    if (!dni) {
      throw new HttpException('DNI es requerido', HttpStatus.BAD_REQUEST);
    }

    // Buscar el empleado
    const empleado = await this.authService.validateEmpleado(dni);

    if (!empleado) {
      throw new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND);
    }

    // Si se marca como supervisor, validar el rol
    if (isSupervisor) {
      const esSupervisor = empleado.rol?.nombre?.toLowerCase() === 'supervisor';
      
      if (!esSupervisor) {
        throw new HttpException('No tienes permisos de supervisor', HttpStatus.FORBIDDEN);
      }
    }

    // Retornar datos del empleado
    return {
      success: true,
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        legajo: empleado.legajo,
        dni: empleado.dni,
        rol: {
          id: empleado.rol.id,
          nombre: empleado.rol.nombre
        }
      }
    };
  }
}