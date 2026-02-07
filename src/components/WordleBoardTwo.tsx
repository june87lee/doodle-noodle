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

*/

const WordleBoard = () => {
  return <>code here</>
};

export default WordleBoard;
