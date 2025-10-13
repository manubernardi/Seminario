import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn  } from "typeorm";
import { TalleEntity } from "./talle.entity";
import { DetalleVentaEntity } from "./detalle.venta.entity";
import { PrendaXTalleEntity } from "./prendaXTalleEntity";


@Entity('prendas')
export class PrendaEntity {
    @PrimaryColumn()
    codigo! : string;

    @Column()
    descripcion!: string;

    @Column()
    precio: number;

    @OneToMany(() => PrendaXTalleEntity, px => px.prenda, { cascade: true, eager: true })
    prendasXTalles: PrendaXTalleEntity[];

    get cantidadTotal(): number {
    if (!this.prendasXTalles) return 0;
    return this.prendasXTalles.reduce((sum, px) => sum + px.cantidad, 0);
    }
}