import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { isNoteMeta, NoteMeta } from "./types";

export interface FindQueryParams
  extends Record<string, string | string[] | undefined> {
  title?: string;
  tags?: string | string[];
}

function stringifyParams(params: FindQueryParams): string {
  if (!params.title && !params.tags) {
    return "";
  }
  return Object.entries(params)
    .reduce((acc, [key, value]) => {
      const valueStr = Array.isArray(value) ? value.join(",") : value;
      return [...acc, `${key}=${valueStr}`];
    }, [] as string[])
    .join("&");
}

export async function find(
  params: FindQueryParams
): Promise<Optional<NoteMeta[]>> {
  const query = stringifyParams(params);
  console.log(`stringified params into query: ${query}`);
  const res = await fetch(routes.find(query), {
    headers: {
      "ngrok-skip-browser-warning": "skip",
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not logged in");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  const notes = await res.json();

  if (!Array.isArray(notes) || !notes.every(isNoteMeta)) {
    console.log(notes);
    return makeFailed(`Server returned malformed data`);
  }

  return makeSuccessful(notes);
}
