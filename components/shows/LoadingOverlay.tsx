import Spinner from 'components/core-ui-lib/Spinner';

const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Spinner size="lg" />
  </div>
);

export default LoadingOverlay;
