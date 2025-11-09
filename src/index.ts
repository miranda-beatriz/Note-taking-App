// src/index.ts
import { NotesRepository } from "./repository/NotesRepository";
import { CLI } from "./cli";

async function main() {
  const repo = await NotesRepository.load();
  const cli = new CLI(repo);
  await cli.run(process.argv);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
