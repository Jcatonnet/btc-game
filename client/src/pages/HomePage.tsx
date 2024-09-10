import React, { useEffect } from 'react';
import { useBtcPrice } from '../hooks/useBTCPrice';
import { useGuessManager } from '../hooks/useGuessManager';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import "./HomePage.css"
import { RulesContainer } from '../components/RulesContainer';
import { ScoreContainer } from '../components/ScoreContainer';
import { OnGoingGuess } from '../components/OngoingGuess';

const HomePage: React.FC = () => {
    const [currentBtcPrice, setBtcPrice] = useBtcPrice();
    const guessedBtcPrice = localStorage.getItem('guessedBtcPrice');
    const {
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
    } = useGuessManager(currentBtcPrice, setBtcPrice);



    useEffect(() => {
        if (countdownActive && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTimer = prevTimer - 1;
                    localStorage.setItem('timer', newTimer.toString());
                    return newTimer;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else if (timer === 0 && countdownActive) {
            handleResolve();
            setCountdownActive(false)
        }
    }, [countdownActive, timer]);

    const handleClose = () => setOpen(false);
    const displayBtcPrice = countdownActive && guessId && localStorage.getItem('guessedBtcPrice')
        ? guessedBtcPrice
        : currentBtcPrice;

    return (
        <div>
            <h1>Welcome to BTC My Guess!</h1>
            <RulesContainer />
            <h3>Current BTC Price: ${Number(displayBtcPrice).toFixed(2)}</h3>

            <div className="button-container">
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleGuess('up')}
                    disabled={!!guess || countdownActive}
                    style={{
                        backgroundColor: guess === 'up' ? '#9c27b047' : '',
                    }}
                >Up</LoadingButton>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleGuess('down')}
                    disabled={!!guess || countdownActive}
                    style={{
                        backgroundColor: guess === 'down' ? '#9c27b047' : '',
                    }}
                >Down</LoadingButton>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={action}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />

            {guessId && (
                <OnGoingGuess
                    timer={timer}
                    guess={guess}
                    btcPrice={Number(guessedBtcPrice)}
                    result={result}
                    resetFlip={resetFlip}
                />
            )}
            <ScoreContainer score={score} />
        </div>
    );
};

export default HomePage;
