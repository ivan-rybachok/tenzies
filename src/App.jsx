import Die from "./components/Die";
// importing nanoid to use for the key warning
import {nanoid} from "nanoid";
// importing confetti for the winner
import Confetti from 'react-confetti';
import { useWindowSize } from "react-use";
import React from "react";
import './App.css';


function App() {
  // creating a state to hold array of numbers
  // Initialize the state by calling our `allNewDice` function so it loads all new dice as soon as the app loads)
  const [dice, setDice] = React.useState(allnewDice());
  const [tenzies, setTenzies] = React.useState(false)
  const { width, height } = useWindowSize();
  const [totalRolls, setTotalRolls] = React.useState(0);

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    // if all dices are held and have the same value say you won the game 
    if (allHeld && allSameValue) {
        setTenzies(true)
        console.log("You won!")
    }
}, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
}
  
  function allnewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;

  }

  function rollDice() {
  // rolling all new dice, but instead to look through the existing dice
  // and make sure to NOT role any that are being `held`
    if(!tenzies) {
      setTotalRolls((prevTotalRolls) => prevTotalRolls + 1);
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : generateNewDie();
      }));
    }else{
      setTenzies(false);
      setTotalRolls(0);
      setDice(allnewDice());
    }

  }
  

  // flipping the `isHeld` property on the object in the array
  // that was clicked, based on the `id` prop passed
  // into the function.

  // checking for the `id`
  // of the die to determine which one to flip `isHeld` on
  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {

      return die.id === id ?
        {...die, isHeld: !die.isHeld} : die
    }))
  }


  // Mapping over the state numbers array to generate our array 
  // of Die elements and render those instead of
  // manually-written 10 Die elements.
  
  const diceElements = dice.map(die => (
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld} 
      holdDice={() => holdDice(die.id)} 
    />
  ))

  return (
    <main>
      <h2>
				Total Rolls: <span className="info-colored">{totalRolls}</span>
			</h2>
      {tenzies && <Confetti
        height={height} 
        width={width} 
        numberOfPieces={400}
      />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same.<br/><br/>
      Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      {/* button where the onClick is being listened for a re-roll*/}
      <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
    </main>
  )
  
}

export default App;
