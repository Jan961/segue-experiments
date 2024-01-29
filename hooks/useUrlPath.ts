import { useRouter } from 'next/router';

const urlPaths = {
  home: '/',
  bookings: '/bookings',
};

const useUrlPath = () => {
  const router = useRouter();

  const isHome = () => {
    return router.pathname === urlPaths.home;
  };

  const navigateToHome = () => {
    if (!isHome()) {
      router.push(urlPaths.home);
    }
  };

  return { isHome, navigateToHome };
};

export default useUrlPath;
