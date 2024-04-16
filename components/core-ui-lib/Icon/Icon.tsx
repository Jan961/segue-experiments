import * as iconDir from '../assets/svg';

type ModuleType = typeof iconDir;

export type IconName =
  | 'search'
  | 'chevron-down'
  | 'check'
  | 'minus'
  | 'edit'
  | 'delete'
  | 'calendar'
  | 'spin'
  | 'pin-open'
  | 'pin-close'
  | 'note'
  | 'note-filled'
  | 'home'
  | 'bookings'
  | 'marketing'
  | 'tasks'
  | 'contracts'
  | 'touring-management'
  | 'system-admin'
  | 'menu'
  | 'exit'
  | 'production-management'
  | 'system-admin'
  | 'excel'
  | 'cross'
  | 'info-circle-solid';

const IconNameMap = new Map([
  ['search', 'SearchIcon'],
  ['chevron-down', 'ChevronDownIcon'],
  ['check', 'CheckIcon'],
  ['minus', 'MinusIcon'],
  ['edit', 'PencilIcon'],
  ['delete', 'BinIcon'],
  ['calendar', 'CalendarIcon'],
  ['spin', 'SpinIcon'],
  ['pin-open', 'PinOpenIcon'],
  ['pin-close', 'PinCloseIcon'],
  ['note', 'NoteIcon'],
  ['note-filled', 'NoteFilledIcon'],
  ['home', 'HomeIcon'],
  ['bookings', 'BookingsIcon'],
  ['marketing', 'HornIcon'],
  ['tasks', 'SquareTickIcon'],
  ['contracts', 'PaperIcon'],
  ['touring-management', 'LocationIcon'],
  ['production-management', 'LocationIcon'],
  ['system-admin', 'UserSettingIcon'],
  ['menu', 'MenuIcon'],
  ['exit', 'ExitIcon'],
  ['excel', 'ExcelIcon'],
  ['cross', 'CrossIcon'],
  ['info-circle-solid', 'InfoCircleSolidIcon'],
  ['book-solid', 'BookSolidIcon'],
  ['user-solid', 'UserSolidIcon'],
  ['square-cross', 'SquareCrossIcon'],
]);

type variant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '5xl';

export interface IconProps {
  iconName: IconName | string;
  onClick?: () => void;
  testId?: string;
  variant?: variant;
  strokeWidth?: string;
  stroke?: string;
  color?: string;
  fill?: string;
  className?: string;
}

export default function Icon({
  iconName,
  testId = '',
  variant = 'sm',
  stroke,
  strokeWidth,
  color,
  fill,
  className,
  onClick,
}: IconProps) {
  if (!IconNameMap.get(iconName)) return null;

  const getIcon = <T extends keyof ModuleType>(icon: T): ModuleType[T] => iconDir[icon as T];

  const IconComp = getIcon(IconNameMap.get(iconName) as any);

  const getSizeForVariant = (v) =>
    ({ xs: '15px', sm: '18px', md: '20px', lg: '22px', xl: '24px', '2xl': '26px', '5xl': '50px' })[v];

  return (
    <IconComp
      role="img"
      strokeWidth={strokeWidth}
      stroke={stroke}
      fill={fill}
      data-testid={testId}
      color={color}
      width={getSizeForVariant(variant)}
      height={getSizeForVariant(variant)}
      className={className}
      onClick={onClick}
    />
  );
}
