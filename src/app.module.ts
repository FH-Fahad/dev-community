import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevModule } from './dev/dev.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { PostCommentModule } from './post-comment/post-comment.module';
import { DevPostModule } from './dev-post/dev-post.module';
import { LikeModule } from './like/like.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './common/config/db.config';

@Module({
  imports: [
    DevModule, PostModule, CommentModule, MongooseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URL'),
      }),
    }),

    PostCommentModule, DevPostModule, LikeModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
