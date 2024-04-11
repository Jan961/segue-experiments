import classNames from 'classnames';
import React from 'react';

const boldText = 'text-base font-bold text-primary-input-text';
const normalText = 'text-base font-normal text-primary-input-text';

type SummaryRowProps = {
  label: string;
  data: string;
};

const SummaryRow: React.FC<SummaryRowProps> = ({ label, data }) => {
  return (
    <div className="flex flex-row">
      <div className={classNames(boldText, 'mr-1')}>{label}</div>
      <div className={normalText}>{data}</div>
    </div>
  );
};

export default SummaryRow;
