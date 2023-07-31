import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-queen.svg";
import whiteLogo from "../../assets/white-queen.svg";

export class Queen extends Figure {

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.QUEEN;
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

        if (this.cell.isEmptyDiagonal(target)) {
            return true;
        }

        return false;
    }
    canEat(target: Cell):boolean {
        if (target.figure?.name !== this.name) {

            if (this.cell.horizontalCanEaten(target)) {
                return true;
            }

            if (this.cell.verticalCanEaten(target)) {
                return true;
            }

            if (this.cell.diagonalCanEaten(target)) {
                return true;
            }
        }
        return false;
    }
}