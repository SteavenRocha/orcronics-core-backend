import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength, } from 'class-validator';
import { EvihubRole } from '../../../common/enums/role.enum';

export class CreateEvihubUserDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(150)
    email: string;

    @IsString()
    @MinLength(8, { message: 'The password must have at least 8 characters' })
    @MaxLength(64)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])\S+$/, {
        message: 'password must contain uppercase, lowercase, number and special character, and no spaces',
    })
    password: string;

    @IsEnum(EvihubRole)
    @IsOptional()
    role?: EvihubRole;

    @IsUUID()
    @IsNotEmpty()
    accountId!: string;
}