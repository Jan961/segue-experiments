import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Props = {
  children?: ReactNode;
  title?: string;
};
/*
 This template is used for pages that do not have any top navigation. Service pages such aslogin, register forgotten password
 */
const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div className="background-gradient">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header></header>
    {children}
    <footer></footer>
  </div>
);

export default Layout;
