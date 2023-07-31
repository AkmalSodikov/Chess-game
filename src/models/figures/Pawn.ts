import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-pawn.svg";
import whiteLogo from "../../assets/white-pawn.svg";
import {Board} from "../Board";


export class Pawn extends Figure {
    isFirstStep: boolean = true;
    moveCounter: number = 0;
    enPassantLeft: Cell | null = null;
    enPassantRight: Cell | null = null;
    localCounter: number = 0;


    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.PAWN;
    }

    canMove (target:Cell): boolean {
        const enPassantRight = this.cell.board.getCell((this.cell.x + 1) % 8, this.cell.y)
        const enPassantLeft = this.cell.board.getCell(Math.abs((this.cell.x - 1) % 8), this.cell.y)

        this.enPassantLeft = enPassantLeft;
        this.enPassantRight = enPassantRight;

        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
        const firstMoveDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;



        if (!super.canMove(target)) {
            return false;
        }



        // left en passant
        if (
            (enPassantLeft.y === 4 || enPassantLeft.y === 3) &&
            enPassantLeft.figure?.localCounter === this.swapCounter - 1 &&
            enPassantLeft.figure?.name === FigureNames.PAWN &&
            this.cell.isEnemy(enPassantLeft) &&
            enPassantLeft.figure?.moveCounter === 1  &&
            Math.abs((this.cell.x - 1) % 8) === target.x &&
            this.cell.y + direction === target.y

        ) {
            return true;
        }

        // right en passant
        if (
            (enPassantRight.y === 4 || enPassantRight.y === 3) &&
            enPassantRight.figure?.localCounter === this.swapCounter - 1 &&
            enPassantRight.figure?.name === FigureNames.PAWN &&
            this.cell.isEnemy(enPassantRight) &&
            enPassantRight.figure?.moveCounter === 1  &&
            Math.abs((this.cell.x + 1) % 8)  === target.x &&
            this.cell.y + direction === target.y

        ) {
            return true;
        }


        if (this.cell.y + direction === target.y &&
            (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) &&
            this.cell.isEnemy(target)
        ) {
            return true;
        }

        if (
            this.isFirstStep &&
            !this.cell.board.getCell(this.cell.x, this.cell.y + 1).isEmpty() &&
            this.color === Colors.BLACK) {
            return false;
        }

        if (this.isFirstStep &&
            !this.cell.board.getCell(this.cell.x, this.cell.y - 1).isEmpty() &&
            this.color === Colors.WHITE) {
            return false;
        }

        if (this.cell.y + direction === target.y &&
             this.cell.x === target.x &&
             this.cell.board.getCell(target.x, target.y).isEmpty()) {

            return true;
        }
        if ((this.isFirstStep &&
             this.cell.y + firstMoveDirection === target.y) &&
             this.cell.x === target.x &&
             this.cell.board.getCell(target.x, target.y).isEmpty()) {

            this.localCounter = this.swapCounter;
            return true;
        }


        return false;
    }

    canEat(target: Cell) {
        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
        if (this.cell.y + direction === target.y &&
            (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
        ) {
            return true;
        }
        return false;
    }







    moveFigure(target: Cell) {
        super.moveFigure(target);
        this.moveCounter++;
        this.isFirstStep = false;
    }


}