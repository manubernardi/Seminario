import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoleEntity } from './roles.entity';
import { VentaEntity } from './venta.entity'
import { CompraEntity } from './compra.entity';

@Entity('empleados')
export class EmpleadoEntity {
    @PrimaryGeneratedColumn()
    legajo!: number;

    @Column({ unique: true })
    dni!: string;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column()
    telefono: string;

     
    @Column() 
    rol_id: number;

    @ManyToOne(() => RoleEntity, role => role.empleados, { eager: true })
    @JoinColumn({ name: 'rol_id' })
    rol!: RoleEntity;

    @OneToMany(() => VentaEntity, ventas => ventas.empleado)
    ventas?: VentaEntity[];

    @OneToMany(()=> CompraEntity, compra => compra.empleado)
    compras?: CompraEntity[];
}