import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { AreasService } from 'src/areas/areas.service';
import { DeviceMetadata } from './entities/device-metadata.entity';
import { CreateDeviceMetadataDto } from './dto/create-device-metadata.dto';
import { UpdateDeviceMetadataDto } from './dto/update-device-metadata.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { query } from 'src/common/helpers/query.helper';

@Injectable()
export class DevicesService {

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,

    @InjectRepository(DeviceMetadata)
    private readonly metadataRepository: Repository<DeviceMetadata>,

    private readonly areasService: AreasService,
  ) { }

  // ==================== DEVICE ====================

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const { area_id, metadata = [], ...deviceData } = createDeviceDto;

    const area = await this.areasService.findOne(area_id);

    const device = this.deviceRepository.create({
      ...deviceData,
      area,
      metadata: metadata.map((item) =>
        this.metadataRepository.create(item)
      ),
    });

    const saved = await this.deviceRepository.save(device);
    const { area: _, ...result } = saved;
    return result as Device;
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID "${id}" not found`);
    }

    return device;
  }

  async findOneWithMetadata(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: { metadata: true },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID "${id}" not found`);
    }

    return device;
  }

  async findByArea(areaId: string, queryDto: QueryDto) {
    await this.areasService.findOne(areaId);

    return await query(this.deviceRepository, queryDto, {
      where: { area: { id: areaId } },
      relations: { metadata: true },
      order: { created_at: 'DESC' },
    }, 'name');
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    if (Object.keys(updateDeviceDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const { metadata, ...deviceData } = updateDeviceDto;

    const device = await this.findOne(id);
    Object.assign(device, deviceData);
    await this.deviceRepository.save(device);

    if (metadata !== undefined) {
      await this.metadataRepository.delete({ device: { id } });
      const newMetadata = metadata.map(item =>
        this.metadataRepository.create({ ...item, device: { id } })
      );
      await this.metadataRepository.save(newMetadata);
    }

    return await this.deviceRepository.findOne({
      where: { id },
      relations: { metadata: true },
    }) as Device;
  }

  /*   async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
      if (Object.keys(updateDeviceDto).length === 0) {
        throw new BadRequestException('No fields provided to update');
      }
  
      const device = await this.findOne(id);
      Object.assign(device, updateDeviceDto);
      return await this.deviceRepository.save(device);
    } */

  async remove(id: string) {
    const device = await this.findOneWithMetadata(id);
    /* await this.metadataRepository.delete({ device: { id } }); */
    await this.deviceRepository.softRemove(device);
  }

  // ==================== METADATA ====================

  async addMetadata(deviceId: string, createMetadataDto: CreateDeviceMetadataDto): Promise<DeviceMetadata> {
    const device = await this.findOne(deviceId);

    const metadata = this.metadataRepository.create({
      ...createMetadataDto,
      device,
    });

    const { device: _, ...result } = await this.metadataRepository.save(metadata);
    return result as DeviceMetadata;
  }

  async updateMetadata(deviceId: string, metadataId: string, updateMetadataDto: UpdateDeviceMetadataDto): Promise<DeviceMetadata> {
    if (Object.keys(updateMetadataDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    await this.findOne(deviceId);

    const metadata = await this.metadataRepository.findOne({
      where: { id: metadataId, device: { id: deviceId } },
    });

    if (!metadata) {
      throw new NotFoundException(`Metadata with ID "${metadataId}" not found`);
    }

    Object.assign(metadata, updateMetadataDto);
    return await this.metadataRepository.save(metadata);
  }

  async removeMetadata(deviceId: string, metadataId: string) {
    await this.findOne(deviceId);

    const metadata = await this.metadataRepository.findOne({
      where: { id: metadataId, device: { id: deviceId } },
    });

    if (!metadata) {
      throw new NotFoundException(`Metadata with ID "${metadataId}" not found`);
    }

    await this.metadataRepository.delete(metadataId);
  }
}
