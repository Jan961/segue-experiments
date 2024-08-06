import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const createClientDB = async () => {
  const organisationId = uuidv4();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `cpanel ${process.env.DB_USER}:${process.env.DB_API_KEY}`,
  };
  const url = `https://${process.env.DB_SERVER}:${process.env.DB_PORT}/execute/Mysql`;

  // Create the DB
  const createDBUrl = `${url}/create_database`;
  const { data: dbData } = await axios.post(
    createDBUrl,
    { name: `${process.env.DB_USER}_${organisationId}` },
    {
      headers,
    },
  );
  if (dbData.status === 1) {
    // Create a user and DBO user nad grant them previlidges to the DB
    const { data: user } = await axios.post(
      `${url}/create_user`,
      { name: `${process.env.DB_USER}_${organisationId}_DBUser`, password: uuidv4() },
      {
        headers,
      },
    );
    console.log('new db user', user);
    await axios.post(
      `${url}/create_user`,
      { name: `${process.env.DB_USER}_${organisationId}_DBOUser`, password: uuidv4() },
      {
        headers,
      },
    );
  }
  console.log('new db data', createDBUrl, dbData);
};
