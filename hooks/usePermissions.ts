import { useUser } from '@clerk/nextjs';
import { useSetRecoilState } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';
import { globalState } from 'state/global/globalState';
import { isNullOrEmpty } from 'utils';
import { getMenuItems } from 'components/PopoutMenu/config';
import useStrings from './useStrings';
import { useMemo } from 'react';

const usePermissions = () => {
  const { isSignedIn, user } = useUser();
  const getStrings = useStrings();
  const setPermissionsState = useSetRecoilState(userPermissionsState);
  const setGlobalState = useSetRecoilState(globalState);

  const menuItems = useMemo(() => getMenuItems(getStrings), [getStrings]);

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

        await setPermissionsState({
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
