import { comparator, swap } from "./utils";

export abstract class Heap<T> {
  heapArr: T[];

  constructor(arr: T[]) {
    this.heapArr = [...arr];
  }

  getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2);
  }

  hasParent(childIndex: number): boolean {
    return this.getParentIndex(childIndex) >= 0;
  }

  hasLeftChild(parentIndex: number): boolean {
    return this.getLeftChildIndex(parentIndex) < this.heapArr.length;
  }

  hasRightChild(parentIndex: number): boolean {
    return this.getRightChildIndex(parentIndex) < this.heapArr.length;
  }

  leftChild(parentIndex: number): T {
    return this.heapArr[this.getLeftChildIndex(parentIndex)];
  }

  rightChild(parentIndex: number): T {
    return this.heapArr[this.getRightChildIndex(parentIndex)];
  }

  parent(childIndex: number): T {
    return this.heapArr[this.getParentIndex(childIndex)];
  }

  isEmpty(): boolean {
    return !this.heapArr.length;
  }

  upAdjust(startIndex = this.heapArr.length - 1) {
    let currentIndex = startIndex;

    while (
      this.hasParent(currentIndex) &&
      this.compareFn(this.heapArr[currentIndex], this.parent(currentIndex))
    ) {
      swap(this.heapArr, currentIndex, this.getParentIndex(currentIndex));

      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  downAdjust(startIndex: number, endIndex = this.heapArr.length - 1) {
    let currentIndex = startIndex;
    let nextIndex = 0;

    while (
      this.hasLeftChild(currentIndex) &&
      this.getLeftChildIndex(currentIndex) <= endIndex
    ) {
      if (
        this.hasRightChild(currentIndex) &&
        this.getRightChildIndex(currentIndex) <= endIndex &&
        this.compareFn(
          this.rightChild(currentIndex),
          this.leftChild(currentIndex),
        )
      ) {
        nextIndex = this.getRightChildIndex(currentIndex);
      } else {
        nextIndex = this.getLeftChildIndex(currentIndex);
      }

      if (this.compareFn(this.heapArr[currentIndex], this.heapArr[nextIndex])) {
        break;
      }

      swap(this.heapArr, currentIndex, nextIndex);

      currentIndex = nextIndex;
    }
  }

  sort(visitFn?: () => void): T[] {
    for (let i = this.heapArr.length - 1; i > 0; i--) {
      visitFn?.();

      swap(this.heapArr, 0, i);

      this.downAdjust(0, i - 1);
    }

    return this.heapArr;
  }

  build(visitFn?: () => void): T[] {
    for (let i = 1; i <= this.heapArr.length - 1; i++) {
      visitFn?.();

      this.upAdjust(i);
    }

    return this.heapArr;
  }

  abstract compareFn(a: T, b: T): boolean;
}

export class MinHeap<T> extends Heap<T> {
  compareFn(a: T, b: T): boolean {
    return comparator.lessThanOrEqual(a, b);
  }
}

export class MaxHeap<T> extends Heap<T> {
  // build(visitFn?: () => void): T[] {
  //   for (let i = Math.floor((this.heapArr.length - 2) / 2); i >= 0; i--) {
  //     visitFn?.();

  //     this.downAdjust(i);
  //   }

  //   return this.heapArr;
  // }

  compareFn(a: T, b: T): boolean {
    return comparator.greaterThanOrEqual(a, b);
  }
}
