import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Dev } from './entity/dev.Schema';
import { CreateDevDto } from './dto/create-dev.dto';
import { UpdateDevDto } from './dto/update-dev.dto';
import { LoginDevDto } from './dto/login-dev.dto';

@Injectable()
export class DevService {
  constructor(
    @InjectModel('Dev') private readonly devModel: Model<Dev>,
    private jwtService: JwtService
  ) { }

  // Create a new dev
  async create(createDevDto: CreateDevDto): Promise<Dev> {
    const hashedPassword = await bcrypt.hash(createDevDto.password, 8);

    try {
      const dev = await this.devModel.create({
        email: createDevDto.email,
        password: hashedPassword,
        skills: createDevDto.skills,
        experience: createDevDto.experience,
        refreshToken: ''
      });

      return dev;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`);
    }
  }


  // Login a dev
  async login(loginDevDto: LoginDevDto) {
    const dev = await this.devModel.findOne({ email: loginDevDto.email });

    if (!dev) {
      throw new BadRequestException(`Dev not found`);
    }

    const comparePassword = await bcrypt.compare(loginDevDto.password, dev.password);

    if (!comparePassword) {
      throw new InternalServerErrorException(`Invalid password`);
    }

    if (dev && comparePassword) {
      const { _id } = dev;
      const payload = { id: _id, email: loginDevDto.email };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.devModel.updateOne({ _id }, { refreshToken });

      return { _id, accessToken, refreshToken };
    }
  }

  // Return all devs info
  findAll(): Promise<Dev[]> {
    return this.devModel.find({}, { password: 0, refreshToken: 0, __v: 0 });
  }

  // Find a dev by id
  async findOne(devId: string): Promise<Dev> {
    const dev = await this.devModel.findById(devId);

    if (!dev) {
      throw new BadRequestException(`Dev not found`);
    }

    return dev;
  }

  // Update a dev info
  async update(devId: string, updateDevDto: UpdateDevDto): Promise<Dev> {
    await this.findOne(devId);

    return await this.devModel.findByIdAndUpdate(devId, updateDevDto, { new: true });
  }

  // Remove a dev
  async remove(devId: string): Promise<Dev> {
    await this.findOne(devId);

    return await this.devModel.findByIdAndDelete(devId);
  }

  // Logout a dev
  async logout(devId: string) {
    const dev = await this.devModel.findOne({ _id: devId });

    if (!dev) {
      throw new BadRequestException(`Dev not found`);
    }

    await this.devModel.updateOne({ _id: devId }, { refreshToken: '' });

    return { message: 'Logout successfully' };
  }
}
