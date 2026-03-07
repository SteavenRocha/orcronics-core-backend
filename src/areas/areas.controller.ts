import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) { }

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get(':id')
  finOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.areasService.findOne(id);
  }

  @Get('branch/:branchId')
  findByBranch(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() queryDto: QueryDto
  ) {
    return this.areasService.findByBranch(branchId, queryDto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.areasService.remove(id);
  }
}
