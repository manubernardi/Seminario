import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { PrendaEntity } from '../entities/prenda.entity';


@Controller('stock')
export class StockController {
    constructor(private readonly stockService: StockService) {}

    // GET /stock - ver todas las prendas
    @Get()
    async getAllPrendas(@Query('limite') limite?: number) {
        return await this.stockService.getAllPrendas(limite);
    }

    // GET /stock/:codigo - obtener prenda por código
    @Get(':codigo')
    async getPrendaByCodigo(@Param('codigo') codigo: string) {
        return await this.stockService.getPrendaByCodigo(codigo);
    }

    // POST /stock - crear nueva prenda
    @Post()
    async createPrenda(@Body() prendaData: Partial<PrendaEntity>) {
        return await this.stockService.createPrenda(prendaData);
    }

    // PUT /stock/:codigo - actualizar prenda
    @Put(':codigo')
    async updatePrenda(
        @Param('codigo') codigo: string, 
        @Body() prendaData: Partial<PrendaEntity>
    ) {
        return await this.stockService.updatePrenda(codigo, prendaData);
    }

    // DELETE /stock/:codigo - eliminar prenda
    @Delete(':codigo')
    async deletePrenda(@Param('codigo') codigo: string) {
        return await this.stockService.deletePrenda(codigo);
    }

    // GET /stock/bajo-stock/:cantidad - prendas con stock bajo
    @Get('bajo-stock/:cantidad')
    async getPrendasBajoStock(@Param('cantidad') cantidad: number) {
        return await this.stockService.getPrendasBajoStock(cantidad);
    }

    // POST /stock/:codigo/ajustar - ajustar stock de una prenda
    @Post(':codigo/ajustar')
    async ajustarStock(
        @Param('codigo') codigo: string,
        @Body() ajuste: { cantidad: number; motivo: string }
    ) {
        return await this.stockService.ajustarStock(codigo, ajuste.cantidad, ajuste.motivo);
    }

    // GET /stock/dashboard/stats - estadísticas para dashboard
    @Get('dashboard/stats')
    async getDashboardStats() {
        return await this.stockService.getDashboardStats();
    }

    // GET /stock/buscar - buscar prendas por descripción
    @Get('buscar/:termino')
    async buscarPrendas(@Param('termino') termino: string) {
        return await this.stockService.buscarPrendas(termino);
    }
}

