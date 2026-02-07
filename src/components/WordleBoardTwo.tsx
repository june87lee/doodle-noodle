import { useEffect, useState, useMemo } from "react";

/*
  Original Instructions:

  https://stormy-zircon-15a.notion.site/Wordle-1c97b4457a0f805c817df63b232e3790

  ### Interview Prompt:

You are tasked with building a word-guessing game in React, similar to the popular game 
Wordle. The final product should match the following specifications:

---

### **Functional Requirements:**

1. **Fetching the Answer:**
    - The answer word should be dynamically fetched from a remote API endpoint:
        - URL: `https://api.jsonbin.io/v3/b/5f604035302a837e956685ac`
    - The API response contains a list of words. Select a random word from the list as 
      the answer.
2. **Gameplay:**
    - The user should be able to input a 5-letter word through a text input field.
    - Upon clicking the "Submit" button:
        - The guessed word should be displayed on the screen.
        - Each letter of the word should be color-coded based on the following rules:
            - **Green:** The letter is in the correct position.
            - **Yellow:** The letter exists in the answer but is in the wrong position.
            - **White:** The letter does not exist in the answer.
    - The input should automatically convert letters to uppercase.
    - The user should be able to make multiple guesses, which are displayed as a list.
    - After each guess, the input field should be cleared.
*/

/*
  Notes and Steps:

  Start: 2/7/26 10:45 AM

  1. Clarifying, understanding and scoping the requirements
     - Ask if it will always be 5 letters?
       (Running with the assumption it will always be 5 characters)
     - Should we limit guesses?
       (Nice to have, but not essential right now)
     - Do we allow for same entries?
       (User should not be able to enter a repeated guess)
     - What is the top priority for this feature?
       (Get the game logic functioning, then prettify)
  
  2. Outlining overall plan
    - I think overall there primarily two components for the base iteration: 
      the input and the list
    - Fetching the list of words and choosing one random answer and save it in a state
    - Figure out how to hold states for guesses
    - Not allow for submission if it has been guessed, not the correct length

  3. Coding while talking/explaining
    - I will first focus in bringing in the data
    - Next I will scaffold the ui
    - Then figure out states and game logic

  End: 2/7/26 11:24 AM

  Start: 2/7/26 1:52 PM

  Corrections, seems overcomplicated, focus on deriving computation, keep states simple
*/

const API_URL = 'https://api.jsonbin.io/v3/b/5f604035302a837e956685ac'


// Not to overcomplicate logic, strip it out and use one hook
const useWordle = () => {
  const [guesses, setGuesses] = useState<string[]>([])
  const [answer, setAnswer] = useState('')
  const guessesSet = useMemo(() => new Set(guesses), [guesses])

  useEffect(() => {
    let isMounted = true
    const fetchAnswer = async () => {
      try {
        const resp = await fetch(API_URL)
        const data = await resp.json()
        const words = data.record;
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (isMounted) {
          setAnswer(randomWord)
        }
      } catch (error) {
        console.log("An error has occurred while fetching")
      }
    }
    fetchAnswer()
    return () => { isMounted = false }
  }, [])

  const addGuess = (guess: string) => {
    if (guess.length !== answer.length || guessesSet.has(guess)) {
      return
    }
    setGuesses(prev => [...prev, guess])
  }

  const hasGuess = (guess: string) => {
    return guessesSet.has(guess)
  }

  return { guesses, answer, addGuess, hasGuess }
}

const WordleBoard = () => {
  const { guesses, answer, addGuess, hasGuess } = useWordle()
  const [input, setInput] = useState('')

  const canSubmit = useMemo(() => answer.length > 0 && input.length === answer.length && !hasGuess(input), [input])

  // is this the best area for helper?
  const getColor = (guessedLetter: string, idx: number) => {
    if (guessedLetter === answer[idx]) {
      return 'green'
    } else if (answer.includes(guessedLetter)) {
      return 'yellow' //not concerned with frequency
    }
    return 'white'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toLocaleUpperCase())
  }
  const handleSubmit = () => {
    addGuess(input)
    setInput('')
  }

  return (<div>
    <h1>Wordle</h1>
    <div>
      {guesses?.map(guess => <div key={guess}>
        {[...guess].map((letter, i) => <span key={`${guess}_${i}${letter}`} style={{ color: getColor(letter, i) }}>{letter}</span>)}
      </div>)}
    </div>
    <div>
      <div>
        <input
          type="text"
          maxLength={answer.length}
          minLength={answer.length}
          value={input}
          onChange={handleInputChange}
        />
        <button disabled={!canSubmit} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  </div>)
};

export default WordleBoard;
