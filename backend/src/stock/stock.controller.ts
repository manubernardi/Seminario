import { Controller, Get, Post, Put, Delete, Body, Param, Patch } from '@nestjs/common';
import { StockService } from './stock.service';
import { PrendaEntity } from '../entities/prenda.entity';
import { CreatePrendaDto } from '../dto/createPrenda.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // 🔹 GET /stock → obtener todas las prendas con sus talles y stock total
  @Get()
  async findAll(): Promise<PrendaEntity[]> {
    return await this.stockService.findAll();
  }

  // 🔹 GET /stock/:codigo → obtener una prenda por su código
  @Get(':codigo')
  async getPrendaByCodigo(@Param('codigo') codigo: string): Promise<PrendaEntity> {
    return await this.stockService.getPrendaByCodigo(codigo);
  }

  // 🔹 GET /stock/:codigo/stock-total → obtener stock total de una prenda
  @Get(':codigo/stock-total')
  async getStockTotal(@Param('codigo') codigo: string): Promise<number> {
    return await this.stockService.getTotalStock(codigo);
  }

  // 🔹 POST /stock → crear una nueva prenda
  @Post()
  async create(@Body() createPrendaDto: CreatePrendaDto): Promise<PrendaEntity> {
    return await this.stockService.create(createPrendaDto);
  }

  // 🔹 PUT /stock/:codigo → actualizar una prenda existente
  @Put(':codigo')
  async updatePrenda(
    @Param('codigo') codigo: string,
    @Body() prendaData: Partial<PrendaEntity>,
  ): Promise<PrendaEntity> {
    return await this.stockService.updatePrenda(codigo, prendaData);
  }

  // 🔹 PATCH /stock/:codigo → actualización parcial
  @Patch(':codigo')
  async patchPrenda(
    @Param('codigo') codigo: string,
    @Body() updateData: Partial<PrendaEntity>,
  ): Promise<PrendaEntity> {
    return await this.stockService.updatePrenda(codigo, updateData);
  }

  // 🔹 DELETE /stock/:codigo → eliminar una prenda
  @Delete(':codigo')
  async deletePrenda(@Param('codigo') codigo: string): Promise<{ mensaje: string }> {
    return await this.stockService.deletePrenda(codigo);
     }

  // 🔹 POST /stock/:codigo/ajustar → ajustar stock (sumar/restar cantidad)
  @Post(':codigo/ajustar')
  async ajustarStock(
    @Param('codigo') codigo: string,
    @Body() ajuste: { talle_id: number; cantidad: number; motivo?: string },
  ) {
    return await this.stockService.ajustarStock(codigo, ajuste.talle_id, ajuste.cantidad);
  }

  // 🔹 GET /stock/dashboard/stats → estadísticas del dashboard
  @Get('dashboard/stats')
  async getDashboardStats() {
    return await this.stockService.getDashboardStats();
  }

  // 🔹 GET /stock/buscar/:termino → buscar prendas por código o descripción
  @Get('buscar/:termino')
  async buscarPrendas(@Param('termino') termino: string) {
    return await this.stockService.buscarPrendas(termino);
  }
}
