import { WritableKeys } from "../../types";

export interface UserBase {
  username: string;
}

export interface UserCredentials extends UserBase {
  password: string;
}

export interface UserNames extends UserBase {
  fullname: string;
}

export interface User extends UserCredentials, UserNames {}

export function isUserNames(value: any): value is UserNames {
  return (
    typeof value === "object" &&
    "username" in value &&
    typeof value.username === "string" &&
    "fullname" in value &&
    typeof value.fullname === "string"
  );
}

export interface Tag {
  tagID: string;
  title: string;
}

// export function NewTag(title: string): Omit<Tag, "tagID"> {
//   return { title };
// }

export function isTag(value: any): value is Tag {
  return typeof value === "object" && "tagID" in value && "title" in value;
}

export interface NoteMeta {
  noteID: string;
  title: string;
  readonly createdAt: string;
  readonly modifiedAt: string;
}

export interface Tagged {
  readonly tags: Tag[];
}

export interface Note extends NoteMeta, Tagged {
  content: string;
}

export type NoteUpdate = Partial<Pick<Note, WritableKeys<Note>>>;

export function isNote(value: any): value is Note {
  return (
    typeof value === "object" &&
    "title" in value &&
    "tags" in value &&
    "createdAt" in value &&
    "modifiedAt" in value &&
    "content" in value
  );
}

// function dateToString(date: Date): string {
//   return `${date.getFullYear}-${date.getMonth}-${date.getDate} ${date.getHours}:${date.getMinutes}:${date.getSeconds}`;
// }

// export function NewNote(
//   title: string,
//   content: string,
//   tags?: Tag[],
//   createdAt?: string,
//   modifiedAt?: string
// ): Omit<Note, "noteID"> {
//   return {
//     title,
//     content,
//     tags: tags ?? [],
//     createdAt: createdAt ?? dateToString(new Date()),
//     modifiedAt: modifiedAt ?? dateToString(new Date()),
//   };
// }

export function isNoteMeta(value: any): value is NoteMeta {
  return (
    typeof value === "object" &&
    "noteID" in value &&
    "title" in value &&
    "createdAt" in value &&
    "modifiedAt" in value
  );
}
