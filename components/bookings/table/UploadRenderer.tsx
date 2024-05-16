import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';
import { ButtonVariant } from 'components/core-ui-lib/Button/Button';

interface UploadRendererProps {
  imageUrl?: string;
  buttonClassName?: string;
  variant?: ButtonVariant;
  buttonText?: string;
  value?: string;
}

const UploadRenderer = ({ imageUrl, buttonClassName, variant = 'secondary', buttonText }: UploadRendererProps) => {
  return imageUrl ? (
    <div className="p-2">
      <div className="flex bg-gray-300 justify-center items-center">
        <Icon iconName="camera-solid" variant="xl" />
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <Button className={buttonClassName} variant={variant} text={buttonText} />
    </div>
  );
};

export default UploadRenderer;
