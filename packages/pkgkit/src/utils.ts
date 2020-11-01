import chalk from "chalk";
import execa from "execa";

export const successLog = (msg: string) =>
  console.log(`${chalk.green("success")} ${msg}`);

export const infoLog = (msg: string) =>
  console.log(`${chalk.blue("info")} ${msg}`);

export const warnLog = (msg: string) =>
  console.log(`${chalk.yellow("warn")} ${msg}`);

export const errLog = (msg: string) =>
  console.log(`${chalk.red("error")} ${msg}`);

export const useExeca = (
  script: string,
  args?: string[],
  opts?: execa.Options,
) => execa(script, args, { stdio: `inherit`, ...opts });

export const spawn = (cmd: string, opts?: execa.Options) => {
  const [script, ...args] = cmd.split(/\s+/);
  return useExeca(script, args, opts);
};

export const gitConfig = (key: string) =>
  useExeca("git", ["config", "--get", key], {
    stdio: "pipe",
  });
