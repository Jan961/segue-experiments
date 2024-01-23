import { SVGProps } from '../types';

export default function HomeIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="26" viewBox="0 0 29 26" fill="none" {...props}>
      <path
        d="M14.622 0L0.37793 14.0231L1.8474 15.4697L3.19103 14.1469V26H12.5437V16.7925H16.7004V26H26.053V14.1469L27.3967 15.4697L28.8661 14.0231L23.9747 9.2075V4.51583H21.8963V7.16139L14.622 0ZM14.622 2.89333L23.9747 12.1008V23.9539H18.7788V14.7464H10.4653V23.9539H5.26939V12.1008L14.622 2.89333Z"
        fill={props.fill || '#FFF'}
      />
    </svg>
  );
}
