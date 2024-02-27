import React, { useState, ReactNode, useEffect } from 'react';

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

  useEffect(() => {
    if (useManualToggle) {
      setShowTooltip(manualToggle);
    }
  }, [manualToggle]);

  const toogleTooltip = () => {
    if (!useManualToggle) {
      setShowTooltip(!showTooltip);
    }
  };

  const positionStyle = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
    left: 'top-1/2 right-full transform -translate-y-1/2 mr-4',
    right: 'top-1/2 left-full transform -translate-y-1/2 ml-4',
  };

  const arrowStyle = {
    top: 'absolute top-0 left-1/2 -mt-3 -ml-2 w-0 h-0 border-t-[10px] border-l-[10px] border-r-[10px] border-transparent',
    bottom:
      'absolute bottom-0 left-1/2 -mb-3 -ml-2 w-0 h-0 border-b-[10px] border-l-[10px] border-r-[10px] border-transparent',
    right:
      'absolute top-1/2 right-0 -mr-4 -mt-2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[10px] border-transparent',
    left: 'absolute top-1/2 left-0 -ml-4 -mt-2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[10px] border-transparent',
  };

  const arrowBg = {
    top: 'border-t-' + bgColorClass,
    bottom: 'border-b-' + bgColorClass,
    right: 'border-r-' + bgColorClass,
    left: 'border-l-primary-navy', // + bgColorClass,
  };

  return (
    <div className="relative">
      <div onMouseEnter={toogleTooltip} onMouseLeave={toogleTooltip}>
        {children}
      </div>
      {showTooltip && (
        <div className="items-center">
          <div
            className={`${bgColorClass} ${arrowStyle[position] || arrowStyle.top} ${arrowBg[position] || arrowBg.top}`}
          ></div>
          <div
            className={`absolute z-10 p-2 ${txtColorClass} bg-${bgColorClass} p-4 rounded-md ${
              positionStyle[position] || positionStyle.top
            } ${height} ${width}`}
          >
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
