import { useSignUp } from '@clerk/nextjs';
import axios from 'axios';
import { useState } from 'react';

type UserDetails = {
  firstName: '';
  lastName: '';
  email: '';
  password: '';
  organisationId: '';
  pin: '';
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
      // Create the user within clerk
      const status = await createNewUserWithClerk(userDetails.email, userDetails.password);
      if (!status) {
        setError('Unable to register user with Clerk');
        return false;
      }

      // Create the user in our database
      await axios.post('/api/user/create', userDetails);

      return true;
    } catch (error) {
      setError('Something went wrong, please try again');
      return false;
    }
  };

  return { isSignUpLoaded, createUser, error };
};

export default useClerk;
