import { useSignUp, useSession } from '@clerk/nextjs';

import axios from 'axios';
import { useState } from 'react';
import { isNullOrEmpty } from 'utils';
import { generateRandomHash } from 'utils/crypto';
import { useUrl } from 'nextjs-current-url';
import { NEW_USER_CONFIRMATION_EMAIL_TEMPLATE } from 'config/global';

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
  // 👇 useUrl() returns `null` until hydration, so plan for that with `??`;
  const { origin: currentUrl } = useUrl() ?? {};
  const { session } = useSession();
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const createUser = async (userDetails: UserDetails): Promise<boolean> => {
    try {
      setIsBusy(true);
      setError('');
      const organisationId = session.user.unsafeMetadata.organisationId as string;
      // check if user already exists
      const {
        data: { users = [] },
      } = await axios(
        `/api/account-user/read?email=${userDetails.email}&firstName=${userDetails.firstName}&lastName=${userDetails.lastName}&organisationId=${organisationId}`,
      );
      const userName = `${userDetails.firstName} ${userDetails.lastName}`.trim().toLowerCase();
      if (
        users.find(
          ({ email, firstName, lastName }) =>
            email === userDetails.email || `${firstName} ${lastName}`.trim().toLowerCase() === userName,
        )
      ) {
        setError('User with this email and/or name already exists');
        return false;
      }

      const password = generateRandomHash(4);
      // Create the user within clerk
      const { data } = await axios.post('/api/auth/create-clerk-user', {
        ...userDetails,
        password,
      });

      if (data.error) {
        setError(data.error);
        return false;
      }

      // Send out an email with the newly generated password
      await axios.post('/api/email/send', {
        to: userDetails.email,
        templateName: NEW_USER_CONFIRMATION_EMAIL_TEMPLATE,
        data: { email: userDetails.email, password, Weblink: `${currentUrl}/auth/sign-in` },
      });

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
    } finally {
      setIsBusy(false);
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

  return { isSignUpLoaded, isBusy, createUser, updateUser, error };
};

export default useUser;
