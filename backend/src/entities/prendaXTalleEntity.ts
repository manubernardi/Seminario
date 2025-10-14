import {Column, Entity, JoinColumn, PrimaryColumn, ManyToOne} from "typeorm";
import { PrendaEntity } from "./prenda.entity";
import { TalleEntity } from "./talle.entity";
import {Exclude} from "class-transformer"; 
import { BadRequestException } from "@nestjs/common";

@Entity('prendas_talles')
export class PrendaXTalleEntity {
    @PrimaryColumn()
    prenda_codigo: string;

    @PrimaryColumn()
    talle_id: number;

    @ManyToOne(() => PrendaEntity, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'prenda_codigo' })
    @Exclude()
    prenda: PrendaEntity;

    @ManyToOne(() => TalleEntity, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'talle_id' })
    talle: TalleEntity;

    @Column()
    cantidad: number;

    actualizarCantidad(ajuste: number): void {
        const nuevaCantidad: number = this.cantidad + ajuste; 
        if (nuevaCantidad < 0) throw new BadRequestException('El stock no puede ser negativo');

        this.cantidad = nuevaCantidad;
    }
}