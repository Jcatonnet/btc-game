import axios from 'axios';

export const submitGuess = async (userId: string, guess: 'up' | 'down', btcPrice: number) => {
    try {
        const response = await axios.post('https://cm4fg2v27f.execute-api.eu-west-3.amazonaws.com/dev/submit-guess', {
            userId,
            guess,
            btcPrice,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { guessId } = response.data;
        console.log('Guess ID:', guessId);

        return { guessId };
    } catch (error) {
        console.error('Error submitting guess:', error);
        throw error;
    }
};

export const resolveGuess = async (userId: string, guessId: string) => {
    try {
        const response = await axios.post('https://cm4fg2v27f.execute-api.eu-west-3.amazonaws.com/dev/resolve-guess', {
            userId,
            guessId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error resolving guess:', error);
        throw error;
    }
};
