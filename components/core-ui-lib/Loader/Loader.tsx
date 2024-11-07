import classNames from 'classnames';
import { SpinIcon } from '../assets/svg';

export type variant = 'xs' | 'sm' | 'md' | 'lg';

interface LoaderProps {
  text?: string;
  variant?: variant;
  className?: string;
  iconProps?: any;
  testId?: string;
}

export default function Loader({
  text,
  variant = 'sm',
  className,
  iconProps = {},
  testId = 'core-ui-lib-loader',
}: LoaderProps) {
  const getSizeForVariant = (v) => ({ xs: '15px', sm: '18px', md: '20px', lg: '22px' })[v];

  return (
    <div data-testid={testId} className={classNames('flex items-center gap-2', className)}>
      {text && <span className={`text-primary-label text-${variant}`}>{text}</span>}
      <SpinIcon
        data-testid="spinIcon"
        className="animate-spin"
        width={getSizeForVariant(variant)}
        height={getSizeForVariant(variant)}
        {...iconProps}
      />
    </div>
  );
}
