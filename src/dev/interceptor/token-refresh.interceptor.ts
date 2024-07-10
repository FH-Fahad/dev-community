import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Dev } from '../entity/dev.Schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TokenRefreshInterceptor implements NestInterceptor {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('Dev') private readonly devModel: Model<Dev>,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest();
        const refreshToken = req.body.refreshToken;
        const validToken = await this.devModel.findOne({ refreshToken });

        if (!validToken || refreshToken !== validToken.refreshToken) {
            throw new UnauthorizedException('Invalid token');
        }

        try {
            const decoded = this.jwtService.verify(refreshToken);
            const { id, email } = decoded;
            const payload = { id, email };
            const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

            req.accessToken = accessToken;
            req.headers['authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        return next.handle().pipe(map(() => req.accessToken));
    }
}
