import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { safeJsonParse } from 'utils';
import { fetchWrapper } from '../helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && safeJsonParse(localStorage.getItem('user')));
export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
};

function login(email, password) {
  return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password }).then((user) => {
    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    userSubject.next(user);
    // NOTE: Can only create session if the Concurrent Session Count
    // TODO: Create session in Session Table
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('userId', user.userId);
    sessionStorage.setItem('accountId', user.accountId);
    return user;
  });
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page

  // TODO:  Delete Session in session Table
  localStorage.removeItem('user');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('accountId');

  userSubject.next(null);
  Router.push('/auth/sign-in');
}

function register(user) {
  return fetchWrapper.post(`${baseUrl}/register`, user);
}

function getAll() {
  return fetchWrapper.get(baseUrl);
}

function getById(id) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id, params) {
  return fetchWrapper.put(`${baseUrl}/${id}`, params).then((x) => {
    // update stored user if the logged in user updated their own record
    if (id === userSubject.value.id) {
      // update local storage
      const user = { ...userSubject.value, ...params };
      localStorage.setItem('user', JSON.stringify(user));

      // publish updated user to subscribers
      userSubject.next(user);
    }
    return x;
  });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
  return fetchWrapper.delete(`${baseUrl}/${id}`);
}

export function safeParseJson<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}
