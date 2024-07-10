import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Comment } from "../../comment/entity/comment.Schema";
import { Post } from "../../post/entity/post.Schema";

@Schema({ timestamps: true})
export class PostComment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
    postId: Post;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true })
    commentId: Comment;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
