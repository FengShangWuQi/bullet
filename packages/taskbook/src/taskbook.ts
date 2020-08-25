import chalk from "chalk";
import signale from "signale";

import { storage } from "./storage";
import {
  Task,
  ITask,
  priorityType,
  statusType,
  validatePriority,
  validateStatus,
} from "./task";
import { message, isUndefined, withWrap } from "./utils";

signale.config({ displayLabel: false });

const { log, pending, success } = signale;
const { underline, red, yellow, dim } = chalk;

class Taskbook {
  get data() {
    return storage.getData();
  }

  validateID(id: string) {
    if (!(id && this.data[id])) {
      withWrap();
      message.error(`id ${id} illegal`);
      process.exit(1);
    }
  }

  generateID() {
    const ids = Object.keys(this.data).map(id => Number(id));

    return ids.length === 0 ? 1 : Math.max(...ids) + 1;
  }

  getBoardName(name: string) {
    return `@${name}`.toUpperCase();
  }

  groupByBoard() {
    return Object.values(this.data).reduce((prev, curr) => {
      const boardArr = Object.keys(prev);

      if (boardArr.length !== 0 && boardArr.includes(curr.board)) {
        return {
          ...prev,
          [curr.board]: [...prev[curr.board], curr],
        };
      }

      return {
        ...prev,
        [curr.board]: [curr],
      };
    }, {} as Record<string, ITask[]>);
  }

  createItem({
    board,
    description,
    priority,
  }: {
    board: string;
    description: string;
    priority?: number;
  }) {
    if (!description) {
      withWrap();
      message.error("must have description");
      process.exit(1);
    }
    if (!isUndefined(priority)) {
      validatePriority(priority);
    }

    const item = new Task({
      id: String(this.generateID()),
      board: this.getBoardName(board),
      description,
      priority: priority || priorityType.normal,
      status: statusType.pending,
    });

    storage.setData({ ...this.data, [item.id]: item });

    withWrap();
    message.success(`craete Task ${item.board}-${item.id}`);
  }

  updateItem({
    id,
    board,
    description,
    priority,
    status,
  }: {
    id: string;
    board?: string;
    description?: string;
    priority?: number;
    status?: number;
  }) {
    this.validateID(id);

    if ([board, description, priority, status].every(isUndefined)) {
      withWrap();
      message.error("edit must have one argv.");
      process.exit(1);
    }

    const { [id]: item, ...rest } = this.data;

    if (board) {
      item.board = this.getBoardName(board);
    }
    if (description) {
      item.description = description;
    }
    if (!isUndefined(priority)) {
      validatePriority(priority);
      item.priority = priority as number;
    }
    if (!isUndefined(status)) {
      validateStatus(status);
      item.status = status as number;
    }

    storage.setData({
      ...rest,
      [id]: {
        ...item,
      },
    });

    withWrap();
    message.success(`Edit Task ${item.board}-${id}`);
  }

  deleteItem(ids: string) {
    let data = this.data;

    ids.split(",").forEach(id => {
      this.validateID(id);

      const { [id]: item, ...rest } = data;

      data = rest;

      withWrap();
      message.success(`Delete Task ${item.board}-${id}`);
    });

    storage.setData({
      ...data,
    });
  }

  cleanItems({ board }: { board?: string }) {
    let data = Object.values(this.data);

    if (board) {
      const boardName = this.getBoardName(board);
      data = data.filter(item => item.board === boardName);
    }

    data.forEach(item => {
      if (item.status === 1) {
        this.deleteItem(item.id);
      }
    });
  }

  clearItems({ board }: { board?: string }) {
    let data = Object.values(this.data);

    if (board) {
      const boardName = this.getBoardName(board);
      data = data.filter(item => item.board === boardName);
    }

    data.forEach(item => {
      if (
        item.status !== statusType.pending ||
        item.priority !== priorityType.normal
      ) {
        this.updateItem({
          id: item.id,
          status: statusType.pending,
          priority: priorityType.normal,
        });
      }
    });
  }

  displayBoard(board: string) {
    log({
      prefix: "\n",
      message: underline(board),
    });
  }

  displayItem(item: ITask) {
    const { id, status, description, priority } = item;

    const prefix = " ";
    const suffix = dim(`#${id}`);
    let message = description;

    if (status !== statusType.done) {
      switch (priority) {
        case priorityType.hign: {
          message = red(description);
          break;
        }
        case priorityType.medium: {
          message = yellow(description);
          break;
        }
      }
    }

    const msgObj = {
      prefix,
      message,
      suffix,
    };

    return status === statusType.done ? success(msgObj) : pending(msgObj);
  }

  displayItemsByBoard() {
    const data = this.groupByBoard();

    Object.keys(data)
      .sort()
      .forEach(board => {
        const items = data[board];

        this.displayBoard(board);
        items.forEach(item => this.displayItem(item));
      });

    withWrap();
  }
}

export const tb = new Taskbook();
