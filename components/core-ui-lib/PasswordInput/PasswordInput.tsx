import { useRef } from 'react';
import Icon from '../Icon';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/TextInput';

const PasswordInput = (props: TextInputProps) => {
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    if (inputRef.current) {
      inputRef.current.type = inputRef.current.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div className={`w-full flex items-center relative`}>
      <TextInput type="password" ref={inputRef} {...props} />
      <div className="input-icon absolute inset-y-0 right-0 flex items-center pr-2">
        <Icon aria-hidden="true" iconName="show-password" onClick={togglePasswordVisibility} />
      </div>
    </div>
  );
};

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
