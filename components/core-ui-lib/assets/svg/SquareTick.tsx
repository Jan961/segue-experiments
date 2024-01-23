import { SVGProps } from '../types';

export default function SquareTickIcon(props: SVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none" {...props}>
      <path
        d="M23.0455 0C23.8727 0 24.5718 0.285767 25.1433 0.856883C25.7142 1.42842 26 2.12726 26 2.95446V23.0455C26 23.8727 25.7142 24.5722 25.1433 25.1433C24.5718 25.7149 23.8727 26.0002 23.0455 26.0002H2.95446C2.12726 26.0002 1.42779 25.7149 0.856882 25.1433C0.285349 24.5722 0 23.8727 0 23.0455V2.95446C0 2.12726 0.285349 1.42842 0.856882 0.856883C1.42779 0.285767 2.12726 0 2.95446 0H23.0455ZM14.7581 9.58752C13.1131 11.4489 11.7591 13.4137 10.6955 15.4818C10.2228 15.0489 9.70061 14.5762 9.1295 14.0636C8.55796 13.5517 7.91305 12.9755 7.19434 12.3352C6.47502 11.6953 5.98752 11.267 5.73185 11.05L3.81134 14.3295C4.18533 14.6841 4.71254 15.1523 5.39195 15.7331C6.07156 16.3142 6.59836 16.7723 6.97276 17.1069C7.34674 17.442 7.79494 17.8654 8.31714 18.3773C8.83871 18.8897 9.31659 19.4115 9.74995 19.9433L11.8772 22.5432L13.0886 19.4706C14.0536 16.9886 15.2945 14.7284 16.8113 12.6898C18.328 10.6511 20.2092 8.59768 22.4546 6.52958L20.6818 3.57512C18.3773 5.72224 16.4024 7.72616 14.7581 9.58752Z"
        fill={props.fill}
      />
    </svg>
  );
}
