import Link from 'next/link';
import Layout from '../components/guestLayout';

function Unauthorised() {
  return (
    <Layout title="Unauthorised | Segue">
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Not Authorised</h1>
            <Link href={'/'} title={'Back to home'}>
              Home
            </Link>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sorry you do not have permission to view this page. Please contact your administrator to get access
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Unauthorised;
