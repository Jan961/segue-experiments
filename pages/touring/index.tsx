import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import Layout from '../../components/Layout';
import { faTriangleExclamation, faFileLines, faBasketShopping } from '@fortawesome/free-solid-svg-icons';

export default function ProductionManagement() {
  const links = [
    {
      title: 'Performance Reports',
      route: '/performance/reports',
      icon: null,
      color: 'bg-primary-navy',
    },
    {
      title: 'Merchandise',
      route: '/tbd',
      icon: faBasketShopping,
      color: 'bg-primary-navy',
    },
    {
      title: 'Advance Venue Notes',
      route: '/tbd',
      icon: faFileLines,
      color: 'bg-primary-navy',
    },
    {
      title: 'Venue Warnings',
      route: '/tbd',
      icon: faTriangleExclamation,
      color: 'bg-primary-navy',
    },
  ];
  return (
    <Layout title="Production Management | Segue">
      <div className="mt-20 flex flex-col justify-center items-center text-primary-navy">
        <h1 className="text-4xl font-bold  text-center">Touring Management</h1>
        <ul
          data-testid="touring tiles"
          role="list"
          className="grid grid-cols-1 gap-4 w-fit sm:grid-cols-2 md:grid-cols-4 mt-20 mx-auto "
        >
          {links.map((link) => (
            <SwitchBoardItem key={link.title} link={link} />
          ))}
        </ul>
      </div>
    </Layout>
  );
}
