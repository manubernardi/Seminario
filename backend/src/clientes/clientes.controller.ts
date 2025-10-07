import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClienteEntity } from 'src/entities/cliente.entity';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() clienteData: any) {
    return this.clientesService.create(clienteData);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
      async update(@Param('id') id: number, @Body() updateData: Partial<ClienteEntity>) {
          return this.clientesService.updateCliente(id, updateData);
      }
    // DELETE /clientes/:id - Eliminar cliente
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
    return await this.clientesService.deleteCliente(id);
  }
}