import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [
    AreasModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule { }
