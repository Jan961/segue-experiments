import { useClerk } from '@clerk/nextjs';

const useAuth = () => {
  const { signOut } = useClerk();

  const logout = async () => {
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
