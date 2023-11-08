// components/IconWithText.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface IconWithTextProps {
  icon: IconDefinition;
  text: string;
  onClick: () => void;
}

const IconWithText: React.FC<IconWithTextProps> = ({ icon, text, onClick }) => {
  return (
    <div onClick={onClick} className="flex flex-col items-center cursor-pointer">
      <FontAwesomeIcon className="text-primary-blue" icon={icon} size={'lg'} />
      <span className="mt-2 text-center font-medium text-lg text-slate-400  ">{text}</span>
    </div>
  );
};

export default IconWithText;
