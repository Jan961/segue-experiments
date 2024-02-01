import { SVGProps } from '../types';

export default function ExcelIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none" {...props}>
      <path
        d="M7 4.25V0H0.75C0.334375 0 0 0.334375 0 0.75V15.25C0 15.6656 0.334375 16 0.75 16H11.25C11.6656 16 12 15.6656 12 15.25V5H7.75C7.3375 5 7 4.6625 7 4.25ZM8.87813 7.57812L7 10.5L8.87813 13.4219C9.0375 13.6719 8.85938 14 8.5625 14H7.47188C7.33438 14 7.20625 13.925 7.14062 13.8031C6.52812 12.6719 6 11.6562 6 11.6562C5.8 12.1187 5.6875 12.2812 4.85625 13.8062C4.79062 13.9281 4.66562 14.0031 4.52812 14.0031H3.4375C3.14062 14.0031 2.9625 13.675 3.12188 13.425L5.00625 10.5031L3.12188 7.58125C2.95938 7.33125 3.14062 7.00313 3.4375 7.00313H4.525C4.6625 7.00313 4.79062 7.07812 4.85625 7.2C5.67188 8.725 5.48125 8.25 6 9.34062C6 9.34062 6.19063 8.975 7.14375 7.2C7.20938 7.07812 7.3375 7.00313 7.475 7.00313H8.5625C8.85938 7 9.0375 7.32812 8.87813 7.57812ZM12 3.80938V4H8V0H8.19063C8.39062 0 8.58125 0.078125 8.72188 0.21875L11.7812 3.28125C11.9219 3.42188 12 3.6125 12 3.80938Z"
        fill={props.fill || '#FFF'}
      />
    </svg>
  );
}
