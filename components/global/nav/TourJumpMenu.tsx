import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { tourJumpState } from 'state/booking/tourJumpState';

export default function TourJumpMenu() {
  const router = useRouter();
  const [tourJump, setTourJump] = useRecoilState(tourJumpState);
  const [includeArchived] = useState<boolean>(false);
  const tours = useMemo(() => {
    if (includeArchived) return tourJump?.tours;
    return tourJump?.tours?.filter?.((tour) => !tour.IsArchived);
  }, [tourJump, includeArchived]);
  if (!tourJump?.selected || !tourJump?.tours?.length) return null;

  const { selected, path } = tourJump;
  function goToTour(e: any) {
    const selectedTour = tours.find((tour) => tour.Id === parseInt(e.target.value));
    if (!selectedTour) return;
    const { ShowCode, Code: TourCode, Id } = selectedTour;
    setTourJump({ ...tourJump, loading: true, selected: Id });
    router.push(`/${path}/${ShowCode}/${TourCode}`);
  }
  return (
    <select
      onChange={goToTour}
      id="selectedTour"
      value={selected}
      className={'text-primary-blue border-y-0 border-r-0 border-l-1 border-gray-200 font-medium rounded-r-md'}
    >
      {tours.map((tour) => (
        <option key={`${tour.ShowCode}/${tour.Code}`} value={tour.Id}>
          {`${tour.ShowCode}/${tour.Code} ${tour.IsArchived ? ' | (Archived)' : ''}`}
        </option>
      ))}
    </select>
  );
}
