import { SpinIcon } from '../assets/svg';

type variant = 'xs' | 'sm' | 'md' | 'lg';

interface LoaderProps {
  text?: string;
  variant?: variant;
  className?: string;
}

export default function Loader({ text, variant = 'sm' }: LoaderProps) {
  const getSizeForVariant = (v) => ({ xs: '15px', sm: '18px', md: '20px', lg: '22px' })[v];

  return (
    <div className="flex items-center gap-2">
      {text && <span className={`text-primary-label text-${variant}`}>{text}</span>}
      <SpinIcon
        data-testid="spinIcon"
        className="animate-spin"
        width={getSizeForVariant(variant)}
        height={getSizeForVariant(variant)}
      />
    </div>
  );
}
