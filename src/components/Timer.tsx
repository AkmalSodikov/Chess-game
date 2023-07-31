import React, {FC, MutableRefObject, useEffect, useRef, useState} from 'react';
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import {Board} from "../models/Board";



interface TimerProps {
    currentPlayer: Player | null;
    restart: () => void;
    setCurrentPlayer: (prev: Player) => void;
    swapCounter: MutableRefObject<number>;
    mate: boolean | undefined;
    board: Board;
}

const Timer: FC<TimerProps> = ({currentPlayer, restart, setCurrentPlayer, swapCounter, mate, board}) => {
    const [blackTime, setBlackTime] = useState(180);
    const [whiteTime, setWhiteTime] = useState(180);
    let loser = null;
    const timer = useRef<null | ReturnType<typeof setInterval>>(null)
    const formatedMinWhite = Math.floor(whiteTime / 60)
    const formatedSecWhite = Math.ceil(whiteTime % 60)
    const formatedMinBlack = Math.floor(blackTime / 60)
    const formatedSecBlack = Math.ceil(blackTime % 60)



    useEffect(() => {
        startTimer()
    }, [currentPlayer])

        if (mate) {
            if (timer.current) {
                clearInterval(timer.current)
            }
        }


        if (blackTime === 0 || whiteTime === 0) {
            loser = currentPlayer;
            if (timer.current) {
                clearInterval(timer.current)
            }
        }



    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current)
        }
        const callback = currentPlayer?.color === Colors.BLACK ? decrementBlackTimer : decrementWhiteTimer
        timer.current = setInterval(callback, 1000)
    }



    function decrementWhiteTimer() {
        setWhiteTime(prev => prev - 1)
    }

    function decrementBlackTimer() {
        setBlackTime(prev => prev - 1)
    }

    function handleRestart() {
        setCurrentPlayer(new Player(Colors.WHITE, board))
        window.location.reload();
    }
    return (
        <div className="timer">
            <h2 className="black-timer">{`${formatedMinBlack}:${formatedSecBlack < 10 ? "0" + formatedSecBlack : formatedSecBlack}`}</h2>
            <h2 className="white-timer">{`${formatedMinWhite}:${formatedSecWhite < 10 ? ("0" + formatedSecWhite) : formatedSecWhite}`}</h2>
            <button className="restart" onClick={() => handleRestart()}>restart</button>
        </div>

    );
};

export default Timer;