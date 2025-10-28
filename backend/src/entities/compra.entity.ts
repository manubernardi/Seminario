import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { EmpleadoEntity } from './empleado.entity';
import { DetalleCompraEntity } from './detalle.compra.entity';

@Entity()
export class CompraEntity{

    @PrimaryGeneratedColumn()
    NumCompra: number;

    @Column()
    fecha: Date;

    @Column()  // <- AGREGÁ ESTO
    empleadoLegajo: number;
    
    @ManyToOne(() => EmpleadoEntity, empleado => empleado.compras)
    @JoinColumn({ name: 'empleadoLegajo', referencedColumnName: 'legajo' })
    empleado: EmpleadoEntity;

    @Column()
    montoTotal: number;

    @OneToMany(()=> DetalleCompraEntity, detalleCompra => detalleCompra.compra,{
        cascade: true, 
        eager:true
    })
    detalles: DetalleCompraEntity[];

    private calcularTotal(): number {
        return this.detalles.reduce((suma, d)=> suma + d.subtotal, 0);
    }
}