import { SVGProps } from '../types';

export default function UserSolidIcon(props: SVGProps) {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_3386_6000)">
        <path
          d="M9.5 10.6875C12.4502 10.6875 14.8438 8.29395 14.8438 5.34375C14.8438 2.39355 12.4502 0 9.5 0C6.5498 0 4.15625 2.39355 4.15625 5.34375C4.15625 8.29395 6.5498 10.6875 9.5 10.6875ZM14.25 11.875H12.2053C11.3814 12.2535 10.4648 12.4688 9.5 12.4688C8.53516 12.4688 7.62227 12.2535 6.79473 11.875H4.75C2.12637 11.875 0 14.0014 0 16.625V17.2188C0 18.2021 0.797852 19 1.78125 19H17.2188C18.2021 19 19 18.2021 19 17.2188V16.625C19 14.0014 16.8736 11.875 14.25 11.875Z"
          fill={props.fill || '#617293'}
          string={props.stroke || '#FFF'}
        />
      </g>
      <defs>
        <clipPath id="clip0_3386_6000">
          <rect width="19" height="19" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
