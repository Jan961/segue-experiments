import { CustomCellRendererProps } from 'ag-grid-react';

export default function ContractStatusCellRenderer(props: CustomCellRendererProps) {
  const getContractStatus = () => {
    const contractStatus = props.value;
    if (contractStatus === 'Received Not Returned' || contractStatus === 'CSAR') {
      return { className: 'bg-[#FFE606]', text: 'Received Not Returned' };
    } else if (contractStatus === 'Countersigned and Filed' || contractStatus === 'CSAF') {
      return { className: 'bg-[#10841C] text-primary-white', text: 'Countersigned and Filed' };
    } else if (contractStatus === 'Received, Questions Raised' || contractStatus === 'U') {
      return { className: 'bg-primary-red text-primary-white', text: 'Received, Questions Raised' };
    } else if (contractStatus === 'Producer Signed, Returned to Venue' || contractStatus === 'X') {
      return { className: 'bg-[#E94580] text-primary-white', text: 'Producer Signed, Returned to Venue' };
    }
    return { className: '', text: '' };
  };

  const cellProps = getContractStatus();

  return <div className={`w-full h-full px-2 truncate ${cellProps.className}`}>{cellProps.text}</div>;
}
