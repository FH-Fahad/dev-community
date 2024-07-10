import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DevService } from "./dev.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { loadEnv } from '../common/config/jwt-secret-loader.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private jwtSecret: string;

    constructor(
        protected readonly devService: DevService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });

        this.loadEnv().then(() => {
            this.jwtSecret = process.env.JWT_SECRET;
        });
    }

    private async loadEnv(): Promise<void> {
        return loadEnv();
    }

    async validate(payload: JwtPayload) {
        const { id } = payload;

        const dev = await this.devService.findOne(id.toString());

        if (!dev) {
            throw new UnauthorizedException();
        }

        return dev;
    }
}
