import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true})
export class Dev {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    skills: string;

    @Prop({ required: true })
    experience: string;

    @Prop({ required: false })
    refreshToken: string;
}

export const DevSchema = SchemaFactory.createForClass(Dev);
