import { IsEnum, IsNotEmpty } from "class-validator";
import { LikeStatus } from "../enum/like-status.enum";
import Mongoose from 'mongoose';

export class CreateLikeDto {
    @IsNotEmpty()
    postId: Mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsEnum(LikeStatus)
    action: LikeStatus;
}
