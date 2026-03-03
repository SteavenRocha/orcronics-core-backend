import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { BranchesModule } from 'src/branches/branches.module';
import { DeviceMetadata } from 'src/devices/entities/device-metadata.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area, DeviceMetadata]),
    BranchesModule
  ],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule { }
