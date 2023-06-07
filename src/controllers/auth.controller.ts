import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import { logger } from '@utils/logger';

export class AuthController {
    public auth = Container.get(AuthService);

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body;
            const signUpUserData: User = await this.auth.signup(userData);

            res.status(201).json({ data: signUpUserData, message: 'signup' });
        } catch (error) {
            next(error);
        }
    };

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: LoginUserDto = req.body;
            logger.info(`1@@@userData ${JSON.stringify(userData)}`);
            const { cookie, findUser } = await this.auth.login(userData);
            logger.info(`8@@@{ cookie, findUser } ${JSON.stringify({ cookie, findUser })}`);

            res.setHeader('Set-Cookie', [cookie]);
            res.status(200).json({ data: findUser, message: 'login' });
        } catch (error) {
            next(error);
        }
    };

    public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.user;
            const logOutUserData: User = await this.auth.logout(userData);

            res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
            res.status(200).json({ data: logOutUserData, message: 'logout' });
        } catch (error) {
            next(error);
        }
    };
}
