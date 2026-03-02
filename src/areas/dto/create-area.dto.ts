import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateAreaDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsUUID()
    @IsNotEmpty()
    branch_id: string;
}
