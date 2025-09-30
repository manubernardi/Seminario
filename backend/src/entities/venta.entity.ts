import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { DetalleVentaEntity } from './detalle.venta.entity';
import { ClienteEntity } from './cliente.entity'
import { EmpleadoEntity } from './empleado.entity';

@Entity('ventas')
export class VentaEntity {

    @PrimaryGeneratedColumn()
    numVenta!: number;

    @Column()
    fecha!: Date;

    @Column()
    total!: number;

    @Column()
    empleadoId!: number;

    @OneToMany(() => DetalleVentaEntity, detalle => detalle.venta, {
        cascade: true,
        eager: true
    })
    detalles!: DetalleVentaEntity;

    @ManyToOne(() => ClienteEntity, cliente => cliente.ventas)
    cliente!: ClienteEntity;

    @ManyToOne(() => EmpleadoEntity, empleado => empleado.ventas)
    empleado!: EmpleadoEntity;
}