import { createContext, useContext } from 'react';
import { useStorage } from '../hooks/use-storage';
import * as api from '../services/backend';
import { Maybe, Nestable } from '../types';
import { makeSuccessful, Optional } from '../utils/Optional';

interface AuthAPI {
  username: Maybe<string>;
  fullname: Maybe<string>;
  tryFetch: () => Promise<Optional<void>>;
  tryRegister: (user: api.User) => Promise<Optional<void>>;
  tryLogin: (creds: api.UserCredentials) => Promise<Optional<void>>;
  logout: () => void;
}

const AuthContext = createContext<AuthAPI | null>(null);

export function AuthProvider({ children }: Nestable) {
  const [username, setUsername] = useStorage<Maybe<string>>('username', null);
  const [fullname, setFullname] = useStorage<Maybe<string>>('fullname', null);

  const tryFetch = async () => {
    const userOption = await api.user.fetch();

    if (!userOption.success) {
      return userOption;
    }

    setUsername(userOption.value.username);
    setFullname(userOption.value.fullname);

    return makeSuccessful(undefined);
  };

  const tryRegister = async (user: api.User) => {
    const res = await api.user.register(user);

    if (!res.success) {
      return res;
    }

    setUsername(user.username);
    setFullname(user.fullname);

    return makeSuccessful(undefined);
  };

  const tryLogin = async (creds: api.UserCredentials) => {
    const res = await api.user.login(creds);

    if (!res.success) {
      return res;
    }

    const userOption = await api.user.fetch();

    if (!userOption.success) {
      return userOption;
    }

    setUsername(userOption.value.username);
    setFullname(userOption.value.fullname);

    return makeSuccessful(undefined);
  };

  const logout = async () => {
    await api.user.logout();
    setUsername(null);
    setFullname(null);
  };

  const values = {
    username,
    fullname,
    tryFetch,
    tryLogin,
    tryRegister,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext)!;
}
