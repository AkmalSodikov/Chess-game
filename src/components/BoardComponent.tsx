import React, {FC, useEffect, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";
import capture from "../audio/capture.mp3"
import move from "../audio/move-self.mp3"




interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => void;
    swapCounter: number;

}

const BoardComponent: FC<BoardProps> = ({board, setBoard, currentPlayer, swapPlayer, swapCounter}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const letters = ["a", "b" , "c", "d", "e", "f", "g", "h"];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
    let isMate = false;
    /*let captureSound = new Audio(capture);
    let moveSound = new Audio(move);*/


   function click(cell: Cell) {
        // @ts-ignore
        if (selectedCell && selectedCell !== cell && selectedCell?.figure?.canMove(cell) && selectedCell.figure?.isLegalMove(cell)) {
            /*if (cell.isEmpty()) {
                console.log(cell.figure?.enPassantLeft)

                //moveSound.play();  doesn't work for Safari
            } else {
                //captureSound.play();
            }*/
            selectedCell.moveFigure(cell);
            swapPlayer();
            setSelectedCell(null);
        } else {
            if (currentPlayer?.color === cell.figure?.color) {
                setSelectedCell(cell)
            }


        }
    }



    useEffect(() => {
        highlightCells();
    }, [selectedCell])

    function highlightCells() {
        board.highlightCells(selectedCell)
        updateBoard()
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function onDragStart(e: React.DragEvent, cell:Cell) {
        if (currentPlayer?.color === cell.figure?.color) {
            setSelectedCell(cell)
        }
    }

    function onDragOver(e: React.DragEvent) {
        e.preventDefault()
    }

    function handleOnDrop(e: React.DragEvent, cell: Cell) {
        if (selectedCell && selectedCell !== cell && selectedCell?.figure?.canMove(cell) && selectedCell?.figure?.isLegalMove(cell)) {
            /*if (cell.isEmpty()) {
                //moveSound.play();
            } else {
                //captureSound.play();
            }*/
            selectedCell?.moveFigure(cell);
            swapPlayer();
            setSelectedCell(null);
            e.preventDefault()
        }
    }

    return (
            <div>
                <div
                    className="board">
                    {board.cells.map((row, index) =>
                        <React.Fragment
                            key={index}>
                            {row.map(cell =>
                                <div>
                                    <CellComponent
                                        click={click}
                                        cell={cell}
                                        key={cell.id}
                                        selected={selectedCell?.x === cell.x && selectedCell?.y === cell.y}
                                        onDragStart={onDragStart}
                                        onDragOver={onDragOver}
                                        handleOnDrop={handleOnDrop}
                                        currentPlayer={currentPlayer}
                                        swapCounter={swapCounter}

                                    />
                                    {cell.y === 7 && <h5 draggable={false} className="letter">{letters[cell.x]}</h5>}
                                    {cell.x === 7 && <h5 draggable={false} className="number">{numbers[cell.y]}</h5>}
                                </div>

                            )}
                        </React.Fragment>
                    )}
                </div>

            </div>



    );
};

export default BoardComponent;