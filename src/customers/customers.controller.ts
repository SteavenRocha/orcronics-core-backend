import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BuildQueryDto } from '../common/dto/build-query.dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() buildQueryDto: BuildQueryDto) {
    return this.customersService.findAll(buildQueryDto);
  }

  @Get(':id')
  finOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerStatusDto: UpdateCustomerStatusDto,
  ) {
    return this.customersService.updateStatus(id, updateCustomerStatusDto.isActive);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
