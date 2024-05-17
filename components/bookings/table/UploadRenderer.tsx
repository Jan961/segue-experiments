import Button from 'components/core-ui-lib/Button';
import { ButtonVariant } from 'components/core-ui-lib/Button/Button';
import Image from 'next/image';

interface UploadRendererProps {
  buttonClassName?: string;
  variant?: ButtonVariant;
  buttonText?: string;
  value?: string;
}

const UploadRenderer = ({ buttonClassName, variant = 'secondary', buttonText, value }: UploadRendererProps) => {
  return value ? (
    <div className="p-2">
      <div className="flex justify-center items-center">
        <Image width={50} height={30} alt="Prod Image" src={value} />
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <Button className={buttonClassName} variant={variant} text={buttonText} />
    </div>
  );
};

export default UploadRenderer;
