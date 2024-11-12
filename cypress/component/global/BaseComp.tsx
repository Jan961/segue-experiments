import { calibri } from 'lib/fonts';

const BaseComp = ({ children }) => {
  return <div className={`${calibri.variable} font-calibri`}>{children}</div>;
};

export default BaseComp;
