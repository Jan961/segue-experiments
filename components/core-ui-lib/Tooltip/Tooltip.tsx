import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  height?: string;
  width?: string;
  bgColorClass?: string;
  txtColorClass?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, children, position = 'top',
  height = 'h-auto', width = 'w-auto',
  bgColorClass = 'bg-primary-navy', 
  txtColorClass = 'text-white'
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'top-1/2 right-full transform translate-y-1/2';
      case 'right':
        return 'top-1/2 left-full transform -translate-y-1/2';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2';
    }
  };

  // const getArrowStyle = () => {
  //   switch (position) {
  //     case 'top':
  //       return 'absolute w-0 h-0 border-l-[5px] border-t-[10px] border-t-red-500 border-r-[5px] rotate-180'
  //     case 'bottom':
  //       return 'absolute bottom-0 left-1/2 -mb-2 w-0 h-0 border-solid border-4 border-b-transparent border-l-transparent border-r-transparent border-t-black';
  //     case 'left':
  //       return 'absolute top-1/2 right-0 -mr-2 w-0 h-0 border-solid border-4 border-r-transparent border-t-transparent border-b-transparent border-l-black';
  //     case 'right':
  //       return 'absolute top-1/2 left-0 -ml-2 w-0 h-0 border-solid border-4 border-l-transparent border-t-transparent border-b-transparent border-r-black';
  //     default:
  //       return '';
  //   }
  // };

  const getArrowStyle = () => {
    switch (position) {
      case 'top':
        return 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-solid border-white';
      case 'bottom':
        return 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-solid border-white';
      case 'left':
        return 'absolute top-1/2 right-full transform translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-solid border-white';
      case 'right':
        return 'absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-solid border-white';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      <div onMouseEnter={toggleTooltip} onMouseLeave={toggleTooltip}>
        {children}
      </div>
      {showTooltip && (
        <div className='items-center'>
         <div className={`${bgColorClass} ${getArrowStyle()}`}></div>
        <div
          className={`absolute z-10 p-2 ${txtColorClass} ${bgColorClass} rounded-md ${getPositionStyle()} ${height} ${width}`}
        >
         
          <div className="relative">
            {content}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
