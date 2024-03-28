import Button from 'components/core-ui-lib/Button';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonVariant } from 'components/core-ui-lib/Button/Button';

interface ButtonRendererProps extends ICellRendererParams {
  variant: ButtonVariant;
  buttonText: string;
}

export default function ButtonRenderer(props: ButtonRendererProps) {
  const { variant = 'secondary', buttonText } = props;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Button className="w-full" variant={variant} text={buttonText} />
    </div>
  );
}
