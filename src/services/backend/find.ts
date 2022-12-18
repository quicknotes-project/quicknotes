import routes, { FindQueryParams } from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { isNoteMeta, NoteMeta } from "./types";

export type { FindQueryParams } from "../../config/routes";

export async function find(
  query: FindQueryParams
): Promise<Optional<NoteMeta[]>> {
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
