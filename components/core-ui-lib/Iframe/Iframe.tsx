type variant = 'xs' | 'sm' | 'md' | 'lg';

interface IframeProps {
  src: string;
  variant?: variant;
  className?: string;
}

const IFRAME_SIZES = {
  xs: 'w-[210px] h-[120px]',
  sm: 'w-[326px] h-[183px]',
  md: 'w-[435px] h-[244px]',
  lg: 'w-[544px] h-[306px]',
};

const Iframe = ({ src, variant = 'sm', className = '' }: IframeProps) => {
  const baseClass = `border-0 ${IFRAME_SIZES[variant]}`;

  // Adding a transform scale to zoom out the content. Adjust the scale value as needed.
  const scaleValue = 0.8; // Example scale value; adjust as needed.
  const scaledWidth = parseInt(IFRAME_SIZES[variant].match(/w-\[(\d+)px\]/)[1]) / scaleValue;
  const scaledHeight = parseInt(IFRAME_SIZES[variant].match(/h-\[(\d+)px\]/)[1]) / scaleValue;
  const transformStyle = {
    transform: `scale(${scaleValue})`,
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    transformOrigin: 'top left'
  };

  return (
    <div className={`${IFRAME_SIZES[variant]} overflow-hidden`} style={{ width: `${scaledWidth * scaleValue}px`, height: `${scaledHeight * scaleValue}px`, margin: 'auto' }}>
      <iframe 
        src={src} 
        className={`${baseClass} ${className}`}
        style={transformStyle}
        allowFullScreen>
      </iframe>
    </div>
  );
}

export default Iframe;
