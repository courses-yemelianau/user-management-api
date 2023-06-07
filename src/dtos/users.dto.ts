import { IsString, IsEmail, IsNotEmpty, IsArray, IsObject } from 'class-validator';
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

export class UpdateUsersDto {
    @IsArray()
    @IsNotEmpty()
    public userIds: number[];

    @IsObject()
    @IsNotEmpty()
    public userData: UpdateUserDto;
}

export class DeleteUsersDto {
    @IsArray()
    @IsNotEmpty()
    public userIds: number[];
}
