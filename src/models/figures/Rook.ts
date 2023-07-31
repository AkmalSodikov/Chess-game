import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-rook.svg";
import whiteLogo from "../../assets/white-rook.svg";

export class Rook extends Figure {
    canCastle: boolean = true;

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.ROOK;

    }
    canMove (target:Cell): boolean {
        if (!super.canMove(target)) {
            return false;
        }
        if (this.cell.isEmptyVertical(target)) {
            return true;
        }

        if (this.cell.isEmptyHorizontal(target)) {
            return true;
        }
        return false;
    }

    canEat(target: Cell) {
        if (target.figure?.name !== this.name) {
            if (this.cell.verticalCanEaten(target)) {

                return true;
            }

            if (this.cell.horizontalCanEaten(target)) {
                return true;
            }
        }

        return false;
    }


    moveFigure(target: Cell) {
        super.moveFigure(target);
        this.canCastle = false;
    }
}