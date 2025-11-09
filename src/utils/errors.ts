// src/utils/errors.ts
export class NoteNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "NoteNotFoundError";
    }
  }
  
  export class NotebookNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "NotebookNotFoundError";
    }
  }
  
  export class InvalidInputError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InvalidInputError";
    }
  }
  