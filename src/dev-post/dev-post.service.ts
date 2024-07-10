import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DevPost } from '../dev-post/entity/dev-post.Schema';
import { DevPostDto } from './dto/dev-post.dto';

@Injectable()
export class DevPostService {
    constructor(@InjectModel(DevPost.name) private devPostModel: Model<DevPost>) { }

    async createDevPost(devPostDto: DevPostDto): Promise<any> {
        return this.devPostModel.create(devPostDto);
    }
}
