import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { LikeStatus } from "../enum/like-status.enum";

@Schema({ timestamps: true})
export class Like {
    @Prop()
    action: LikeStatus;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    postId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dev' })
    devId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
