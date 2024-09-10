import { useClerk } from '@clerk/nextjs';
import axios from 'axios';
const useAuth = () => {
  const { signOut } = useClerk();

  const logout = async (email: string) => {
    try {
      // Sign out from Clerk
      await signOut();
      // Remove organisation id on redis
      const { data } = await axios.post('/api/user/session/delete', {
        email,
      });

      if (!data.success) {
        console.error('Error deleting user session');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { logout };
};

export default useAuth;
