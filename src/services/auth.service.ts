import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { DB } from '@database';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { UserStatus } from '@constants';
import { logger } from '@utils/logger';

const createToken = (user: User): TokenData => {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
    public async signup(userData: CreateUserDto): Promise<User> {
        const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
        if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

        const hashedPassword = await hash(userData.password, 10);
        const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });

        return createUserData;
    }

    public async login(userData: LoginUserDto): Promise<{ cookie: string; findUser: User }> {
        const findUser = await DB.Users.findOne({ where: { email: userData.email } });
        logger.info(`2@@@findUser ${JSON.stringify(findUser)}`);
        if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

        if (findUser.status === UserStatus.Blocked) {
            throw new HttpException(403, 'User is blocked. Login is not allowed.');
        }

        logger.info(`3@@@userData, findUser ${JSON.stringify({ userData, findUser })}`);
        const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
        logger.info(`4@@@isPasswordMatching ${JSON.stringify(isPasswordMatching)}`);
        if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

        findUser.lastLoginDate = new Date();
        logger.info(`5@@@findUser ${JSON.stringify(findUser)}`);
        await findUser.save();

        logger.info(`6@@@findUser ${JSON.stringify(findUser)}`);
        const tokenData = createToken(findUser);
        const cookie = createCookie(tokenData);

        logger.info(`7@@@tokenData, cookie ${JSON.stringify({ tokenData, cookie })}`);
        return { cookie, findUser };
    }

    public async logout(userData: User): Promise<User> {
        const findUser: User = await DB.Users.findOne({
            where: {
                email: userData.email,
                password: userData.password
            }
        });
        if (!findUser) throw new HttpException(409, 'User doesn\'t exist');

        return findUser;
    }
}
