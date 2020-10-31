import chalk from "chalk";

export const successLog = (msg: string) =>
  console.log(`${chalk.green("success")} ${msg}`);

export const warnLog = (msg: string) =>
  console.log(`${chalk.yellow("warning")} ${msg}`);

export const infoLog = (msg: string) =>
  console.log(`${chalk.blue("info")} ${msg}`);

export const errLog = (msg: string) =>
  console.log(`${chalk.red("error")} ${msg}`);
