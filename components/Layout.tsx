import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { HeaderNav } from 'components/HeaderNav';
import PopoutMenu from 'components/PopoutMenu/index';
import Router from 'next/router';
import { calibri } from 'lib/fonts';
import { useRecoilValue } from 'recoil';
import { globalState } from 'state/global/globalState';
import LoadingOverlay from './core-ui-lib/LoadingOverlay';

type Props = {
  children?: ReactNode;
  title?: string;
  flush?: boolean;
};

const Layout = ({ children, title = 'Your production assistant', flush = false }: Props) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const state = useRecoilValue(globalState);

  React.useEffect(() => {
    let loadingTimeout;

    const startLoading = () => {
      // Set a timer to show the loading overlay after 1 second
      loadingTimeout = setTimeout(() => {
        setIsLoading(true);
      }, 1000);
    };

    const endLoading = () => {
      // Clear the timer and hide the loading overlay
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    };

    Router.events.on('routeChangeStart', startLoading);
    Router.events.on('routeChangeComplete', endLoading);
    Router.events.on('routeChangeError', endLoading);

    return () => {
      Router.events.off('routeChangeStart', startLoading);
      Router.events.off('routeChangeComplete', endLoading);
      Router.events.off('routeChangeError', endLoading);
    };
  }, []);

  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col px-6 min-w-max min-h-max`}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/segue/segue_mini_icon.png" type="image/png" />
      </Head>
      <header className="flex flex-col">
        <HeaderNav menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen} />
      </header>
      <main className="h-full w-full flex flex-rows flex-1">
        <PopoutMenu menuIsOpen={state.menuPinned || menuIsOpen} setMenuIsOpen={setMenuIsOpen} />
        {isLoading && <LoadingOverlay testId="page-loader" />}
        <div className={`flex flex-col ${flush ? 'flex-1' : 'flex-1 px-4'} ${state.menuPinned ? 'ml-64 pl-1' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
