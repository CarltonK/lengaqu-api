
import { Request, Response, Router } from 'express';
import HttpException from '../helpers/exceptions';
import AuthService from '../services/auth_service';

export default class SessionController {
    public path = '/session';
    public router = Router();
    private auth = new AuthService();

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(this.path, this.createSession.bind(this));
    }

    private createSession = async (request: Request, response: Response) => {
        try {
            const { identificationNumber, password, type } = request.body;

            // Identification Number
            if (!identificationNumber) throw new HttpException(400, 'Identification Number required', request);

            if (!password) throw new HttpException(400, 'Password required', request);

            if (!type) throw new HttpException(400, 'Please provide the login type', request);

            const data = { identificationNumber, password, type }

            const user = await this.auth.sessionCreate(data);

            response.status(200).send({ status: true, user });

        } catch (error: any) {
            response.status(error.code).send({ status: false, detail: `${error.message}` });
        }
    }

}