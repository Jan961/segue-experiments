import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { HeaderNav } from 'components/HeaderNav';
import { PopoutMenu } from 'components/PopoutMenu';
import Router from 'next/router';
import { Spinner } from './global/Spinner';

type Props = {
  children?: ReactNode;
  title?: string;
  flush?: boolean;
};

const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Spinner size="lg" />
  </div>
);

const Layout = ({ children, title = 'Your tour assistant', flush = false }: Props) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="background-gradient font-primary">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="flex flex-col">
        <HeaderNav menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}></HeaderNav>
      </header>
      <main className="h-full w-full flex flex-rows  ">
        <PopoutMenu menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen} />
        {isLoading && <LoadingOverlay />}
        <div className={`md:ml-64 ${flush ? 'flex-1' : 'flex-1 px-4'}`}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
