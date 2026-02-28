import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]),
    CustomersModule
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule { }
