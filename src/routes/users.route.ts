import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { UpdateUserDto } from '@dtos/users.dto';
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
        this.router.put(`${this.path}/:id(\\d+)`, AuthMiddleware, ValidationMiddleware(UpdateUserDto, true, true), this.user.updateUser);
        this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware, this.user.deleteUser);
    }
}
