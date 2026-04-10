import { IsNotEmpty, IsUUID } from 'class-validator';

export class SubscribeEvihubDto {
    @IsUUID()
    @IsNotEmpty()
    customerId!: string;
}