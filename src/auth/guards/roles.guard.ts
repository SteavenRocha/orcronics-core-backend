import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const required_roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!required_roles?.length) return true;

        const { user } = context.switchToHttp().getRequest();

        if (!user)
            throw new InternalServerErrorException('User not found in request');

        if (!required_roles.includes(user.role))
            throw new ForbiddenException(
                `User requires one of these roles: [${required_roles.join(', ')}]`
            );

        return true;
    }
}