import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { EvihubService } from '../integrations/evihub/evihub.service';
import { SubscribeEvihubDto } from './dto/subscribe-evihub.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private evihubService: EvihubService,
  ) { }

  async subscribeToEvihub(subscribeEvihubDto: SubscribeEvihubDto) {
    const existing = await this.subscriptionsRepository.findOne({
      where: { customer: { id: subscribeEvihubDto.customerId }, serviceName: 'evihub' },
    });

    if (existing) {
      throw new ConflictException('Customer already has Evihub subscription');
    }

    const evihubAccount = await this.evihubService.createAccount(subscribeEvihubDto.customerId, subscribeEvihubDto.customerName);

    const subscription = this.subscriptionsRepository.create({
      customer: { id: subscribeEvihubDto.customerId },
      serviceName: 'evihub',
      externalAccountId: evihubAccount.id,
      isActive: true,
    });

    return this.subscriptionsRepository.save(subscription);
  }

  async deactivateEvihub(customerId: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { customer: { id: customerId }, serviceName: 'evihub' },
    });

    if (!subscription) {
      throw new NotFoundException('Evihub subscription not found');
    }

    await this.evihubService.updateAccountStatus(subscription.externalAccountId, false);

    subscription.isActive = false;
    return this.subscriptionsRepository.save(subscription);
  }

  async activateEvihub(customerId: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { customer: { id: customerId }, serviceName: 'evihub' },
    });

    if (!subscription) {
      throw new NotFoundException('Evihub subscription not found');
    }

    await this.evihubService.updateAccountStatus(subscription.externalAccountId, true);

    subscription.isActive = true;
    return this.subscriptionsRepository.save(subscription);
  }

  async findByCustomer(customerId: string) {
    return this.subscriptionsRepository.find({
      where: { customer: { id: customerId } },
    });
  }
}