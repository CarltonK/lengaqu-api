// import CloudEventsHandler from '../handlers/cloud-events';
// import { logger } from '../middlewares/logger';
import { Request } from 'express';

export default class HttpException extends Error {
  code: number;
  status: boolean;
  detail: string;
  request: Request | Record<string, any> | null;
//   private cloudEventsHelper: CloudEventsHandler;

  constructor(code: number, detail: string, request: Request | Record<string, any> | null = null) {
    super(detail);
    this.code = code;
    this.status = false;
    this.detail = detail;
    this.request = request;
    // this.cloudEventsHelper = new CloudEventsHandler(['lapi_error']);
    // this.errorReporter();
  }

//   private errorReporter() {
//     const env = process.env.NODE_ENV ?? '';
//     let exceptionMessage: string = `:new: *LAPI EXCEPTION*\n\n:rocket: Environment - ${env}\n\n:1234: Code - ${this.code}\n\n:x: Detail - ${this.detail}\n\n:construction: Stack - ${this.stack}`;

//     const { method, path } = this.request ?? {};
//     if (method && path) exceptionMessage += `\n\n:triangular_flag_on_post: Method - ${method}\n\n:motorway: Path - ${path}`

//     this.cloudEventsHelper.addData('kweli_error', { slack: { text: exceptionMessage, channel: 'system_alerts' } });
//     this.cloudEventsHelper.fire(undefined).catch(error => logger('KAPI').error(`${error}`));
//   }
}