import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';

export class UserController {
    public user = Container.get(UserService);

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllUsersData: User[] = await this.user.findAllUser();

            res.status(200).json({ data: findAllUsersData, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public updateUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userIds: number[] = req.body.userIds;
            const userData: UpdateUserDto = req.body.userData;

            const updatedUsersData: User[] = await this.user.updateUsers(userIds, userData);

            res.status(200).json({ data: updatedUsersData, message: 'Users updated' });
        } catch (error) {
            next(error);
        }
    };

    public deleteUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userIds: number[] = req.body.userIds;

            const deletedUsersData: User[] = await this.user.deleteUsers(userIds);

            res.status(200).json({ data: deletedUsersData, message: 'Users deleted' });
        } catch (error) {
            next(error);
        }
    };
}
