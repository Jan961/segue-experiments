import { useSignUp } from '@clerk/nextjs';
import axios from 'axios';
import { useState } from 'react';
import { contractsFilterState } from 'state/contracts/contractsFilterState';

const USER_EXISTS = 'User already exists.';

type UserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  pin: string;
  password?: string;
  permissions: string[];
  accountId: number;
};

const useClerk = () => {
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const [error, setError] = useState('');

  const createNewUserWithClerk = async (emailAddress: string, password: string): Promise<boolean> => {
    setError('');
    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });
      // Prepare email address verification
      await result.prepareEmailAddressVerification({
        strategy: 'email_link',
        redirectUrl: `${window.location.origin}/sign-in`,
      });

      return true;
    } catch (err) {
      setError(err.errors[0].code);
      console.error('error', err.errors[0].longMessage);
      return false;
    }
  };

  const createUser = async (userDetails: UserDetails): Promise<boolean> => {
    try {
      setError('');
      // Create the user within clerk
      const status = await createNewUserWithClerk(userDetails.email, userDetails.password);
      if (!status) {
        setError('Unable to register user with Clerk');
        return false;
      }

      // Create the user in our database
      const { data } = await axios.post('/api/user/create', userDetails);
      console.log(data);
      if (data.error) {
        setError(data.error);
        return false;
      }
      return true;
    } catch (error) {
      setError('Something went wrong, please try again');
      return false;
    }
  };

  return { isSignUpLoaded, createUser, error };
};

export default useClerk;
