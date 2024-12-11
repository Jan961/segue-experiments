import { calibri } from '../../../lib/fonts';
import * as React from 'react';

const BaseComp: React.FC<{
  children?: React.ReactNode;
  styles?: React.CSSProperties;
}> = ({ children, styles }) => {
  return (
    <div className={`${calibri.variable} font-calibri`} style={styles}>
      {children}
    </div>
  );
};
export default BaseComp;