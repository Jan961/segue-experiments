import { CustomCellRendererProps } from 'ag-grid-react';

export default function TwoLineRenderer(props: CustomCellRendererProps) {
  const data = props.value.split('\n');
  const isSingleLine = data.length === 1;

  return (
    <div className={`break-keep w-full my-2 leading-[1.2] ${isSingleLine ? 'flex items-center h-full' : ''}`}>
      {data[0]}
      {data[1] && (
        <>
          <br />
          {data[1]}
        </>
      )}
    </div>
  );
}
