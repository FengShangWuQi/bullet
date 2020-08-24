import path from "path";
import fse from "fs-extra";
import os from "os";

import { ITask } from "./task";

const tbPath = path.join(os.homedir(), ".taskbook", "storage.json");

type IStorageData = Record<string, ITask>;

class Storage {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  getData(): IStorageData {
    if (!fse.pathExistsSync(this.filePath)) {
      return {};
    }

    return fse.readJsonSync(this.filePath);
  }

  setData(data: IStorageData) {
    fse.outputJsonSync(this.filePath, data, { spaces: 4 });
  }
}

export const storage = new Storage(tbPath);
