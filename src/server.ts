import App from './app';
import DBConfig from './config/prisma';

const db = new DBConfig();
export default db;

const app = new App();

db.runMigrations()
  .then((value) => app.listen())
  .catch((error) => { console.error(`${error}`); process.exit(1) });