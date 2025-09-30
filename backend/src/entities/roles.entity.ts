import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EmpleadoEntity } from './empleado.entity';
import { PermissionEntity } from './permissions.entity';

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column() 
    descripcion!: string;

    @OneToMany(() => EmpleadoEntity, empleado => empleado.rol)
    empleados!: EmpleadoEntity[];

    @ManyToMany(()=> PermissionEntity, permission => permission.roles, { eager: true })
    @JoinTable({ name: 'roles_permissions' })
    permissions!: PermissionEntity[];
}  