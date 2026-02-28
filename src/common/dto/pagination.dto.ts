import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {

    @IsInt()
    @IsPositive()
    @IsOptional()
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    page?: number = 1;

}