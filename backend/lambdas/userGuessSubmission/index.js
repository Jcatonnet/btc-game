import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-3' });

export const handler = async (event) => {
    try {
        const { userId, guess, btcPrice } = JSON.parse(event.body);

        if (!userId || !guess || !btcPrice) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        const guessId = uuidv4();
        const timestamp = Date.now();

        const params = {
            TableName: 'userGuess',
            Item: {
                userId: { S: userId },
                guessId: { S: guessId },
                guess: { S: guess },
                btcPriceAtGuess: { N: btcPrice.toString() },
                timestamp: { N: timestamp.toString() },
                resolved: { BOOL: false },
                won: { BOOL: false }
            },
        };

        const command = new PutItemCommand(params);
        await dynamoDbClient.send(command);

        const scoreCheckParams = {
            TableName: 'userScore',
            Key: {
                userId: { S: userId }
            }
        };

        const scoreItem = await dynamoDbClient.send(new GetItemCommand(scoreCheckParams));

        if (!scoreItem.Item) {
            const initScoreParams = {
                TableName: 'userScore',
                Item: {
                    userId: { S: userId },
                    score: { N: '0' }
                }
            };
            await dynamoDbClient.send(new PutItemCommand(initScoreParams));
        }


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Guess submitted successfully!', guessId }),
        };
    } catch (error) {
        console.error('Error submitting guess:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error. Please try again later.' }),
        };
    }
};
