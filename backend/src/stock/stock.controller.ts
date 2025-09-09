import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreatePrendaDto } from '../dto/createPrenda.dto';
import { PrendaEntity } from '../entities/prenda.entity';
@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) {}

    @Get()
    async findAll() {
        return this.stockService.findAll();
    }

    @Post()
    async create(@Body() createPrendaDto: CreatePrendaDto) {
        return this.stockService.create(createPrendaDto);
    }

    @Patch(':codigo')
    async update(@Param('codigo') codigo: string, @Body() updateData: Partial<PrendaEntity>) {
        return this.stockService.update(codigo, updateData);
    }
}