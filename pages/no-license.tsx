import Link from 'next/link';
import Layout from '../components/guestLayout';
import { useRouter } from 'next/router';

import { Alert } from '../components/alert';

export default NoLicences;

function NoLicences() {
  const router = useRouter();

  return (
    <Layout title="No Licence | Segue">
      <Alert></Alert>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">No Licences</h1>
            <button onClick={() => router.back()}>Back</button>
            <p className="mt-2 text-center text-sm text-gray-600">Sorry Your Account has no Licences Available,</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
