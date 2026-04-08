import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateSubscriptionStatusDto {
    @IsUUID()
    @IsNotEmpty()
    customerId!: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;
}