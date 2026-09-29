function normalizePredictionAnswer(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function predictionAnswersMatch(
  submittedAnswer: string,
  expectedAnswer: string,
) {
  return (
    normalizePredictionAnswer(submittedAnswer) ===
    normalizePredictionAnswer(expectedAnswer)
  );
}