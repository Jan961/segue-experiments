import { list } from 'radash';
import { FC } from 'react';

export const SwitchBoardSkeleton: FC = () => {
  return (
    <li className="shadow-lg md:w-44 md:h-24 lg:w-56 lg:h-32">
      <div className="h-full flex flex-col items-center justify-center rounded-md bg-gray-100 animate-pulse">
        <div className="rounded-md bg-gray-200 lg:h-13 lg:w-13 md:h-10 md:w-10" />
        <div className="w-3/4 h-5 bg-gray-200 rounded mt-3">
          <div className="h-full animate-pulse" />
        </div>
      </div>
    </li>
  );
};

// Wrapper component to show multiple skeletons
interface SwitchBoardSkeletonGridProps {
  count?: number;
}

export const SwitchBoardSkeletonGrid: FC<SwitchBoardSkeletonGridProps> = ({ count = 6 }) => {
  return (
    <ul className="grid grid-cols-1 gap-4 w-fit sm:grid-cols-2 md:grid-cols-3 mt-4 mx-auto">
      {list(count).map((_, index) => (
        <SwitchBoardSkeleton key={index} />
      ))}
    </ul>
  );
};
