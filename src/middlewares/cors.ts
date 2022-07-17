import { Request, Response } from 'express';

class CorsMiddleware {
    /**
     * Handles CORS request
     * @returns {middleware} 
     */
    cors(req: Request, res: Response, next: () => void): void {
        const allowedHeaders: String[] = [
            'Access-Control-Allow-Headers',
            'Origin',
            'Accept',
            'X-Requested-With',
            'Content-Type',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
            'Authorization',
            'X-LengaQu-App-Key',
        ];

        const allowedMethods: String[] = [
            'HEAD',
            'OPTIONS',
            'GET',
            'PUT',
            'POST',
            'DELETE',
        ];

        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', allowedHeaders.join(','));
        res.set('Access-Control-Allow-Methods', allowedMethods.join(','));
        res.set('Access-Control-Allow-Credentials', 'true');
        next();
    }
}

export default new CorsMiddleware();