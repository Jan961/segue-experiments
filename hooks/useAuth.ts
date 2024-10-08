import { useClerk } from '@clerk/nextjs';
import axios from 'axios';



const useAuth = () => {
  const { signOut } = useClerk();

  const logout = async (email: string) => {
    try {
      // Sign out from Clerk
      await signOut();

    } catch (err) {
      console.error(err);
    }
  };

  return { logout };
};

export default useAuth;
