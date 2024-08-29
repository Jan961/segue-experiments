import { calibri } from 'lib/fonts';
import Image from 'next/image';

const UserCreatedPage = () => {
  return (
    <div className={`${calibri.variable} font-calibri background-gradient flex flex-col py-20  px-6`}>
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
