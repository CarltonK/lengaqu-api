import { compare, hash } from 'bcryptjs';
import JwtUtility from '../utils/jwt';
import db from '../server';
import HttpException from '../helpers/exceptions';
import { randomPassword, digits } from 'secure-random-password';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import LogService from './log_service';

export default class AuthService extends LogService {
    private jwt: JwtUtility = new JwtUtility();

    async userRegistration(data: any): Promise<any> {
        const { password, isVerified, firstName, emailAddress } = data;
        try {
            data.password = await hash(password, 10);

            const prefix = firstName ?? emailAddress.split('@')[0];
            data.referralCode = await this.generateReferralCode(prefix);

            const user = await db.prisma.sysUser.create({
                data: { ...data },
            });

            delete data.password;
            delete data.isCompliant;
            delete data.mobileNumber;
            delete data.emailAddress;

            if (!isVerified) {
                const code = this.generateRandomCode();
                const hashedCode = this.hashVerificationCode(code);

                const rightNow = new Date();
                const validUntil = new Date(rightNow.setHours(rightNow.getHours() + 1));

                await db.prisma.logCode.create({
                    data: {
                        code: hashedCode,
                        userId: user.id,
                        codeReason: 'REGISTRATION',
                        validUntil,
                    },
                });
            }

            await this.createLog({ eventType: 'USER', userId: user.id, desc: 'JOIN ATTEMPT' });

            return data;
        } catch (error: any) {
            throw new HttpException(400, `${error}`);
        }
    }

    async verifyUser(data: any): Promise<void> {
        try {

            const { identificationNumber, code, reason } = data;

            const user = await db.prisma.sysUser.findUnique({
                where: { identificationNumber },
            });

            if (!user) throw new HttpException(400, 'User not found');

            const { id } = user;

            if (!id) throw new HttpException(400, 'User not found');

            const rightNow = new Date();

            const userCodeRecord = await db.prisma.logCode.findFirst({
                where: { userId: id, code: { equals: String(code) }, usedAt: { equals: null }, validUntil: { gt: rightNow } },
                orderBy: { createdAt: 'desc' },
            });

            if (!userCodeRecord) {
                await this.createLog({ eventType: 'USER', userId: id, desc: 'JOIN FAILED', remarks: 'Invalid code provided' });
                throw new HttpException(400, 'Invalid code provided');
            }

            const { code: retrievedCode, codeReason, validUntil, codeId } = userCodeRecord!;

            if (new Date() > validUntil) throw new HttpException(400, 'Code has expired');

            if (retrievedCode !== code) throw new HttpException(400, 'Invalid code provided');
            if (reason !== codeReason) throw new HttpException(400, 'Code reason does not match');

            if (reason === 'REGISTRATION') {
                await db.prisma.sysUser.update({
                    where: { identificationNumber },
                    data: { isVerified: 1 },
                });
            }

            await db.prisma.logCode.update({
                where: { codeId },
                data: { usedAt: new Date() },
            });

            await this.createLog({ eventType: 'USER', userId: id, desc: 'JOINED' });
        } catch (error: any) {
            throw new HttpException(400, `${error.message}`);
        }
    }

    async sessionCreate(data: any): Promise<Record<string, any>> {
        try {
            let token;
            const { identificationNumber, password, type } = data;

            if (type === 'user') {
                const user = await db.prisma.sysUser.findUnique({
                    where: { identificationNumber },
                });

                if (!user) throw new HttpException(400, 'User Not Found');

                if (user.isVerified !== 1) throw new HttpException(400, 'Please verify your account before login');

                const checkPassword = compare(password, user.password!);

                if (!checkPassword) throw new HttpException(400, 'Incorrect Password');

                const { userType, id } = user;

                token = await this.jwt.signAccessToken({ userId: identificationNumber, userType });

                await this.createLog({ eventType: 'USER', userId: id, desc: 'LOGIN' });

                return { identificationNumber, token };
            }

            throw new HttpException(400, `type can only be one of ["user"]`);

        } catch (error: any) {
            throw new HttpException(400, `${error.message}`);
        }
    }

    private generateRandomCode(): string {
        const characterOptions = { length: 6, characters: [digits] };
        return randomPassword(characterOptions);
    }

    private hashVerificationCode(code: string): string {
        return createHash('sha256').update(code).digest('hex');
    }

    private async generateReferralCode(prefix: string): Promise<string> {
        let generatedreferralCode: string = '';
        let codeCreated: boolean = false;
        let generationCount: number = 100;

        while (!codeCreated || generationCount > 0) {
            const uid = uuidv4();
            const uniqueChars = uid.split('-')[0];
            generatedreferralCode = prefix + uniqueChars;

            const user = await db.prisma.sysUser.findUnique({
                where: { referralCode: generatedreferralCode },
            });

            if (user) {
                generationCount--;
                codeCreated = false;
            } else {
                codeCreated = true;
                generationCount = 0;
            }
        }

        return generatedreferralCode;
    }
}