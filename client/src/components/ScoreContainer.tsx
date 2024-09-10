import "./ScoreContainerStyle.css"

export const ScoreContainer = ({ score }: { score: number }) => {
    return (
        <div className="score-container">
            <h3>Your total score: {score} points</h3>

        </div>
    )
}