import React, { useState, ReactNode, useEffect, useMemo } from 'react';
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
  useManualToggle?: boolean;
  manualToggle?: boolean;
}

const positionStyle = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-3',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-3',
  left: 'top-1/2 right-full transform -translate-y-1/2 -translate-x-4',
  right: 'top-1/2 left-full transform -translate-y-1/2 translate-x-4',
};

const getArrowStyle = (bgColorClass: string) => ({
  top:
    'absolute bottom-0 left-1/2 w-[20px] h-[20px] transform rotate-45 -translate-x-1/2 translate-y-2 bg-' +
    bgColorClass,
  bottom:
    'absolute top-0 left-1/2 w-[20px] h-[20px] transform rotate-45 -translate-x-1/2 -translate-y-2 bg-' + bgColorClass,
  left:
    'absolute top-1/2 right-0 w-[20px] h-[20px] transform rotate-45 -translate-y-2 translate-x-2 bg-' + bgColorClass,
  right:
    'absolute top-1/2 left-0 w-[20px] h-[20px] transform rotate-45 -translate-y-2 -translate-x-2 bg-' + bgColorClass,
});

const Tooltip: React.FC<TooltipProps> = ({
  title,
  body,
  children,
  position = 'top',
  height = 'h-auto',
  width = 'w-auto',
  bgColorClass = 'primary-navy',
  txtColorClass = 'text-white',
  useManualToggle = false,
  manualToggle,
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const arrowStyle = useMemo(() => getArrowStyle(bgColorClass), [bgColorClass]);

  useEffect(() => {
    if (useManualToggle) {
      setShowTooltip(manualToggle);
    }
  }, [manualToggle]);

  const toggleTooltip = () => {
    if (!useManualToggle) {
      setShowTooltip(!showTooltip);
    }
  };

  return (
    <div className={classNames('relative', showTooltip && 'z-[9999]')}>
      <div onMouseEnter={toggleTooltip} onMouseLeave={toggleTooltip}>
        {children}
      </div>
      {showTooltip && (
        <div className={classNames('absolute', positionStyle[position])}>
          <div
            className={`z-[10000] relative p-2 ${txtColorClass} bg-${bgColorClass} p-4 rounded-md ${height} ${width} max-w-[300px]`}
          >
            <div className={`${arrowStyle[position]}`}></div>
            <div className="relative text-center items-center h-full">
              <div className="text font-bold leading-[1.125]">{title}</div>
              <div className="text leading-[1.125]">{body}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
