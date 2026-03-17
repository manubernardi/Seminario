import { DataSource } from 'typeorm';
import { TalleEntity } from '../src/entities/talle.entity';
import { RoleEntity } from '../src/entities/roles.entity';

import { PermissionEntity } from '../src/entities/permissions.entity';
import { EmpleadoEntity } from '../src/entities/empleado.entity';
import { VentaEntity } from '../src/entities/venta.entity';
import { CompraEntity } from '../src/entities/compra.entity';


const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5434,
  username: 'postgres',
  password: 'postgres',
  database: 'gestion',
  entities: [ TalleEntity, RoleEntity, PermissionEntity],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();

  const talleRepo = AppDataSource.getRepository(TalleEntity);
  const rolRepo = AppDataSource.getRepository(RoleEntity);
  const permisosRepo = AppDataSource.getRepository(PermissionEntity);
  const empleadosRepo = AppDataSource.getRepository(EmpleadoEntity);

  await talleRepo.save([
    { descripcion: 'S' },
    { descripcion: 'M' },
    { descripcion: 'L' },
    { descripcion: 'XL' },
    { descripcion: 'XXL' },
    { descripcion: 'XXXL' },
  ]);

  await rolRepo.save([
    { nombre: 'Supervisor' },
    { nombre: 'Vendedor' },
    { nombre: 'Comprador' },
  ]);

  await permisosRepo.save([
    { name: 'Ver Talles' },
    { name: 'Crear Talles' },
    { name: 'Editar Talles' },
    { name: 'Borrar Talles' },
    { name: 'Ver Empleados' },
    { name: 'Crear Empleados' },
    { name: 'Editar Empleados' },
    { name: 'Borrar Empleados' },
    { name: 'Ver Ventas' },
    { name: 'Crear Ventas' },
    { name: 'Editar Ventas' },
    { name: 'Borrar Ventas' },
    { name: 'Ver Compras' },
    { name: 'Crear Compras' },
    { name: 'Editar Compras' },
    { name: 'Borrar Compras' },
  ]);

  console.log('Datos insertados correctamente');
  await AppDataSource.destroy();
}
seed();