import { useState, useEffect } from 'react';
import { resolveGuess, submitGuess } from '../services/guessService';
import { v4 as uuidv4 } from 'uuid';

export const useGuessManager = (btcPrice: number, setBtcPrice: (price: number) => void) => {
    const storedScore = localStorage.getItem('score');
    const storedBtcPrice = localStorage.getItem('btcPrice');
    const [guess, setGuess] = useState<'up' | 'down' | null>(null);
    const [guessId, setGuessId] = useState<string | null>(null);
    const [score, setScore] = useState<number>(storedScore ? parseInt(storedScore, 10) : 0);
    const [result, setResult] = useState<string | null>(null);
    const [timer, setTimer] = useState<number>(60);
    const [countdownActive, setCountdownActive] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [resetFlip, setResetFlip] = useState<boolean>(false);
    const [action, setAction] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [readyToResolve, setReadyToResolve] = useState<boolean>(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedGuessId = localStorage.getItem('guessId');
        const storedTimer = localStorage.getItem('timer');
        const storedStartTime = localStorage.getItem('startTime');
        const storedGuess = localStorage.getItem('guess');

        if (!storedUserId) {
            const newUserId = uuidv4();
            setUserId(newUserId);
            localStorage.setItem('userId', newUserId);
        } else {
            setUserId(storedUserId);
        }

        if (storedGuessId) {
            setGuessId(storedGuessId);
        }

        if (storedGuess) {
            setGuess(storedGuess as 'up' | 'down');
        }

        if (storedBtcPrice) {
            setBtcPrice(Number(storedBtcPrice));
        }

        if (storedTimer && storedStartTime) {
            const elapsedTime = Math.floor((Date.now() - Number(storedStartTime)) / 1000);
            const remainingTime = Math.max(0, Number(storedTimer) - elapsedTime);
            setTimer(remainingTime);
            if (remainingTime > 0) {
                setCountdownActive(true);
            } else {
                setReadyToResolve(true);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('score', score.toString());
        if (guessId) {
            localStorage.setItem('guessId', guessId);
        } else {
            localStorage.removeItem('guessId');
        }
    }, [score, guessId]);

    useEffect(() => {
        if (readyToResolve && guessId && userId) {
            handleResolve();
            setReadyToResolve(false);
        }
    }, [readyToResolve, guessId, userId]);

    const handleGuess = async (guess: 'up' | 'down') => {
        if (!userId) return;

        try {
            setLoading(true);
            setResetFlip(true);

            const { guessId } = await submitGuess(userId, guess, btcPrice);
            setLoading(false);
            setGuessId(guessId);
            setGuess(guess);
            setCountdownActive(true);

            localStorage.setItem('guessedBtcPrice', btcPrice.toString());
            localStorage.setItem('timer', '60');
            localStorage.setItem('startTime', Date.now().toString());
            localStorage.setItem('guess', guess);

            setResetFlip(false);
            setAction('Guess submitted successfully! Good luck');
            setOpen(true);
        } catch (error) {
            console.error('Error submitting guess:', error);
            setResult('Error submitting guess. Please try again.');
            setOpen(true);
        }
    };

    const handleResolve = async () => {
        if (!guessId) return;

        try {
            const result = await resolveGuess(userId as string, guessId);
            if (result.scoreUpdate === 0) {
                setResult('No win, no lose! Score remains the same. Try again!');
            } else if (result.scoreUpdate > 0) {
                setResult('You won! +1 point to your total score. Keep going champ!');
            } else {
                setResult('You lost! -1 point to your total score. Try again!');
            }
            setAction('Your guess has been resolved!');
            setOpen(true);

            setScore(result.score);
            setBtcPrice(result.currentBtcPrice);

            setCountdownActive(false);
            setTimer(60);
            setGuess(null);

            localStorage.setItem('score', result.score.toString());
            localStorage.removeItem('guessedBtcPrice');
            localStorage.removeItem('startTime');
            localStorage.removeItem('timer');
            localStorage.removeItem('guess');
            localStorage.removeItem('guessId');
        } catch (error) {
            console.error('Error resolving guess:', error);
            setAction('Error resolving guess. Please try again.');
            setOpen(true);
        }
    };

    return {
        guess,
        guessId,
        score,
        result,
        timer,
        countdownActive,
        loading,
        resetFlip,
        open,
        action,
        handleGuess,
        handleResolve,
        setTimer,
        setCountdownActive,
        setOpen,
    };
};
