import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { RoleEntity } from './roles.entity';

@Entity('permissions')
export class PermissionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(()=> RoleEntity, role => role.permissions)
    roles: RoleEntity[];

    
}