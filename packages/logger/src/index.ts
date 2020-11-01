import chalk from "chalk";

enum LogType {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  INFO = "INFO",
  ERROR = "ERROR",
}

type ILogType = keyof typeof LogType;

class Logger {
  msg: any;
  static instance: null | Logger;

  logTypeStr = {
    [LogType.SUCCESS]: chalk.green(LogType.SUCCESS),
    [LogType.WARNING]: chalk.yellow(LogType.WARNING),
    [LogType.INFO]: chalk.blue(LogType.INFO),
    [LogType.ERROR]: chalk.red(LogType.ERROR),
  };

  constructor(msg: any) {
    this.msg = msg;
  }

  withType(type: ILogType) {
    this.msg = `${this.logTypeStr[type].toLowerCase()} ${this.msg as string}`;
    return this;
  }

  output() {
    console.log(this.msg);
  }
}

export const log = (msg: any) => new Logger(msg).output();

export const info = (msg: any) =>
  new Logger(msg).withType(LogType.INFO).output();

export const success = (msg: any) =>
  new Logger(msg).withType(LogType.SUCCESS).output();

export const warn = (msg: any) =>
  new Logger(msg).withType(LogType.WARNING).output();

export const error = (msg: any) =>
  new Logger(msg).withType(LogType.ERROR).output();
