import React, { useState, ReactNode, useMemo } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

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
  testId?: string;
}

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
  testId = 'core-ui-lib-tooltip',
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const arrowStyle = useMemo(() => getArrowStyle(bgColorClass), [bgColorClass]);

  const toggleTooltip = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    console.log({ x: e.clientX, y: e.clientY });
    const tpContentAvail = title.trim() !== '' || body.trim() !== '';
    if (!tpContentAvail) {
      return null;
    }

    if (!disabled) {
      setShowTooltip(!showTooltip);
    }
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <div className={classNames('relative', { 'z-[9999]': showTooltip })}>
      <div onMouseEnter={toggleTooltip} onMouseLeave={toggleTooltip}>
        {children}
      </div>

      {showTooltip &&
        createPortal(
          <div
            data-testid={testId}
            style={{ left: `${mousePosition.x - 110}px`, top: `${mousePosition.y - 30}px`, position: 'absolute' }}
          >
            <div
              className={`z-[10000] relative flex flex-col justify-center p-4 ${txtColorClass} bg-${bgColorClass} rounded-md ${height} ${width} max-w-[300px]`}
            >
              <div className={`${arrowStyle[position]}`} />
              <div className="text-center">
                {title && (
                  <div
                    data-testid={`${testId}-title`}
                    className="font-bold leading-[1.125] break-words whitespace-normal not-italic"
                  >
                    {title}
                  </div>
                )}
                {body && (
                  <div
                    data-testid={`${testId}-body`}
                    className="leading-[1.125] break-words whitespace-normal not-italic"
                  >
                    {body}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Tooltip;
