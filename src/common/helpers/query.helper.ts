import { BadRequestException } from "@nestjs/common";
import { FindManyOptions, ILike, ObjectLiteral, Repository } from "typeorm";
import { QueryDto } from "../dto/query.dto";

export async function query<T extends ObjectLiteral>(
    repository: Repository<T>,
    queryDto: QueryDto,
    options: FindManyOptions<T> = {},
    searchField?: keyof T,
): Promise<{ data: T[]; meta: object }> {
    const { limit = 10, page = 1, search } = queryDto;
    const offset = (page - 1) * limit;

    const where = search && searchField
        ? { ...options.where, [searchField]: ILike(`%${search}%`) }
        : options.where;

    const [data, total] = await repository.findAndCount({
        ...options,
        where,
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