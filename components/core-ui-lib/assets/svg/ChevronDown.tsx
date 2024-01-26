import { SVGProps } from '../types';

export default function ChevronDownIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="8" viewBox="0 0 13 8" fill="none" {...props}>
      <path
        d="M1.5 1.77783L6.5 6.08339L11.5 1.77783"
        stroke={props.stroke || '#617293'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={props.fill || '#FFF'}
      />
    </svg>
  );
}
