import yargs from "yargs";

import { tb } from "./taskbook";

export const cli = () => {
  const y = yargs
    .scriptName("tb")
    .usage("$0 <cmd> [args]")
    .help()
    .alias("h", "help");

  y.command({
    command: "create",
    describe: "Create Item",
    aliases: "add",
    builder: yargs =>
      yargs.options({
        b: {
          alias: "board",
          type: "string",
          default: "TODO",
          describe: "Set Board. Default TODO",
        },
        m: {
          alias: "description",
          type: "string",
          describe: "Set Description",
        },
        p: {
          alias: "priority",
          type: "number",
          describe: "Set Task Priority",
        },
      }),
    handler: (argv: any) => {
      tb.createItem({
        board: argv.board,
        description: argv.description,
        priority: argv.priority,
      });
    },
  });

  y.command({
    command: "edit [id]",
    describe: "Edit Item",
    aliases: "u",
    builder: yargs =>
      yargs.options({
        b: {
          alias: "board",
          type: "string",
          describe: "Edit Board",
        },
        m: {
          alias: "description",
          type: "string",
          describe: "Edit Description",
        },
        p: {
          alias: "priority",
          type: "number",
          describe: "Edit Task Priority",
        },
        s: {
          alias: "status",
          type: "number",
          describe: "Edit Task Status",
        },
      }),
    handler: (argv: any) => {
      tb.updateItem({
        id: argv.id,
        board: argv.board,
        description: argv.description,
        priority: argv.priority,
        status: argv.status,
      });
    },
  });

  y.command({
    command: "delete [id]",
    describe: "Delete Item",
    aliases: "rm",
    handler: (argv: any) => {
      tb.deleteItem(argv.id);
    },
  });

  y.command({
    command: "clean",
    describe: "Clean done Items",
    builder: yargs =>
      yargs.options({
        b: {
          alias: "board",
          type: "string",
          describe: "clean done item by board",
        },
      }),
    handler: (argv: any) => {
      tb.cleanItems({ board: argv.board });
    },
  });

  y.command({
    command: "clear",
    describe: "Clear Items",
    builder: yargs =>
      yargs.options({
        b: {
          alias: "board",
          type: "string",
          describe: "clear board status and priority",
        },
      }),
    handler: (argv: any) => {
      tb.clearItems({ board: argv.board });
    },
  });

  const argv = y.argv;
  const cmd = argv._[0];

  if (!cmd) {
    tb.displayItemsByBoard();
  }
};
