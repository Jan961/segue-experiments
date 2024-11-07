import Spinner from 'components/core-ui-lib/Spinner';
import classNames from 'classnames';
import { Loader } from '../index';
import { variant } from '../Loader/Loader';

interface LoaderProps {
  className?: string;
  testId?: string;
  spinner?: boolean;
  loaderClassName?: string;
  loaderVariant?: variant;
}

export default function LoadingOverlay({
  className,
  testId = 'loading-overlay',
  spinner = true,
  loaderClassName = 'ml-2',
  loaderVariant = 'sm',
}: LoaderProps) {
  return (
    <div
      data-testid={testId}
      className={classNames('inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center', className)}
    >
      {spinner ? (
        <Spinner size="lg" />
      ) : (
        <Loader variant={loaderVariant} className={loaderClassName} iconProps={{ stroke: '#FFF' }} />
      )}
    </div>
  );
}
