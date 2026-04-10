import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribeEvihubDto } from './dto/subscribe-evihub.dto';
import { BuildQueryDto } from '../../common/dto/build-query.dto';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService
  ) { }

  @Post('evihub')
  subscribeToEvihub(@Body() subscribeEvihubDto: SubscribeEvihubDto) {
    return this.subscriptionsService.subscribeToEvihub(subscribeEvihubDto);
  }

  @Get()
  findAll(@Query() buildQueryDto: BuildQueryDto) {
    return this.subscriptionsService.findAll(buildQueryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubscriptionStatusDto,
  ) {
    return this.subscriptionsService.updateStatus(id, dto);
  }
}