import { IsString, IsUrl, IsNotEmpty, MaxLength, IsOptional, MinLength } from "class-validator";

export class CreateCustomerDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @IsUrl()
    @IsOptional()
    logo_url?: string;

}
