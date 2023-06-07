import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DB } from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { UserStatus } from '@constants';

const getAuthorization = (req) => {
    const cookie = req.cookies.Authorization;
    if (cookie) return cookie;

    const header = req.header('Authorization');
    if (header) return header.split('Bearer ')[1];

    return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const Authorization = getAuthorization(req);

        if (Authorization) {
            const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
            const findUser = await DB.Users.findByPk(id);

            if (findUser) {
                if (findUser.status === UserStatus.Blocked) {
                    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
                    throw new HttpException(403, 'User is blocked. Access is not allowed.');
                }

                req.user = findUser;
                next();
            } else {
                next(new HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication token'));
    }
};
