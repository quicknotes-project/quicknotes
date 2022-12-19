import { createContext, useContext } from "react";
import { useStorage } from "../hooks/use-storage";
import * as api from "../services/backend";
import { Maybe, Nestable } from "../types";
import { makeSuccessful, Optional } from "../utils/Optional";

interface AuthAPI {
  username: Maybe<string>;
  fullname: Maybe<string>;
  tryFetch: () => Promise<Optional<void>>;
  tryRegister: (user: api.User) => Promise<Optional<void>>;
  tryLogin: (creds: api.UserCredentials) => Promise<Optional<void>>;
  tryUpdateUser: (updates: Partial<api.User>) => Promise<Optional<void>>;
  logout: () => void;
}

const AuthContext = createContext<AuthAPI | null>(null);

export function AuthProvider({ children }: Nestable) {
  const [username, setUsername] = useStorage<Maybe<string>>("username", null);
  const [fullname, setFullname] = useStorage<Maybe<string>>("fullname", null);

  const tryFetch = async (): Promise<Optional<void>> => {
    const userOption = await api.user.fetch();

    if (!userOption.success) {
      return userOption;
    }

    setUsername(userOption.value.username);
    setFullname(userOption.value.fullname);

    return makeSuccessful(void 0);
  };

  const tryRegister = async (user: api.User): Promise<Optional<void>> => {
    return api.user.register(user);
  };

  const tryLogin = async (
    creds: api.UserCredentials
  ): Promise<Optional<void>> => {
    const res = await api.user.login(creds);

    if (!res.success) {
      return res;
    }

    return tryFetch();
  };

  const logout = async (): Promise<void> => {
    await api.user.logout();
    setUsername(null);
    setFullname(null);
  };

  const tryUpdateUser = async (
    updates: Partial<api.User>
  ): Promise<Optional<void>> => {
    const res = await api.user.update(updates);

    if (!res.success) {
      return res;
    }

    return tryFetch();
  };

  const values = {
    username,
    fullname,
    tryFetch,
    tryLogin,
    tryRegister,
    tryUpdateUser,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext)!;
}
