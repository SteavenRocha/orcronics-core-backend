import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { BranchesService } from '../branches/branches.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Area, Prisma } from '../../generated/prisma/client';
import { BuildQueryDto } from '../../common/dto/build-query.dto';
import { paginate } from '../../common/helpers/paginator.helper';

@Injectable()
export class AreasService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly branchesService: BranchesService,
  ) { }

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    // Verificamos si existe la sucursal antes de crear el area
    const { branchId } = createAreaDto;
    await this.branchesService.findOne(branchId);

    return await this.prisma.area.create({
      data: createAreaDto,
    });
  }

  async findAllByBranch(branchId: string, buildQueryDto: BuildQueryDto) {
    // Verificamos si existe la sucursal antes de buscar las areas
    await this.branchesService.findOne(branchId);

    const { search } = buildQueryDto;

    const where: Prisma.AreaWhereInput = {
      branchId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const result = await paginate<Area>(this.prisma.area, buildQueryDto, {
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { devices: true },
        },
      },
    });

    return result;
  }

  async findOne(id: string): Promise<Area> {
    return await this.prisma.area.findFirstOrThrow({
      where: {
        id,
        deletedAt: null
      },
    });
  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    if (Object.keys(updateAreaDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    return await this.prisma.area.update({
      where: {
        id,
        deletedAt: null
      },
      data: updateAreaDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.area.update({
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
