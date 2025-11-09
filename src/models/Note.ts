// src/models/Note.ts
export class Note {
    public id: string;
    public title: string;
    public content: string;
    public createdAt: Date;
    public updatedAt: Date;
  
    constructor(id: string, title: string, content: string) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    updateContent(newContent: string): void {
      this.content = newContent;
      this.updatedAt = new Date();
    }
  
    updateTitle(newTitle: string): void {
      this.title = newTitle;
      this.updatedAt = new Date();
    }
  }
  