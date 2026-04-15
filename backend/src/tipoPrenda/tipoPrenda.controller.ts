import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TipoPrendaService } from "./tipoPrenda.service";
import { CreateTipoPrendaDto, UpdateTipoPrendaDto } from "../dto/tipo-prenda.dto";

@Controller('tipos-prenda')
export class TipoPrendaController {

    constructor(private readonly tipoPrendaService: TipoPrendaService) {}

    @Get()
    findAll() {
        return this.tipoPrendaService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tipoPrendaService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateTipoPrendaDto) {
        return this.tipoPrendaService.create(dto);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoPrendaDto) {
        return this.tipoPrendaService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tipoPrendaService.remove(id);
    }
}