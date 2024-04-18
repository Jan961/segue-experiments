import React, { useState, ReactNode, useMemo } from 'react';
import classNames from 'classnames';

export interface TooltipProps {
  title?: string;
  body?: string;
  children?: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  height?: string;
  width?: string;
  bgColorClass?: string;
  txtColorClass?: string;
  disabled?: boolean;
}

const positionStyle = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-3',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-3',
  left: 'top-1/2 right-full transform -translate-y-1/2 -translate-x-3',
  right: 'top-1/2 left-full transform -translate-y-1/2 translate-x-3',
};

const getArrowStyle = (bgColorClass: string) => ({
  top: `absolute bottom-0 left-1/2 w-[20px] h-[20px] transform rotate-45 -translate-x-1/2 translate-y-2 bg-${bgColorClass}`,
  bottom: `absolute top-0 left-1/2 w-[20px] h-[20px] transform rotate-45 -translate-x-1/2 -translate-y-2 bg-${bgColorClass}`,
  left: `absolute top-1/2 right-0 w-[20px] h-[20px] transform rotate-45 -translate-y-2 translate-x-2 bg-${bgColorClass}`,
  right: `absolute top-1/2 left-0 w-[20px] h-[20px] transform rotate-45 -translate-y-2 -translate-x-2 bg-${bgColorClass}`,
});

const Tooltip: React.FC<TooltipProps> = ({
  title = '',
  body = '',
  children,
  position = 'top',
  height = 'h-auto',
  width = 'w-auto',
  bgColorClass = 'primary-navy',
  txtColorClass = 'text-white',
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const arrowStyle = useMemo(() => getArrowStyle(bgColorClass), [bgColorClass]);

  const toggleTooltip = () => {
    const tpContentAvail = title.trim() !== '' || body.trim() !== '';
    if (!tpContentAvail) {
      return null;
    }

    if (!disabled) {
      setShowTooltip(!showTooltip);
    }
  };

  return (
    <div className={classNames('relative', { 'z-[9999]': showTooltip })}>
      <div onMouseEnter={toggleTooltip} onMouseLeave={toggleTooltip}>
        {children}
      </div>
      {showTooltip && (
        <div className={classNames('absolute', positionStyle[position])}>
          <div
            className={`z-[10000] relative flex flex-col justify-center p-4 ${txtColorClass} bg-${bgColorClass} rounded-md ${height} ${width} max-w-[300px]`}
          >
            <div className={`${arrowStyle[position]}`} />
            <div className="text-center">
              {title && (
                <div className="font-bold leading-[1.125] break-words whitespace-normal not-italic">{title}</div>
              )}
              {body && <div className="leading-[1.125] break-words whitespace-normal not-italic">{body}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
