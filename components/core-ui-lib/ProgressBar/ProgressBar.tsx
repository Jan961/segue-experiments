interface ProgressBarProps {
  backgroundColor?: string;
  fillColor?: string;
  progress: number;
}

const ProgressBar = ({ backgroundColor, fillColor, progress }: ProgressBarProps) => {
  return (
    <div className="w-full flex flex-row overflow-hidden">
      <div className={`w-full rounded-full h-3 ${backgroundColor ? `bg-[${backgroundColor}]` : 'bg-gray-300'}`}>
        <div
          className={`${
            fillColor ? `bg-${fillColor}` : 'bg-primary-navy'
          }  transition-all duration-300 ease-in-out rounded-full h-3`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
