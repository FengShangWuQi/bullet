import { outputFile, readdir } from "fs-extra";
import chalk from "chalk";

import pkg from "./package.json";

(async () => {
  const title = `> ## ${pkg.name}`;

  const data = await readdir("./packages");

  const content = data.map(item => `- [${item}](./${item})`).join("\n");

  await outputFile(`${process.cwd()}/README.md`, `${title}\n\n${content}`);

  console.log(chalk.green("success".toUpperCase()), "generate readme");
})();
