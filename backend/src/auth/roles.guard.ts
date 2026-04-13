import { CanActivate, Injectable, ExecutionContext} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) return true;
  
    const request = context.switchToHttp().getRequest().user;
    const empleado = request.user;

    if (!empleado) return false;
    
    return roles.includes(empleado.rol.nombre);
  }

}