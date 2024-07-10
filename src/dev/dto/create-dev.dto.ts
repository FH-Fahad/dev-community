import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateDevDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    skills: string;

    @IsString()
    @IsOptional()
    experience: string;

    @IsString()
    @IsOptional()
    refreshToken?: string;
}
