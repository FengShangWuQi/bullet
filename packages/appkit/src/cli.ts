import yargs from "yargs";

import { appkit } from "./appkit";

export const cli = () => {
  const y = yargs
    .scriptName("appkit")
    .usage("$0 <action> <app>")
    .version()
    .help();

  y.command("new", `new [rootPath] [starterPath]`);
  y.command("dev", "app dev");
  y.command("build", "app build");
  y.command("release", "app release");

  const argv = yargs.argv;
  const action = argv._[0];

  switch (action) {
    case "new":
      appkit(action, {});
      break;
    case "dev":
    case "build":
    case "release":
      appkit(action, { app: argv._[1] });
      break;
    default:
      break;
  }
};

appkit("new", {
  directory: "hello",
  starterRepo: "fengshangwuqi",
});
