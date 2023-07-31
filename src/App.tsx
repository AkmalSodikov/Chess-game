import React, {useEffect, useRef, useState, useContext} from 'react';
import './App.css';
import BoardComponent from "./components/BoardComponent";
import {Board} from "./models/Board";
import {Player} from "./models/Player";
import {Colors} from "./models/Colors";
import LostFigures from "./components/LostFigures";
import Timer from "./components/Timer";






function App() {
    const [board, setBoard] = useState(new Board())
    const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE, board));
    const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK, board));
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    let swapCounter = useRef<number>(1)
    const winner = currentPlayer?.color === Colors.WHITE ? "Black" : "White"




    useEffect(() => {
        restart()
        setCurrentPlayer(whitePlayer)
    }, [])

    function restart() {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures()
        setBoard(newBoard)
        setBlackPlayer(new Player(Colors.BLACK, newBoard));
        setWhitePlayer(new Player(Colors.WHITE, newBoard));
    }

    function swapPlayer() {
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer)
        swapCounter.current++
    }



    return (
        <div className="app">

            <BoardComponent
                board={board}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                swapPlayer={swapPlayer}
                swapCounter={swapCounter.current}
            />
            <Timer
                swapCounter={swapCounter}
                restart={restart}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                mate={currentPlayer?.isCheckMate()}
                board={board}
            />

            <div className="info-table">
                {currentPlayer?.isCheckMate() ? <h3 className="checkmate">Checkmate. {winner} is victorious</h3> :
                    <h3 className="player-indicator">{currentPlayer?.color} to move</h3>}
                <LostFigures title="" figures={board.lostWhiteFigure} />
                <LostFigures title="" figures={board.lostBlackFigure} />
            </div>


        </div>

  );
}

export default App;
