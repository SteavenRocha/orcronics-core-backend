import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CustomersService } from 'src/customers/customers.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { query } from 'src/common/helpers/query.helper';

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly customersService: CustomersService,
  ) { }

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const { customer_id, ...branchData } = createBranchDto;

    const customer = await this.customersService.findOne(customer_id);

    const branch = this.branchRepository.create({
      ...branchData,
      customer,
    });

    const { customer: _, ...result } = await this.branchRepository.save(branch);

    return result as Branch;
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID "${id}" not found`);
    }

    return branch;
  }

  async findOneWithAreas(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: { areas: true },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID "${id}" not found`);
    }

    return branch;
  }

  async findByCustomer(customerId: string, queryDto: QueryDto) {
    await this.customersService.findOne(customerId);

    return await query(this.branchRepository, queryDto, {
      where: { customer: { id: customerId } },
      order: { created_at: 'DESC' },
    }, 'name');
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    if (Object.keys(updateBranchDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const branch = await this.branchRepository.preload({
      id,
      ...updateBranchDto,
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID "${id}" not found`);
    }

    return await this.branchRepository.save(branch);
  }

  async remove(id: string) {
    const branch = await this.findOneWithAreas(id);
    await this.branchRepository.softRemove(branch);
  }
}
