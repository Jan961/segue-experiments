import React from 'react';

export interface SVGProps extends React.SVGProps<SVGSVGElement> {
  stroke?: string;
  fill?: string;
}
