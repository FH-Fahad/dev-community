import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostComment, PostCommentSchema } from '../post-comment/entity/post-comment.Schema';
import { PostCommentService } from './post-comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: PostComment.name,
      schema: PostCommentSchema
    }])
  ],
  providers: [PostCommentService]
})
export class PostCommentModule { }
