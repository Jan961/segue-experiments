import { SVGProps } from '../types';

export default function ExitIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none" {...props}>
      <path
        d="M10.5625 9.79486H8.42969C8.26211 9.79486 8.125 9.65712 8.125 9.48877V8.46847C8.125 8.30012 8.26211 8.16238 8.42969 8.16238H10.5625C11.0119 8.16238 11.375 7.79762 11.375 7.34614V2.44871C11.375 1.99723 11.0119 1.63248 10.5625 1.63248H8.42969C8.26211 1.63248 8.125 1.49474 8.125 1.32639V0.306089C8.125 0.13774 8.26211 0 8.42969 0H10.5625C11.9082 0 13 1.09682 13 2.44871V7.34614C13 8.69804 11.9082 9.79486 10.5625 9.79486ZM9.36914 4.66786L5.10352 0.382612C4.72266 0 4.0625 0.267828 4.0625 0.816238V3.26495H0.609375C0.27168 3.26495 0 3.53788 0 3.87713V6.32584C0 6.66509 0.27168 6.93802 0.609375 6.93802H4.0625V9.38674C4.0625 9.93515 4.72266 10.203 5.10352 9.82036L9.36914 5.53511C9.60527 5.29534 9.60527 4.90763 9.36914 4.66786Z"
        fill={props.fill || '#FFF'}
      />
    </svg>
  );
}
