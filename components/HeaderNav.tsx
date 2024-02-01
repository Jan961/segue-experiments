import * as React from 'react';
import { useRouter } from 'next/router';
import { useClerk } from '@clerk/nextjs';
import { userService } from 'services/user.service';

import classNames from 'classnames';
import { SegueLogo } from './global/SegueLogo';
import useUrlPath from 'hooks';
// import { FormInputSelect } from './global/forms/FormInputSelect';
// import { availableLocales } from 'config/global';
// import { useRecoilState } from 'recoil';
// import { globalState } from 'state/global/globalState';
import useStrings from 'hooks/useStrings';
import Icon from './core-ui-lib/Icon';

interface HeaderNavButtonProps {
  iconName: string;
  onClick?: () => void;
  className: string;
  containerClass?: string;
  href?: string;
}

const HeaderNavButton = ({
  iconName,
  onClick,
  className,
  containerClass,
  children,
  href,
}: React.PropsWithChildren<HeaderNavButtonProps>) => {
  const ContainerClasses =
    'text-primary-dark-blue rounded-full inline-flex items-center px-1 pt-1 text-[13px] font-bold';
  const ButtonClasses = 'w-5.5 h-5.5 rounded-full text-white ml-2 flex justify-center items-center';

  if (href) {
    return (
      <a href={href} className={classNames(ContainerClasses, containerClass)}>
        {children}
        <div className={classNames(className, ButtonClasses)}>
          <Icon iconName={iconName} fill="#FFF" variant="xs" />
        </div>
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={classNames(ContainerClasses, containerClass)}>
        {children}
        <div className={classNames(className, ButtonClasses)}>
          <Icon iconName={iconName} fill="#FFF" variant="xs" />
        </div>
      </button>
    );
  }
};

const HeaderNavDivider = () => <span className="mx-2">{' | '}</span>;

export const HeaderNav = ({ menuIsOpen, setMenuIsOpen }: any) => {
  // const [username, setUsername] = React.useState('My Account');
  // const [userPrefs, setUserPrefs] = useRecoilState(globalState);
  const getString = useStrings();
  const router = useRouter();
  const { isHome, navigateToHome } = useUrlPath();
  const isCurrentPathHome = isHome();
  const { signOut } = useClerk();

  const logout = async () => {
    userService.logout();
    await signOut();
    router.push('/');
  };
  /* const user = userService.userValue;
   React.useEffect(() => {
    if (user && user.name) {
      setUsername(user.name);
    }
  }, [user]); 
   const onLocaleChange = (e: any) => {
    setUserPrefs({ ...userPrefs, locale: e.target.value });
  }; */

  return (
    <nav>
      <div>
        <div className="flex justify-between items-center">
          <div onClick={() => setMenuIsOpen(!menuIsOpen)} className="flex items-center h-20">
            <div id="menu-icon" className="cursor-pointer hover:scale-105 pr-2 text-primary-blue">
              <Icon iconName="menu" className="pointer-events-none" variant="xl" />
            </div>
            <SegueLogo
              className={`${!isCurrentPathHome ? 'cursor-pointer hover:scale-105' : ''}`}
              onClick={navigateToHome}
            />
          </div>
          <div className="flex flex-row items-center">
            <HeaderNavButton
              iconName="home"
              href="/"
              className="bg-primary-green shadow-sm-shadow"
              containerClass={`${!isCurrentPathHome ? 'cursor-pointer hover:scale-105' : 'pointer-events-none'}`}
            >
              {getString('global.home')}
            </HeaderNavButton>

            {/* <div className="">
              <FormInputSelect
                onChange={onLocaleChange}
                value={userPrefs.locale}
                name={'locale'}
                options={availableLocales}
              />
            </div> */}
            <HeaderNavDivider />
            <HeaderNavButton
              iconName="exit"
              onClick={logout}
              className="bg-primary-purple shadow-sm-shadow"
              containerClass="cursor-pointer hover:scale-105"
            >
              {getString('global.logOut')}
            </HeaderNavButton>
          </div>
        </div>
      </div>
    </nav>
  );
};
