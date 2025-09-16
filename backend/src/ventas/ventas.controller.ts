import { Body, Controller, Get, Patch, Post, Param} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentaEntity } from '../entities/venta.entity';

@Controller('ventas')
export class VentasController {
    constructor(private readonly ventasService: VentasService) {}
    @Get()
    async findAll() {
        return this.ventasService.findAll();
    }
    @Post()
    async create(@Body() createData: Partial<VentaEntity>) {
        return this.ventasService.create(createData);
    }
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateData: Partial<VentaEntity>) {
        return this.ventasService.update(id, updateData);
    }
}
