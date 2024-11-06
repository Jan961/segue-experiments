import Spinner from 'components/core-ui-lib/Spinner';
import classNames from 'classnames';

interface LoaderProps {
  className?: string;
  testId?: string;
}

export default function LoadingOverlay({ className, testId = 'loading-overlay' }: LoaderProps) {
  return (
    <div
      data-testid={testId}
      className={classNames('inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center', className)}
    >
      <Spinner size="lg" />
    </div>
  );
}
