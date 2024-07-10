/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { DevService } from './dev.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Dev } from './entity/dev.Schema';
import { Model } from 'mongoose';
import { LoginDevDto } from './dto/login-dev.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'crypto';
import { UpdateDevDto } from './dto/update-dev.dto';

describe('DevService', () => {
    let devService: DevService;
    let jwtService: JwtService;
    let devModel: Model<Dev>;

    const mockDevService = {
        create: jest.fn(),
        findOne: jest.fn(),
        updateOne: jest.fn(),
        sign: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    };

    const mockDev = {
        email: 'test@gmail.com',
        password: 'hashedPassword',
        skills: 'JavaScript, Node.js',
        experience: 'Intermediate',
    };

    const mockDevResponse: any = {
        id: '660d2eff898f6d8e0c76328d',
        email: 'test@gmail.com',
        password: 'hashedPassword',
        skills: 'JavaScript, Node.js',
        experience: 'Intermediate',
    };

    const mockJwtService = {
        sign: jest.fn()
    }

    const mockLoginDevDto: LoginDevDto = {
        email: 'test@gmail.com',
        password: 'hashedPassword'
    };

    const mockLoginResponse = {
        _id: '660d2eff898f6d8e0c76328d',
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
    };

    const updateDevDto: UpdateDevDto = {
        email: 'test1@gmail.com'
    }

    const mockUpdateResponse = {
        id: '660d2eff898f6d8e0c76328d',
        email: 'test1@gmail.com'
    }

    const devId = '660d2eff898f6d8e0c76328d';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DevService,
                JwtService,
                {
                    provide: getModelToken(Dev.name),
                    useValue: mockDevService,
                }, {
                    provide: JwtService,
                    useValue: mockJwtService,
                }
            ],
        }).compile();

        devService = module.get<DevService>(DevService);
        jwtService = module.get<JwtService>(JwtService);
        devModel = module.get<Model<Dev>>(getModelToken(Dev.name));
    });

    describe('create a dev', () => {
        it('should create a new dev', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

            jest.spyOn(devModel, 'create').mockImplementationOnce(() => Promise.resolve(mockDevResponse));

            const result = await devService.create(mockDev);

            expect(result).toEqual(mockDevResponse);
        });

        it('should throw an InternalServerErrorException if something went wrong', async () => {
            jest.spyOn(devModel, 'create').mockImplementationOnce(() => Promise.reject(new Error()));

            await expect(devService.create(mockDev)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('login a dev', () => {
        it('should successfully log in with valid credentials', async () => {
            jest.spyOn(devModel, 'findOne').mockResolvedValueOnce(mockLoginResponse);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

            jest.spyOn(jwtService, 'sign').mockReturnValueOnce('mockAccessToken').mockReturnValueOnce('mockRefreshToken');

            const result = await devService.login(mockLoginDevDto);

            expect(result).toEqual(mockLoginResponse);
        });

        it('should throw BadRequestException if dev not found', async () => {
            jest.spyOn(devModel, 'findOne').mockResolvedValueOnce(null);

            await expect(devService.login(mockLoginDevDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException if invalid password', async () => {
            jest.spyOn(devModel, 'findOne').mockResolvedValueOnce(mockLoginResponse);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

            await expect(devService.login(mockLoginDevDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return all devs info', async () => {
            jest.spyOn(devModel, 'find').mockResolvedValueOnce([mockDevResponse]);

            const result = await devService.findAll();

            expect(result).toEqual([mockDevResponse]);
        });
    })

    describe('findOne', () => {
        it('should find a dev with valid devId', async () => {
            jest.spyOn(devModel, 'findById').mockResolvedValueOnce(mockDevResponse);

            const result = await devService.findOne(mockDevResponse.id);

            expect(result).toEqual(mockDevResponse);
        });

        it('should throw BadRequestException if invalid devId is provided', async () => {
            const invalidDevId = 'notvalid';

            jest.spyOn(devModel, 'findById').mockResolvedValueOnce(null);

            await expect(devService.findOne(invalidDevId)).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update a dev', async () => {
            jest.spyOn(devService, 'findOne').mockResolvedValueOnce(mockDevResponse.id);

            jest.spyOn(devModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdateResponse);

            const result = await devService.update(mockDevResponse.id, mockDev);

            expect(result).toEqual(mockUpdateResponse);
        });
    });

    describe('remove', () => {
        it('should remove a dev with valid devId', async () => {
            jest.spyOn(devService, 'findOne').mockResolvedValueOnce(mockDevResponse.id);
            jest.spyOn(devModel, 'findByIdAndDelete').mockResolvedValueOnce(mockDevResponse);

            const result = await devService.remove(mockDevResponse.id);

            expect(result).toEqual(mockDevResponse);
        });
    })
});
