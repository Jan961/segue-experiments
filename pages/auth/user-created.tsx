import { calibri } from 'lib/fonts';
import Image from 'next/image';
import Head from 'next/head';

const UserCreatedPage = () => {
  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
      <Head>
        <title>User Created | Segue</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/segue/segue_mini_icon.png" type="image/png" />
      </Head>
      <Image className="mx-auto mb-2" height={160} width={310} src="/segue/segue_logo_full.png" alt="Segue" />
      <h1 className="my-4 text-2xl font-bold text-center text-primary-input-text">Congratulations!</h1>
      <section className="text-center text-primary-input-text mt-4">
        <p className="mb-4">Your Segue adminstrator account has been created. </p>
        <p className="mb-4">Please verify your email in order to access your account.</p>
      </section>
    </div>
  );
};
export default UserCreatedPage;
