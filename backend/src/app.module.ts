import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/index';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
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
        synchronize: false,
        dropSchema: false,
        entities,
      }),
      // Importa los módulos de pedidos y pagos
      TypeOrmModule.forFeature(Object.values(entities)),
  ],
  controllers: [AppController, StockController],
  providers: [AppService, StockService],
})
export class AppModule {}
