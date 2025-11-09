// src/cli.ts
import { NotesRepository } from "./repository/NotesRepository";
import {
  InvalidInputError,
  NotebookNotFoundError,
  NoteNotFoundError,
} from "./utils/errors";

export class CLI {
  constructor(private repo: NotesRepository) {}

  async run(args: string[]): Promise<void> {
    const command = args[2];

    try {
      switch (command) {
        case "tree":
          this.repo.printNotebookTree();
          break;
        case "new-notebook": {
          const parentId = args[3] ?? "root";
          const name = args[4] ?? "";
          const nb = await this.repo.createNotebook(parentId, name);
          console.log("Notebook created:", nb);
          break;
        }
        case "new-note": {
          const notebookId = args[3] ?? "root";
          const title = args[4] ?? "";
          const content = args.slice(5).join(" ") || "";
          const note = await this.repo.createNote(notebookId, title, content);
          console.log("Note created:", note);
          break;
        }
        case "open-notebook": {
            const notebookId = args[3];
            if (!notebookId) {
              console.log("Please provide a notebook id.");
              break;
            }
            this.repo.openNotebook(notebookId);
            break;
          }
          
        case "search": {
          const keyword = args[3] ?? "";
          const results = this.repo.searchNotes(keyword);
          console.log(`Found ${results.length} notes for "${keyword}":`);
          results.forEach((n) => {
            console.log(`- ${n.title} (${n.id})`);
          });
          break;
        }
        case "update-note": {
          const noteId = args[3];
          const newContent = args.slice(4).join(" ");
          await this.repo.updateNote(noteId, newContent);
          console.log("Note updated.");
          break;
        }
        case "help":
        default:
          this.printHelp();
          break;
      }
    } catch (err: any) {
      this.handleError(err);
    }
  }

  private printHelp(): void {
    console.log("Notes CLI - Available commands:");
    console.log("  tree                       -> Print notebook tree");
    console.log("  new-notebook <parentId> <name> -> Create a new notebook");
    console.log("  new-note <notebookId> <title> <content...> -> Create a new note");
    console.log("  search <keyword>           -> Search notes by keyword");
    console.log("  update-note <noteId> <newContent...> -> Update an existing note");
    console.log("  help                       -> Show this help");
    console.log("  open-notebook <notebookId>  -> Show contents of a notebook");

  }

  private handleError(err: any): void {
    if (
      err instanceof InvalidInputError ||
      err instanceof NotebookNotFoundError ||
      err instanceof NoteNotFoundError
    ) {
      console.error("Error:", err.message);
    } else {
      console.error("Unexpected error:", err);
    }
  }
}
