import { CustomCellRendererProps } from 'ag-grid-react';

const NoPerfRender = (props: CustomCellRendererProps) => {
  return (
    <p className=" text-center border-2 mx-auto border-primary-input-text rounded-sm line  text-sm  p-0 m-0 w-5 h-5 ">
      {props.value}
    </p>
  );
};

export default NoPerfRender;
