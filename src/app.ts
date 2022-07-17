import * as express from 'express';
import * as morgan from 'morgan';
import helmet from 'helmet';

import CorsMiddleware from './middlewares/cors';
import { logger, morganLogger } from './middlewares/logger';

import BaseController from './controllers/base';

export default class App {
    public app: express.Application;
    private port: any;
    private controllers: any[] = [
        new BaseController(),
    ];

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan(morganLogger));
        this.app.use(CorsMiddleware.cors);
    }

    private initializeRoutes() {
        this.controllers.forEach((controller: any) => {
            this.app.use('/api/', controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger('LAPI').info(`Up, up and away`);
        });
    }
}