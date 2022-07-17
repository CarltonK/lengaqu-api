import * as bunyan from 'bunyan';

const logLevel: any = process.env.LAPI_LOG_LEVEL ?? 'debug';
/**
 * Bunyan logger (use instead of console.log)
 * @param namespace
 * @returns {*}
 */
function logger(namespace: string): any {
    return bunyan.createLogger({
        name: namespace,
        level: logLevel,
        serializers: { err: bunyan.stdSerializers.err },
        labels: { module: namespace, project: 'LengaQu' },
    });
}

const requestLogger = logger('REQUEST');
function morganLogger(tokens: any, req: any, res: any): any {

    const latencyMs = tokens['response-time'](req, res);
    const latency =+ (Number(latencyMs) / 1000).toFixed(9);

    requestLogger.debug({
        httpRequest: {
            requestMethod: tokens.method(req, res),
            requestUrl: tokens.url(req, res),
            responseStatusCode: tokens.status(req, res),
            status: tokens.status(req, res),
            responseSize: tokens.res(req, res, 'content-length'),
            userAgent: tokens.req(req, res, 'user-agent'),
            latency: `${latency}`,
        },
    }, tokens.url(req, res));
}

export { morganLogger, logger };