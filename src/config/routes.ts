const prefix = "/api";

export interface FindQueryParams {
  title?: string;
  tags?: string | string[];
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
  find: ({ title, tags }: FindQueryParams) => {
    if (!title && !tags) {
      return `${prefix}/find`;
    }
    const params = new URLSearchParams();
    if (title) {
      params.set("title", title);
    }
    if (tags) {
      const tagsString = typeof tags === "string" ? tags : tags?.join(",");
      params.set("tags", tagsString);
    }
    return `${prefix}/find?${params.toString()}`;
  },
};

export default routes;
