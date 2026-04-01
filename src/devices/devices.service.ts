import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { AreasService } from '../areas/areas.service';
import { CreateDeviceMetadataDto } from './dto/create-device-metadata.dto';
import { UpdateDeviceMetadataDto } from './dto/update-device-metadata.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Device } from '../generated/prisma/client';
import { BuildQueryDto } from '../common/dto/build-query.dto';
import { paginate } from '../common/helpers/paginator.helper';

@Injectable()
export class DevicesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly areasService: AreasService,
  ) { }

  // ==================== DEVICE ====================

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const { areaId, metadata = [], ...deviceData } = createDeviceDto;

    await this.areasService.findOne(areaId);

    const result = await this.prisma.device.create({
      data: {
        ...deviceData,
        areaId,
        metadata: {
          create: metadata.map((item) => ({
            field: item.field,
            value: item.value,
          })),
        },
      },
      include: {
        metadata: true,
      },
    });

    return result;
  }

  async findAllByArea(areaId: string, buildQueryDto: BuildQueryDto) {
    await this.areasService.findOne(areaId);

    const { search } = buildQueryDto;

    const where = {
      deletedAt: null,
      areaId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const result = await paginate<Device>(this.prisma.device, buildQueryDto, {
      where,
      orderBy: { createdAt: 'desc' },
    });

    return result;
  }

  async findOne(id: string): Promise<Device> {
    return await this.prisma.device.findFirstOrThrow({
      where: {
        id,
        deletedAt: null
      },
      include: {
        metadata: true,
      },
    });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    if (Object.keys(updateDeviceDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const { metadata, ...deviceData } = updateDeviceDto;

    return await this.prisma.device.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        ...deviceData,
        ...(metadata && {
          metadata: {
            deleteMany: {},
            create: metadata.map((item) => ({
              field: item.field,
              value: item.value,
            })),
          },
        }),
      },
      include: {
        metadata: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.device.update({
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
