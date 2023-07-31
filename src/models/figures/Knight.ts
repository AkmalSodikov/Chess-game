import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-knight.svg";
import whiteLogo from "../../assets/white-knight.svg";

export class Knight extends Figure {
    lodash = require("lodash");

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KNIGHT;
    }
    canMove (target:Cell): boolean {
        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);

        if (!super.canMove(target)) {
            return false;
        }

        for (let i = 0; i < this.cell.board.cells.length; i++) {
            let row = this.cell.board.cells[i];
            for (let j = 0; j < row.length; j++) {
                let cell = row[j];

                if (cell.figure?.name === FigureNames.KING && !cell.isEnemy(this.cell) && cell.figure?.isInCheck()) {
                    this.isCheck = true;
                }
            }
        }

        if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
            return true;
        }



        return false;
    }


    canEat(target: Cell) {
        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);

        if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
            return true;
        }
        return false;

    }
}