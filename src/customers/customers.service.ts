import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  async findAll(paginationDto: PaginationDto): Promise<{ data: Customer[], meta: object }> {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;

    const [data, total] = await this.customerRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw new BadRequestException(
        `Page ${page} does not exist. Total pages: ${totalPages}`
      );
    }

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return customer;
  }

  async deactivate(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.is_active = false;
    return await this.customerRepository.save(customer);
  }

  async activate(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.is_active = true;
    return await this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<{ message: string }> {
    const customer = await this.findOne(id);
    await this.customerRepository.softDelete(id);
    return { message: `Customer ${customer.name} has been deleted` };
  }

}
