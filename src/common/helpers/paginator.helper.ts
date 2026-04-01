import { BadRequestException } from "@nestjs/common";
import { BuildQueryDto } from "../dto/build-query.dto";

export async function paginate<T>(
    model: any,
    buildQueryDto: BuildQueryDto,
    options: {
        where?: any;
        include?: any;
        orderBy?: any;
    } = {}
): Promise<{ data: T[]; meta: any }> {
    const { limit = 10, page = 1, search } = buildQueryDto;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
        model.count({
            where: options.where
        }),
        model.findMany({
            where: options.where,
            include: options.include,
            orderBy: options.orderBy || { createdAt: 'desc' },
            take: limit,
            skip: skip,
        }),
    ]);

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