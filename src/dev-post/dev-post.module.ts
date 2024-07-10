import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevPost, DevPostSchema } from '../dev-post/entity/dev-post.Schema';
import { DevPostService } from './dev-post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DevPost.name, schema: DevPostSchema }
    ])],
  providers: [DevPostService]
})
export class DevPostModule { }
