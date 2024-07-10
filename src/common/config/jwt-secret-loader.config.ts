import * as dotenv from 'dotenv';
import { UnauthorizedException } from '@nestjs/common';

export async function loadEnv(): Promise<void> {
    try {
        await dotenv.config();
    } catch (error) {
        throw new UnauthorizedException('Failed to load environment variables');
    }
}
