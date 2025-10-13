import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePrendaXTalleDto } from 'src/dto/createPrendaXTalle.dto';
import { UpdatePrendaTalleDto } from 'src/dto/update-PrendaXTalle.dto';
import { PrendaXTalleEntity } from 'src/entities/prendaXTalleEntity';
import { Repository } from 'typeorm';

@Injectable()
export class PrendaTalleService {
    constructor(
        @InjectRepository(PrendaXTalleEntity)
        private readonly prendaTalleRepository: Repository<PrendaXTalleEntity>
    ){}

    async findAll(){
        console.log("findAll service")
       return this.prendaTalleRepository.find()
    }
    async create(createPrendaXTalleDto: CreatePrendaXTalleDto): Promise<PrendaXTalleEntity>{
        const prendaTalle = this.prendaTalleRepository.create(createPrendaXTalleDto)
        return await this.prendaTalleRepository.save(prendaTalle)
  
    }
    async update(prenda_codigo: string, talle_id: number ,updatePrendaTalleDto: UpdatePrendaTalleDto){
        const registro = await this.prendaTalleRepository.findOneBy({
            prenda_codigo: prenda_codigo ,
            talle_id: talle_id ,
            
        });
        console.log(prenda_codigo, talle_id);
        if (registro) {
            this.prendaTalleRepository.merge(registro, updatePrendaTalleDto);
            return this.prendaTalleRepository.save(registro);
        }

    } 
}
