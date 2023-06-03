import { Component } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

const displayPieces: Record<string, string> = {
  blackpawn: '♟',
  blackbishop: '♝',
  blackknight: '♞',
  blackrook: '♜',
  blackqueen: '♛',
  blackking: '♚',
  whitepawn: '♙',
  whitebishop: '♗',
  whiteknight: '♘',
  whiterook: '♖',
  whitequeen: '♕',
  whiteking: '♔',
};

interface Position {
  row: number;
  col: number;
}

interface Piece {
  type: string;
  color: 'white' | 'black';
  // board: Cell[][];
  // validMove(row: number, col: number): boolean;
}
interface Cell {
  piece?: Piece;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'Game';

  sizeBoard: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

  board!: Cell[][];
  ngOnInit(): void {
    this.board = this.createBoard();
  }

  displayPiece(row: number, col: number): string {
    const p = this.board[row][col].piece;
    return p ? displayPieces[`${p?.color}${p?.type}`] : '';
  }

  getPieceColor(row: number, col: number): 'white' | 'black' | undefined {
    return this.board[row][col].piece?.color;
  }

  createBoard(): Cell[][] {
    const board: Cell[][] = [];
    for (let i = 0; i < 8; i++) {
      board.push([]);
      for (let j = 0; j < 8; j++) {
        const cell: Cell = {};
        cell.piece = this.getStartingPiece(i, j, board);
        board[i].push(cell);
      }
    }
    return board;
  }

  getStartingPiece(row: number, col: number, board: Cell[][]) {
    const color = row <= 1 ? 'black' : 'white';

    if (row === 1 || row === 6) {
      return this.pawn(board, color);
    }

    if (row === 0 || row === 7) {
      switch (col) {
        case 0:
        case 7:
          return this.rook(board, color);
        case 1:
        case 6:
          return this.kinght(board, color);
        case 2:
        case 5:
          return this.bishop(board, color);
        case 3:
          return row === 0 ? this.queen(board, color) : this.king(board, color);
        case 4:
          return row === 0 ? this.king(board, color) : this.queen(board, color);
      }
    }
    return undefined;
  }

  pawn(board: Cell[][], color: 'white' | 'black'): Piece {
    return {
      type: 'pawn',
      color,
    };
  }
  queen(board: Cell[][], color: 'white' | 'black'): Piece {
    return {
      type: 'queen',
      color,
    };
  }
  king(board: Cell[][], color: 'white' | 'black'): Piece {
    return {
      type: 'king',
      color,
    };
  }
  kinght(board: Cell[][], color: 'white' | 'black'): Piece {
    return {
      type: 'knight',
      color,
    };
  }
  rook(board: Cell[][], color: 'white' | 'black'): Piece {
    return {
      type: 'rook',
      color,
    };
  }
  bishop(board: Cell[][], color: 'white' | 'black'): Piece {
    return {
      type: 'bishop',
      color,
    };
  }

  validMove(
    oldRow: number,
    oldCol: number,
    newRow: number,
    newCol: number
  ): boolean {
    // const moveDirection = color === 'white' ? 1 : -1;
    const piece = this.board[oldRow][oldCol].piece;

    // switch (piece?.type) {
    //   case 'pawn':
    //     const moveDirection = piece.color === 'white' ? 1 : -1;
    //     return newRow === oldRow + moveDirection && newCol === oldCol;
    //   default:
    //     return false;
    // }
    switch (piece?.type) {
      case 'pawn':
        const moveDirection = piece.color === 'white' ? 1 : -1;
        return (
          newRow === oldRow + moveDirection &&
          newCol === oldCol ||
          (newRow === oldRow + moveDirection * 2 && oldRow === 1 && piece.color === 'white') ||
          (newRow === oldRow - moveDirection * 2 && oldRow === 6 && piece.color === 'black') ||
          (newCol !== oldCol && (newRow === oldRow + moveDirection || newRow === oldRow - moveDirection) && this.board[newRow][newCol].piece === null)
        );
      case 'rook':
        return (newRow === oldRow || newCol === oldCol);
      case 'bishop':
        return Math.abs(newRow - oldRow) === Math.abs(newCol - oldCol);
      case 'knight':
        return (newRow === oldRow + 2 && newCol === oldCol + 1) ||
          (newRow === oldRow + 2 && newCol === oldCol - 1) ||
          (newRow === oldRow - 2 && newCol === oldCol + 1) ||
          (newRow === oldRow - 2 && newCol === oldCol - 1) ||
          (newRow === oldRow + 1 && newCol === oldCol + 2) ||
          (newRow === oldRow + 1 && newCol === oldCol - 2) ||
          (newRow === oldRow - 1 && newCol === oldCol + 2) ||
          (newRow === oldRow - 1 && newCol === oldCol - 2);
      case 'queen':
        return (newRow === oldRow || newCol === oldCol) || Math.abs(newRow - oldRow) === Math.abs(newCol - oldCol);
      case 'king':
        return (newRow === oldRow + 1 || newRow === oldRow - 1 || newRow === oldRow) && (newCol === oldCol + 1 || newCol === oldCol - 1 || newCol === oldCol);
      default:
        return false;
    }
  }

  move(event: CdkDragDrop<any, Position, Position>) {
    const oldPos = event.item.data;
    const newPos = event.container.data;

    if (this.validMove(oldPos.row, oldPos.col, newPos.row, newPos.col)) {
      const piece = this.board[oldPos.row][oldPos.col];
      this.board[oldPos.row][oldPos.col] = {};
      this.board[newPos.row][newPos.col] = piece;
      
    }
  }
}
