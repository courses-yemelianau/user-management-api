import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';
import { UserStatus } from '@constants';

export type UserCreationAttributes = Optional<User, 'id' | 'lastLoginDate'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public registrationDate?: Date;
    public lastLoginDate?: Date;
    public status: UserStatus;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING(45)
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            registrationDate: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            lastLoginDate: {
                allowNull: true,
                type: DataTypes.DATE
            },
            status: {
                allowNull: false,
                type: DataTypes.ENUM(...Object.values(UserStatus)),
                defaultValue: UserStatus.Unblocked
            }
        },
        {
            tableName: 'users',
            sequelize
        }
    );

    return UserModel;
}
