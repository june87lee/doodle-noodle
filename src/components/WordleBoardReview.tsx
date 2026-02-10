import { useEffect, useState } from "react";
import { DEFAULT_COLOR_MAP } from "../assets/constants";
import useWordle from "../hooks/useWordle";

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

  START 2/9/26 4:30 PM

  Speed run
  Clarify questions such as game mechnics, word limit, new/end game state etc
  Running with one shot and maybe better word validation and separations

  PAUSE 5:00 PM dinner time
  UNPAUSE 7:00 PM
  I think I spent too much time on the hook part, did it most of 4:30-5 time

*/
const WordleBoard = () => {
  const { evaluatedGuesses, addGuess, hasGuess, answer, status } = useWordle();
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInput(value);
  };

  const handleSubmit = () => {
    if (input.length === answer?.length && !hasGuess(input)) {
      addGuess(input);
      setInput("");
    }
  };

  if (status === "loading") {
    return <>It's loading</>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "gray",
        color: "white",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h1>Worsdfdle</h1>
      <p>{answer}</p>
      <div>
        <input
          type="text"
          maxLength={answer?.length}
          minLength={answer?.length}
          value={input}
          onChange={handleInputChange}
        />
        <button onClick={() => handleSubmit()}>Submit</button>
      </div>
      <div>
        {evaluatedGuesses.map(({ word, letters }, index) => (
          <div key={`${word}_${index}`}>
            {letters.map(({ char, state }, jdx) => (
              <span
                key={`${word}_${index}_${char}_${jdx}`}
                style={{ color: DEFAULT_COLOR_MAP[state] }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordleBoard;
