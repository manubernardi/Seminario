import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
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
    @Put(':id')
    update(
         @Param('id', ParseIntPipe) id: number,
         @Body() dto: CreateProveedorDto
    ) {
         return this.proveedoresService.update(id, dto);
    }
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.proveedoresService.remove(id);
    }

    

}
