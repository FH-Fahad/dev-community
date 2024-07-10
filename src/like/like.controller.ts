import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateLikeDto } from "./dto/create-like.dto";
import { LikeService } from "./like.service";
import { GetCurrentDevId } from "../common/decorators/get-user-id.decorator";

@Controller('like')
@UseGuards(AuthGuard())
export class LikeController {
    constructor(private likeService: LikeService) { }

    // Liking or Disliking a post
    @Post('post')
    async likePost(@Body() createLikeDto: CreateLikeDto,
        @GetCurrentDevId() devId: string): Promise<any> {
        return this.likeService.likePost(createLikeDto, devId);
    }
}
