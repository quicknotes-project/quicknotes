import { makeSuccessful, Optional } from "../utils/Optional";

export interface LoginData {
  fullname: string;
  sessionID: string;
}

export async function tryRegister(username: string, fullname: string, password: string): Promise<Optional<LoginData>> {
  return makeSuccessful({ fullname: 'Ivan', sessionID: '0' })
}

export async function tryLogin(username: string, password: string): Promise<Optional<LoginData>> {
  return makeSuccessful({ fullname: 'Ivan', sessionID: '0' })
}