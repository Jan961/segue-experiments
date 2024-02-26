type variant = 'xs' | 'sm' | 'md' | 'lg';

interface LabelProps {
  text: string;
  variant?: variant;
  className?: string;
}

const labelClassMap = {
  xs: 'text-xs',
  sm: 'text-sm leading-8 font-normal',
  md: 'text-base',
  lg: 'text-lg',
};
export default function Label({ text, variant = 'sm', className = '' }: LabelProps) {
  const basClass = `text-primary-label font-calibri ${labelClassMap[variant]}`;
  return <span className={`${basClass} ${className}`}>{text}</span>;
}
