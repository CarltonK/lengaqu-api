import { hash } from 'bcryptjs';
// import JwtUtility from '../utils/jwt';
import db from '../server';
import HttpException from '../helpers/exceptions';
import { randomPassword, digits } from 'secure-random-password';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import LogService from './log_service';

export default class AuthService extends LogService {
    // private jwt: JwtUtility = new JwtUtility();

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