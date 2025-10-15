import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn  } from "typeorm";
import { TalleEntity } from "./talle.entity";
import { DetalleVentaEntity } from "./detalle.venta.entity";
import { PrendaXTalleEntity } from "./prendaXTalleEntity";
import { IsOptional } from "class-validator";

import { DetalleCompraEntity } from "./detalle.compra.entity";

@Entity('prendas')
export class PrendaEntity {
    @PrimaryColumn()
    codigo! : string;

    @Column()
    descripcion!: string;

    @Column()
    precio: number;

    @Column({ default: true })  // Para borrar prendas, porque si borramos una prenda literal, 
    // y esa prenda fue vendida, habria que borrar toda la venta y perderiamos esa info, 
    // entonces la marcamos como inactiva en vez de borrarla como tal
    
    activo: boolean;

    @OneToMany(() => PrendaXTalleEntity, px => px.prenda, { cascade: true, eager: true, onDelete: 'CASCADE' })
    prendasXTalles: PrendaXTalleEntity[];

    @IsOptional()
    @Column({ nullable: true })
    cantidadTotal?: number;
    
}