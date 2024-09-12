import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Spinner from 'components/core-ui-lib/Spinner';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';
import { isNullOrEmpty } from 'utils';
import axios from 'axios';

export const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center top-20 left-20 right-20 bottom-20">
    <Spinner size="lg" />
  </div>
);

const publicPaths = ['/account/sign-up', '/access-denied', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password'];

const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();
  const [permissions, setPermissions] = useRecoilState(userPermissionsState);
  const router = useRouter();

  const fetchPermissions = async (organisationId: string) => {
    if (isNullOrEmpty(permissions)) {
      try {
        const { data } = await axios(`/api/user/permissions/read?organisationId=${organisationId}`);
        setPermissions(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (isSignedIn) {
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
