import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn  } from "typeorm";
import { TalleEntity } from "./talle.entity";
import { DetalleVentaEntity } from "./detalle.venta.entity";
import { DetalleCompraEntity } from "./detalle.compra.entity";

@Entity('prendas')
export class PrendaEntity {
    @PrimaryColumn()
    codigo! : string;

    @Column()
    descripcion!: string;

    @Column()
    precio!: number;

    @Column()
    cantidad!: number;

    @Column({ name: 'talle_id' }) 
    talle_id: number;

    @ManyToOne(() => TalleEntity)
    @JoinColumn({ name: 'talle_id' })
    talle!: TalleEntity;

    @OneToMany(() => DetalleVentaEntity, detalle => detalle.prenda)
    ventas!: DetalleVentaEntity;

    @OneToMany(()=> DetalleCompraEntity, detalleCompra => detalleCompra.prenda)
    compras: DetalleCompraEntity;
}