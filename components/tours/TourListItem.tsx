import Link from 'next/link';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MenuButton } from 'components/global/MenuButton';
import { dateToSimple } from 'services/dateService';
import { useRouter } from 'next/router';
import { TourDTO } from 'interfaces';

interface TourListDateDisplayProps {
  startDate: string;
  endDate: string;
  label: string;
}

const TourListDateDisplay = ({ startDate, endDate, label }: TourListDateDisplayProps) => {
  return (
    <div className="flex basis-1 flex-col pr-2 mr-2">
      <b>{label}</b>
      <span className="whitespace-nowrap">
        {dateToSimple(startDate)} &#12297;{dateToSimple(endDate)}
      </span>
    </div>
  );
};

type TourListItemProps = {
  tour: TourDTO;
  editable: boolean;
  showDateBlock?: boolean;
};

const TourListItem = ({ tour, editable, showDateBlock = true }: TourListItemProps) => {
  const router = useRouter();
  const path = router.pathname.split('/')[1];

  const navigateToShow = () => {
    if (!editable) router.push(`/${path}/${tour.ShowCode}/${tour.Code}`);
  };

  return (
    <li
      onClick={navigateToShow}
      className={`flex w-full
        
        ${editable ? '' : 'cursor-pointer hover:bg-blue-400 hover:bg-opacity-25'}
        items-center justify-between border-b border-gray-200
         p-4`}
    >
      <div className="flex-grow">
        {!editable && (
          <Link href={`/${path}/${tour.ShowCode}/${tour.Code}`} className="text-sm text-gray-900">
            {tour.ShowName} ({tour.ShowCode}) - Tour {tour.Code}
          </Link>
        )}
        {editable && (
          <>
            {tour.ShowName} ({tour.ShowCode}) - Tour {tour.Code}
          </>
        )}
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          {showDateBlock
            ? tour.DateBlock.map((x) => (
                <TourListDateDisplay key={x.Id} label={x.Name} startDate={x.StartDate} endDate={x.EndDate} />
              ))
            : null}
        </div>
      </div>
      {editable && (
        <div className="whitespace-nowrap">
          <MenuButton icon={faPencil} href={`/account/shows/${tour.ShowCode}/${tour.Code}/edit`} />
          <MenuButton intent="DANGER" icon={faTrash} href={`/account/shows/${tour.ShowCode}/${tour.Code}/delete`} />
        </div>
      )}
    </li>
  );
};

export default TourListItem;
