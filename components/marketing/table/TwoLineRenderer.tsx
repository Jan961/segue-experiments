import { CustomCellRendererProps } from 'ag-grid-react';

export default function TwoLineRenderer(props: CustomCellRendererProps) {
  const data = props.value.split('\n');
  return (
    <div className="break-keep w-full my-2 leading-[1.2]">
      {data[0]}
      <br />
      {data[1]}
    </div>
  );
}
