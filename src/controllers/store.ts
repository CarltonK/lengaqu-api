import { Request, Response, Router } from 'express';
import HttpException from '../helpers/exceptions';
import StoreService from '../services/store_service';

export default class StoreController {
    public path = '/store';
    public router = Router();
    private storeService: StoreService;

    constructor() {
        this.intializeRoutes();
        this.storeService = new StoreService();
    }

    public intializeRoutes() {
        this.router.get(this.path + '/scan', this.storeLiveCheck.bind(this));
    }

    private storeLiveCheck = async (request: Request, response: Response) => {
        const { id } = request.query;
        try {
            if (!id) throw new HttpException(400, 'Store "id" is required');

            const store = await this.storeService.storeLiveCheck(String(id));

            response.status(200).send({ status: true, detail: `Store live check complete`, store });
        } catch (error: any) {
            response.status(error.code).send({ status: false, detail: `${error.message}` });
        }
    }

}