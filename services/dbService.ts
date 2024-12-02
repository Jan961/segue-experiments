import axios from 'axios';
import s3 from 'lib/s3';
import MariaDB from 'mariadb';
import { replaceTemplateString } from 'utils';

const DB_USER_PRIVILEGES = 'SELECT,INSERT,UPDATE,DELETE,EXECUTE,SHOW VIEW';

const executeSQLFromFile = async (host, user, password, database, file) => {
  // Create a MySQL connection pool
  const pool = MariaDB.createPool({
    host,
    user,
    password,
    database,
    multipleStatements: true,
  });
  // Get a connection from the pool
  const conn = await pool.getConnection();

  // Execute the SQL script
  const result = await conn.query(file);

  // Close the connection
  conn.release();

  return result;
};

export const createClientDB = async (organisationId: string) => {
  if (!organisationId) {
    throw new Error('Unable to create new DB. OrganisationId is required');
  }

  const deploymentEnv = process.env.DEPLOYMENT_ENV;
  if (!deploymentEnv) {
    throw new Error('Unable to create new DB as deployment environment is invalid');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `cpanel ${process.env.DB_USER}:${process.env.DB_API_KEY}`,
  };
  const host = process.env.DB_SERVER;
  const url = `https://${host}:${process.env.DB_PORT}/execute/Mysql`;
  const dbName = `${process.env.DB_USER}_${deploymentEnv}_Segue_${organisationId}`;
  const dbUser = `${process.env.DB_USER}_${deploymentEnv}_AppUser`;
  const dboUser = `${process.env.DB_USER}_${deploymentEnv}_DBOUser`;
  // Create the DB
  const createDBUrl = `${url}/create_database`;
  const { data: dbData } = await axios.post(
    createDBUrl,
    { name: dbName },
    {
      headers,
    },
  );
  if (dbData.status === 1) {
    // Grant users privilidges to the DB
    await axios.post(
      `${url}/set_privileges_on_database`,
      { database: dbName, user: dbUser, privileges: DB_USER_PRIVILEGES },
      {
        headers,
      },
    );

    await axios.post(
      `${url}/set_privileges_on_database`,
      { database: dbName, user: dboUser, privileges: 'ALL' },
      {
        headers,
      },
    );

    // Seed data
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: process.env.CLIENT_DB_SEED_SCRIPT,
    };
    const response = await s3.getObject(params).promise();

    if (!response.Body || response.ContentLength === 0) {
      throw new Error('Unable to create new DB. Unable to get DB seed script');
    }
    // Replace template strings [DB_PREFIX] with actual value
    const formattedScript = replaceTemplateString(
      response.Body.toString('utf-8'),
      { DB_PREFIX: `${process.env.DB_USER}_${deploymentEnv}` },
      '[',
      ']',
    );

    await executeSQLFromFile(host, dboUser, process.env.DBO_PASSWORD, dbName, formattedScript);
  } else {
    throw new Error('Unable to create new DB');
  }
};
