import { CustomCellRendererProps } from 'ag-grid-react';

export default function ContractStatusCellRenderer(props: CustomCellRendererProps) {
  const getContractStatusClass = () => {
    const contractStatus = props.value;
    if (contractStatus === 'Received Not Returned') {
      return 'bg-[#FFE606]';
    } else if (contractStatus === 'Countersigned and Filed') {
      return 'bg-[#10841C] text-primary-white';
    } else if (contractStatus === 'Received, Questions Raised') {
      return 'bg-primary-red text-primary-white';
    } else if (contractStatus === 'Producer Signed, Returned to Venue') {
      return 'bg-[#E94580] text-primary-white';
    }
    return '';
  };

  return <div className={`w-full h-full px-2 truncate ${getContractStatusClass()}`}>{props.value}</div>;
}
