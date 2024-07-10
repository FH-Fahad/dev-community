import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "./comment.service";
import { getModelToken } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Comment } from './entity/comment.Schema';
import { PostCommentService } from "../post-comment/post-comment.service";
import { PostComment } from "../post-comment/entity/post-comment.Schema";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

describe('CommentService', () => {
    let commentService: CommentService;
    let postCommentService: PostCommentService;
    let commentModel: Model<Comment>;
    let postCommentModel: Model<PostComment>;


    const mockCommentService = {
        create: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };

    const mockPostCommentService = {
        createPostComment: jest.fn(),
        deleteOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                PostCommentService,
                {
                    provide: getModelToken(Comment.name),
                    useValue: mockCommentService
                },
                {
                    provide: getModelToken(PostComment.name),
                    useValue: mockPostCommentService
                }
            ],
        }).compile();

        commentService = module.get<CommentService>(CommentService);
        postCommentService = module.get<PostCommentService>(PostCommentService);
        commentModel = module.get<Model<Comment>>(getModelToken(Comment.name));
        postCommentModel = module.get<Model<PostComment>>(getModelToken(PostComment.name));
    });

    const mockCommentResponse: any = {
        _id: '5f5a3f4e4e5e7d5f5a3f4e4e',
        content: 'This is a comment'
    }

    const mockDeleteCommentResponse: any = {
        _id: '5f5a3f4e4e5e7d5f5a3f4e4e',
        content: 'This is a comment'
    }

    const createCommentDto = {
        content: 'This is a comment'
    };

    const updateCommentDto = {
        content: 'This is an updated comment'
    }

    const mockUpdatedCommentResponse = {
        _id: '5f5a3f4e4e5e7d5f5a3f4e4e',
        content: 'This is an updated comment'
    }

    const postId = '5f5a3f4e4e5e7d5f5a3f4e4e';


    describe('create', () => {
        it('should create a comment and associate it with the post', async () => {
            jest.spyOn(commentModel, 'create').mockImplementationOnce(() => Promise.resolve(mockCommentResponse));

            jest.spyOn(postCommentService, 'createPostComment').mockImplementationOnce(() => Promise.resolve(
                {
                    postId,
                    commentId: mockCommentResponse._id
                }
            ));

            const result = await commentService.create(createCommentDto, postId);

            expect(commentModel.create).toHaveBeenCalledWith(createCommentDto);

            expect(postCommentService.createPostComment).toHaveBeenCalledWith({
                postId,
                commentId: mockCommentResponse._id
            });

            expect(result).toEqual(mockCommentResponse);
        });

        it('should throw InternalServerErrorException if something goes wrong', async () => {
            jest.spyOn(commentModel, 'create').mockRejectedValueOnce(new Error());

            await expect(commentService.create(createCommentDto, postId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw an error if postCommentService.createPostComment fails', async () => {
            jest.spyOn(commentModel, 'create').mockImplementationOnce(() => Promise.resolve(mockCommentResponse));

            jest.spyOn(postCommentService, 'createPostComment').mockRejectedValueOnce(new Error());

            await expect(commentService.create(createCommentDto, postId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw an error if commentModel.create fails', async () => {
            jest.spyOn(commentModel, 'create').mockRejectedValueOnce(new Error());

            await expect(commentService.create(createCommentDto, postId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw an error if postId is not a valid ObjectId', async () => {
            const invalidPostId = '000000000000000000000000';

            await expect(commentService.create(createCommentDto, invalidPostId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw an error if no comment is passed', async () => {
            await expect(commentService.create(null, postId)).rejects.toThrow(InternalServerErrorException);
        });
    });


    describe('findById', () => {
        it('should return a comment with valid commentId', async () => {
            jest.spyOn(commentModel, 'findById').mockResolvedValueOnce(mockCommentResponse);

            const result = await commentService.findById(mockCommentResponse._id);

            expect(commentModel.findById).toHaveBeenCalledWith(mockCommentResponse._id);
            expect(result).toEqual(mockCommentResponse);
        });

        it('should throw NotFoundException if comment is not found', async () => {
            jest.spyOn(commentModel, 'findById').mockResolvedValueOnce(null);

            await expect(commentService.findById(mockCommentResponse._id)).rejects.toThrow(
                NotFoundException,
            );

            expect(commentModel.findById).toHaveBeenCalledWith(mockCommentResponse._id);
        });

        it('should throw BadRequestException if invalid commentId is provided', async () => {
            const invalidCommentId = 'notvalid'

            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValueOnce(false);

            await expect(commentService.findById(invalidCommentId)).rejects.toThrow(
                BadRequestException,
            );
        });
    });


    describe('update a comment', () => {
        it('should update a comment with valid commentId', async () => {
            jest.spyOn(commentService, 'findById').mockResolvedValueOnce(mockCommentResponse);

            jest.spyOn(commentModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedCommentResponse);

            const result = await commentService.update(mockCommentResponse._id, updateCommentDto);

            expect(result).toEqual(mockUpdatedCommentResponse);
        });

        it('should throw BadRequestException if invalid commentId is provided', async () => {
            const invalidCommentId = 'invalid'

            await expect(commentService.update(invalidCommentId, createCommentDto)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw NotFoundException if comment is not found', async () => {
            jest.spyOn(commentService, 'findById').mockResolvedValueOnce(null);

            await expect(commentService.update(mockCommentResponse._id, createCommentDto)).rejects.toThrow(
                NotFoundException,
            );
        });
    });


    describe('remove a comment', () => {
        it('should remove a comment with valid commentId', async () => {
            jest.spyOn(commentModel, 'findById').mockResolvedValueOnce(mockCommentResponse);

            jest.spyOn(postCommentModel, 'deleteOne').mockResolvedValueOnce(mockCommentResponse);

            jest.spyOn(commentModel, 'findByIdAndDelete').mockResolvedValueOnce(mockDeleteCommentResponse);

            const result = await commentService.remove(mockCommentResponse._id);

            expect(result).toEqual(mockDeleteCommentResponse);
        });

        it('should throw BadRequestException if invalid commentId is provided', async () => {
            const invalidCommentId = 'invalid'

            jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValueOnce(false);

            await expect(commentService.remove(invalidCommentId)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw NotFoundException if comment is not found', async () => {
            jest.spyOn(commentService, 'findById').mockResolvedValueOnce(null);

            await expect(commentService.remove(mockCommentResponse._id)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw a InternalServerErrorException if something goes wrong', async () => {
            jest.spyOn(commentModel, 'findById').mockResolvedValueOnce(mockCommentResponse);

            jest.spyOn(postCommentModel, 'deleteOne').mockRejectedValueOnce(new Error());

            await expect(commentService.remove(mockCommentResponse._id)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });
});
