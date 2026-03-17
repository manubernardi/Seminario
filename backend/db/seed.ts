import { DataSource } from 'typeorm';
import { TalleEntity } from '../src/entities/talle.entity';
import { RoleEntity } from '../src/entities/roles.entity';

import { PermissionEntity } from '../src/entities/permissions.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5434,
  username: 'postgres',
  password: 'postgres',
  database: 'gestion',
  entities: [ TalleEntity, RoleEntity, PermissionEntity ],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();

  const talleRepo = AppDataSource.getRepository(TalleEntity);
  const rolRepo = AppDataSource.getRepository(RoleEntity);

  await talleRepo.save([
    { descripcion: 'S' },
    { descripcion: 'M' },
    { descripcion: 'L' },
    { descripcion: 'XL' },
    { descripcion: 'XXL' },
    { descripcion: 'XXXL' },
  ]);

  await rolRepo.save([
    { nombre: 'Vendedor' },
    { nombre: 'Comprador' },
  ]);

  console.log('Datos insertados 🚀');
  await AppDataSource.destroy();
}

seed();