import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { CreateDeviceMetadataDto } from './create-device-metadata.dto';

export class CreateDeviceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    type: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    serial?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    username?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    password?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsNotEmpty()
    area_id: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateDeviceMetadataDto)
    metadata?: CreateDeviceMetadataDto[];
}
