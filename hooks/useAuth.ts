import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const useAuth = () => {
  const { signOut: clerkSignOut } = useClerk();
  const router = useRouter();
  const signOut = async () => {
    try {
      // Sign out from Clerk
      await clerkSignOut();
      // navigate to sign-in page
      router.push('/auth/sign-in');
    } catch (err) {
      console.error(err);
    }
  };

  return { signOut };
};

export default useAuth;
