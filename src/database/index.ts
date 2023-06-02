import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';
import UserModel from '@models/users.model';
import { logger } from '@utils/logger';
import { Env } from '@constants';

const sequelize = new Sequelize.Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}?ssl=true`, {
    dialect: 'postgres',
    port: +DB_PORT,
    pool: {
        min: 0,
        max: 5
    },
    logQueryParameters: NODE_ENV === Env.Development,
    logging: (query, time) => {
        logger.info(`${time}ms ${query}`);
    },
    benchmark: true
});

sequelize.authenticate()
    .then(() => {
        logger.info('The database is connected.');
    })
    .catch((error: Error) => {
        logger.error(`Unable to connect to the database: ${error}.`);
    });

export const DB = {
    Users: UserModel(sequelize),
    sequelize,
    Sequelize
};
