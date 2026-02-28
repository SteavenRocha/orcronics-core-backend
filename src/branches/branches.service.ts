import { Injectable } from '@nestjs/common';
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

    return await this.branchRepository.save(branch);
  }

  findAll() {
    return `This action returns all branches`;
  }

  async findByCustomer(customerId: string, paginationDto: PaginationDto): Promise<{ data: Branch[], meta: object }> {
    await this.customersService.findOne(customerId);

    return await paginate(this.branchRepository, paginationDto, {
      where: { customer: { id: customerId } },
      order: { created_at: 'DESC' },
    });
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
