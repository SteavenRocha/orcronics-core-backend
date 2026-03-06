import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) { }

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get('customer/:customerId')
  findByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query() queryDto: QueryDto
  ) {
    return this.branchesService.findByCustomer(customerId, queryDto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.branchesService.remove(id);
  }
}
