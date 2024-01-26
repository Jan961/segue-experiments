import { SVGProps } from '../types';

export default function HornIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill={props.fill} {...props}>
      <path
        d="M9 9.57143V18.3333M5 18.3333L7 26H3L1 18.3333V9.57143C1 9.57143 3.04054 9.57143 9.72973 9.57143C16.8345 9.57143 25 3 25 3V24.9048C25 24.9048 16.75 18.3333 9.72973 18.3333C3.16554 18.3333 2 18.3333 2 18.3333M25 11.7619C26.1047 11.7619 27 12.7424 27 13.9524C27 15.1623 26.1047 16.1429 25 16.1429V11.7619Z"
        stroke={props.stroke || '#FFF'}
        fill={props.fill || '#FFF'}
        strokeWidth="2"
      />
    </svg>
  );
}
