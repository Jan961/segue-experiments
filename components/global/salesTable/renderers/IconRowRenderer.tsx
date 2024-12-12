import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';

type IconType = {
  name: string;
  table: string;
  color: string;
  onClick: () => void;
};

interface IconRowProps extends CustomCellRendererProps {
  iconList?: Array<IconType>;
}

const IconRowRenderer = (props: IconRowProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2">
      {props.iconList.map((icon) =>
        icon ? (
          <Icon
            testId={icon.table + '-table-' + icon.name + '-button'}
            color="#fff"
            key={icon.name}
            fill={icon.color}
            iconName={icon.name}
            onClick={icon.onClick}
          />
        ) : (
          <></>
        ),
      )}
    </div>
  );
};

export default IconRowRenderer;
