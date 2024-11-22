import { useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';
import { globalState } from 'state/global/globalState';
import { isNullOrEmpty } from 'utils';
import { getMenuItems } from 'components/PopoutMenu/config';
import useStrings from './useStrings';

const usePermissions = () => {
  const { isSignedIn, user } = useUser();
  const getStrings = useStrings();
  const [permissionState, setPermissionsState] = useRecoilState(userPermissionsState);
  const setGlobalState = useSetRecoilState(globalState);

  const menuItems = useMemo(() => getMenuItems(getStrings), [getStrings]);

  useEffect(() => {
    if (isSignedIn) {
      // Updates User permissions in the Recoil state when the user is updated from the Clerk context
      setPermissionsState({
        permissions: (user.unsafeMetadata?.permissions as string[]) || permissionState?.permissions || [],
        accountId: (user.unsafeMetadata?.organisationId as string) || permissionState?.accountId || '',
      });
    }
  }, [user]);

  const applyPermissionsToMenuItems = (items, permissions = []) => {
    const filteredItems = items.reduce((acc, item) => {
      if (!item.permission || permissions.includes(item.permission)) {
        let options = [];
        if (!isNullOrEmpty(item.options)) {
          options = applyPermissionsToMenuItems(item.options, permissions);
        }
        acc.push({ ...item, options });
      }
      return acc;
    }, []);

    return filteredItems;
  };

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
        const updatedmenuItems = applyPermissionsToMenuItems(menuItems, permissions);
        setGlobalState((prev) => ({ ...prev, menuItems: updatedmenuItems }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { isSignedIn, setUserPermissions };
};

export default usePermissions;
