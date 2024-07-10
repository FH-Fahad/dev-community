import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDevDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
