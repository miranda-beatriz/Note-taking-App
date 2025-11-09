# Overview

This project is a command-line Note-Taking App written in TypeScript.  
The goal of this software is to demonstrate practical understanding of TypeScript syntax, including classes, inheritance, recursion, asynchronous functions, and exception handling.

The program allows users to create and organize notebooks and notes using only the terminal.  
It supports commands to create, view, search, and update notes, while saving all data persistently in a local JSON file.

My purpose in writing this software was to strengthen my skills as a software engineer by learning how to:

- Design object-oriented programs in TypeScript
- Apply recursion to traverse hierarchical data structures
- Implement custom error handling and a command-line interface

[Software Demo Video](http://youtube.link.goes.here)

# Development Environment

- Editor: Visual Studio Code
- Runtime: Node.js
- Language: TypeScript
- Main Libraries:
  - `ts-node` – to run TypeScript directly in the terminal
  - `@types/node` – for Node.js type definitions
  - `fs/promises` – for asynchronous file read/write

The project was executed using the Node.js environment with TypeScript configured via `tsconfig.json`.

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [Node.js File System (fs) Module Docs](https://nodejs.org/api/fs.html)
- [MDN – JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [Stack Overflow – TypeScript Import Paths Explained](https://stackoverflow.com/questions/56792407/typescript-cannot-find-module)
- [Youtube video from Web Dev Simplified channel] (https://www.youtube.com/watch?v=jBmrduvKl5w&list=PLZlA0Gpn_vH_z2fqIg50_POJrUkJgBu7g)

# Future Work

- Add the ability to delete notebooks and notes directly through CLI
- Implement an interactive menu using the `inquirer` library
- Allow users to search by notebook name (not only ID)
- Improve the data structure to support tags and note prioritization
- Create a web interface version using React + TypeScript
