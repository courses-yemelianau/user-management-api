import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { UserStatus } from '@constants';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

    @IsString()
    @IsNotEmpty()
    public name: string;
}

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    public status: UserStatus;
}
