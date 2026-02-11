export type LetterState = "correct" | "present" | "absent"; // maybe in it's own thing

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(guess.length).fill("absent");
  const answerFreq: Record<string, number> = {};

  for (const char of answer) {
    answerFreq[char] = (answerFreq[char] || 0) + 1;
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "correct";
      answerFreq[guess[i]] = answerFreq[guess[i]] - 1;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;

    if (answerFreq[guess[i]] > 0) {
      result[i] = "present";
      answerFreq[guess[i]] = answerFreq[guess[i]] - 1;
    }
  }

  return result;
}

export function evaluateGuesses(
  guesses: string[],
  answer: string,
): LetterState[][] {
  return guesses.map((guess) => evaluateGuess(guess, answer));
}
