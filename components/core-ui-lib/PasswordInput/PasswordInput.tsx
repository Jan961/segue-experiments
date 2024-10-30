import { useRef, useState } from 'react';
import Icon from '../Icon';

import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/TextInput';
import classNames from 'classnames';

const PasswordInput = (props: TextInputProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
    if (inputRef.current) {
      inputRef.current.type = inputRef.current.type === 'password' ? 'text' : 'password';
    }
  };

  return (
    <div className={classNames('relative', props.className)}>
      <TextInput data-testid="password-input" type="password" ref={inputRef} {...props} />
      <div className="input-icon absolute inset-y-0 right-0 flex items-center pr-2">
        <Icon
          testId="password-input-icon"
          aria-hidden="true"
          iconName={isVisible ? 'hide-password' : 'show-password'}
          onClick={togglePasswordVisibility}
        />
      </div>
    </div>
  );
};

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
