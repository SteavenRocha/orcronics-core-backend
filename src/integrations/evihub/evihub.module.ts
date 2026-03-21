import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EvihubService } from './evihub.service';

@Module({
    imports: [HttpModule],
    providers: [EvihubService],
    exports: [EvihubService],
})
export class EvihubModule { }