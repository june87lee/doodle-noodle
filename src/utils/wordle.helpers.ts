export type LetterState = "correct" | "present" | "absent"; // maybe in it's own thing

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(guess.length).fill("absent");
  const answerChars = answer.split("");

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = "_"; // mark as used
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;

    const idx = answerChars.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      answerChars[idx] = "_";
    }
  }

  return result;
}
