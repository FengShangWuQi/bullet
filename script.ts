import { outputFile, readdir } from "fs-extra";
import * as logger from "@fengshangwuqi/logger";

import pkg from "./package.json";

(async () => {
  const title = `> ## ${pkg.name}`;

  const data = await readdir("./packages");

  const content = data.map(item => `- [${item}](./${item})`).join("\n");

  await outputFile(`${process.cwd()}/README.md`, `${title}\n\n${content}`);

  logger.success("generate readme");
})();
