import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from '../../assets/black-bishop.svg'
import whiteLogo from '../../assets/white-bishop.svg'


export class Bishop extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.BISHOP;
    }

    canMove (target:Cell): boolean {

        if (!super.canMove(target)) {
            return false;
        }

        return this.cell.isEmptyDiagonal(target);
    }

    canEat(target: Cell) {
        if (target.figure?.name === this.name) {
            return false;
        }

        return this.cell.diagonalCanEaten(target);
    }
}