import { SVGProps } from '../types';

export default function NoteIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="26" viewBox="0 0 21 26" fill="none" {...props}>
      <path
        d="M20 8.5V7.875V7.5V7.23789C20 6.69381 19.7777 6.17393 19.3869 5.79449C19.3869 5.7944 19.3868 5.79431 19.3867 5.79422C19.3866 5.7942 19.3866 5.79417 19.3866 5.79414L15.0528 1.58356L15.0525 1.5832C14.661 1.20329 14.1389 1 13.6034 1H13.3333H12.9167H12.3333H11.9167H3.0625C1.94976 1 1 1.87955 1 3.03125V22.9688C1 24.1204 1.94976 25 3.0625 25H17.9375C19.0502 25 20 24.1204 20 22.9688V8.875V8.5Z"
        fill={props.fill || '#FFF'}
        stroke={props.stroke || '#617293'}
        strokeWidth="2"
      />
    </svg>
  );
}
