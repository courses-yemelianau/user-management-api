import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken extends JwtPayload {
    id: number;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface RequestWithUser extends Request {
    user: User;
}
