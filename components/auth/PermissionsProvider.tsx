import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import LoadingOverlay from '../core-ui-lib/LoadingOverlay';
import { useRouter } from 'next/router';
import axios from 'axios';
import usePermissions from 'hooks/usePermissions';
import { PUBLIC_PATH_URLS } from 'config/auth';
import useNavigation from 'hooks/useNavigation';

const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();
  const { navigateToSignIn } = useNavigation();
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
    if (!PUBLIC_PATH_URLS.includes(router.pathname) && isSignedIn) {
      const organisationId = user.unsafeMetadata.organisationId as string;
      if (!organisationId) {
        navigateToSignIn();
      } else {
        fetchPermissions(organisationId);
      }
    }
  }, [isSignedIn]);

  if (PUBLIC_PATH_URLS.includes(router.pathname)) {
    return <>{children}</>;
  }

  return isSignedIn ? <>{children}</> : <LoadingOverlay className="top-20 left-20 right-20 bottom-20" />;
};

export default PermissionsProvider;
