import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { EvihubService } from '../../integrations/evihub/evihub.service';
import { SubscribeEvihubDto } from './dto/subscribe-evihub.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BuildQueryDto } from '../../common/dto/build-query.dto';
import { paginate } from '../../common/helpers/paginator.helper';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';

@Injectable()
export class SubscriptionsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly evihubService: EvihubService,
  ) { }

  async subscribeToEvihub(subscribeEvihubDto: SubscribeEvihubDto) {

    const existing = await this.prisma.subscription.findFirst({
      where: {
        customerId: subscribeEvihubDto.customerId,
        serviceName: 'evihub'
      },
    });
    if (existing) throw new ConflictException('Customer already subscribed to Evihub');

    const account = await this.evihubService.createAccount(subscribeEvihubDto.customerId);

    const subscription = await this.prisma.subscription.create({
      data: {
        customerId: subscribeEvihubDto.customerId,
        serviceName: 'evihub',
        externalAccountId: account.id,
      },
    });

    return subscription;
  }

  async findAll(buildQueryDto: BuildQueryDto) {
    const { search } = buildQueryDto;

    const where = {
      deletedAt: null,
      ...(search && {
        customer: {
          name: { contains: search, mode: 'insensitive' },
        },
      }),
    };

    const result = await paginate(this.prisma.subscription, buildQueryDto, {
      where,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    });

    return result;
  }

  async findOne(id: string) {
    return this.prisma.subscription.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: { customer: true },
    });
  }

  async updateStatus(id: string, dto: UpdateSubscriptionStatusDto) {
    const subscription = await this.prisma.subscription.findFirstOrThrow({
      where: { id, deletedAt: null }
    });

    if (subscription.isActive === dto.isActive) {
      throw new BadRequestException(`Subscription is already ${dto.isActive ? 'active' : 'inactive'}`);
    }

    if (subscription.externalAccountId) {
      await this.evihubService.updateAccountStatus(subscription.externalAccountId, dto.isActive);
    }

    await this.prisma.subscription.update({
      where: { id },
      data: { isActive: dto.isActive },
    });
  }
}