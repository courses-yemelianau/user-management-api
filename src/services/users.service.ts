import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { DB } from '@database';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';

@Service()
export class UserService {
    public async findAllUser(): Promise<User[]> {
        const allUser: User[] = await DB.Users.findAll();
        return allUser;
    }

    public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
        const findUser: User = await DB.Users.findByPk(userId);
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist');

        const hashedPassword = await hash(userData.password, 10);
        await DB.Users.update({ ...userData, password: hashedPassword }, { where: { id: userId } });

        const updateUser: User = await DB.Users.findByPk(userId);
        return updateUser;
    }

    public async deleteUser(userId: number): Promise<User> {
        const findUser: User = await DB.Users.findByPk(userId);
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist');

        await DB.Users.destroy({ where: { id: userId } });

        return findUser;
    }
}
