import Button from 'components/core-ui-lib/Button';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonVariant } from 'components/core-ui-lib/Button/Button';
import { isNullOrEmpty } from 'utils';

interface CloneButtonRendererProps extends ICellRendererParams {
  variant: ButtonVariant;
  buttonText: string;
  className?: string;
  disabled?: boolean;
}

export default function CloneButtonRenderer(props: CloneButtonRendererProps) {
  const { variant = 'secondary', buttonText, className } = props;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Button disabled={!isNullOrEmpty(props.data.MTRId)} className={className} variant={variant} text={buttonText} />
    </div>
  );
}
