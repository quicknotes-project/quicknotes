import { createContext, useContext, useState } from 'react';
import store from '../store';
import * as api from '../services/backend';
import { Maybe, Nestable } from '../types';
import { isSuccessful } from '../utils/Optional';

interface AuthAPI {
  username: Maybe<string>;
  fullname: Maybe<string>;
  tryLogin: (creds: api.UserCreds) => Promise<boolean>;
  tryRegister: (user: api.User) => Promise<boolean>;
  signout: () => void;
}

const AuthContext = createContext<AuthAPI | null>(null);

export function AuthProvider({ children }: Nestable) {
  const [username, setUser] = useState(store.get('username'));

  const saveUsername = (value: string) => {
    store.set('username', value);
    setUser(value);
  };

  const unsetUsername = () => {
    store.remove('username');
    setUser(null);
  };

  const [fullname, setFullname] = useState(store.get('fullname'));

  const saveFullname = (value: string) => {
    store.set('fullname', value);
    setFullname(value);
  };

  const unsetFullname = () => {
    store.remove('fullname');
    setFullname(null);
  };

  const tryRegister = async (user: api.User) => {
    const status = await api.register(user);
    if (status === 200) {
      saveUsername(user.username);
      saveFullname(user.fullname);
    }
    return status === 200;
  };

  const tryLogin = async (creds: api.UserCreds) => {
    const status = await api.login(creds);
    if (status === 200) {
      const userOption = await api.user.fetch()
      if (!isSuccessful(userOption)) {
        return false
      }
      saveUsername(userOption.value.username);
      saveFullname(userOption.value.fullname);
    }
    return status === 200;
  };

  const signout = () => {
    unsetUsername();
    unsetFullname();
  };

  const values = {
    username,
    fullname,
    tryLogin,
    tryRegister,
    signout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext)!;
}
