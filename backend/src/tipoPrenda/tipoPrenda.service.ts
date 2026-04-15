import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { TipoPrendaEntity } from "../entities/tipoPrenda.entity";
import { TalleEntity } from "../entities/talle.entity";
import { CreateTipoPrendaDto, UpdateTipoPrendaDto } from "../dto/tipo-prenda.dto";

@Injectable()
export class TipoPrendaService {

    constructor(
        @InjectRepository(TipoPrendaEntity)
        private readonly tipoPrendaRepo: Repository<TipoPrendaEntity>,

        @InjectRepository(TalleEntity)
        private readonly talleRepo: Repository<TalleEntity>,
    ) {}

    async findAll(): Promise<TipoPrendaEntity[]> {
        return this.tipoPrendaRepo.find();
    }

    async findOne(id: number): Promise<TipoPrendaEntity> {
        const tipo = await this.tipoPrendaRepo.findOne({ where: { id } });
        if (!tipo) throw new NotFoundException(`Tipo de prenda con id ${id} no encontrado`);
        return tipo;
    }

    async create(dto: CreateTipoPrendaDto): Promise<TipoPrendaEntity> {
        const existe = await this.tipoPrendaRepo.findOne({ where: { nombre: dto.nombre } });
        if (existe) throw new BadRequestException(`Ya existe un tipo de prenda llamado "${dto.nombre}"`);

        const talles = await this.talleRepo.findBy({ codigo: In(dto.talleIds) });
        if (talles.length !== dto.talleIds.length) {
            throw new BadRequestException('Uno o más talleIds no existen en la base de datos');
        }

        const nuevo = this.tipoPrendaRepo.create({ nombre: dto.nombre, talles });
        return this.tipoPrendaRepo.save(nuevo);
    }

    async update(id: number, dto: UpdateTipoPrendaDto): Promise<TipoPrendaEntity> {
        const tipo = await this.findOne(id);

        if (dto.nombre !== undefined) tipo.nombre = dto.nombre;
        if (dto.activo !== undefined) tipo.activo = dto.activo;

        if (dto.talleIds !== undefined) {
            const talles = await this.talleRepo.findBy({ codigo: In(dto.talleIds) });
            if (talles.length !== dto.talleIds.length) {
                throw new BadRequestException('Uno o más talleIds no existen en la base de datos');
            }
            tipo.talles = talles;
        }

        return this.tipoPrendaRepo.save(tipo);
    }

    async remove(id: number): Promise<void> {
        const tipo = await this.findOne(id);
        // Soft delete: marcar como inactivo en vez de borrar
        tipo.activo = false;
        await this.tipoPrendaRepo.save(tipo);
    }
}