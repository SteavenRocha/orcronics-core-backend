import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) { }

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @Get('customer/:customerId')
  findByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.branchesService.findByCustomer(customerId, paginationDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(+id);
  }
}
