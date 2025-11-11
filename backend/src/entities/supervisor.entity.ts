import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('supervisor')
export class SupervisorEntity extends BaseEntity {

    @PrimaryColumn({ unique: true })
    dni!: string;

    @Column()
    nombre!: string;

    @Column()
    apellido!: string;

    @Column()
    telefono: string;

    @Column()
    contraseña: string;

}