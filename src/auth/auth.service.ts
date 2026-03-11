import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async login(loginDto: LoginDto) {

        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException('invalid credentials');

        const is_valid = await bcrypt.compare(loginDto.password, user.password_hash);
        if (!is_valid) throw new UnauthorizedException('invalid credentials');

        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async refresh(user: User) {
        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(user_id: string): Promise<void> {
        await this.usersService.updateRefreshToken(user_id, null);
    }

    async validateRefreshToken(user_id: string, refresh_token: string): Promise<User> {
        const user = await this.usersService.findById(user_id);
        if (!user || !user.refresh_token_hash) throw new UnauthorizedException();

        const is_valid = await bcrypt.compare(refresh_token, user.refresh_token_hash);
        if (!is_valid) throw new UnauthorizedException();

        return user;
    }

    private async generateTokens(user: User) {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('JWT_SECRET'),
                expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES') as JwtSignOptions['expiresIn'],
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES') as JwtSignOptions['expiresIn'],
            }),
        ]);

        return { access_token, refresh_token };
    }
}
