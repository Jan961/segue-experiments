import Image from 'next/image';
import { lazy } from 'react';

export default function ExcelIcon({height=25, width=25}:{height?:number, width?:number}) {
  return <Image src="/segue/icons/excel.png" alt="excel" width={height} height={width} />;
}
