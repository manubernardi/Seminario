import{Column, Entity, PrimaryGeneratedColumn,} from 'typeorm';
@Entity('talles')
export class TalleEntity{
    @PrimaryGeneratedColumn()
    codigo!: number;

    @Column()
    descripcion!: string;
}