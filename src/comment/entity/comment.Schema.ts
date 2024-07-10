import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
