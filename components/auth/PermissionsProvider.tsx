import { useEffect } from 'react';
import LoadingOverlay from '../core-ui-lib/LoadingOverlay';
import { useRouter } from 'next/router';
import usePermissions from 'hooks/usePermissions';
import { ACCESS_DENIED_URL, PUBLIC_PATH_URLS } from 'config/auth';
import useNavigation from 'hooks/useNavigation';

const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { navigateToSignIn } = useNavigation();
  const { updatePermissions, isSignedIn, user } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (
      (!PUBLIC_PATH_URLS.includes(router.pathname) && isSignedIn) ||
      (isSignedIn && router.pathname === ACCESS_DENIED_URL)
    ) {
      const organisationId = user.unsafeMetadata.organisationId as string;
      if (!organisationId) {
        navigateToSignIn();
      } else {
        updatePermissions(organisationId);
      }
    }
  }, [isSignedIn]);

  if (PUBLIC_PATH_URLS.includes(router.pathname)) {
    return <>{children}</>;
  }

  return isSignedIn ? <>{children}</> : <LoadingOverlay className="top-20 left-20 right-20 bottom-20" />;
};

export default PermissionsProvider;
