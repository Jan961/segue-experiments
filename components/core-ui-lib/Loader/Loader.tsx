import classNames from 'classnames';
import { SpinIcon } from '../assets/svg';

type variant = 'xs' | 'sm' | 'md' | 'lg';

interface LoaderProps {
  text?: string;
  variant?: variant;
  className?: string;
  iconProps?: any;
}

export default function Loader({ text, variant = 'sm', className, iconProps = {} }: LoaderProps) {
  const getSizeForVariant = (v) => ({ xs: '15px', sm: '18px', md: '20px', lg: '22px' })[v];

  return (
    <div className={classNames('flex items-center gap-2', className)}>
      {text && <span className={`text-primary-label text-${variant}`}>{text}</span>}
      <SpinIcon
        className="animate-spin"
        width={getSizeForVariant(variant)}
        height={getSizeForVariant(variant)}
        {...iconProps}
      />
    </div>
  );
}
