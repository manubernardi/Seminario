import { Entity, ManyToOne, Column } from "typeorm";
import { CompraEntity } from "./compra.entity";
import { PrendaEntity } from "./prenda.entity";

@Entity()
export class DetalleCompraEntity{

    @ManyToOne(()=> CompraEntity, compra => compra.detalles)
    compra: CompraEntity

    @ManyToOne(()=> PrendaEntity, prenda => prenda.compras)
    prenda: PrendaEntity;

    @Column()
    cantidad: number;

    @Column()
    subtotal: number;

    private calcularSubtotal(): number{
        return this.prenda.precio * this.cantidad;
    }
}