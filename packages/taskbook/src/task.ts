import { Item, IItem } from "./item";

import * as logger from "@fengshangwuqi/logger";

export interface ITask extends IItem {
  status: number;
  priority: number;
}

export enum priorityType {
  hign = 2,
  medium = 1,
  normal = 0,
}

export enum statusType {
  pending = 0,
  done = 1,
}

export class Task extends Item {
  status: number;
  priority: number;

  constructor({ priority, status, ...rest }: ITask) {
    super(rest);
    this.status = status;
    this.priority = priority;
  }
}

export const validatePriority = (priority: any) => {
  if (!Object.values(priorityType).includes(priority)) {
    logger.error("priority illegal");
    process.exit(1);
  }
};

export const validateStatus = (status: any) => {
  if (!Object.values(statusType).includes(status)) {
    logger.error("status illegal");
    process.exit(1);
  }
};
