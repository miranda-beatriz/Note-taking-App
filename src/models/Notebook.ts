// src/models/Notebook.ts
import { Note } from "./Note";

export class Notebook {
  public id: string;
  public name: string;
  public notes: Note[];
  public children: Notebook[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.notes = [];
    this.children = [];
  }

  addNote(note: Note): void {
    this.notes.push(note);
  }

  addChildNotebook(notebook: Notebook): void {
    this.children.push(notebook);
  }
}
