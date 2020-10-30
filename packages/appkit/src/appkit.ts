import hostedGitInfo from "hosted-git-info";
import { removeSync } from "fs-extra";
import spawn from "cross-spawn";
import { join } from "path";
import child_process from "child_process";
import dotenv from "dotenv";

import { infoLog, successLog, errLog, run } from "./utils";

export const appkit = (
  action: "dev" | "build" | "release" | "new",
  opts: { app?: string; directory?: string; starterRepo?: string },
) => {
  if (action === "new") {
    const { directory, starterRepo } = opts;

    if (directory && starterRepo) {
      let repo = starterRepo;

      const onlyNameRe = /^[\w-]+$/;
      const onlyName = onlyNameRe.test(repo);

      if (onlyName) {
        const userName = getGitConfig("user.name").trim();
        repo = `${userName}/${starterRepo}`;
      }

      const info = hostedGitInfo.fromUrl(repo);

      if (info) {
        const url = info?.ssh({ noCommittish: true });

        infoLog(`Creating new starter from git: ${url}`);

        gitClone(url, directory);

        successLog(`Created starter`);

        const targetDir = join(process.cwd(), directory);

        removeSync(join(targetDir, ".git"));

        useGit(["init"], { cwd: targetDir });
      }
    }
  } else {
    const { app } = opts;
    const pkgPath = join(process.cwd(), "package.json");

    const pkg = require(pkgPath);

    if (!pkg?.appkit?.[action]) {
      errLog(`package.json not exists, or appkit ${action} script not exists`);
      process.exit(1);
    }

    const result = dotenv.config({
      path: join(process.cwd(), app ? `.env.${app}` : ".env"),
    });

    run(pkg.appkit?.[action], {
      ...(app && { APP: app }),
      ...result.parsed,
    });
  }
};

const gitClone = (url: string, directory: string) =>
  useGit(["clone", url, directory, "--depth=1"]);

const getGitConfig = (key: string) => useGit(["config", "--get", key]);

const useGit = (args: string[], opts: child_process.SpawnOptions = {}) => {
  const { stdout } = spawn.sync("git", args, {
    encoding: "utf-8",
    ...opts,
  });

  return stdout;
};
