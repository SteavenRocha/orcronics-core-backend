import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateDeviceMetadataDto } from './dto/create-device-metadata.dto';
import { UpdateDeviceMetadataDto } from './dto/update-device-metadata.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  // ==================== DEVICES ====================

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get('area/:areaId')
  findByArea(
    @Param('areaId', ParseUUIDPipe) areaId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.devicesService.findByArea(areaId, paginationDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeviceDto: UpdateDeviceDto
  ) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.remove(id);
  }

  // ==================== METADATA ====================

  @Post('metadata/:id')
  addMetadata(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createMetadataDto: CreateDeviceMetadataDto,
  ) {
    return this.devicesService.addMetadata(id, createMetadataDto);
  }

  @Patch(':id/metadata/:metadataId')
  updateMetadata(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('metadataId', ParseUUIDPipe) metadataId: string,
    @Body() updateMetadataDto: UpdateDeviceMetadataDto,
  ) {
    return this.devicesService.updateMetadata(id, metadataId, updateMetadataDto);
  }

  @Delete(':id/metadata/:metadataId')
  removeMetadata(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('metadataId', ParseUUIDPipe) metadataId: string,
  ) {
    return this.devicesService.removeMetadata(id, metadataId);
  }
}
