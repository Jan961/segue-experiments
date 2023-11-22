import { SwitchBoardItem } from 'components/global/SwitchBoardItem';
import Layout from '../../components/Layout';
import { faTriangleExclamation, faFileLines, faBasketShopping } from '@fortawesome/free-solid-svg-icons';

export default function TouringManagement() {
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
    <Layout title="Touring Management | Segue">
      <div className="mt-4 max-w-5xl mx-auto text-2xl text-primary-navy">
        <h1 className="mb-8 text-center">Touring Management</h1>
        <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {links.map((link) => (
            <SwitchBoardItem key={link.title} link={link} />
          ))}
        </ul>
      </div>
    </Layout>
  );
}
