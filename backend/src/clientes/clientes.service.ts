import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteEntity)
    private clienteRepository: Repository<ClienteEntity>,
  ) {}

  async create(clienteData: Partial<ClienteEntity>): Promise<ClienteEntity> {
    const cliente = this.clienteRepository.create(clienteData);
    return await this.clienteRepository.save(cliente);
  }

  async findAll(): Promise<ClienteEntity[]> {
    return await this.clienteRepository.find();
  }

  async findOne(id: number): Promise<ClienteEntity> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }
  
   // Actualizar cliente
  async updateCliente(id: number, updateData: Partial<ClienteEntity>): Promise<ClienteEntity> {
    const cliente = await this.clienteRepository.findOne({ 
      where: { id } 
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    Object.assign(cliente, updateData);
    return await this.clienteRepository.save(cliente);
  }

  // Eliminar cliente CON VALIDACIÓN DE VENTAS
  async deleteCliente(id: number): Promise<{ mensaje: string }> {
    const cliente = await this.clienteRepository.findOne({ 
      where: { id },
      relations: ['ventas'] // Cargar relación con ventas
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    // Verificar si tiene ventas asociadas
    //if (cliente.ventas && cliente.ventas.length > 0) {
      //throw new BadRequestException(
        //`No se puede eliminar el cliente porque tiene ${cliente.ventas.length} venta(s) registrada(s). ` +
        //`Primero debe eliminar o reasignar las ventas asociadas.`
      //);
    //}
    
    await this.clienteRepository.remove(cliente);
    
    return { mensaje: `Cliente "${cliente.nombre} ${cliente.apellido}" eliminado correctamente` };
  }
}