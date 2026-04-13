import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EmpleadoService } from '../empleados/empleados.service';
import { JwtService } from '../jwt/jwt.service';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
    constructor(
        private empleadoService: EmpleadoService,
        private jwtService: JwtService,
    ){}

    async login(dni: string, password?:string): Promise<{accessToken: string, refreshToken: string, empleado: any}> {
        
        const empleado = await this.empleadoService.findOne(dni);
    
        if (!empleado) throw new NotFoundException(`Empleado con DNI ${dni} no encontrado`);

        console.log('Empleado encontrado:', empleado);

        console.log('contraseña enviada:', password);
        
        if(empleado.password){
          if (!empleado.password.startsWith('$2')) {
            if (password === empleado.password) {
                const hashed = await this.jwtService.hashPassword(password);
                await this.empleadoService.updatePassword(empleado.dni, hashed);

                empleado.password = hashed;
            } else {
                throw new UnauthorizedException('Contraseña incorrecta');
            }
          }

          if (!password) throw new UnauthorizedException('Se requiere contraseña');
    
          const compareResult = await this.jwtService.comparePassword(password, empleado.password);
    
          if (!compareResult) throw new UnauthorizedException('Contraseña incorrecta');
        
        }
        
        const payload = {
          sub: empleado.legajo,
          rol: empleado.rol.nombre,
          permissions: empleado.rol.permissions.map(p => p.name)
        }
    
        const accessToken = this.jwtService.generateToken(payload);
        const refreshToken = this.jwtService.generateToken(payload, 'refresh');
    
        return { accessToken, refreshToken, empleado };
    }

    refreshToken(refreshToken: string): { accessToken: string; refreshToken: string } {
        try {
            
            const payload = this.jwtService.getPayload(refreshToken, 'refresh');

            // Calcula cuántos minutos faltan para que expire
            const timeToExpire = dayjs.unix(payload.exp).diff(dayjs(), 'minute');

            return {
                accessToken: this.jwtService.generateToken({ sub: payload.legajo, rol: payload.rol, permissions: payload.permissions }, 'auth'),

                // Si le quedan menos de 20 minutos, se renueva el refreshToken también
                refreshToken:
                    timeToExpire < 20
                    ? this.jwtService.generateToken({ sub: payload.legajo, rol: payload.rol, permissions: payload.permissions }, 'refresh')
                    : refreshToken
            };

        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}