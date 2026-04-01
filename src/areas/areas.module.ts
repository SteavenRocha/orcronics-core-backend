import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  imports: [
    BranchesModule
  ],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule { }
