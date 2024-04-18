import { SVGProps } from '../types';

export default function MinusCircleSolidIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <g clipPath="url(#clip0_3771_6615)">
        <path
          d="M10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20ZM7.1875 9.0625H12.8125C13.332 9.0625 13.75 9.48047 13.75 10C13.75 10.5195 13.332 10.9375 12.8125 10.9375H7.1875C6.66797 10.9375 6.25 10.5195 6.25 10C6.25 9.48047 6.66797 9.0625 7.1875 9.0625Z"
          fill="#617293"
        />
      </g>
      <defs>
        <clipPath id="clip0_3771_6615">
          <rect width="20" height="20" fill={props.fill || '#FFF'} />
        </clipPath>
      </defs>
    </svg>
  );
}
