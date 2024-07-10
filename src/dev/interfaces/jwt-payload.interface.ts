import Mongoose from 'mongoose';

export interface JwtPayload {
    id: Mongoose.Types.ObjectId;
    email: string;
}