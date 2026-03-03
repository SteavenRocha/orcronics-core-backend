import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateDeviceMetadataDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    field: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}