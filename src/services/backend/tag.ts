import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { Tag } from "./types";

async function addTag(noteID: string, title: string): Promise<Optional<void>> {
  const res = await fetch(routes.tag(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip",
    },
    body: JSON.stringify({ noteID, title }),
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not logged in");
      case 403:
        return makeFailed("Invalid noteID supplied");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(void 0);
}

async function editTag(update: Tag): Promise<Optional<void>> {
  const res = await fetch(routes.tag(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip",
    },
    body: JSON.stringify(update),
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not logged in");
      case 403:
        return makeFailed("Invalid tagID supplied");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(void 0);
}

async function deleteTag(tagID: string): Promise<Optional<void>> {
  const res = await fetch(routes.tag(tagID), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "skip",
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        return makeFailed("Not logged in");
      case 403:
        return makeFailed("Invalid tagID supplied");
      default:
        return makeFailed(`Unknown error (status code ${res.status})`);
    }
  }

  return makeSuccessful(void 0);
}

export const tag = {
  add: addTag,
  edit: editTag,
  delete: deleteTag,
};
