import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { BranchesService } from 'src/branches/branches.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/helpers/pagination.helper';

@Injectable()
export class AreasService {

  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
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

  async findByBranch(branchId: string, paginationDto: PaginationDto) {
    await this.branchesService.findOne(branchId);

    return await paginate(this.areaRepository, paginationDto, {
      where: { branch: { id: branchId } },
      order: { created_at: 'DESC' },
    });
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

  async remove(id: string): Promise<{ message: string }> {
    const area = await this.findOne(id);
    await this.areaRepository.softDelete(id);
    return { message: `Area ${area.name} has been deleted` };
  }
}
