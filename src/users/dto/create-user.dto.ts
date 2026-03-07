import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    /* @IsEmail()
    @IsNotEmpty()
    email: string; */

    @IsString()
    @MinLength(8, { message: 'The password must have at least 8 characters' })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}