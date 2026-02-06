import { useEffect, useState } from "react";

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

  START 2/6/26 11:00 AM

  (Not gonna focus on git cleanliness for this, pushing everything to main baby)

  Step 1: Read the question and understand it. Scope out the requirements and constraints 
    with interviewer.
    Things I could ask:
    - Do I need to limit the number of guesses? (let's role with no limit for now)
    - Do I need to handle invalid inputs? (let's assume nah)
    - Do I need to handle limiting length of input? (let's assume nah)

  Step 2: High level planning, and explain how I would approach the problem.
    - I would explain that I would have a primary component called WordleBoard
    which would be responsible for fetching and maintaining the state.
    - Maybe a separate components for guesses and input, but not be necessary for now.
    - Personally will focus on fetching the words, basic ui, then state managemnt and then
      logic to figure out the colors.

  Step 3: Start coding, talk as I go, get it working bare bones

  END 2/6/26 11:31AM
*/

const API_URL = "https://api.jsonbin.io/v3/b/5f604035302a837e956685ac";

// todo: maybe overkill to have type for this?
type GuessedLetter = {
  letter: string;
  color: "green" | "yellow" | "white";
};

const useWordle = () => {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<GuessedLetter[][]>([]);

  // todo: a bit too simple?
  const getColorForLetter = (
    letter: string,
    index: number,
  ): "green" | "yellow" | "white" => {
    if (answer[index] === letter) {
      return "green";
    }
    if (answer.includes(letter)) {
      // always 5, so o(1) to check if letter is in answer
      return "yellow";
    }
    return "white";
  };

  const handleSubmit = (guess: string) => {
    const newGuess: GuessedLetter[] = [];
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const color = getColorForLetter(letter, i);
      newGuess.push({ letter, color });
    }
    setGuesses((prev) => [...prev, newGuess]);
  };

  useEffect(() => {
    const fetchAnswer = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      const words = data.record;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setAnswer(randomWord);
    };

    fetchAnswer();
  }, []);

  return { answer, guesses, handleSubmit };
};
const WordleBoard = () => {
  const { guesses, handleSubmit } = useWordle();
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInput(value);
  };

  const handleSubmitWrapper = () => {
    if (input.length === 5) {
      handleSubmit(input);
      setInput("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "gray",
        color: "white",
        height: "100vh",
        paddingTop: "50px",
      }}
    >
      <h1>Wordle</h1>
      <div>
        <input
          type="text"
          maxLength={5}
          minLength={5}
          value={input}
          onChange={handleInputChange}
        />
        <button onClick={() => handleSubmitWrapper()}>Submit</button>
      </div>
      <div>
        {guesses.map((guess, index) => (
          <div key={index}>
            {guess.map((letter, i) => (
              <span key={i} style={{ color: letter.color }}>
                {letter.letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordleBoard;
