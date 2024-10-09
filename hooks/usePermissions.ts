import { useUser } from '@clerk/nextjs';
import { useSetRecoilState } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';

const usePermissions = () => {
  const { isSignedIn, user } = useUser();
  const setPermissionsState = useSetRecoilState(userPermissionsState);

  const setUserPermissions = async (organisationId: string, permissions: string[]) => {
    try {
      if (isSignedIn) {
        user.update({
          unsafeMetadata: {
            organisationId,
            permissions,
          },
        });
        setPermissionsState({
          permissions,
          accountId: organisationId,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { setUserPermissions };
};

export default usePermissions;
