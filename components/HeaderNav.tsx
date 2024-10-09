import React, { useState } from 'react';
import useAuth from 'hooks/useAuth';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import classNames from 'classnames';
import { SegueLogo } from './global/SegueLogo';
import useUrlPath from 'hooks';
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
  const { signOut } = useAuth();
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const getString = useStrings();
  const { isHome, navigateToHome } = useUrlPath();
  const isCurrentPathHome = isHome();

  const onLogout = async () => {
    setConfirmVisible(false);
    await signOut();
  };

  return (
    <nav>
      <div>
        <div className="flex justify-between">
          <div onClick={() => setMenuIsOpen(!menuIsOpen)} className="flex items-center">
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
            <HeaderNavDivider />
            <HeaderNavButton
              iconName="exit"
              onClick={() => setConfirmVisible(true)}
              className="bg-primary-purple shadow-sm-shadow"
              containerClass="cursor-pointer hover:scale-105"
            >
              {getString('global.logOut')}
            </HeaderNavButton>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        variant="logout"
        show={confirmVisible}
        onYesClick={onLogout}
        onNoClick={() => setConfirmVisible(false)}
        hasOverlay={false}
      />
    </nav>
  );
};
