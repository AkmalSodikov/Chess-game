import {Colors} from "./Colors";
import {Board} from "./Board";
import {Figure, FigureNames} from "./figures/Figure";
import {Queen} from "./figures/Queen";

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null;
    board: Board;
    available: boolean; // Can move
    id: number; // For react keys

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.board = board;
        this.figure = figure;
        this.available = false;
        this.id = Math.random();
    }



    setFigure(figure: Figure) {
        this.figure = figure;
        this.figure.cell = this;
    }

    addLostFigure(figure: Figure) {
        figure.color === Colors.BLACK
        ? this.board.lostBlackFigure.push(figure)
        : this.board.lostWhiteFigure.push(figure)

    }




    moveFigure(target: Cell) {
        if (this.figure?.possibleMoves) {
            this.figure.possibleMoves = []
        }

        // pawn promotion
        if (this.figure?.canMove(target) &&
            this.figure?.name === FigureNames.PAWN
            && (target.y === 7 || target.y === 0 )) {
            if (target.figure) {
                this.addLostFigure(target.figure)
            }

            new Queen(this.figure?.color, this.board.getCell(target.x, target.y))
            this.figure = null;

        }
        // en passant
        if (
            this.x < target.x &&
            this.figure?.enPassantRight?.figure &&
            this.figure?.enPassantRight?.figure?.name === FigureNames.PAWN &&
            this.figure?.enPassantRight.figure?.moveCounter === 1 &&
            this.figure?.enPassantRight?.isEnemy(this)) {

            if (this.figure && this.figure?.canMove(target)) {
                this.figure?.moveFigure(target);

                if (target.x === this.figure?.enPassantRight.x) {
                    this.addLostFigure(this.figure.enPassantRight.figure)
                }
                target.setFigure(this.figure)

                this.figure = null;
            }
             if (this.y + 1 === 5) {
                 this.board.getCell(target.x, Math.abs((target.y - 1) % 8)).figure = null;

             } else {
                 this.board.getCell(target.x, Math.abs((target.y + 1) % 8)).figure = null;
             }
        }
        if (this.x > target.x &&
            this.figure?.enPassantLeft?.figure &&
            this.figure?.enPassantLeft?.figure?.name === FigureNames.PAWN &&
            this.figure?.enPassantLeft.figure?.moveCounter === 1 &&
            this.figure?.enPassantLeft?.isEnemy(this)) {

            if (this.figure && this.figure?.canMove(target)) {
                this.figure?.moveFigure(target);

                if (target.x === this.figure?.enPassantLeft.x) {
                    this.addLostFigure(this.figure.enPassantLeft.figure)
                }
                target.setFigure(this.figure)

                this.figure = null;
            }
            if (this.y + 1 === 5) {
                this.board.getCell(target.x, Math.abs((target.y - 1) % 8)).figure = null;
            } else {
                this.board.getCell(target.x, Math.abs((target.y + 1) % 8)).figure = null;
            }


        }

        // short castle
        if (this.figure?.name === FigureNames.KING &&
            this.figure?.canCastle &&
            this.figure?.canMove(target) &&
            target?.isEmpty() &&
            this.board.getCell(target.x + 1, target.y)?.figure?.canCastle &&
            this.isEmptyHorizontal(target)
            ) {
            this.board.getCell(Math.abs(target.x + 1 % 8), target.y)?.moveFigure(this.board.getCell(target.x - 1 , target.y));
            this?.figure?.moveFigure(target);
            target?.setFigure(this?.figure);
            this.figure = null;
        }

        // long castle
        if (this.isEmptyHorizontal(target) &&
            this.figure?.name === FigureNames.KING &&
            this.figure?.canCastle &&
            this.figure?.canMove(target) &&
            this.board.getCell(target.x - 2, target.y)?.figure?.canCastle) {
            this.board.getCell(target.x - 2, target.y)?.moveFigure(this.board.getCell(target.x + 1, target.y));
            this?.figure?.moveFigure(target);
            target?.setFigure(this?.figure);
            this.figure = null;
        }

        // movement
        if (this.figure && this.figure?.canMove(target)) {
            this.figure?.moveFigure(target);
            if (target.figure) {
                this.addLostFigure(target.figure)
            }
            target?.setFigure(this?.figure)
            this.figure = null;
        }
    }

    isEmpty(): boolean {
        return this.figure === null;
    }

    isEnemy(target: Cell) : boolean {
        if (target?.figure) {
        return this.figure?.color !== target.figure.color;
        }
        return false;
    }

    isEnemyByColor(color:Colors): boolean {
        if (this.figure?.color !== color) {
            return true;
        }
        return false;
    }

    isEmptyVertical(target: Cell) : boolean {
        if (this.x !== target.x) {
            return false;
        }
        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++) {
            if (!this.board.getCell(this.x, y).isEmpty()) {
                return false;
            }
        }
        return true;
    }



    isEmptyHorizontal(target: Cell) : boolean {
        if (this.y !== target.y) {
            return false;
        }

        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);

        for (let x = min + 1; x < max; x++) {

            if (!this.board.getCell(x, this.y).isEmpty()) {
                return false;
            }
        }

        return true;
    }

    isEmptyDiagonal(target: Cell) : boolean {
        const absX = Math.abs(this.x - target.x);
        const absY = Math.abs(this.y - target.y);

        if (absX !== absY) {
            return false;
        }

        const dx = this.x < target.x ? 1 : -1;
        const dy = this.y < target.y ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
                return false;
            }

        }
        return true;
    }

    verticalCanEaten(target: Cell) : boolean {
        if (this.x !== target.x) {
            return false;
        }
        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++) {
            if (this.board.getCell(target.x, y).figure?.name === FigureNames.KING &&
                this.board.getCell(target.x, y).isEnemy(this)
            ) {
                continue;
            }
            if (!this.board.getCell(this.x, y).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    horizontalCanEaten(target: Cell) : boolean {
        if (this.y !== target.y) {
            return false;
        }

        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);

        for (let x = min + 1; x < max; x++) {
            if (this.board.getCell(x, this.y).figure?.name === FigureNames.KING) {
                continue;
            }

            if (!this.board.getCell(x, this.y).isEmpty()) {
                return false;
            }
        }

        return true;
    }

    diagonalCanEaten(target: Cell) : boolean {
        const absX = Math.abs(this.x - target.x);
        const absY = Math.abs(this.y - target.y);

        if (absX !== absY) {
            return false;
        }

        const dx = this.x < target.x ? 1 : -1;
        const dy = this.y < target.y ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (this.board.getCell(this.x + dx * i, this.y + dy * i).figure?.name === FigureNames.KING) {

                continue;
            }
            if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
                return false;
            }

        }
        return true;
    }
}