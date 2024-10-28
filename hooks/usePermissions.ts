import { useUser } from '@clerk/nextjs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';
import { globalState } from 'state/global/globalState';
import { isNullOrEmpty } from 'utils';

const usePermissions = () => {
  const { isSignedIn, user } = useUser();
  const setPermissionsState = useSetRecoilState(userPermissionsState);
  const [state, setGlobalState] = useRecoilState(globalState);

  const applyPermissionsToMenuItems = (permissions = []) => {
    const filteredItems = state.menuItems.reduce((acc, item) => {
      if (!item.permission || permissions.includes(item.permission)) {
        let options = [];
        if (!isNullOrEmpty(item.options)) {
          options = applyPermissionsToMenuItems(item.options);
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
        const updatedmenuItems = applyPermissionsToMenuItems(permissions);
        setGlobalState((prev) => ({ ...prev, menuItems: updatedmenuItems }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { setUserPermissions };
};

export default usePermissions;
