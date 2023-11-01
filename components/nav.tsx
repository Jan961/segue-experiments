import { useState, useEffect } from 'react';

import { NavLink } from './navLink';
import { userService } from '../services/user.service';

export { Nav };

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
  }

  // only show nav when logged in
  if (!user) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-nav">
        <NavLink
          href="/"
          exact
          className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
        >
          Home
        </NavLink>

        <a onClick={logout} className="nav-item nav-link">
          Logout
        </a>
      </div>
    </nav>
  );
}
