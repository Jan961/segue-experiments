import { useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';
import { globalState } from 'state/global/globalState';
import { isNullOrEmpty } from 'utils';
import { getMenuItems } from 'components/PopoutMenu/config';
import useStrings from './useStrings';
import axios from 'axios';

const usePermissions = () => {
  const { isSignedIn, user } = useUser();
  const getStrings = useStrings();
  const [permissionState, setPermissionsState] = useRecoilState(userPermissionsState);
  const setGlobalState = useSetRecoilState(globalState);
  const userOrganisationId = useMemo(() => user?.unsafeMetadata?.organisationId as string, [user]);

  const menuItems = useMemo(() => getMenuItems(getStrings), [getStrings]);

  useEffect(() => {
    if (isSignedIn && permissionState?.permissions.length !== 0 && permissionState?.accountId !== '') {
      // Updates User permissions in the Recoil state when the user is updated from the Clerk context
      setPermissionsState((currentVal) => ({
        ...(currentVal ?? {}),
        permissions: (user.unsafeMetadata?.permissions as string[]) || permissionState?.permissions || [],
        accountId: (user.unsafeMetadata?.organisationId as string) || permissionState?.accountId || '',
      }));
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
        await user.update({
          unsafeMetadata: {
            organisationId,
            permissions,
          },
        });

        setPermissionsState({
          permissions,
          accountId: organisationId,
          isInitialised: true,
        });
        const updatedmenuItems = applyPermissionsToMenuItems(menuItems, permissions);
        setGlobalState((prev) => ({ ...prev, menuItems: updatedmenuItems }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updatePermissions = async (organisationId = userOrganisationId) => {
    if (!organisationId) return;
    try {
      const { data } = await axios(`/api/user/permissions/read?organisationId=${organisationId}`);
      setUserPermissions(organisationId, data);
    } catch (err) {
      console.error(err);
    }
  };

  return { isSignedIn, setUserPermissions, updatePermissions, user };
};

export default usePermissions;
