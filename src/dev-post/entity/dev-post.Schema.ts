import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Dev } from "../../dev/entity/dev.Schema";
import { Post } from "../../post/entity/post.Schema";

@Schema({ timestamps: true})
export class DevPost {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    devId: Dev;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
    postId: Post;
}

export const DevPostSchema = SchemaFactory.createForClass(DevPost);
