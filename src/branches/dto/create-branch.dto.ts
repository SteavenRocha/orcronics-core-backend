import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateBranchDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    contactName?: string;

    @IsOptional()
    @IsString()
    @MinLength(9)
    @MaxLength(20)
    contactPhone?: string;

    @IsUUID()
    @IsNotEmpty()
    customerId: string;
}
