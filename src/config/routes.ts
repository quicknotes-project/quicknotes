const prefix = "/api";

export interface FindQueryParams
  extends Record<string, undefined | string | string[]> {
  title?: string;
  tags?: string | string[];
}

function stringifyParams(
  params: Record<string, undefined | string | string[]>
) {
  const pairs = Object.entries(params).filter(
    ([, value]) => typeof value !== "undefined"
  ) as [string, string | string[]][];
  if (pairs.length === 0) return "";
  const usp = new URLSearchParams();
  pairs.forEach(([key, value]) => {
    usp.set(key, typeof value === "string" ? value : value.join(","));
  });
  return "?" + usp.toString();
}

const routes = {
  register: () => `${prefix}/register`,
  login: () => `${prefix}/login`,
  logout: () => `${prefix}/logout`,
  user: () => `${prefix}/user`,
  notes: () => `${prefix}/notes`,
  note: (noteID?: string) =>
    noteID
      ? `${prefix}/note?${new URLSearchParams({ noteID }).toString()}`
      : `${prefix}/note`, // при вызове без параметра noteID
  notetag: () => `${prefix}/notetag`,
  tags: () => `${prefix}/tags`,
  tag: (tagID?: string) =>
    tagID
      ? `${prefix}/tag?${new URLSearchParams({ tagID }).toString()}`
      : `${prefix}/tag`,
  find: (params: FindQueryParams) => {
    return `${prefix}/find${stringifyParams(params)}`;
  },
};

export default routes;
