import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateCustomerStatusDto {
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}