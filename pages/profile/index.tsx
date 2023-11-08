import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';

import ProfileMessage from '../../components/profile/profile-message';
import UpdateProfile from '../../components/profile/updateProfile';

export default function Profile() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // TODO: Validate user session Agains frontend changed Page can only load if a session is active for this user
    // this account and this session id
    const userid = sessionStorage.getItem('UserId');
    const account = sessionStorage.getItem('accountId');

    fetch('/api/account/read/users/accountUsers/' + account)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <>
      <Layout title="Account | Segue">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
          <span className="block xl:inline">Profile</span>
        </h1>

        <ProfileMessage></ProfileMessage>
        <UpdateProfile></UpdateProfile>
      </Layout>
    </>
  );
}
