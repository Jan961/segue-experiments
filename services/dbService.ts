import axios from 'axios';

const DB_USER_PRIVILEGES = 'SELECT,INSERT,UPDATE,DELETE,EXECUTE,SHOW VIEW';

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
  const url = `https://${process.env.DB_SERVER}:${process.env.DB_PORT}/execute/Mysql`;
  const dbName = `${process.env.DB_USER}_${deploymentEnv}_Segue_${organisationId}`;
  const dbUser = `${process.env.DB_USER}_${deploymentEnv}User`;
  const dboUser = `${process.env.DB_USER}_${deploymentEnv}DBO`;
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
  }
};
