import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SubscribeEvihubDto {
    @IsUUID()
    @IsNotEmpty()
    customerId!: string;

    @IsString()
    @IsNotEmpty()
    customerName!: string;
}