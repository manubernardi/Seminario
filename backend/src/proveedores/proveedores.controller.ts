import { Controller, Get, Post, Put, Delete, Body, Patch } from '@nestjs/common';
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
    async create(@Body() createProveedorDto: CreateProveedorDto) {
        console.log("Controller Back",createProveedorDto);
        return this.proveedoresService.create(createProveedorDto);
    }
    @Delete(':id')
    remove(@Body('id') id: number) {
        return this.proveedoresService.remove(id);
    }
    @Patch(':id')
    update(id: number, @Body() updateProveedorDto: Partial<CreateProveedorDto>) {
        console.log("Controller Back Edit", updateProveedorDto, id);
        return this.proveedoresService.update(id, updateProveedorDto);
    }

    

}
