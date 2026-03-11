import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from "../../users/entities/user.entity";

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user)
            throw new InternalServerErrorException('user not found in request, check JwtAuthGuard');

        return request.user;
    },
);