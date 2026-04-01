import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CustomersService } from 'src/customers/customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { Branch, Prisma } from '../generated/prisma/client';
import { BuildQueryDto } from '../common/dto/build-query.dto';
import { paginate } from '../common/helpers/paginator.helper';

@Injectable()
export class BranchesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly customersService: CustomersService
  ) { }

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    // Verificamos si existe el customer antes de crear la sucursal
    const { customerId } = createBranchDto;
    await this.customersService.findOne(customerId);

    return await this.prisma.branch.create({
      data: createBranchDto,
    });
  }

  async findAllByCustomer(customerId: string, buildQueryDto: BuildQueryDto) {
    // Verificamos si existe el customer antes de buscar las sucursales
    await this.customersService.findOne(customerId);

    const { search } = buildQueryDto;

    const where: Prisma.BranchWhereInput = {
      customerId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } },
          { contactPhone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const result = await paginate<Branch>(this.prisma.branch, buildQueryDto, {
      where,
      orderBy: { createdAt: 'desc' },
    });

    return result;
  }

  async findOne(id: string): Promise<Branch> {
    return await this.prisma.branch.findFirstOrThrow({
      where: {
        id,
        deletedAt: null
      },
    });
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    if (Object.keys(updateBranchDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    return await this.prisma.branch.update({
      where: {
        id,
        deletedAt: null
      },
      data: updateBranchDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.branch.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
