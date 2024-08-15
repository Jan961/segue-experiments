import Layout from 'components/Layout';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';

export default function index() {
  const links = [
    {
      title: 'Venue Contracts',
      route: '/contracts/venue-contracts',
      color: 'bg-primary-blue',
    },
    {
      title: 'Artiste Contracts',
      route: '/contracts/company-contracts/all?d=1',
      color: 'bg-primary-blue',
    },
    {
      title: 'Creative Contracts',
      route: '/contracts/company-contracts/all?d=2',
      color: 'bg-primary-blue',
    },
    {
      title: 'SM/Tech/Crew Contracts',
      route: '/contracts/company-contracts/all?d=3',
      color: 'bg-primary-blue',
    },
  ];
  return (
    <Layout title="Contracts | Segue">
      <div className="mt-20 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold font-calibri text-primary-blue">Contracts</h1>
        <ul
          data-testid="system-admin-tiles"
          role="list"
          className="grid grid-cols-1 gap-4 w-fit sm:grid-cols-2 md:grid-cols-4 mt-20 mx-auto "
        >
          {links.map((link) => (
            <SwitchBoardItem key={link.route} link={link} />
          ))}
        </ul>
      </div>
    </Layout>
  );
}
