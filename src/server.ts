import App from './app';
import DBConfig from './config/prisma';
import { logger } from './middlewares/logger';

const db = new DBConfig();
export default db;

const app = new App();

db.runMigrations()
  .then((value) => app.listen())
  .catch((error) => { logger('KAPI').info(`${error}`); process.exit(1) });