export const withWrap = () => console.log();

export const isUndefined = (value: any) => value === void 0;

export const clearConsole = () => {
  process.stdout.write(
    process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H",
  );
};
