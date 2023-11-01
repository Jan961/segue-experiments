import * as React from 'react';
import Link from 'next/link';

const TemplateHelper = () => (
  <div className={'flex bg-blue-100 w-9/12 p-5'}>
    <div className="flex-auto mx-4 mt-0overflow-hidden shadow  ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
      <div className={'mb-1'}></div>
      <div>
        <Link href={'/segue/downloads/SalesEntryTemplate.csv'}>Download Example Template</Link>
      </div>
    </div>
  </div>
);

export default TemplateHelper;
