import Layout from 'components/Layout';
import Tiles from 'components/global/Tiles';

export default function index() {
  const links = [
    {
      title: 'Company Information',
      route: '/company-information',
      color: 'bg-primary-pink',
      textClass: 'whitespace-pre-wrap',
    },
    {
      title: 'Users',
      route: '/users',
      color: 'bg-primary-pink',
    },
    {
      title: 'Payment Details',
      route: '/payment-details',
      color: 'bg-primary-pink',
      textClass: 'whitespace-pre-wrap w-[60px]',
    },
    {
      title: 'Account Preferences',
      route: '/account-preferences',
      color: 'bg-primary-pink',
      textClass: 'whitespace-pre-wrap w-[80px]',
    },
  ];
  return (
    <Layout title="System Admin | Segue" flush>
      <div className=" flex flex-col justify-center items-center h-full  ">
        <h1 className="text-4xl font-bold  text-primary-pink">System Admin</h1>
        <ul
          data-testid="system-admin-tiles"
          role="list"
          className="grid grid-cols-1 gap-4 w-fit sm:grid-cols-2 md:grid-cols-4 mt-20 mx-auto"
        >
          {links.map((link) => (
            <Tiles key={link.route} link={link} />
          ))}
        </ul>
      </div>
    </Layout>
  );
}
