import hostedGitInfo from "hosted-git-info";
import { remove, pathExists } from "fs-extra";
import execa from "execa";
import { join } from "path";
import dotenv from "dotenv";

import { warnLog, infoLog, successLog, errLog } from "./utils";

export const appkit = async (
  action: "dev" | "build" | "release" | "new",
  opts: { app?: string; directory?: string; starterRepo?: string } = {},
) => {
  if (action === "new") {
    const { directory, starterRepo } = opts;

    if (directory && starterRepo) {
      let repo = starterRepo;

      const onlyNameRe = /^[\w-]+$/;
      const onlyName = onlyNameRe.test(repo);

      if (onlyName) {
        const { stdout: userName } = await gitConfig("user.name");
        repo = `${userName}/${starterRepo}`;
      }

      const info = hostedGitInfo.fromUrl(repo);

      if (info) {
        const url = info?.ssh({ noCommittish: true });
        const targetDir = join(process.cwd(), directory);

        const isTargetDirExists = await pathExists(targetDir);

        if (isTargetDirExists) {
          await remove(targetDir);
          warnLog(`remove ${targetDir}`);
        }

        infoLog(`Creating ${directory} from git: ${url}`);

        await gitClone([url, targetDir]);

        successLog(`Created ${directory}`);

        await remove(join(targetDir, ".git"));

        await useExeca("git", ["init"], { cwd: targetDir });
      }
    }
  } else {
    const { app } = opts;

    const pkgPath = join(process.cwd(), "package.json");
    const envPath = join(process.cwd(), app ? `.env.${app}` : ".env");

    const pkg = require(pkgPath);

    if (!pkg?.appkit?.[action]) {
      errLog(`package.json not exists, or appkit ${action} script not exists`);
      return;
    }

    const isEnvExists = await pathExists(envPath);

    if (isEnvExists) {
      const { parsed: envs } = dotenv.config({
        path: envPath,
      });

      console.log(envs);

      await spawn(pkg.appkit[action], {
        env: {
          ...process.env,
          ...envs,
        },
      });

      return;
    }

    await spawn(pkg.appkit[action]);
  }
};

const gitClone = (args: string[]) =>
  useExeca("git", ["clone", ...args, "--depth=1"]);

const gitConfig = (key: string) =>
  useExeca("git", ["config", "--get", key], {
    stdio: "pipe",
  });

export const spawn = (cmd: string, opts?: execa.Options) => {
  const [script, ...args] = cmd.split(/\s+/);
  return useExeca(script, args, opts);
};

const useExeca = (script: string, args?: string[], opts?: execa.Options) =>
  execa(script, args, { stdio: `inherit`, ...opts });
