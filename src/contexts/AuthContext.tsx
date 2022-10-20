/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext, useState } from 'react';
import store from '../store';
import { Maybe, Nestable } from '../types';
import * as AuthService from '../services/AuthService';
import { isSuccessful } from '../utils/Optional';

interface AuthAPI {
  username: Maybe<string>;
  fullname: Maybe<string>;
  // sessionID: Maybe<string>;
  tryLogin: (username: string, password: string) => Promise<boolean>;
  tryRegister: (username: string, fullname: string, password: string) => Promise<boolean>;
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

  const tryLogin = async (username: string, password: string) => {
    const res = await AuthService.tryLogin(username, password);
    if (isSuccessful(res)) {
      saveUsername(username);
      saveFullname(res.value.fullname);
      // saveSessionID(res.value.sessionID);
    }
    return res.success;
  };

  const tryRegister = async (
    username: string,
    fullname: string,
    password: string
  ) => {
    const res = await AuthService.tryRegister(username, fullname, password);
    if (isSuccessful(res)) {
      saveUsername(username);
      saveFullname(res.value.fullname);
      // saveSessionID(res.value.sessionID);
    }
    return res.success;
  };

  const signout = () => {
    unsetUsername();
    unsetFullname();
    // unsetSessionID();
  };

  const values = {
    username,
    fullname,
    // sessionID,
    tryLogin,
    tryRegister,
    signout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext)!;
}
