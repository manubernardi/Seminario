import { Controller, Post, Body} from '@nestjs/common';
import { ArcaService } from './arca.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('arca')
export class ArcaController {
    constructor(private readonly arcaService: ArcaService){}

    @Post('facturar')
    async facturar(@Body() dto: CreateInvoiceDto) {
        return this.arcaService.facturar(dto);
    }

}
