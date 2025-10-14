import {Column, Entity, JoinColumn, PrimaryColumn, ManyToOne} from "typeorm";
import { PrendaEntity } from "./prenda.entity";
import { TalleEntity } from "./talle.entity";
import {Exclude} from "class-transformer"; 
@Entity('prendas_talles')
export class PrendaXTalleEntity {
    @PrimaryColumn()
    prenda_codigo: string;

    @PrimaryColumn()
    talle_id: number;

    @ManyToOne(() => PrendaEntity)
    @JoinColumn({ name: 'prenda_codigo' })
    @Exclude()
    prenda: PrendaEntity;

    @ManyToOne(() => TalleEntity)
    @JoinColumn({ name: 'talle_id' })
    talle: TalleEntity;

    @Column()
    cantidad: number;




}