export interface IItem {
  id: string;
  board: string;
  description: string;
}

export class Item {
  readonly id: string;
  board: string;
  description: string;

  constructor(props: IItem) {
    this.id = props.id;
    this.board = props.board;
    this.description = props.description;
  }
}
