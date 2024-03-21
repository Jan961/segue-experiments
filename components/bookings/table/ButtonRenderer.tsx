import Button from 'components/core-ui-lib/Button';
import { CustomCellRendererProps } from 'ag-grid-react';

export default function ButtonRenderer(props: CustomCellRendererProps) {
  const variant = props?.colDef?.cellRendererParams?.variant ?? 'secondary';
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Button className="w-full" variant={variant} text={props?.colDef?.cellRendererParams?.buttonText} />
    </div>
  );
}
