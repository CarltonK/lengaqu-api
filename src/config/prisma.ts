import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';

export default class DBConfig {
    public prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient({ log: ['query'], errorFormat: 'pretty' });
    }

    async runMigrations() {
        return new Promise((resolve, reject) => {
            exec('npm run migrations:prod', { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
                if (error) console.info(`${error}`);
                else if (stdout) console.info(`${stdout}`);
                else console.info(`${stderr}`);
                resolve(stdout ? true : false);
            });
        });
    }
}
