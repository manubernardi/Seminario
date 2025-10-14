import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
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

    @Column()
    subtotal!: number;

    @ManyToOne(() => PrendaEntity)
    prenda!: PrendaEntity;

    @ManyToOne(()=> TalleEntity)
    talle!: TalleEntity;
    
}