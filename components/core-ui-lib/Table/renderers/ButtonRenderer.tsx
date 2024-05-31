import Button from 'components/core-ui-lib/Button';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonVariant } from 'components/core-ui-lib/Button/Button';

interface ButtonRendererProps extends ICellRendererParams {
  variant: ButtonVariant;
  buttonText: string;
  className?: string;
}

export default function ButtonRenderer(props: ButtonRendererProps) {
  const { variant = 'secondary', buttonText, className } = props;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Button className={className} variant={variant} text={buttonText} />
    </div>
  );
}
