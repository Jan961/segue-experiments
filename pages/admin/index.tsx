import Layout from 'components/Layout';
import { SwitchBoardItem } from 'components/global/SwitchBoardItem';

export default function index() {
  const links = [
    {
      title: 'Company Information',
      route: '/company-information',
      color: 'bg-primary-pink',
      textClass: '!mt-0 whitespace-pre-wrap w-[80px]',
      boxClass: 'max-h-[95px] max-w-[180px]',
    },
    {
      title: 'Users',
      route: '/users',
      color: 'bg-primary-pink',
      boxClass: 'max-h-[95px] max-w-[180px]',
    },
    {
      title: 'Payment Details',
      route: '/payment-details',
      color: 'bg-primary-pink',
      boxClass: 'max-h-[95px] max-w-[180px]',
      textClass: '!mt-0 whitespace-pre-wrap w-[80px]',
    },
    {
      title: 'Account Preferences',
      route: '/account-preferences',
      color: 'bg-primary-pink',
      boxClass: 'max-h-[95px] max-w-[180px]',
      textClass: '!mt-0 whitespace-pre-wrap w-[85px]',
    },
  ];
  return (
    <Layout title="System Admin | Segue" flush>
      <div className=" flex flex-col justify-center items-center h-full  ">
        <h1 className="text-4xl font-bold  text-primary-pink">System Admin</h1>
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
