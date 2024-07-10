import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Like } from "./entity/like.Schema";
import { CreateLikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikeService {
    constructor(
        @InjectModel('Like') private likeModel: Model<Like>
    ) { }

    // Liking or Disliking a post
    async likePost(createLikeDto: CreateLikeDto, devId: string): Promise<any> {
        const { postId, action } = createLikeDto;

        const like = new this.likeModel({ postId, devId, action });

        try {
            const liked = await like.save();
            return liked;
        } catch (error) {
            throw new InternalServerErrorException(`Something went wrong`);
        }
    }
}
