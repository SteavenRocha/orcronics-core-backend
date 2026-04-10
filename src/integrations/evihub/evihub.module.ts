import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EvihubService } from './evihub.service';
import { EvihubController } from './evihub.controller';

@Module({
    imports: [HttpModule],
    controllers: [EvihubController],
    providers: [EvihubService],
    exports: [EvihubService],
})
export class EvihubModule { }