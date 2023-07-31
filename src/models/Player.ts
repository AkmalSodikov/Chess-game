import {Colors} from "./Colors";
import {Board} from "./Board";


export class Player {
    color: Colors;
    board: Board;


    constructor(color: Colors, board: Board) {
        this.color = color;
        this.board = board;
    }

    isCheckMate():boolean {
        for (let i = 0; i < this.board.cells.length; i++) {
            const row = this.board.cells[i];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                for (let k = 0; k < this.board.cells.length; k++) {
                    const row1 = this.board.cells[k];
                    for (let z = 0; z < row1.length; z++) {
                        const target = row1[z];
                        if (cell?.figure &&
                            !cell.isEnemyByColor(this.color) &&
                            cell.figure?.isLegalMove(target) &&
                            cell.figure?.canMove(target)
                        ) {

                            return false;

                        }
                    }
                }
            }
        }
        for (let i = 0; i < this.board.cells.length; i++) {
            const row = this.board.cells[i];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if ((cell?.figure && !cell.isEnemyByColor(this.color) && (cell.figure?.isCheck || cell.figure.isInCheck()) &&
                cell.figure.swapCounter > 5)){
                    return true;
                } else if (!cell.figure?.isCheck && this.color === "white") {
                    return true;
                } else {
                    continue;
                }

            }
        }
        return false;
    }
}