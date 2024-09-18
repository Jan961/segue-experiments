import { useSignUp } from '@clerk/nextjs';
import axios from 'axios';
import { useState } from 'react';
import { isNullOrEmpty } from 'utils';
import { generateRandomHash } from 'utils/crypto';

type UserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  pin: string;
  password?: string;
  permissions: string[];
  productions: string[];
  accountId: number;
};

const useUser = () => {
  const { isLoaded: isSignUpLoaded } = useSignUp();
  const [error, setError] = useState('');

  const createUser = async (userDetails: UserDetails): Promise<boolean> => {
    try {
      setError('');
      // Create the user within clerk
      const { data } = await axios.post('/api/auth/create-clerk-user', {
        ...userDetails,
        password: generateRandomHash(4),
      });
      if (data.error) {
        setError(data.error);
        return false;
      }

      // Create the user in our database
      const { data: createResponse } = await axios.post('/api/user/create', userDetails);
      if (createResponse.error) {
        setError(createResponse.error);
        return false;
      }

      // create permissions for productions
      if (!isNullOrEmpty(userDetails.productions)) {
        await axios.post('/api/admin/permissions/production/create', {
          accountUserId: createResponse.AccUserId,
          productionIds: userDetails.productions,
        });
      }
      return true;
    } catch (error) {
      console.log(error);
      setError('Something went wrong, please try again');
      return false;
    }
  };

  const updateUser = async (userDetails: UserDetails): Promise<boolean> => {
    try {
      setError('');
      const { data } = await axios.post('/api/user/update', userDetails);
      if (data.error) {
        setError(data.error);
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      setError('Something went wrong, please try again');
      return false;
    }
  };

  return { isSignUpLoaded, createUser, updateUser, error };
};

export default useUser;
