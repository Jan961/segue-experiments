import localFont from '@next/font/local';

export const calibri = localFont({
  src: [
    {
      path: '../public/fonts/calibri.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/calibrib.ttf',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../public/fonts/calibrii.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-calibri',
});
