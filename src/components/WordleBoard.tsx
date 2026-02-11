import { useState } from "react";
import useWordle from "../hooks/useWordle";
import { DEFAULT_COLOR_MAP } from "../assets/constants";

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
