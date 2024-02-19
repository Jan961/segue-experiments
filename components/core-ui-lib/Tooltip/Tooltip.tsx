import { useEffect, useState } from 'react';
import { Tooltip as ReactToolTip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

// property reference: https://react-tooltip.com/docs/options#available-attributes

interface TooltipProps {
  show: boolean;
  position: any,
  title: string;
  body: string;
  anchorID: string;
  className: string;
}


export default function Tooltip({ show, title, body, position, anchorID, className }: TooltipProps) {
  return (
    <div>
      <ReactToolTip
        anchorSelect={anchorID}
        place={position}
        isOpen={show}
        style={{  backgroundColor: '#082B4B' }}
        className={className}

      >
        <div className="text-center text-primary-white">
          <div className='font-bold text-xl'>
            {title}
          </div>

          <div className='text-base'>
            {body}
          </div>
        </div>
      </ReactToolTip>
    </div>
  )
}
