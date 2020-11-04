import hostedGitInfo from "hosted-git-info";
import { remove, pathExists, writeJson, outputFile } from "fs-extra";
import execa from "execa";
import { join } from "path";
import dotenv from "dotenv";
import * as logger from "@fengshangwuqi/logger";

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
          logger.warn(`remove ${targetDir}`);
        }

        logger.info(`Creating ${directory} from git: ${url}`);
        await gitClone([url, targetDir]);

        logger.success(`Created ${directory}`);

        await remove(join(targetDir, ".git"));
        await useExeca("git", ["init"], { cwd: targetDir });

        const pkgPath = join(targetDir, "package.json");
        const isPkgExists = await pathExists(pkgPath);

        if (isPkgExists) {
          const pkg = require(pkgPath);

          await writeJson(
            pkgPath,
            { ...pkg, name: directory },
            { spaces: "  " },
          );
        }

        const docPath = join(targetDir, "README.md");
        const isDocExists = await pathExists(docPath);

        if (isDocExists) {
          const content = `> ## ${directory}`;

          await outputFile(docPath, content);
        }
      }
    }
  } else {
    const { app } = opts;

    const pkgPath = join(process.cwd(), "package.json");
    const envPath = join(process.cwd(), app ? `.env.${app}` : ".env");

    const pkg = require(pkgPath);

    if (!pkg?.appkit?.[action]) {
      logger.error(
        `package.json not exists, or appkit ${action} script not exists`,
      );
      return;
    }

    const isEnvExists = await pathExists(envPath);

    if (isEnvExists) {
      const { parsed: envs } = dotenv.config({
        path: envPath,
      });

      const finalEnvs = {
        APP: app,
        ...process.env,
        ...envs,
      };

      logger.log(finalEnvs);

      await spawn(pkg.appkit[action], {
        env: finalEnvs,
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
