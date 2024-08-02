interface FormErrorProps {
  error: string;
  className?: string;
  testId?: string;
  variant?: string;
}

const errorSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function FormError({ error, className, variant = 'xs', testId }: FormErrorProps) {
  const baseClass = `text-primary-red font-calibri ${errorSizeMap[variant]}`;
  return (
    <p data-testid={testId} className={`${className} ${baseClass}`}>
      {error}
    </p>
  );
}
