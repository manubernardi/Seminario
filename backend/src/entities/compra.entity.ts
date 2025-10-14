import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { EmpleadoEntity } from './empleado.entity';
import { DetalleCompraEntity } from './detalle.compra.entity';

@Entity()
export class CompraEntity{

    @PrimaryGeneratedColumn()
    NumCompra: number;

    @Column()
    fecha: Date;

    @ManyToOne(()=> EmpleadoEntity, empleado => empleado.compras)
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