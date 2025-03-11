import mysql from "mysql";
import { 
  ROCKO_DB_DATABASE, 
  ROCKO_DB_HOST, 
  ROCKO_DB_PASSWORD, 
  ROCKO_DB_USER 
} from "../constants";
import logger from "../util/logger";

const db = mysql.createPool({
    // TODO 
    // have roughly twice as many connections as the number of CPU cores available on your database server
    connectionLimit : 24,
    host: ROCKO_DB_HOST,
    user: ROCKO_DB_USER,
    password: ROCKO_DB_PASSWORD,
    database: ROCKO_DB_DATABASE,
    supportBigNumbers: true,
    bigNumberStrings: true
  });

const connectDB = async () => {
  try {
      db.getConnection((err) => {
        if (err) {
          console.error(err);
          logger({msg:"Database connection failed", err: err.message}, 'error');

          throw new Error('Database query failed');
        }
        logger(`MySQL Connected to ${ROCKO_DB_DATABASE}`, 'info');
      });
  } catch (err) {
    // @ts-ignore
    logger({msg:"Database connection failed", err: err.message}, 'error');
    // Exit process with failure
    process.exit(1);
  }
};

export {connectDB, db};
