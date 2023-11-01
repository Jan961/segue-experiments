import Image from 'next/image';
import { lazy } from 'react';

export default function SmallLogo() {
  return (
    <div className={'flex items-center mt-55'}>
      <Image src="/segue/slogo.jpg" alt="logo" width={33} height={33} />
    </div>
  );
}
