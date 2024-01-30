import Link from 'next/link';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MenuButton } from 'components/global/MenuButton';
import { dateToSimple } from 'services/dateService';
import { useRouter } from 'next/router';
import { ProductionDTO } from 'interfaces';

interface ProductionListDateDisplayProps {
  startDate: string;
  endDate: string;
  label: string;
}

const ProductionListDateDisplay = ({ startDate, endDate, label }: ProductionListDateDisplayProps) => {
  return (
    <div className="flex basis-1 flex-col pr-2 mr-2">
      <b>{label}</b>
      <span className="whitespace-nowrap">
        {dateToSimple(startDate)} &#12297;{dateToSimple(endDate)}
      </span>
    </div>
  );
};

type ProductionListItemProps = {
  production: ProductionDTO;
  editable: boolean;
  showDateBlock?: boolean;
};

const ProductionListItem = ({ production, editable, showDateBlock = true }: ProductionListItemProps) => {
  const router = useRouter();
  const path = router.pathname.split('/')[1];

  const navigateToShow = () => {
    if (!editable) router.push(`/${path}/${production.ShowCode}/${production.Code}`);
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
          <Link href={`/${path}/${production.ShowCode}/${production.Code}`} className="text-sm text-gray-900">
            {production.ShowName} ({production.ShowCode}) - Production {production.Code}
          </Link>
        )}
        {editable && (
          <>
            {production.ShowName} ({production.ShowCode}) - Production {production.Code}
          </>
        )}
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          {showDateBlock
            ? production.DateBlock.map((x) => (
                <ProductionListDateDisplay key={x.Id} label={x.Name} startDate={x.StartDate} endDate={x.EndDate} />
              ))
            : null}
        </div>
      </div>
      {editable && (
        <div className="whitespace-nowrap">
          <MenuButton icon={faPencil} href={`/account/shows/${production.ShowCode}/${production.Code}/edit`} />
          <MenuButton intent="DANGER" icon={faTrash} href={`/account/shows/${production.ShowCode}/${production.Code}/delete`} />
        </div>
      )}
    </li>
  );
};

export default ProductionListItem;
