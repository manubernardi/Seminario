import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/index';
import { EmpleadoModule } from './empleados/empleados.module';
import { VentasModule } from './ventas/ventas.module';
import { StockModule } from './stock/stock.module';
import { TallesModule } from './talles/talles.module';
import { ClientesModule } from './clientes/clientes.module';
import { ComprasModule } from './compras/compras.module';
import { AuthModule } from './auth/auth.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      // Configuración de la conexión a la base de datos PostgreSQL
        type: 'postgres',
        host: '127.0.0.1',
        port: 5434,
        database: 'gestion',
        username: 'postgres',
        password: 'postgres',
        synchronize: true,
        dropSchema: false,
        entities,
      }),
       VentasModule,
      EmpleadoModule,  
      StockModule,
      TallesModule,
      ClientesModule,
      AuthModule,
      ComprasModule,
      ProveedoresModule,
      TypeOrmModule.forFeature(Object.values(entities)),
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
