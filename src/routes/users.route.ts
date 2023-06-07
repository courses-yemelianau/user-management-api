import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { DeleteUsersDto, UpdateUsersDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class UserRoute implements Routes {
    public path = '/users';
    public router = Router();
    public user = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, AuthMiddleware, this.user.getUsers);
        this.router.put(`${this.path}/update`, AuthMiddleware, ValidationMiddleware(UpdateUsersDto, true, true), this.user.updateUsers);
        this.router.delete(`${this.path}/delete`, AuthMiddleware, ValidationMiddleware(DeleteUsersDto, true, true), this.user.deleteUsers);
    }
}
