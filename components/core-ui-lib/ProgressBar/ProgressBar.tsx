interface ProgressBarprops {
  backgroundColor?: string;
  fillColor?: string;
  progress: number;
}

const ProgressBar = ({ backgroundColor, fillColor, progress }: ProgressBarprops) => {
  return (
    <div className="w-full flex flex-row">
      <div className={`w-full ${backgroundColor ? `bg-[${backgroundColor}]` : 'bg-gray-300'}  rounded-full h-3`}>
        <div
          className={`${fillColor ? `bg-[${fillColor}]` : 'bg-primary-navy'} rounded-full h-3`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
