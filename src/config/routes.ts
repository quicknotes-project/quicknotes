const prefix = '/api'

const routes = {
  register: () => `${prefix}/register`,
  login: () => `${prefix}/login`,
  logout: () => `${prefix}/logout`,
  user: () => `${prefix}/user`,
  notes: () => `${prefix}/notes`,
  note: (noteID?: string) => noteID
    ? `${prefix}/note?${new URLSearchParams({ noteID }).toString()}`
    : `${prefix}/note`, // при вызове без параметра noteID 
}

export default routes