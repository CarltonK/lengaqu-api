import { Request, Response, NextFunction } from 'express';
import HttpException from '../helpers/exceptions';
// import { logger } from '../middlewares/logger';
// import CloudEventsHandler from './cloud-events';

class ErrorHandler {
    /**
     * Global error handler
     * @param request
     * @param response
     * @param next
     * @returns {void}
     */
    error(error: HttpException, request: Request, response: Response, next: NextFunction): void {
        // const { method, path } = request;
        const code = error.code || 500;
        const status = error.status;
        const detail = error.detail || 'Internal Server Error';

        // const cloudEventsHelper = new CloudEventsHandler(['lq-error']);
        // const env = process.env.NODE_ENV ?? '';
        // cloudEventsHelper.addData('lq-error', { slack: { text: `:new: *LAPI ERROR*\n\n:rocket: Environment - ${env}\n\n:1234: Code - ${code}\n\n:x: Detail - ${detail}\n\n:triangular_flag_on_post: Method - ${method}\n\n:motorway: Path - ${path}`, channel: 'lapi-alerts' } });
        // cloudEventsHelper.fire(undefined).catch(err => logger('KAPI').error(`${err}`));

        response.status(code).send({ status, detail });
    }
}

export default new ErrorHandler();