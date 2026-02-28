import { FindManyOptions, ObjectLiteral, Repository } from "typeorm";
import { PaginationDto } from "../dto/pagination.dto";
import { BadRequestException } from "@nestjs/common";

export async function paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationDto: PaginationDto,
    options: FindManyOptions<T> = {},
): Promise<{ data: T[]; meta: object }> {
    const { limit = 10, page = 1 } = paginationDto;
    const offset = (page - 1) * limit;

    const [data, total] = await repository.findAndCount({
        ...options,
        take: limit,
        skip: offset,
    });

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
        throw new BadRequestException(
            `Page ${page} does not exist. Total pages: ${totalPages}`,
        );
    }

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
}