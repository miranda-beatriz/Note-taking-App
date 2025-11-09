// src/repository/NotesRepository.ts
import { promises as fs } from "fs";
import { join } from "path";
import { Notebook } from "../models/Notebook";
import { Note } from "../models/Note";
import {
  NoteNotFoundError,
  NotebookNotFoundError,
  InvalidInputError,
} from "../utils/errors";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "notes.json");

export interface NotesDataFile {
  rootNotebook: Notebook;
}

export class NotesRepository {
  private rootNotebook: Notebook;

  private constructor(rootNotebook: Notebook) {
    this.rootNotebook = rootNotebook;
  }

  static async load(): Promise<NotesRepository> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });

      const raw = await fs.readFile(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);

      // revive notebooks and notes
      const root = NotesRepository.reviveNotebook(parsed.rootNotebook);
      return new NotesRepository(root);
    } catch (err: any) {
      // if file does not exist, create a default structure
      if (err.code === "ENOENT") {
        const defaultRoot = new Notebook("root", "Root");
        const repo = new NotesRepository(defaultRoot);
        await repo.save();
        return repo;
      }
      throw err;
    }
  }

  private static reviveNotebook(raw: any): Notebook {
    const notebook = new Notebook(raw.id, raw.name);
    notebook.notes = (raw.notes ?? []).map(
      (n: any) => new Note(n.id, n.title, n.content)
    );
    notebook.children = (raw.children ?? []).map((c: any) =>
      NotesRepository.reviveNotebook(c)
    );
    return notebook;
  }

  async save(): Promise<void> {
    const data: NotesDataFile = {
      rootNotebook: this.rootNotebook,
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  getRootNotebook(): Notebook {
    return this.rootNotebook;
  }

  findNotebookById(
    notebookId: string,
    current: Notebook = this.rootNotebook
  ): Notebook | null {
    if (current.id === notebookId) {
      return current;
    }
    for (const child of current.children) {
      const found = this.findNotebookById(notebookId, child);
      if (found) {
        return found;
      }
    }
    return null;
  }

  async createNotebook(parentId: string, name: string): Promise<Notebook> {
    if (!name.trim()) {
      throw new InvalidInputError("Notebook name cannot be empty.");
    }
    const parent = this.findNotebookById(parentId);
    if (!parent) {
      throw new NotebookNotFoundError(`Notebook with id ${parentId} not found.`);
    }
    const newNotebook = new Notebook(
      `notebook-${Date.now()}`,
      name.trim()
    );
    parent.addChildNotebook(newNotebook);
    await this.save();
    return newNotebook;
  }

  async createNote(
    notebookId: string,
    title: string,
    content: string
  ): Promise<Note> {
    if (!title.trim()) {
      throw new InvalidInputError("Note title cannot be empty.");
    }
    const notebook = this.findNotebookById(notebookId);
    if (!notebook) {
      throw new NotebookNotFoundError(
        `Notebook with id ${notebookId} not found.`
      );
    }
    const note = new Note(`note-${Date.now()}`, title.trim(), content);
    notebook.addNote(note);
    await this.save();
    return note;
  }

  getNoteById(
    noteId: string,
    current: Notebook = this.rootNotebook
  ): Note | null {
    for (const note of current.notes) {
      if (note.id === noteId) {
        return note;
      }
    }
    for (const child of current.children) {
      const found = this.getNoteById(noteId, child);
      if (found) {
        return found;
      }
    }
    return null;
  }

  async updateNote(noteId: string, newContent: string): Promise<void> {
    const note = this.getNoteById(noteId);
    if (!note) {
      throw new NoteNotFoundError(`Note with id ${noteId} not found.`);
    }
    note.updateContent(newContent);
    await this.save();
  }

  // recursive tree print
  printNotebookTree(
    current: Notebook = this.rootNotebook,
    level: number = 0
  ): void {
    const indent = "  ".repeat(level);
    console.log(`${indent}- [Notebook] ${current.name} (${current.id})`);
    for (const note of current.notes) {
      console.log(
        `${indent}  * [Note] ${note.title} (${note.id})`
      );
    }
    for (const child of current.children) {
      this.printNotebookTree(child, level + 1);
    }
  }

  openNotebook(notebookId: string): void {
    const notebook = this.findNotebookById(notebookId);
    if (!notebook) {
      console.error(`Notebook with id ${notebookId} not found.`);
      return;
    }
  
    console.log(`\n[Notebook] ${notebook.name} (${notebook.id})`);
    console.log("Notes:");
    if (notebook.notes.length === 0) {
      console.log("  (no notes)");
    } else {
      for (const note of notebook.notes) {
        console.log(`  * ${note.title} (${note.id})`);
      }
    }
  
    console.log("\nChild notebooks:");
    if (notebook.children.length === 0) {
      console.log("  (no sub-notebooks)");
    } else {
      for (const child of notebook.children) {
        console.log(`  - ${child.name} (${child.id})`);
      }
    }
    console.log("");
  }
  

  // recursive search by keyword in title or content
  searchNotes(
    keyword: string,
    current: Notebook = this.rootNotebook,
    results: Note[] = []
  ): Note[] {
    const lower = keyword.toLowerCase();
    for (const note of current.notes) {
      if (
        note.title.toLowerCase().includes(lower) ||
        note.content.toLowerCase().includes(lower)
      ) {
        results.push(note);
      }
    }
    for (const child of current.children) {
      this.searchNotes(lower, child, results);
    }
    return results;
  }
}

