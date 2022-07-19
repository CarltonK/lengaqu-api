import { Request } from 'express';
import HttpException from './exceptions';;
import JwtUtility from './../utils/jwt';

export default class AuthUserHelper {
    async userValidation(request: Request) {
        // Retrieve user data from token
        const userToken = request.headers.authorization!.split(' ')[1];

        const jwt = new JwtUtility();
        const userTokenData: any = await jwt.verifyAccessToken(userToken);

        const { identificationNumber, userType } = userTokenData;

        if (!identificationNumber) throw new HttpException(400, `Invalid Token`);

        return { identificationNumber, userType };
    }
}