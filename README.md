# Welcome to BTC my guess !

This is a BTC price guess game. 
You can bet on the next BTC price move by clicking on one of the two guess. 
if you win, you add +1 points to your total score.
If you lose, you lose -1 point to your total score.
If price is even, nothing happens ! 

Result is displayed at the end of the 60 sec timer. 

Show us your skills !

## How the app is built

BTC My Guess is a web application where users can predict if the price of Bitcoin (BTC) will go up or down within a certain period. The app is built using modern technologies, including a frontend powered by React, a backend hosted on AWS (using AWS Lambda and DynamoDB), and integration with a Bitcoin price API for real-time data. Users can submit guesses, view results after a countdown, and their scores are tracked and displayed.


Architecture
The application follows a serverless architecture. Here's a high-level breakdown of the architecture:

Frontend:
React: The frontend is built using React + Vite and manages the user interface and interactions.
React Hooks: Custom hooks (useBtcPricen, useGuessManager) are used to manage stateful logic such as BTC price fetching and guess submission/ resolution.
Material UI: For UI components such as buttons and snackbars.
LocalStorage: User data like guesses, scores, and timers are stored in localStorage to persist state across page refreshes.

The Frontend app is structured as follow: 
- client/src/pages: main pages of the app
- client/src/components: small reusable components
- client/src/hooks: custom hook to handle BTC price fetch and update and Guess submission/resolution.
- client/src/services: to handle backend API call 
- client/src/App.tsx: main app file

Backend:
AWS Lambda: The backend consists of serverless functions (Lambdas) that handle requests for submitting and resolving guesses.
DynamoDB: Used as the database to store user guesses and scores. It operates as the backend storage layer.
API Gateway: Provides an interface for the frontend to interact with the backend, forwarding requests to the appropriate Lambda functions.
AWS SDK: Used to interact with DynamoDB and manage user data.
CoinGecko API: The real-time BTC price is fetched from CoinGecko, a public cryptocurrency price API.


Due to time constrain, we did not refacto everything. 
Here we handle local state using react hooks in the HomePage. In the future, we would refacto that page by creating custom React hook for guess Management, Timer management and localStorage management. 
We would as well refine the state management using React Context to prepare for more features.
We would add unit and integration testing as well.
In further version, we would create a DynamoDB call to retrieve player data.

For exercice purpose, we provided the CoinGecko API key publicly. For real world usage, we would store it in an environment variable.


# How it works ?
Here is an overview of the workflow
- BTC price is fetched and displayed on pageLoad
- When the user clicks on a guess button, guess is saved in localStorage alongside with guessId, userId to enable session persistence
- On click, userGuessSubmission lambda is triggered and the guess is sent to the backend to be saved in DynamoDB in the UserGuess table. 
- On click, the timer is initiated
- When timer reached 0sec, it triggers the resolveGuess lambda which return the result of the guess. The guess is updated in DynamoDB as well as the userScore
- The resulst is displayed to the user with their updated score

1. User Interaction:
When the user visits the site, they are presented with the current Bitcoin price (fetched from CoinGecko), a welcome message, and two buttons: Up and Down.
The user makes a prediction (guess) whether the BTC price will increase or decrease after a set countdown.

2. Backend Integration:
Upon submitting a guess, the app makes an POST request to the AWS Lambda function (/submit-guess) via API Gateway.
The backend stores the user’s guess in DynamoDB, along with the BTC price at the time of the guess.

3. Countdown & Resolution:
Once the guess is submitted, a countdown begins.
When the countdown ends, another request is sent to the backend to resolve the guess (/resolve-guess). The BTC price is fetched again to check if the user guessed correctly.
The backend calculates whether the user won or lost and updates the score accordingly in DynamoDB.

4. Result Display:
The frontend flips the card to show the result, indicating whether the user won or lost, and updates the user’s score.

Features
Real-Time Bitcoin Price: Fetched from CoinGecko API and displayed in the app.
User Guess Management: Users can guess if the BTC price will go up or down after a countdown.
Serverless Backend: The app uses AWS Lambda functions to handle guess submission and resolution.
DynamoDB Storage: User scores and guesses are stored in DynamoDB and managed using AWS SDK.
Persistent State: User data (guess, score, and timer) is stored in localStorage to persist across page reloads.
Card Flip Animation: A card flip animation is used to show the result after the guess is resolved.

## Future Enhancements
- Leaderboard: Add a leaderboard feature to display the top users based on their scores.
- UserName: allow user to enter a userName to generate more engagement.
- User Authentication: Implement user authentication (e.g., with AWS Cognito) to allow users to sign in and track their progress.
- Win strikes: Give additional points after 3 consecutive correct guesses.
Advanced Guess Options: Allow users to place more complex bets (e.g., guessing the exact BTC price after a set period).
- Make the app responsive for all devices


## Local Setup (Frontend)
Clone the repository:

```git clone https://github.com/yourusername/btc-my-guess.git
```cd btc-my-guess

Install dependencies:
```npm install
``` cd client
```npm install

Start the development server:
```npm run dev
The app should now be running at http://localhost:3000.