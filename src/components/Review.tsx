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
    For this exercise, we’ll build a simple autocomplete search component 
    using a public API.

    Build a user autocomplete search component in React.
    https://jsonplaceholder.typicode.com/users?name_like=<query>

    Core functionality
    Render a text input.
    As the user types:
        Fetch matching users from the API.
        Show results in a dropdown below the input.
    Each result should display:
        User’s name
        User’s email
    When a result is clicked: 
        Populate the input with the selected 
        user’s name.
        Close the dropdown.

    Do not call the API on every keystroke.
    Only send a request 300ms after the user stops typing.
*/

/*

Fast review for these two problems

*/
import { useState, useMemo, useEffect } from "react";
import styles from "./Review.module.css";

const WORDLE_URL = "https://api.jsonbin.io/v3/b/5f604035302a837e956685ac";
const QUERY_URL = "https://jsonplaceholder.typicode.com/users?name_like=";

const useWordleEngine = () => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);

  const guessesSet = useMemo(() => new Set(guesses), [guesses]);

  const addGuess = (guess: string) => {
    if (!answer) {
      return;
    }
    if (guess.length !== answer.length || guessesSet.has(guess)) {
      return;
    }
    setGuesses((prev) => [...prev, guess]);
  };

  const hasGuess = (guess: string) => guessesSet.has(guess);

  const getGuessLetterColorPairs = (
    guess: string,
  ): { letter: string; color: string }[] => {
    if (!answer) {
      // this shouldn't be triggered
      return [];
    }
    const answerFreq: Record<string, number> = {};
    const orderedColors: { letter: string; color: string }[] = [];
    for (const c of answer) {
      answerFreq[c] = (answerFreq[c] || 0) + 1;
    }
    for (let i = 0; i < guess.length; i++) {
      if (answer[i] === guess[i]) {
        orderedColors.push({ letter: guess[i], color: "green" });
        answerFreq[guess[i]] = answerFreq[guess[i]] - 1;
      } else if (answerFreq[guess[i]] && answerFreq[guess[i]] > 0) {
        orderedColors.push({ letter: guess[i], color: "yellow" });
        answerFreq[guess[i]] = answerFreq[guess[i]] - 1;
      } else {
        orderedColors.push({ letter: guess[i], color: "white" });
      }
    }

    return orderedColors;
  };

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const fetchAnswer = async () => {
      try {
        const resp = await fetch(WORDLE_URL, { signal: controller.signal });
        const data = await resp.json();
        const randomWord =
          data.record[Math.floor(Math.random() * data.record.length)];
        if (mounted) {
          setAnswer(randomWord);
        }
      } catch (error: any) {
        if (error.name === "Abort Error") {
          console.log("Fetching aborted");
        } else {
          console.log("An error has occurred while fetching");
        }
      }
    };
    fetchAnswer();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return { answer, guesses, hasGuess, getGuessLetterColorPairs, addGuess };
};

const Review = () => {
  const { answer, guesses, hasGuess, getGuessLetterColorPairs, addGuess } =
    useWordleEngine();
  const [guessInput, setGuessInput] = useState("");

  const canSubmit = guessInput.length === 5 && !hasGuess(guessInput);

  const handleGuessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuessInput(e.target.value.toLocaleUpperCase());
  };
  const handleGuessSubmit = () => {
    addGuess(guessInput);
    setGuessInput("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wordle}>
        <h2>Wordle</h2>
        <p>{answer}</p>
        <div>
          {guesses?.map((guess) => {
            const guessPairs = getGuessLetterColorPairs(guess);
            return (
              <div key={guess}>
                {guessPairs.map(({ letter, color }) => (
                  <span style={{ color: color }}>{letter}</span>
                ))}
              </div>
            );
          })}
        </div>
        <div>
          <input
            type="text"
            minLength={5}
            maxLength={5}
            value={guessInput}
            onChange={handleGuessInputChange}
          />
          <button disabled={!canSubmit} onClick={handleGuessSubmit}>
            Submit
          </button>
        </div>
      </div>
      <div className={styles.autocomplete}>
        <h2>Autocomplete</h2>
      </div>
    </div>
  );
};

export default Review;
