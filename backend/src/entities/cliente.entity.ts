import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VentaEntity } from './venta.entity';

@Entity()
export class ClienteEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono?: string;

    @OneToMany(() => VentaEntity, (venta) => venta.cliente)
    ventas?: VentaEntity[];

}