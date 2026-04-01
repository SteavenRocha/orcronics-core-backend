import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '../generated/prisma/client';
import { BuildQueryDto } from '../common/dto/build-query.dto';
import { paginate } from '../common/helpers/paginator.helper';

@Injectable()
export class CustomersService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll(buildQueryDto: BuildQueryDto) {
    const { search } = buildQueryDto;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const result = await paginate<Customer>(this.prisma.customer, buildQueryDto, {
      where,
      orderBy: { createdAt: 'desc' },
    });

    return result;
  }

  async findOne(id: string): Promise<Customer> {
    return await this.prisma.customer.findFirstOrThrow({
      where: {
        id,
        isActive: true,
        deletedAt: null
      },
    });
  }

  /* async findOneWithBranches(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findFirstOrThrow({
      where: { id },
      include: {
        branches: {
          areas: {
            devices: {
              metadata: true
            }
          }
        }
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return customer;
  } */

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    if (Object.keys(updateCustomerDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    return await this.prisma.customer.update({
      where: {
        id,
        deletedAt: null
      },
      data: updateCustomerDto,
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    const customer = await this.prisma.customer.findFirstOrThrow({
      where: {
        id,
        deletedAt: null
      }
    });

    if (customer.isActive === isActive) {
      throw new BadRequestException(`Customer is already ${isActive ? 'active' : 'inactive'}`);
    }

    await this.prisma.customer.update({
      where: { id },
      data: { isActive },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.customer.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }
}
