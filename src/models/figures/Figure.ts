import {Colors} from '../Colors'
import logo from '../../assets/black-bishop.svg'
import {Cell} from "../Cell";

export enum FigureNames {
    FIGURE = "Figure",
    KING = "King",
    QUEEN = "Queen",
    ROOK = "Rook",
    PAWN = "Pawn",
    BISHOP = "Bishop",
    KNIGHT = "Knight",

}


export class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    id: number;
    canCastle: boolean = true;
    moveCounter: number = 0;
    enPassantLeft: Cell | null = null;
    enPassantRight: Cell | null = null;
    swapCounter: number = 1;
    localCounter: number = 1;
    isCheck: boolean = false;
    possibleMoves: Cell[] = [];
    lodash = require("lodash")




    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE
        this.id = Math.random()
    }


    canMove(target: Cell): boolean {
        if (target.figure?.name === FigureNames.KING) {
            return false;
        }

        return target.figure?.color !== this.color;
    }

    isInCheck():boolean {
        return false;
    }

    moveFigure(target: Cell) {}
    canEat(target: Cell) {}



    isLegalMove(target: Cell): boolean {
        this.isCheck = false;
        for (let i = 0; i < this.cell.board.cells.length; i++) {
            const row = this.cell.board.cells[i];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell.figure?.name === FigureNames.KING &&
                    !cell.isEnemy(this.cell) &&
                    cell.figure.isInCheck()) {

                    this.isCheck = true;
                }

            }
        }

        if (this.isCheck) {
            for (let move of this.possibleMoves) {
                if (target !== move) {
                    continue;
                }
                // move simulation
                const clone = this.lodash.cloneDeep(this.cell.board)
                clone.getCell(this.cell.x, this.cell.y).moveFigure(clone.getCell(move.x, move.y))
                for (let i = 0; i < clone.cells.length; i++) {
                    const row = clone.cells[i];
                    for (let j = 0; j < row.length; j++) {
                        const cell = row[j];
                        if (cell.figure?.name === FigureNames.KING &&
                            !cell.isEnemy(clone.getCell(move.x, move.y)) &&
                            !cell.figure?.isInCheck()) {
                            return true;
                        } else {
                            continue;
                        }

                    }
                }
            }
            return false;
        } else {
            for (let move of this.possibleMoves) {
                if (target !== move) {
                    continue;
                }
                const clone = this.lodash.cloneDeep(this.cell.board)
                clone.getCell(this.cell.x, this.cell.y).moveFigure(clone.getCell(move.x, move.y))
                for (let i = 0; i < clone.cells.length; i++) {
                    const row = clone.cells[i];
                    for (let j = 0; j < row.length; j++) {
                        const cell = row[j];
                        if (cell.figure?.name === FigureNames.KING &&
                            !cell.isEnemy(clone.getCell(move.x, move.y)) &&
                            cell.figure?.isInCheck()) {
                            return false;
                        } else {
                            continue;
                        }

                    }
                }
            }

        }
        return true;


    }



}