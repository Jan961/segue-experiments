import Link from 'next/link';

import LayoutAccountLocked from '../../components/LayoutAccountLocked';

const Index = () => (
  <LayoutAccountLocked title="Account | Segue">
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
      <span className="block xl:inline">Account Locked</span>
    </h1>
    If Account Admin Link to account Payment else
    <p>
      Sorry, your account cannot be loaded, Your company has no Licences available. Please contact your account
      administrator to activate more licences, to log out and try again later
    </p>
  </LayoutAccountLocked>
);

export default Index;
