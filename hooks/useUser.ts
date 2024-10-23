import { useSignUp, useSession } from '@clerk/nextjs';
import axios from 'axios';
import { useState } from 'react';
import { isNullOrEmpty, mapRecursive } from 'utils';
import { useUrl } from 'nextjs-current-url';
import { NEW_USER_CONFIRMATION_EMAIL_TEMPLATE, SEND_ACCOUNT_PIN_TEMPLATE } from 'config/global';
import { Production } from 'components/admin/modals/config';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { generateUserPassword } from 'utils/authUtils';

type UserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  permissions: string[];
  productions: string[];
  accountId: number;
  accpuntPIN?: number;
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

      const password = generateUserPassword();

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
        data: { username: userDetails.email, password, Weblink: `${currentUrl}/auth/sign-in` },
      });

      // Send out an email with the account PIN
      await axios.post('/api/email/send', {
        to: userDetails.email,
        templateName: SEND_ACCOUNT_PIN_TEMPLATE,
        data: { AccountPin: userDetails.accpuntPIN },
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
      setIsBusy(true);
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
    } finally {
      setIsBusy(false);
    }
  };

  const fetchPermissionsForSelectedUser = async (
    accountUserId: number,
    productions: Production[],
    permissions: TreeItemOption[],
  ) => {
    try {
      setIsBusy(true);
      setError('');
      const { data } = await axios.get(`/api/admin/user-permissions/${accountUserId}`);
      const prodPermissions = productions.map((p) => (data.productions.includes(p.id) ? { ...p, checked: true } : p));
      const userPermissions = mapRecursive(permissions, (p) =>
        data.permissions.includes(p.id) ? { ...p, checked: true } : p,
      );
      return { prodPermissions, userPermissions, isSingleAdminUser: data.isSingleAdminUser };
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };
  return { isSignUpLoaded, isBusy, createUser, updateUser, fetchPermissionsForSelectedUser, error };
};

export default useUser;
