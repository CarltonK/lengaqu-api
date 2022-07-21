import { Router, Request, Response } from 'express';
import HttpException from '../helpers/exceptions';

import AuthService from '../services/auth_service';

export default class UserController {
    public path = '/users';
    public router = Router();
    private codeReasonEnums: string[] = ['REGISTRATION', 'PASSWORD_RESET'];
    private emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    private allowedMobilePrefix: string[] = ['01', '07'];
    private allowedUserTypes = ['CUSUSER'];

    private authService;

    constructor() {
        this.intializeRoutes();
        this.authService = new AuthService();
    }

    public intializeRoutes() {
        this.router.post(this.path, this.createUser.bind(this));
        this.router.post(this.path + '/:id/verify', this.verifyUser.bind(this));
        this.router.get(this.path + '/:id/password', this.requestChangePasswordUser.bind(this));
        this.router.put(this.path + '/:id/password', this.validateChangePasswordUser.bind(this));
    }

    private createUser = async (request: Request, response: Response) => {
        try {
            const { identificationNumber, mobileNumber, emailAddress, firstName, lastName, password } = request.body;
            let { isCompliant, userType } = request.body;

            // Identification Number
            if (!identificationNumber) throw new HttpException(400, 'Identification Number required', request);

            // Mobile Number
            if (!mobileNumber) throw new HttpException(400, 'Mobile Number required', request);

            const mobileSubString = String(mobileNumber).substring(0, 2);
            if (!this.allowedMobilePrefix.includes(mobileSubString)) throw new HttpException(400, 'Mobile Number prefix is not allowed', request);
            if (String(mobileNumber).length !== 10) throw new HttpException(400, 'Invalid Mobile Number length', request);

            // Email Address
            if (!emailAddress) throw new HttpException(400, 'Email Address required', request);
            if (!this.validateEmail(emailAddress)) throw new HttpException(400, 'Email Address is invalid', request);

            if (!password) throw new HttpException(400, 'Password required', request);
            if (!isCompliant) throw new HttpException(400, 'Compliance required', request);

            if (isCompliant) isCompliant = 1;

            // User Types
            if (userType) {
                if (userType === 'ADMINUSER') throw new HttpException(403, 'ADMINUSER must be created manually');
                if (!this.allowedUserTypes.includes(userType)) throw new HttpException(400, `The user type must be one of [${this.allowedUserTypes}]`, request);
            }

            userType = [String(userType).toUpperCase()];

            const data: any = { identificationNumber, mobileNumber, emailAddress, password, isCompliant, firstName, lastName, userType };

            const user = await this.authService.userRegistration(data);

            response.status(201).send({ status: true, detail: 'Account created successfully', user });
        } catch (error: any) {
            response.status(error.code).send({ status: false, detail: `${error.message}` });
        }
    }

    private verifyUser = async (request: Request, response: Response) => {
        try {
            const identificationNumber = request.params.id;
            const { code, reason } = request.query;

            if (!code) throw new HttpException(400, 'Please provide a code', request);
            if (!reason) throw new HttpException(400, 'A reason is required to verify your code', request);

            if (!this.codeReasonEnums.includes(String(reason))) throw new HttpException(400, 'The reason must be either "REGISTRATION" or "PASSWORD_RESET"', request);

            const data = { identificationNumber, code, reason };

            await this.authService.verifyUser(data);

            response.status(200).send({
                status: true,
                detail: 'Account verified',
            });
        } catch (error: any) {
            response.status(error.code).send({
                status: false,
                detail: `${error.message}`,
            });
        }
    }

    private requestChangePasswordUser = async (request: Request, response: Response) => {
        try {
            const identificationNumber = request.params.id;
            await this.authService.userPasswordResetRequest(identificationNumber);

            response.status(200).send({ status: true, detail: 'Password reset request sent successfuly' });
        } catch (error: any) {
            response.status(error.code).send({ status: false, detail: `${error.message}` });
        }
    }

    private validateChangePasswordUser = async (request: Request, response: Response) => {
        try {

            const identificationNumber = request.params.id;

            const { newPassword, oldPassword, code } = request.body;

            if (!newPassword) throw new HttpException(400, 'Please provide the new password', request);
            if (!oldPassword) throw new HttpException(400, 'Please provide the old password', request);
            if (!code) throw new HttpException(400, 'Please provide the OTP code sent to your phone', request);

            const data = { newPassword, oldPassword, code, identificationNumber };

            await this.authService.userPasswordValidateResetRequest(data);

            response.status(200).send({ status: true, detail: 'Password reset successfully' });
        } catch (error: any) {
            response.status(error.code).send({ status: false, detail: `${error.message}` });
        }
    }

    private validateEmail = (email: string) => {
        return String(email).toLowerCase().match(this.emailRegex);
    };
}