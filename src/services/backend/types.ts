export interface User {
  username: string;
  fullname: string;
  password: string
}

export type UserCreds = Omit<User, 'fullname'>
export type UserData = Omit<User, 'password'>

export function isUserData(value: any): value is UserData {
  return typeof value === 'object' && 'username' in value && 'fullname' in value
}

export interface Tag {
  tagID: string,
  title: string,
  color: string
}

export function NewTag(title: string, color: string): Omit<Tag, 'tagID'> {
  return { title, color };
}

export function isTag(value: any): value is Tag {
  return typeof value === 'object' && 'tagID' in value && 'title' in value && 'color' in value
}

export interface Note {
  noteID: string,
  title: string,
  createdAt: Date,
  modifiedAt: Date,
  tags: Tag[],
  content: string
}

export function isNote(value: any): value is Note {
  return typeof value === 'object' &&
    'title' in value &&
    // 'tags' in value &&
    'createdAt' in value &&
    'modifiedAt' in value &&
    'content' in value
}

export function NewNote(
  title: string,
  content: string,
  tags?: Tag[],
  createdAt?: Date,
  modifiedAt?: Date
): Omit<Note, 'noteID'> {
  return {
    title,
    content,
    tags: tags ?? [],
    createdAt: createdAt ?? new Date(),
    modifiedAt: modifiedAt ?? new Date(),
  };
}

export type NoteMetadata = Omit<Note, 'content'>

export function isNoteMetadata(value: any): value is NoteMetadata {
  return typeof value === 'object' &&
    'noteID' in value &&
    'title' in value &&
    // 'tags' in value &&
    'createdAt' in value &&
    'modifiedAt' in value
}

export type NoteUpdate = Partial<Pick<Note, 'title' | 'tags' | 'content'>>