import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostComment } from '../post-comment/entity/post-comment.Schema';
import { PostCommentDto } from './dto/post-comment.dto';

@Injectable()
export class PostCommentService {
    constructor(
        @InjectModel('PostComment') private readonly postCommentModel: Model<PostComment>
    ) { }

    async createPostComment(postComment: PostCommentDto): Promise<any> {
        const postCommentModel = new this.postCommentModel(postComment);
        return await postCommentModel.save();
    }
}
