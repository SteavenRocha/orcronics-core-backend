import { Module } from '@nestjs/common';
import { CustomersModule } from './modules/customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { BranchesModule } from './modules/branches/branches.module';
import { AreasModule } from './modules/areas/areas.module';
import { DevicesModule } from './modules/devices/devices.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { IntegrationsModule } from './integrations/integrations.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    CommonModule,

    CustomersModule,

    BranchesModule,

    AreasModule,

    DevicesModule,

    UsersModule,

    AuthModule,

    IntegrationsModule,

    SubscriptionsModule,

    PrismaModule,

  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
