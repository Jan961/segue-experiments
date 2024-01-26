import Checkbox from 'components/core-ui-lib/Checkbox';
import Typeahead from 'components/core-ui-lib/Typeahead';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { tourJumpState } from 'state/booking/tourJumpState';

export default function TourJumpMenu() {
  const router = useRouter();
  const [tourJump, setTourJump] = useRecoilState(tourJumpState);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const tours = useMemo(() => {
    const tourOptions = [];
    for (const tour of tourJump.tours) {
      if (includeArchived) {
        tourOptions.push({
          ...tour,
          text: `${tour.ShowName} ${tour.ShowCode}/${tour.Code} ${tour.IsArchived ? ' | (Archived)' : ''}`,
          value: tour.Id,
        });
      } else if (!tour.IsArchived) {
        tourOptions.push({
          ...tour,
          text: `${tour.ShowName} ${tour.ShowCode}/${tour.Code} ${tour.IsArchived ? ' | (Archived)' : ''}`,
          value: tour.Id,
        });
      }
    }
    return tourOptions;
  }, [tourJump, includeArchived]);
  if (!tourJump?.selected || !tourJump?.tours?.length) return null;

  const { selected, path } = tourJump;
  function goToTour(value: any) {
    const selectedTour = tours.find((tour) => tour.Id === parseInt(value));
    if (!selectedTour) return;
    const { ShowCode, Code: TourCode, Id } = selectedTour;
    setTourJump({ ...tourJump, loading: true, selected: Id });
    router.push(`/${path}/${ShowCode}/${TourCode}`);
  }
  return (
    <>
      <Typeahead
        className="border-0 !shadow-none w-80"
        onChange={goToTour}
        value={selected ? selected + '' : null}
        label="Production"
        options={tours}
      />
      <div className="flex items-center ml-1 mr-4">
        <Checkbox
          id="IncludeArchived"
          label="Include Archived"
          checked={includeArchived}
          onChange={(e) => setIncludeArchived(e.target.value)}
          className=""
        />
      </div>
    </>
  );
}
