import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../post/entity/post.Schema';
import { DevPostService } from '../dev-post/dev-post.service';
import { DevPost } from '../dev-post/entity/dev-post.Schema';
import { PostComment } from '../post-comment/entity/post-comment.Schema';

@Injectable()
export class PostService {
  constructor(
    private readonly devPostService: DevPostService,
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('DevPost') private readonly devPostModel: Model<DevPost>,
    @InjectModel('PostComment') private readonly postCommentModel: Model<PostComment>
  ) { }

  // Creating a post
  async create(createPostDto: CreatePostDto, devId: string): Promise<Post> {

    try {
      const postSave = await this.postModel.create(createPostDto);

      const devPost = {
        postId: postSave._id.toString(),
        devId
      };

      await this.devPostService.createDevPost(devPost);

      return postSave;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }

  async postWithComments(postId: string) {
    const aggregate = [];

    aggregate.push({
      $match: {
        postId: new Types.ObjectId(postId)
      }
    });

    aggregate.push({
      $lookup: {
        from: 'comments',
        localField: 'commentId',
        foreignField: '_id',
        as: 'comment'
      }
    });

    // used $unwind to flatten the array to an object.
    aggregate.push({
      $unwind: '$comment'
    });

    aggregate.push({
      $project: {
        _id: '$comment._id',
        content: '$comment.content',
        createdAt: '$comment.createdAt',
        updatedAt: '$comment.updatedAt'
      }
    });

    const res = await this.postCommentModel.aggregate(aggregate);

    return res
  }

  // Get all post by dev Id
  async findAllPostByDevId(devId: string): Promise<any> {
    const devPosts = await this.devPostModel.find({ devId: devId }).exec();
    const postIds = devPosts.map(devPost => devPost.postId);

    const posts = await this.postModel.find({ _id: { $in: postIds } }).exec();

    const postWithComments = await Promise.all(posts.map(async post => {
      const comments = await this.postWithComments(post._id.toString());
      return { post: post.toObject(), comments };
    }));

    return postWithComments;
  }

  // Get a post
  async findById(postId: string) {
    const post = this.postModel.findById(postId);

    if (!post) {
      throw new InternalServerErrorException(`Post not found`);
    }

    const comments = await this.postWithComments(postId);

    return {
      post: (await post).toObject(), comments
    };
  }

  // Update a post
  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findById(id);
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  // Delete a post
  async remove(id: string) {
    await this.findById(id);
    await this.devPostModel.deleteOne({ postId: id });
    return this.postModel.findByIdAndDelete(id);
  }
}
