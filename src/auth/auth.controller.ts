import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Refresh } from './decorators/refresh.decorator';
import type { User } from '../generated/prisma/client';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('me')
    getMe(@CurrentUser() user: User) {
        return user;
    }

    @Refresh()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@CurrentUser() user: User) {
        return this.authService.refresh(user);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@CurrentUser('id') userId: string) {
        return this.authService.logout(userId);
    }
}
