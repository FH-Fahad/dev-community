import { PartialType } from '@nestjs/mapped-types';
import { CreateDevDto } from './create-dev.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDevDto extends PartialType(CreateDevDto) {
    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    skills?: string;

    @IsString()
    @IsOptional()
    experience?: string;

    @IsString()
    @IsOptional()
    refreshToken?: string;
}
