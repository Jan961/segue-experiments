import { SIGN_IN_URL, SIGN_UP_URL, PASSWORD_RESET_URL } from 'config/auth';
import { useRouter } from 'next/router';
import { useUrl } from 'nextjs-current-url';

const useNavigation = () => {
  const router = useRouter();
  // 👇 useUrl() returns `null` until hydration, so plan for that with `??`;
  const { origin: currentUrl } = useUrl() ?? {};

  const getSignUpUrl = () => {
    return `${currentUrl}${SIGN_UP_URL}`;
  };

  const getSignInUrl = () => {
    return `${currentUrl}${SIGN_IN_URL}`;
  };

  const navigateToHome = () => {
    router.push(currentUrl);
  };

  const navigateToSignIn = () => {
    router.push(SIGN_IN_URL);
  };

  const navigateToSignUp = () => {
    router.push(SIGN_UP_URL);
  };

  const navigateToPasswordReset = (skipVerify = false) => {
    router.push(skipVerify ? `${PASSWORD_RESET_URL}?skipVerify=true` : PASSWORD_RESET_URL);
  };

  return {
    getSignUpUrl,
    getSignInUrl,
    navigateToHome,
    navigateToSignIn,
    navigateToSignUp,
    navigateToPasswordReset,
  };
};

export default useNavigation;
