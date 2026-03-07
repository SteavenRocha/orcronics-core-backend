import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { DeviceMetadata } from 'src/devices/entities/device-metadata.entity';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class AreasService {

  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,

    @InjectRepository(DeviceMetadata)
    private readonly metadataRepository: Repository<DeviceMetadata>,

    private readonly branchesService: BranchesService,
  ) { }

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const { branch_id, ...areaData } = createAreaDto;

    const branch = await this.branchesService.findOne(branch_id);

    const area = this.areaRepository.create({
      ...areaData,
      branch,
    });

    const { branch: _, ...result } = await this.areaRepository.save(area);
    return result as Area;
  }

  async findOne(id: string): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { id },
    });

    if (!area) {
      throw new NotFoundException(`Area with ID "${id}" not found`);
    }

    return area;
  }

  async findOneWithDevices(id: string): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: {
        devices: {
          metadata: true
        },
      },
    });

    if (!area) {
      throw new NotFoundException(`Area with ID "${id}" not found`);
    }

    return area;
  }

  /* Para obtener el device_count */
  async findByBranch(branchId: string, queryDto: QueryDto) {
    await this.branchesService.findOne(branchId);

    const { limit = 10, page = 1, search } = queryDto;
    const offset = (page - 1) * limit;

    const queryBuilder = this.areaRepository
      .createQueryBuilder('area')
      .loadRelationCountAndMap('area.device_count', 'area.devices', 'device',
        (qb) => qb.where('device.deleted_at IS NULL')
      )
      .where('area.branch_id = :branchId', { branchId })
      .andWhere('area.deleted_at IS NULL')
      .orderBy('area.created_at', 'DESC')
      .take(limit)
      .skip(offset);

    if (search) {
      queryBuilder.andWhere('area.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [areas, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
      throw new BadRequestException(
        `Page ${page} does not exist. Total pages: ${totalPages}`,
      );
    }

    return {
      data: areas,
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

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    if (Object.keys(updateAreaDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const area = await this.areaRepository.preload({
      id,
      ...updateAreaDto,
    });

    if (!area) {
      throw new NotFoundException(`Area with ID "${id}" not found`);
    }

    return await this.areaRepository.save(area);
  }

  async remove(id: string) {
    const area = await this.findOneWithDevices(id);

    /*  await this.metadataRepository
       .createQueryBuilder()
       .delete()
       .where('device_id IN (SELECT id FROM devices WHERE area_id = :id)', { id })
       .execute(); */

    await this.areaRepository.softRemove(area);
  }
}
