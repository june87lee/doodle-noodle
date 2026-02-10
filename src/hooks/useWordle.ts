import { useState, useEffect, useMemo } from "react";
import { DEFAULT_WORDS_API } from "../assets/constants";

// should only be responsible for game mechanics, not ui
const useWordle = () => {
  const [answer, setAnswer] = useState<null | string>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "play" | "win">(
    "loading",
  ); //define types in diff area
  // not sure if worthwhile to build out a set
  const guessesSet = useMemo(() => new Set(guesses), [guesses]);

  // to not expose the set directly
  const hasGuess = (guess: string) => guessesSet.has(guess);

  const addGuess = (guess: string) => {
    if (
      guess.length !== answer?.length ||
      status !== "play" ||
      hasGuess(guess)
    ) {
      return;
    }
    if (guess === answer) {
      setStatus("win");
    }
    setGuesses((prev) => [...prev, guess]);
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const fetchWord = async () => {
      setStatus("loading");
      try {
        const resp = await fetch(DEFAULT_WORDS_API, {
          signal: controller.signal,
        });
        const data: { record: string[] } = await resp.json();
        const words: string[] = data.record;
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (mounted) {
          setAnswer(randomWord);
        }
      } catch (error: any) {
        // maybe figure this out?
        if (error.name === "AbortError") {
          console.log("Fetching aborted");
        } else {
          console.log("An error has occurred while fetching");
          console.log(error);
        }
        setStatus("error");
      } finally {
        setStatus("play");
      }
    };
    fetchWord();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return { answer, status, guesses, hasGuess, addGuess };
};

export default useWordle;
