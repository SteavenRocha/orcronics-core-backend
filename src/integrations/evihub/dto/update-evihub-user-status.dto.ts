import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateEvihubUserStatusDto {
    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;
}