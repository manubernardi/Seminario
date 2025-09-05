import{Column, Entity, PrimaryColumn, PrimaryGeneratedColumn,} from 'typeorm';
@Entity('talles')
export class TalleEntity{
    @PrimaryGeneratedColumn()
    codigo: number;

    @Column()
    descripcion: string;
}