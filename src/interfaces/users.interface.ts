import { UserStatus } from '@constants';

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    registrationDate?: Date;
    lastLoginDate?: Date;
    status: UserStatus;
}
