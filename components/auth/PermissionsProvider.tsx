import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import LoadingOverlay from '../core-ui-lib/LoadingOverlay';
import { useRouter } from 'next/router';
import axios from 'axios';
import usePermissions from 'hooks/usePermissions';

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

  return isSignedIn ? <>{children}</> : <LoadingOverlay className="top-20 left-20 right-20 bottom-20" />;
};

export default PermissionsProvider;
