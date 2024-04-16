import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';

type Icon = {
  name: string;
  color: string;
  onClick: () => void;
}

interface IconRowProps extends CustomCellRendererProps {
  iconList?: Array<Icon>;
}

const IconRowRenderer = (props: IconRowProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2">
      {props.iconList.map((icon) =>
        <Icon color='#fff' fill={icon.color} iconName={icon.name} onClick={icon.onClick} />
      )}
    </div>
  );
};

export default IconRowRenderer;
