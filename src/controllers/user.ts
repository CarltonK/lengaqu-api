import { Router, Request, Response } from 'express';
import HttpException from '../helpers/exceptions';

export default class UserController {
    public path = '/users';
    public router = Router();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(this.path, this.createUser.bind(this));
    }

    private createUser = async (request: Request, response: Response) => {
        try {
            const { identificationNumber, mobileNumber } = request.body;

            // Identification Number
            if (!identificationNumber) throw new HttpException(400, 'Identification Number required', request);

            // Mobile Number
            if (!mobileNumber) throw new HttpException(400, 'Mobile Number required', request);
            response.status(201).send({ status: true, detail: 'Account created successfully' });
        } catch (error: any) {
            response.status(error.code).send({ status: false, detail: `${error.message}` });
        }
    }
}