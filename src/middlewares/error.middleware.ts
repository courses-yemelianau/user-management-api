import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/httpException';
import { logger } from '@utils/logger';
import { Default } from '@constants';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.status || Default.ERROR_STATUS_CODE;
        const message: string = error.message || Default.ERROR_MESSAGE;

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({ message });
    } catch (error) {
        next(error);
    }
};
