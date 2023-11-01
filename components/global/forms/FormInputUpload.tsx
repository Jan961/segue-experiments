import { PropsWithChildren } from 'react';

interface FormInputUploadProps {
  label: string;
  name: string;
  onChange: (e: any) => void;
}

export const FormInputUpload = ({ name, onChange, children, label }: PropsWithChildren<FormInputUploadProps>) => {
  return (
    <div className="mb-2">
      <label htmlFor="Tour Logo" className="">
        {label}
      </label>
      <div className="flex gap-x-4">
        {children && <div>{children}</div>}
        <div>
          <input id={name} type="file" name={name} onChange={onChange} title=" " />
        </div>
      </div>
    </div>
  );
};
