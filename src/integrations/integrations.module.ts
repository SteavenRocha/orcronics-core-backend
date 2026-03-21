import { Module } from '@nestjs/common';
import { EvihubModule } from './evihub/evihub.module';

@Module({
  imports: [EvihubModule],
  exports: [EvihubModule],
  providers: [],
})
export class IntegrationsModule { }
