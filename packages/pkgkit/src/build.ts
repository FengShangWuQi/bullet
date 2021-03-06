import { join, relative } from "path";
import { pathExists, pathExistsSync } from "fs-extra";
import { rollup, RollupOptions, OutputOptions } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

import { usePkg, outputs } from "./pkg";
import { successLog, warnLog } from "./utils";

const getRootPath = (path: string): string => {
  const lernaJSONFile = join(path, "./lerna.json");

  const isLernaJSONExists = pathExistsSync(lernaJSONFile);

  if (!isLernaJSONExists) {
    return getRootPath(join(path, "../"));
  }

  return path;
};

export const build = async () => {
  const cwd = process.cwd();
  const root = getRootPath(cwd);

  const [pkg, setPkg] = usePkg();

  const indexFile = join(cwd, "index.ts");
  const isIndexExists = await pathExists(indexFile);

  if (!isIndexExists) {
    warnLog(`exit ${pkg.name as string}`);
    process.exit(0);
  }

  setPkg({ ...outputs });

  const rollupOpts: RollupOptions[] = [
    {
      input: indexFile,
      output: [
        {
          file: join(cwd, outputs.main),
          format: "cjs",
        },
        {
          file: join(cwd, outputs.module),
          format: "es",
        },
      ],
      external: [...Object.keys(pkg.dependencies || {}), "path"],
      plugins: [
        commonjs(),
        nodeResolve({
          extensions: [".ts", ".js"],
        }),
        json(),
        babel({
          babelrc: false,
          presets: ["@fengshangwuqi/babel-preset"],
          babelHelpers: "runtime",
          exclude: "node_modules/**",
          extensions: [".ts"],
        }),
      ],
    },
    {
      input: join(root, "typings", relative(root, cwd), "index.d.ts"),
      output: [
        {
          file: join(cwd, outputs.types),
          format: "es",
        },
      ],
      plugins: [dts()],
    },
  ];

  await Promise.all(
    rollupOpts.map(opt => {
      return rollup(opt).then(bundle => {
        return Promise.all(
          ([] as OutputOptions[]).concat(opt.output || []).map(bundle.write),
        );
      });
    }),
  ).catch(err => {
    console.error(err);
  });

  successLog(`build ${pkg.name as string}`);
};
