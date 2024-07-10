import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Comment, CommentSchema } from './entity/comment.Schema';
import { PostComment, PostCommentSchema } from '../post-comment/entity/post-comment.Schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PostCommentService } from '../post-comment/post-comment.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{
      name: Comment.name,
      schema: CommentSchema
    }, {
      name: PostComment.name,
      schema: PostCommentSchema
    }
    ])],
  controllers: [CommentController],
  providers: [CommentService, PostCommentService],
})
export class CommentModule { }
