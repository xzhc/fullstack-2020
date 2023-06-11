import { useState } from "react";

const Button = ({text, handleClick}) =>{
    return <button onClick={handleClick}>{text}</button>
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGoodClick = () => {
        setGood(good + 1)
    }
    const handleNeutralClick = () => {
        setNeutral(neutral + 1)
    }
    const handleBadClick = () => {
        setBad(bad + 1)
    }

    
    return (
        <div>
            <div>
            <h2>Give FeedBack</h2>
            <Button text='good' handleClick={handleGoodClick} />
            <Button text='neutral' handleClick={handleNeutralClick} />
            <Button text='bad' handleClick={handleBadClick} />
            </div>
            
            <div>
            <h2>Statistics</h2>
            <p>Good:{good}</p>
            <p>neutral:{neutral}</p>
            <p>bad:{bad}</p>
            </div>
        </div>
        

        
    )
}

export default App