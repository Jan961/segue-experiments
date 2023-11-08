import Layout from 'components/Layout';
import Image from 'next/image';
import Link from 'next/link';

export default function Error404() {
  return (
    <Layout title="Dashboard | Segue">
      <Link href="/">
        <Image className="mx-auto" height={160} width={310} src="/segue/segue_logo_full.png" alt="Your Company" />
      </Link>
      <div className="text-xl text-center">
        <h1>404 - Page Not Found</h1>
      </div>
    </Layout>
  );
}
