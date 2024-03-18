import Layout from 'components/Layout';

export default function index() {
  return (
    <Layout title="System Admin" flush>
      <div className=" flex flex-col justify-center items-center h-full">
        <h1 className="text-4xl font-bold  text-primary-pink">System Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-20">
          <div className="bg-primary-pink w-[180px] h-[95px] flex justify-center items-center px-5 font-bold rounded-md shadow-md ">
            <p className="text-white text-center">
              Company <br /> Information
            </p>
          </div>
          <div className="bg-primary-pink w-[180px] h-[95px] flex justify-center items-center px-5 font-bold rounded-md shadow-md">
            <p className="text-white text-center">Users</p>
          </div>
          <div className="bg-primary-pink w-[180px] h-[95px] flex justify-center items-center px-5 font-bold rounded-md shadow-md">
            <p className="text-white text-center">
              Payment
              <br /> Details
            </p>
          </div>
          <div className="bg-primary-pink w-[180px] h-[95px] flex justify-center items-center px-5 font-bold rounded-md shadow-md">
            <p className="text-white text-center">
              Account <br />
              Preferences
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
