import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Spinner from 'components/core-ui-lib/Spinner';
import { useRouter } from 'next/router';
import axios from 'axios';
import usePermissions from 'hooks/usePermissions';

export const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center top-20 left-20 right-20 bottom-20">
    <Spinner size="lg" />
  </div>
);

const publicPaths = [
  '/account/sign-up',
  '/access-denied',
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/password-reset',
  '/auth/user-created',
];

const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();
  const { setUserPermissions } = usePermissions();
  const router = useRouter();

  const fetchPermissions = async (organisationId: string) => {
    try {
      const { data } = await axios(`/api/user/permissions/read?organisationId=${organisationId}`);
      setUserPermissions(organisationId, data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!publicPaths.includes(router.pathname) && isSignedIn) {
      console.log('In permissions provider', user);
      const organisationId = user.unsafeMetadata.organisationId as string;
      if (!organisationId) {
        router.push('/auth/sign-in');
      } else {
        fetchPermissions(organisationId);
      }
    }
  }, [isSignedIn]);

  if (publicPaths.includes(router.pathname)) {
    return <>{children}</>;
  }

  return isSignedIn ? <>{children}</> : <LoadingOverlay />;
};

export default PermissionsProvider;
