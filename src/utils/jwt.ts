import { SignOptions, sign, verify } from 'jsonwebtoken';
import HttpException from '../helpers/exceptions';

export default class JwtUtility {
    private jwtSecretKey: string | undefined;
    private jwtSigningOptions: SignOptions

    constructor(expiresIn: string = '1h',) {
        this.jwtSecretKey = process.env.JWT_SECRET_KEY;
        this.jwtSigningOptions = { expiresIn, issuer: 'https://ksmart.tech' };
    }

    signAccessToken(payload: string | object) {
        return new Promise((resolve, reject) => {
            sign(payload, this.jwtSecretKey!, this.jwtSigningOptions, (error, data) => {
                if (error) {
                    return reject(new HttpException(400, `${error.message}`));
                }
                resolve(data);
            });
        });
    }

    verifyAccessToken(token: string) {
        return new Promise((resolve, reject) => {
            verify(token, this.jwtSecretKey!, (error, data) => {
                if (error) {
                    const message = error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
                    return reject(new HttpException(401, `${message}`));
                }
                resolve(data);
            })
        })
    }
}