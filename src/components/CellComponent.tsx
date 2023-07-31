import React, {FC} from 'react';
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";
import {FigureNames} from "../models/figures/Figure";


interface CellProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
    onDragStart: (e: React.DragEvent, cell: Cell) => void;
    onDragOver: (e: React.DragEvent) => void;
    handleOnDrop: (e: React.DragEvent, cell: Cell) => void;
    currentPlayer: Player | null;
    swapCounter: number;


}

const CellComponent: FC<CellProps> = ({cell, selected, click, onDragStart, onDragOver, handleOnDrop, currentPlayer,swapCounter}) => {

     if (cell.figure?.swapCounter) {
         cell.figure.swapCounter = swapCounter;
     }
    return (
        <div
            className={['cell', cell.color, selected && cell.figure ? "selected" : '', ].join(' ')}
            onClick={() => click(cell)}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => handleOnDrop(e, cell)}
            onDragStart={(e) => onDragStart(e, cell)}
        >
            {cell.figure?.name === FigureNames.KING && cell.figure?.isInCheck() && <div className="check"/>}
            {cell.available && cell.figure && <div className={"figure-available"}/>}
            {cell.available && !cell.figure && <div className={"available"}/>}
            {cell.figure?.logo &&  <div
                draggable = {currentPlayer?.color === cell.figure.color}
                className={`cell-piece`}
                style={{
                    backgroundImage: cell.figure?.logo ? `url(${cell.figure.logo})` : 'none'

                }}
            />}


        </div>

)
};

export default CellComponent;