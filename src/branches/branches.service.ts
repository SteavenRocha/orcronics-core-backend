import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CustomersService } from 'src/customers/customers.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { paginate } from 'src/common/helpers/pagination.helper';

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

  async findByCustomer(customerId: string, paginationDto: PaginationDto) {
    await this.customersService.findOne(customerId);

    return await paginate(this.branchRepository, paginationDto, {
      where: { customer: { id: customerId } },
      order: { created_at: 'DESC' },
    });
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

  async remove(id: string): Promise<{ message: string }> {
    const branch = await this.findOne(id);
    await this.branchRepository.softDelete(id);
    return { message: `Branch ${branch.name} has been deleted` };
  }
}
