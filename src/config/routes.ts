const prefix = '/api'

const routes = {
  register: () => `${prefix}/register`,
  login: () => `${prefix}/login`,
  logout: () => `${prefix}/logout`,
  user: () => `${prefix}/user`,
  notes: () => `${prefix}/notes`,
  note: (noteID: string) => `${prefix}/note?${new URLSearchParams({ noteID }).toString()}`,
}

export default routes