import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class ProveedorEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    razonSocial: string;

    @Column()
    telefono: string;
    
    @Column()
    mail: string;
}
