import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import axios from 'axios';

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-3' });

export const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const { userId, guessId } = body
        console.log('Parsed request:', { userId, guessId });


        if (!userId || !guessId) {
            throw new Error('Missing userId or guessId');
        }

        const getParams = {
            TableName: 'userGuess',
            Key: {
                userId: { S: userId },
                guessId: { S: guessId }
            }
        };
        const getItemCommand = new GetItemCommand(getParams);
        const userRecord = await dynamoDbClient.send(getItemCommand);

        if (!userRecord.Item) {
            throw new Error('User record not found');
        }

        const storedBtcPrice = parseFloat(userRecord.Item.btcPriceAtGuess.N);
        const guess = userRecord.Item.guess.S;

        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin',
                vs_currencies: 'usd',
                x_cg_demo_api_key: "CG-Q3CkX2sTEpbc5y8o8piYEuXC"

            }
        });

        const currentBtcPrice = response.data.bitcoin.usd;

        const conditions = {
            won: (currentBtcPrice > storedBtcPrice && guess === 'up') || (currentBtcPrice < storedBtcPrice && guess === 'down'),
            lost: (currentBtcPrice > storedBtcPrice && guess === 'down') || (currentBtcPrice < storedBtcPrice && guess === 'up'),
            neutral: currentBtcPrice === storedBtcPrice
        };


        let won = false;
        let scoreUpdate = 0;

        if (conditions.won) {
            won = true;
            scoreUpdate = 1;
        } else if (conditions.lost) {
            scoreUpdate = -1;
        }


        const getScoreParams = {
            TableName: 'userScore',
            Key: {
                userId: { S: userId }
            }
        };
        const scoreRecord = await dynamoDbClient.send(new GetItemCommand(getScoreParams));

        if (!scoreRecord.Item) {
            throw new Error('User score record not found');
        }

        const currentScore = parseInt(scoreRecord.Item.score.N);
        const newScore = currentScore + scoreUpdate;

        if (!conditions.neutral) {
            const updateScoreParams = {
                TableName: 'userScore',
                Key: {
                    userId: { S: userId }
                },
                UpdateExpression: 'SET score = :newScore',
                ExpressionAttributeValues: {
                    ':newScore': { N: newScore.toString() }
                }
            };
            await dynamoDbClient.send(new UpdateItemCommand(updateScoreParams));
        }

        const updateGuessParams = {
            TableName: 'userGuess',
            Key: {
                userId: { S: userId },
                guessId: { S: guessId }
            },
            UpdateExpression: 'SET resolved = :resolved, won = :won',
            ExpressionAttributeValues: {
                ':resolved': { BOOL: true },
                ':won': { BOOL: won }
            }
        };

        const updateItemCommand = new UpdateItemCommand(updateGuessParams);
        await dynamoDbClient.send(updateItemCommand);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                message: 'Guess resolved successfully!',
                won: won,
                currentBtcPrice: currentBtcPrice,
                scoreUpdate: scoreUpdate,
                score: newScore
            }),
        };
    } catch (error) {
        console.error('Error checking guess:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error checking guess', error: error.message }),
        };
    }
};
