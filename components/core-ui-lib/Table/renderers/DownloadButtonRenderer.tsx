import Button from 'components/core-ui-lib/Button';
import { ICellRendererParams } from 'ag-grid-community';
import { ButtonVariant } from 'components/core-ui-lib/Button/Button';
import Tooltip, { TooltipProps } from 'components/core-ui-lib/Tooltip/Tooltip';

interface DownloadButtonRendererProps extends ICellRendererParams, TooltipProps {
  variant: ButtonVariant;
  buttonText: string;
  className?: string;
  disabled?: boolean;
  tpActive?: boolean;
  href?: string;
}

export default function DownloadButtonRenderer(props: DownloadButtonRendererProps) {
  const {
    variant = 'secondary',
    buttonText,
    className,
    disabled = false,
    tpActive = false,
    href,
    ...tooltipProps
  } = props;

  const buttonElement = (
    <a href={href} target="_blank" rel="noreferrer" download>
      <Button disabled={disabled} className={className} variant={variant} text={buttonText} />
    </a>
  );

  return (
    <div className="w-full h-full flex justify-center items-center">
      {tpActive ? (
        <Tooltip
          title={tooltipProps.title}
          body={tooltipProps.body}
          position={tooltipProps.position}
          height={tooltipProps.height}
          width={tooltipProps.width}
          bgColorClass={tooltipProps.bgColorClass}
        >
          {buttonElement}
        </Tooltip>
      ) : (
        buttonElement
      )}
    </div>
  );
}