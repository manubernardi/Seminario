import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TipoPrendaEntity } from "../entities/tipoPrenda.entity";
import { TalleEntity } from "../entities/talle.entity";
import { TipoPrendaService } from "./tipoPrenda.service";
import { TipoPrendaController } from "./tipoPrenda.controller";
 
@Module({
    imports: [TypeOrmModule.forFeature([TipoPrendaEntity, TalleEntity])],
    providers: [TipoPrendaService],
    controllers: [TipoPrendaController],
    exports: [TipoPrendaService],  // exportamos para que PrendaService lo pueda usar
})
export class TipoPrendaModule {}
 