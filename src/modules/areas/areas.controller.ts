import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { BuildQueryDto } from '../../common/dto/build-query.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) { }

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get('branch/:branchId')
  findByBranch(
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Query() buildQueryDto: BuildQueryDto
  ) {
    return this.areasService.findAllByBranch(branchId, buildQueryDto);
  }

  @Get(':id')
  finOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.areasService.findOne(id);
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
