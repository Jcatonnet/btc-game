import { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import './OngoingGuessStyle.css';

export const OnGoingGuess = ({
    timer,
    guess,
    btcPrice,
    result,
    resetFlip,
}: {
    timer: number;
    guess: string | null;
    btcPrice: number;
    result: string | null;
    resetFlip: boolean;
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (resetFlip) {
            setIsFlipped(false);
        }
    }, [resetFlip]);

    useEffect(() => {
        if (timer === 0) {
            setIsFlipped(true);
        }
    }, [timer, result]);

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div key="front" className="ongoing-container">
                <h3>Result will appear in: {timer}s</h3>
                <p>Your guess: {guess}</p>
                <p>BTC Price at guess: ${btcPrice.toFixed(2)}</p>
            </div>

            <div key="back" className="ongoing-container">
                <h3>{result ? result : 'Calculating result...'}</h3>
            </div>
        </ReactCardFlip>
    );
};
