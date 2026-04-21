import { Controller, Post, Body} from '@nestjs/common';
import { WsfeService } from './wsfe.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('arca')
export class ArcaController {
    constructor(private readonly wsfeService: WsfeService){}

    @Post('facturar')
    async facturar(@Body() dto: CreateInvoiceDto) {
        return this.wsfeService.crearFactura(dto);
    }

}
