import TextInput from 'components/core-ui-lib/TextArea';
import { useState } from 'react';

interface TextBoxConfirmationProps {
  requiredMessage: string;
  setValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextBoxConfirmation = ({ requiredMessage, setValid }: TextBoxConfirmationProps) => {
  const [inputMessage, setInputMessage] = useState<string>('');

  const onChange = (e) => {
    setInputMessage(e.target.value);
    setValid(e.target.value !== requiredMessage);
  };

  return (
    <div>
      <p className="text-sm">Type {requiredMessage} to confirm</p>
      <TextInput value={inputMessage} onChange={onChange} className="w-full overflow-hidden resize-none h-[35px]" />
    </div>
  );
};

export default TextBoxConfirmation;
