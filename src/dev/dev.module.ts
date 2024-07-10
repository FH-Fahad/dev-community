import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Dev, DevSchema } from './entity/dev.Schema';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { JwtStrategy } from './jwt-strategy';
import { loadEnv } from '../common/config/jwt-secret-loader.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{
      name: Dev.name,
      schema: DevSchema
    }]),
    JwtModule.registerAsync({
      useFactory: async () => {
        await loadEnv();
        return {
          secret: process.env.JWT_SECRET
        }
      }
    })
  ],
  controllers: [DevController],
  providers: [DevService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class DevModule { }
