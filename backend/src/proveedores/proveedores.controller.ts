import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service'; 
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
@Controller('proveedores')
export class ProveedoresController {
    constructor(private readonly proveedoresService: ProveedoresService) {}

    @Get()
    findAll() {
        return this.proveedoresService.findAll();
    }
    @Post()
    async create(createProveedorDto: CreateProveedorDto) {
        console.log(createProveedorDto);
        return this.proveedoresService.create(createProveedorDto);
    }

    

}
