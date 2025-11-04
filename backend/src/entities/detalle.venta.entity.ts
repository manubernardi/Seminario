import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VentaEntity } from './venta.entity';
import { PrendaEntity } from './prenda.entity';
import { TalleEntity } from './talle.entity';

@Entity()
export class DetalleVentaEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(()=> VentaEntity, venta => venta.detalles, {
        onDelete: 'CASCADE'
    })
    venta!: VentaEntity;

    @Column()
    cantidad!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number;

    @ManyToOne(() => PrendaEntity, { nullable: false, onDelete: 'RESTRICT' })
    prenda!: PrendaEntity;

    @ManyToOne(()=> TalleEntity, { nullable: false, onDelete: 'RESTRICT' })
    talle!: TalleEntity;
    
}