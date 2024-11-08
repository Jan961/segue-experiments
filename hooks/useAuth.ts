import { useClerk, useSignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const useAuth = () => {
  const { signOut: clerkSignOut } = useClerk();
  const { signIn: clerkSignIn, setActive } = useSignIn();
  const { user } = useUser();
  const router = useRouter();

  const signOut = async () => {
    try {
      if (user) {
        // reset metadata
        user.update({
          unsafeMetadata: {},
        });
      }

      // Sign out from Clerk
      await clerkSignOut();
      // navigate to sign-in page
      router.push('/auth/sign-in');
    } catch (err) {
      console.error(err);
    }
  };

  const signIn = async (username: string, password: string) => {
    if (!username || !password) {
      return false;
    }
    // Attempt to sign in with Clerk
    const signInAttempt = await clerkSignIn.create({
      identifier: username,
      password,
    });

    if (signInAttempt.status === 'complete') {
      await setActive({ session: signInAttempt.createdSessionId });
      return true;
    }
    return false;
  };

  const navigateToHome = () => {
    router.push('/');
  };

  return { signIn, signOut, navigateToHome };
};

export default useAuth;
