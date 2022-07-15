import { Request, Response, Router } from 'express';

export default class BaseController {
  public path = '/';
  public router = Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.livenessCheck.bind(this));
    this.router.use(this.path, this.methodNotAllowed.bind(this));
  }

  private methodNotAllowed = (request: Request, response: Response) => {
    response.status(405).send({ status: false, detail: 'Method Not Allowed' });
  }

  private livenessCheck = (request: Request, response: Response) => {
    response.status(200).send({
      status: true,
      detail: `LAPI is up and running`,
    });
  }

}