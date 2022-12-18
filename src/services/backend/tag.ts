import routes from "../../config/routes";
import { makeFailed, makeSuccessful, Optional } from "../../utils/Optional";
import { isTag, Tag } from "./types";

async function getAllTags(): Promise<Optional<Tag[]>> {
  const res = await fetch(routes.tags(), {
    headers: {
      "ngrok-skip-browser-warning": "skip",
    },
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

  const tags = await res.json();

  if (!Array.isArray(tags) || !tags.every(isTag)) {
    return makeFailed("Server returned malformed data");
  }

  return makeSuccessful(tags);
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
  getAll: getAllTags,
  edit: editTag,
  delete: deleteTag,
};
