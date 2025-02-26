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
  | 'system-admin'
  | 'menu'
  | 'exit'
  | 'production-management'
  | 'system-admin'
  | 'excel'
  | 'cross'
  | 'info-circle-solid'
  | 'minus-circle-solid'
  | 'plus-circle-solid'
  | 'camera-solid'
  | 'document-solid'
  | 'upload-to-cloud'
  | 'show-password'
  | 'hide-password'
  | 'price-plan';

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
  ['minus-circle-solid', 'MinusCircleSolidIcon'],
  ['plus-circle-solid', 'PlusCircleSolidIcon'],
  ['camera-solid', 'CameraSolidIcon'],
  ['upload-to-cloud', 'UploadToCloudIcon'],
  ['document-solid', 'DocumentSolidIcon'],
  ['show-password', 'EyeIcon'],
  ['hide-password', 'ClosedEyeIcon'],
  ['price-plan', 'PricePlanIcon'],
]);

type variant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '5xl' | '7xl';

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
  disabled?: boolean;
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
  disabled = false,
}: IconProps) {
  if (!IconNameMap.get(iconName)) return null;

  const getIcon = <T extends keyof ModuleType>(icon: T): ModuleType[T] => iconDir[icon as T];

  const IconComp = getIcon(IconNameMap.get(iconName) as any);
  const fillValue = disabled && fill ? fill.slice(0, 1) + '66' + fill.slice(1) : fill;
  const strokeValue = disabled && stroke ? stroke.slice(0, 1) + '66' + stroke.slice(1) : stroke;

  const getSizeForVariant = (v) =>
    ({
      xs: '15px',
      sm: '18px',
      md: '20px',
      lg: '22px',
      xl: '24px',
      '2xl': '26px',
      '3xl': '30px',
      '5xl': '50px',
      '7xl': '80px',
    })[v];

  return (
    <IconComp
      role="img"
      strokeWidth={strokeWidth}
      stroke={strokeValue}
      fill={fillValue}
      data-testid={testId}
      color={color}
      width={getSizeForVariant(variant)}
      height={getSizeForVariant(variant)}
      className={className}
      onClick={onClick}
    />
  );
}
