/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { DevPostService } from '../dev-post/dev-post.service';
import { Model, Types } from 'mongoose';
import { Post } from '../post/entity/post.Schema';
import { DevPost } from '../dev-post/entity/dev-post.Schema';
import { getModelToken } from '@nestjs/mongoose';
import { PostComment } from '../post-comment/entity/post-comment.Schema';

const mockCreatePostDto: CreatePostDto = {
    title: 'Test Post Title',
    content: 'Test Post Content',
};

const mockPostResponse: any = {
    _id: '1234567890abcdef',
    title: mockCreatePostDto.title,
    content: mockCreatePostDto.content,
};

const mockPostId = '1234567890abcdef';
const mockDevId = '9876543210fedcba';

describe('PostService', () => {
    let postService: PostService;
    let devPostService: DevPostService;
    let postModel: Model<Post>;
    let devPostModel: Model<DevPost>;
    let postCommentModel: Model<PostComment>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: DevPostService,
                    useValue: {
                        createDevPost: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(Post.name),
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        deleteOne: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(DevPost.name),
                    useValue: {
                        createDevPost: jest.fn(),
                        deleteOne: jest.fn(),
                    },
                },
                {
                    provide: getModelToken(PostComment.name),
                    useValue: {
                        aggregate: jest.fn(),
                    },
                }
            ],
        }).compile();

        postService = module.get<PostService>(PostService);
        devPostService = module.get<DevPostService>(DevPostService);
        postModel = module.get<Model<Post>>(getModelToken(Post.name));
        devPostModel = module.get<Model<DevPost>>(getModelToken(DevPost.name));
        postCommentModel = module.get<Model<PostComment>>(getModelToken(PostComment.name));
    });


    describe('create', () => {
        it('should create a post and save it to DevPost', async () => {
            jest.spyOn(postModel, 'create').mockResolvedValueOnce(mockPostResponse);
            jest.spyOn(devPostService, 'createDevPost').mockResolvedValueOnce({
                postId: mockPostId,
                devId: mockDevId,
            });

            const result = await postService.create(mockCreatePostDto, mockDevId);

            expect(result).toEqual(mockPostResponse);
        });

        it('should throw an error if something goes wrong', async () => {
            jest.spyOn(postModel, 'create').mockRejectedValueOnce(new Error('Something went wrong'));

            try {
                await postService.create(mockCreatePostDto, mockDevId);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Something went wrong');
            }
        });
    });

    // describe('postWithComments', () => {
    //     it('should return comments for a post', async () => {
    //         const mockCommentData = [
    //             {
    //                 _id: new Types.ObjectId(),
    //                 content: 'Mock comment content',
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //             }
    //         ];
    //         jest.spyOn(postCommentModel, 'aggregate').mockResolvedValueOnce(mockCommentData);

    //         const result = await postService.postWithComments(mockPostId);

    //         expect(result).toEqual(mockCommentData);
    //     });
    // })

    describe('update', () => {
        it('should update a post', async () => {
            jest.spyOn(postService, 'findById').mockImplementationOnce(() => Promise.resolve(mockPostResponse));
            jest.spyOn(postModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockPostResponse);

            const result = await postService.update(mockPostId, mockCreatePostDto);

            expect(result).toEqual(mockPostResponse);
        });

        it('should throw an error if something goes wrong', async () => {
            jest.spyOn(postService, 'findById').mockImplementationOnce(() => Promise.resolve(mockPostResponse));
            jest.spyOn(postModel, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Something went wrong'));

            await expect(postService.update(mockPostId, mockCreatePostDto)).rejects.toThrow('Something went wrong');
        });
    })

    describe('delete', () => {
        it('should delete a post', async () => {
            jest.spyOn(postService, 'findById').mockImplementationOnce(() => Promise.resolve(mockPostResponse));

            jest.spyOn(devPostModel, 'deleteOne').mockResolvedValueOnce(mockPostResponse);

            jest.spyOn(postModel, 'findByIdAndDelete').mockResolvedValueOnce(mockPostResponse);

            const result = await postService.remove(mockPostId);

            expect(result).toEqual(mockPostResponse);
        });

        it('should throw an error if something goes wrong', async () => {
            jest.spyOn(postService, 'findById').mockImplementationOnce(() => Promise.resolve(mockPostResponse));

            jest.spyOn(devPostModel, 'deleteOne').mockRejectedValueOnce(new Error('Something went wrong'));

            await expect(postService.remove(mockPostId)).rejects.toThrow('Something went wrong');
        });
    });
});
