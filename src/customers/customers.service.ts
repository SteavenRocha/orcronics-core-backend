import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/helpers/pagination.helper';

@Injectable()
export class CustomersService {

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findAll(paginationDto: PaginationDto) {
    return await paginate(this.customerRepository, paginationDto, {
      order: { created_at: 'DESC' },
    });
  }

  // Sin relaciones -> devuelve solo el CUSTOMER con estado ACTIVO
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, is_active: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return customer;
  }

  // Con relaciones -> devuelve el CUSTOMER y sus BRANCHES con estado ACTIVO / INACTIVO
  async findOneWithBranches(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: { branches: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return customer;
  }

  // Método privado para verificar el estado del customer
  private async findByStatus(id: string, isActive: boolean): Promise<Customer> {
    const exists = await this.customerRepository.findOne({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    if (exists.is_active !== isActive) {
      throw new BadRequestException(
        `Customer ${exists.name} is already ${exists.is_active ? 'active' : 'inactive'}`
      );
    }

    return exists;
  }

  async deactivate(id: string): Promise<Customer> {
    const customer = await this.findByStatus(id, true);
    customer.is_active = false;
    return await this.customerRepository.save(customer);
  }

  async activate(id: string): Promise<Customer> {
    const customer = await this.findByStatus(id, false);
    customer.is_active = true;
    return await this.customerRepository.save(customer);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    if (Object.keys(updateCustomerDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const customer = await this.findOne(id);

    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<{ message: string }> {
    const customer = await this.findOneWithBranches(id);

    if (customer.is_active) {
      customer.is_active = false;
      await this.customerRepository.save(customer);
    }

    await this.customerRepository.softRemove(customer);
    return { message: `Customer ${customer.name} has been deleted` };
  }

}
