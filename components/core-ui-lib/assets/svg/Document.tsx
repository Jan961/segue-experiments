import { SVGProps } from '../types';

export default function DocumentIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="51" height="65" viewBox="0 0 51 65" fill="none" {...props}>
      <path
        d="M29.75 17.2656V0H3.1875C1.42109 0 0 1.3584 0 3.04688V61.9531C0 63.6416 1.42109 65 3.1875 65H47.8125C49.5789 65 51 63.6416 51 61.9531V20.3125H32.9375C31.1844 20.3125 29.75 18.9414 29.75 17.2656ZM51 15.4756V16.25H34V0H34.8102C35.6602 0 36.4703 0.317383 37.068 0.888672L50.0703 13.3301C50.668 13.9014 51 14.6758 51 15.4756Z"
        fill={props.fill || '#FFF'}
      />
    </svg>
  );
}
