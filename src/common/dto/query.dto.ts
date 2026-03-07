import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class QueryDto {

    /* Paginacion */
    @IsInt()
    @IsPositive()
    @IsOptional()
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    /* Busqueda */
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    search?: string;

}