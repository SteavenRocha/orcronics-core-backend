import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribeEvihubDto } from './dto/subscribe-evihub.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private subscriptionsService: SubscriptionsService
  ) { }

  @Post('evihub')
  subscribeToEvihub(@Body() dto: SubscribeEvihubDto) {
    return this.subscriptionsService.subscribeToEvihub(dto);
  }

  @Patch('evihub/:customerId/activate')
  activateEvihub(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.subscriptionsService.activateEvihub(customerId);
  }

  @Patch('evihub/:customerId/deactivate')
  deactivateEvihub(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.subscriptionsService.deactivateEvihub(customerId);
  }

  @Get(':customerId')
  findByCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.subscriptionsService.findByCustomer(customerId);
  }
}