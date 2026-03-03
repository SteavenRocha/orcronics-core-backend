import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { AreasModule } from 'src/areas/areas.module';
import { DeviceMetadata } from './entities/device-metadata.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, DeviceMetadata]),
    AreasModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule { }
