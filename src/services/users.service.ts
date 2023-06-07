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

    public async updateUsers(userIds: number[], userData: UpdateUserDto): Promise<User[]> {
        const findUsers = await DB.Users.findAll({ where: { id: userIds } });

        if (findUsers.length !== userIds.length) {
            throw new HttpException(409, 'Some users do not exist');
        }

        const updatePromises: Promise<User>[] = findUsers.map(async (user) => {
            await user.update(userData);
            return DB.Users.findByPk(user.dataValues.id);
        });

        const updatedUsers: User[] = await Promise.all(updatePromises);

        return updatedUsers;
    }

    public async deleteUsers(userIds: number[]): Promise<User[]> {
        const findUsers: User[] = await DB.Users.findAll({ where: { id: userIds } });

        if (findUsers.length !== userIds.length) {
            throw new HttpException(409, 'Some users do not exist');
        }

        await DB.Users.destroy({ where: { id: userIds } });

        return findUsers;
    }
}
