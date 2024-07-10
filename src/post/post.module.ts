import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entity/post.Schema';
import { DevModule } from '../dev/dev.module';
import { DevPost, DevPostSchema } from '../dev-post/entity/dev-post.Schema';
import { DevPostService } from '../dev-post/dev-post.service';
import { PostComment, PostCommentSchema } from '../post-comment/entity/post-comment.Schema';

@Module({
  imports: [
    DevModule,
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema
      },
      {
        name: DevPost.name,
        schema: DevPostSchema
      },
      {
        name: PostComment.name,
        schema: PostCommentSchema
      }
    ])
  ],
  controllers: [PostController],
  providers: [PostService, DevPostService],
})
export class PostModule { }
