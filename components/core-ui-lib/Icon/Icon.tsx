import * as iconDir from '../assets/svg';

type ModuleType = typeof iconDir;

export type IconName = 'search' | 'chevron-down' | 'check' | 'minus' | 'edit' | 'delete' | 'calendar' | 'spin';

const IconNameMap = new Map([
  ['search', 'SearchIcon'],
  ['chevron-down', 'ChevronDownIcon'],
  ['check', 'CheckIcon'],
  ['minus', 'MinusIcon'],
  ['edit', 'PencilIcon'],
  ['delete', 'BinIcon'],
  ['calendar', 'CalendarIcon'],
  ['spin', 'SpinIcon'],
]);

type variant = 'xs' | 'sm' | 'md' | 'lg';

interface IconProps {
  iconName: IconName;
  onClick?: () => void;
  testId?: string;
  variant?: variant;
  strokeWidth?: string;
  stroke?: string;
  color?: string;
  className?: string;
}

export default function Icon({
  iconName,
  testId = '',
  variant = 'sm',
  stroke,
  strokeWidth,
  color,
  className,
}: IconProps) {
  if (!IconNameMap.get(iconName)) return null;

  const getIcon = <T extends keyof ModuleType>(icon: T): ModuleType[T] => iconDir[icon as T];

  const IconComp = getIcon(IconNameMap.get(iconName) as any);

  const getSizeForVariant = (v) => ({ xs: '15px', sm: '18px', md: '20px', lg: '22px' })[v];

  return (
    <IconComp
      role="img"
      strokeWidth={strokeWidth}
      stroke={stroke}
      data-testid={testId}
      color={color}
      width={getSizeForVariant(variant)}
      height={getSizeForVariant(variant)}
      className={className}
    />
  );
}
