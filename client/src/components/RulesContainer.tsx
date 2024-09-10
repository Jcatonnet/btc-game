import './RulesContainerStyle.css'
export const RulesContainer = () => {
    return (
        <div className="rules-container">
            <h2>Is the BTC price going up or down?</h2>
            <p>Try to guess weither the BTC price will go up or down. If you guess right, you win 1 point, if you lose, your score decrease by 1 point. Try your best to join the top scorers !   <br /> Your result will be revealed after 60sec</p>
            <p>If you want to see more details about the BTC prices, please visit <a href="https://www.coingecko.com/en/coins/bitcoin" target="_blank" rel="noopener noreferrer">CoinGecko</a></p>
        </div>
    )
}