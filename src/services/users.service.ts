import { Service } from 'typedi';
import { DB } from '@database';
import { UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';

@Service()
export class UserService {
    public async findAllUser(): Promise<User[]> {
        const allUser: User[] = await DB.Users.findAll();
        return allUser;
    }

    public async updateUser(userId: number, userData: UpdateUserDto): Promise<User> {
        const findUser: User = await DB.Users.findByPk(userId);
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist');

        await DB.Users.update({ ...findUser, ...userData }, { where: { id: userId } });

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
