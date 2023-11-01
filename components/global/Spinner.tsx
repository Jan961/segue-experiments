import classNames from 'classnames';

interface SpinnerProps {
  size: undefined | 'sm' | 'md' | 'lg';
  className?: string;
}

// Based on: https://tailwind-elements.com/docs/standard/components/spinners/
export const Spinner = ({ className, size = 'md' }: SpinnerProps) => {
  let baseClass = `inline-block mx-auto animate-spin rounded-full 
  border-4 border-gray-400  
  border-r-transparent 
  align-[-0.125em] 
  motion-reduce:animate-[spin_1.5s_linear_infinite]`;

  switch (size) {
    case 'sm':
      baseClass += ' h-8 w-8';
      break;
    case 'md':
      baseClass += ' h-12 w-12';
      break;
    case 'lg':
      baseClass += ' h-32 w-32';
      break;
  }

  return (
    <div className={classNames('flex justify-center', className)}>
      <div className={baseClass} role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};
