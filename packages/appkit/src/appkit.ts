import { pathExists } from "fs-extra";
import execa from "execa";
import { join } from "path";
import dotenv from "dotenv";
import * as logger from "@fengshangwuqi/logger";

export const appkit = async (
  action: "dev" | "build" | "release",
  opts: { app?: string } = {},
) => {
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

    const envsWithAPP = {
      ...(app && { APP: app }),
      ...envs,
    };

    logger.log(envsWithAPP);

    await spawn(pkg.appkit[action], {
      env: {
        ...process.env,
        ...envsWithAPP,
      },
    });

    return;
  }

  await spawn(pkg.appkit[action]);
};

export const spawn = (cmd: string, opts?: execa.Options) => {
  const [script, ...args] = cmd.split(/\s+/);
  return useExeca(script, args, opts);
};

const useExeca = (script: string, args?: string[], opts?: execa.Options) =>
  execa(script, args, { stdio: `inherit`, ...opts });
