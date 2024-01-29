import Image from 'next/image';

export const SegueLogo = ({ className, onClick = () => null }: { className?: string; onClick?: () => void }) => {
  return (
    <Image
      className={className}
      height={80}
      width={155}
      src="/segue/segue_logo.png"
      alt="Your Company"
      onClick={onClick}
    />
  );
};
