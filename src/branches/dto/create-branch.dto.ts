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
    contact_name?: string;

    @IsOptional()
    @IsString()
    @MinLength(9)
    @MaxLength(20)
    contact_phone?: string;

    @IsUUID()
    @IsNotEmpty()
    customer_id: string;
}
