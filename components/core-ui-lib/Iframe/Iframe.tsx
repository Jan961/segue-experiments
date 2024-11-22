import React, { useState } from 'react';
import classNames from 'classnames';
import { Spinner } from 'components/global/Spinner';
import { formatUrl } from 'utils/formatUrl';

export type Variant = 'xs' | 'sm' | 'md' | 'lg';

export interface IframeProps {
  src: string;
  variant?: Variant;
  className?: string;
  testId?: string;
}

const IFRAME_SIZES = {
  xs: 'w-[150px] h-[81px]',
  sm: 'w-[326px] h-[183px]',
  md: 'w-[435px] h-[244px]',
  lg: 'w-[544px] h-[306px]',
};

const Iframe = ({ src, variant = 'sm', className = '', testId = 'iframe' }: IframeProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const baseClass = `border-0 ${IFRAME_SIZES[variant]}`;

  // Calculate scaled dimensions for the transform
  const scaleValue = 0.25; // Example scale value; adjust as needed
  const scaledWidth = parseInt(IFRAME_SIZES[variant].match(/w-\[(\d+)px\]/)[1]) / scaleValue;
  const scaledHeight = parseInt(IFRAME_SIZES[variant].match(/h-\[(\d+)px\]/)[1]) / scaleValue;
  const transformStyle: React.CSSProperties = {
    transform: `scale(${scaleValue})`,
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    transformOrigin: 'top left',
    visibility: isLoading ? 'hidden' : 'visible',
    pointerEvents: 'none',
  };
  const formattedUrl = formatUrl(src);

  if (!src) {
    // Display some text when there is no src
    return <div className={`${baseClass} ${className} flex items-center justify-center`}>No URL provided.</div>;
  }

  return (
    <div
      className={classNames(`${baseClass} overflow-hidden relative ${className}`)}
      onClick={() => window.open(formattedUrl, '_blank')}
      data-testid={testId}
    >
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      )}
      <iframe
        src={formattedUrl}
        style={transformStyle}
        allowFullScreen
        className="absolute"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default Iframe;
