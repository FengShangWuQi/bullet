import yargs from "yargs";

import { appkit } from "./appkit";

export const cli = () => {
  (async () => {
    const y = yargs
      .scriptName("appkit")
      .usage("$0 <action> <app>")
      .version()
      .help();

    y.command("dev", "app dev");
    y.command("build", "app build");
    y.command("release", "app release");

    const argv = yargs.argv;
    const action = argv._[0];

    switch (action) {
      case "dev":
      case "build":
      case "release":
        await appkit(action, { app: argv._[1] as string });
        break;
      default:
        break;
    }
  })();
};
