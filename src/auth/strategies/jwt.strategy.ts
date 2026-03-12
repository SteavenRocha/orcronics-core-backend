import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "src/users/entities/user.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { sanitizeUser } from "src/common/helpers/sanitize-user.helper";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload): Promise<Omit<User, 'password_hash' | 'refresh_token_hash'>> {
        const user = await this.usersService.findById(payload.sub);

        if (!user)
            throw new UnauthorizedException('invalid token');

        if (!user.is_active)
            throw new UnauthorizedException('user is inactive, contact an administrator');

        return sanitizeUser(user);
    }
}