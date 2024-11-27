interface ProgressBarProps {
  backgroundColor?: string;
  fillColor?: string;
  progress: number;
  className?: string;
}

const ProgressBar = ({ backgroundColor, fillColor, progress, className }: ProgressBarProps) => {
  const clippedWidth = Math.max(Math.min(100, progress), 0);

  return (
    <div className={`w-full flex flex-row overflow-hidden ${className}`} data-testid="progress-bar">
      <div
        className={`w-full rounded-full h-3 ${backgroundColor ? '' : 'bg-gray-300'}`}
        style={backgroundColor ? { backgroundColor } : undefined}
        data-testid="progress-bar-background"
      >
        <div
          className={`transition-all duration-300 ease-in-out rounded-full h-3 ${fillColor ? '' : 'bg-primary-navy'}`}
          style={{ width: `${clippedWidth}%`, backgroundColor: fillColor || undefined }}
          data-testid="progress-bar-fill"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
