import { NewNote, NewTag, Note } from "../services/backend";
import { generateRandomColor } from "../utils";

export const mockTags = {
  cool: { tagID: "1", ...NewTag('cool', '#AFBC9A') },
  awesome: { tagID: "2", ...NewTag('awesome', '#8CACB6') },
  wow: { tagID: "3", ...NewTag('wow', generateRandomColor()) },
  nice: { tagID: "4", ...NewTag('nice', generateRandomColor()) },
  smth: { tagID: "5", ...NewTag('smth', generateRandomColor()) },
} as const;

export const mockNotes: Omit<Note, "noteID">[] = [
  NewNote(
    'school',
    'hahaha i love school '.repeat(48),
    [mockTags.cool, mockTags.awesome],
    new Date(Date.parse('2022-10-01')),
    new Date(Date.parse('2022-10-01'))
  ),
  NewNote(
    'foo',
    'bar',
    [mockTags.cool, mockTags.awesome, mockTags.awesome, mockTags.awesome],
    new Date(Date.parse('2022-09-30')),
    new Date(Date.parse('2022-09-30'))
  ),
  NewNote('something', 'something', [mockTags.nice, mockTags.wow]),
  NewNote('', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
  NewNote('something', 'something'),
];

function NewNoteData(arg0: string, arg1: string, arg2: Omit<import("../services/backend").Tag, "tagID">[], arg3: Date, arg4: Date): Note {
  throw new Error("Function not implemented.");
}
