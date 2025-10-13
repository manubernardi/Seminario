import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DetalleVentaEntity } from './detalle.venta.entity';
import { ClienteEntity } from './cliente.entity';
import { EmpleadoEntity } from './empleado.entity';

@Entity('ventas')
export class VentaEntity {
    @PrimaryGeneratedColumn()
    numVenta: number;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;
    
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number; 
    
    @OneToMany(() => DetalleVentaEntity, detalle => detalle.venta, {
        cascade: true,
        eager: true
    })
    detalles: DetalleVentaEntity[];
    
    @Column({ nullable: true })
    clienteId?: number;
    
    @ManyToOne(() => ClienteEntity, (cliente) => cliente.ventas, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'clienteId' })
    cliente?: ClienteEntity;
    
    @Column()
    empleadoLegajo: number;
    
    @ManyToOne(() => EmpleadoEntity, empleado => empleado.ventas)
    @JoinColumn({ name: 'empleadoLegajo', referencedColumnName: 'legajo' })
    empleado: EmpleadoEntity;
}