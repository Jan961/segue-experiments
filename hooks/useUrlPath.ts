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

  const isBookingsHome = () => {
    return router.pathname === urlPaths.bookings;
  };

  const isBookingsUrl = () => {
    return router.pathname.includes(urlPaths.bookings);
  };

  const navigateToHome = () => {
    if (!isHome()) {
      router.push(urlPaths.home);
    }
  };

  return { isHome, isBookingsHome, isBookingsUrl, navigateToHome };
};

export default useUrlPath;
