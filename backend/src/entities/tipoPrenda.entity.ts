import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TalleEntity } from "./talle.entity";
import { PrendaEntity } from "./prenda.entity";
 
@Entity('tipos_prenda')
export class TipoPrendaEntity {
 
    @PrimaryGeneratedColumn()
    id: number;
 
    @Column({ unique: true })
    nombre: string; // Ej: "Remera", "Pantalón", "Zapatillas", "Perfume"
 
    @Column({ default: true })
    activo: boolean;
 
    // Talles que corresponden a este tipo (fijos, definidos una vez)
    @ManyToMany(() => TalleEntity, { eager: true })
    @JoinTable({
        name: 'tipos_prenda_talles',
        joinColumn: { name: 'tipo_prenda_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'talle_id', referencedColumnName: 'codigo' }
    })
    talles: TalleEntity[];
 
    @OneToMany(() => PrendaEntity, p => p.tipoPrenda)
    prendas: PrendaEntity[];
}