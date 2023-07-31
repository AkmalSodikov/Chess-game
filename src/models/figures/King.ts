import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-king.svg";
import whiteLogo from "../../assets/white-king.svg";

export class King extends Figure {
    canCastle: boolean = true;
    lodash = require("lodash")


    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KING;

    }
    canMove (target:Cell): boolean {
        if (!super.canMove(target)) {
            return false;
        }

        if ((this.cell.x === target.x && this.cell.y - 1 === target.y) ||
            (this.cell.x === target.x && this.cell.y + 1 === target.y) ||
            (this.cell.y === target.y && this.cell.x + 1 === target.x) ||
            (this.cell.y === target.y && this.cell.x - 1 === target.x) ||
            (Math.abs(this.cell.y - target.y) === 1 && Math.abs(this.cell.x - target.x) === 1)
        ) {
            for (let i = 0; i < this.cell.board.cells.length; i++) {
                let row = this.cell.board.cells[i];
                for (let j = 0; j < row.length; j++) {
                    let cell = row[j];

                    // @ts-ignore
                    if (cell.figure?.canEat(target) && cell.isEnemy(this.cell) ) {
                        return false;
                    }

                    }

                }
                return true;
            }


        //king castling
        if (!this.isInCheck() &&
            this.canCastle &&
            this.cell.x + 2 === target.x &&
            this.cell.y === target.y &&
            this.cell.isEmptyHorizontal(this.cell.board.getCell(target.x + 1, target.y)) &&
            this.cell.board.getCell(Math.abs(target.x + 1) % 8, target.y)?.figure?.canCastle) {
            for (let i = 0; i < this.cell.board.cells.length; i++) {
                let row = this.cell.board.cells[i];
                for (let j = 0; j < row.length; j++) {
                    let cell = row[j];

                    // @ts-ignore
                    if ((cell.figure?.canEat(target) ||
                        cell.figure?.canEat(this.cell.board.getCell(target.x - 1, target.y))) &&
                        cell.isEnemy(this.cell)) {
                        return false;
                    }

                }

            }
            return true;
        }

        if (!this.isInCheck() &&
            this.canCastle &&
            this.cell.x - 2 === target.x &&
            this.cell.y === target.y &&
            this.cell.isEmptyHorizontal(this.cell.board.getCell(target.x - 2, target.y)) &&
            this.cell.board.getCell(Math.abs(target.x - 2), target.y)?.figure?.canCastle) {
            for (let i = 0; i < this.cell.board.cells.length; i++) {
                let row = this.cell.board.cells[i];
                for (let j = 0; j < row.length; j++) {
                    let cell = row[j];

                    // @ts-ignore
                    if ((cell.figure?.canEat(this.cell.board.getCell(target.x + 1, target.y)) ||
                        cell.figure?.canEat(target) ||
                        cell.figure?.canEat(this.cell.board.getCell(target.x - 1, target.y)
                            )) &&
                        cell.isEnemy(this.cell)) {
                        return false;
                    }

                }

            }
            return true;
        }
        return false;
    }

    canEat(target: Cell) {
        if ((this.cell.x === target.x && this.cell.y - 1 === target.y) ||
            (this.cell.x === target.x && this.cell.y + 1 === target.y) ||
            (this.cell.y === target.y && this.cell.x + 1 === target.x) ||
            (this.cell.y === target.y && this.cell.x - 1 === target.x) ||
            (Math.abs(this.cell.y - target.y) === 1 && Math.abs(this.cell.x - target.x) === 1)
        ) {
            return true;
        }
        return false;
    }

    isInCheck(): boolean {
        for (let i = 0; i < this.cell.board.cells.length; i++) {
            let row = this.cell.board.cells[i];
            for (let j = 0; j < row.length; j++) {
                let cell = row[j];


                // @ts-ignore
                if (cell?.figure && cell.isEnemy(this.cell) && cell.figure?.canEat(this.cell)) {
                    return true;
                }
            }
        }
        return false;
    }

    isLegalMove(target:Cell): boolean {
        return true;
    }


    moveFigure(target: Cell) {
        super.moveFigure(target);
        this.canCastle = false;
    }
}