
import { Request, Response } from 'express';
import HttpException from '../helpers/exceptions';

export default class AuthMiddleware {

    async auth(request: Request, response: Response, next: any) {
        try {
            if (!request.headers.authorization) throw new HttpException(400, 'Authorization is required. Please include the header property', request);

            const token = request.headers.authorization.split(' ')[1];

            if (!token) throw new HttpException(400, 'Bearer Token is required', request);
            next();
        } catch (error: any) {
            response.status(400).send({
                status: false,
                detail: `${error.message}`,
            });
        }
    }
}