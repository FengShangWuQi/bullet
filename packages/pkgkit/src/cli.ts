import yargs from "yargs";

import { build } from "./build";
import { add } from "./add";

export const cli = () => {
  (async () => {
    const y = yargs
      .scriptName("pkgkit")
      .usage("$0 <action> <pkg>")
      .version()
      .help();

    y.command("build", "pkg build");
    y.command("add", "pkg add");

    const argv = y.argv;
    const action = argv._[0];
    const pkg = argv._[1] as string;

    switch (action) {
      case "build": {
        await build();
        break;
      }
      case "add": {
        await add(pkg);
        break;
      }
    }
  })();
};
