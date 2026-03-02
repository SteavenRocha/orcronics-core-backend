import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area]),
    BranchesModule
  ],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule { }
