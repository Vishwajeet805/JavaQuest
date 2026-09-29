import { describe, expect, it } from "vitest";
import { predictionAnswersMatch } from "./answer-validation.js";

describe("prediction answer comparison", () => {
  it("accepts matching multiline output with CRLF and trailing whitespace", () => {
    expect(predictionAnswersMatch("4  \r\n72.5 \t", "4\n72.5")).toBe(
      true,
    );
  });

  it("rejects incorrect lines and meaningful internal whitespace", () => {
    expect(predictionAnswersMatch("4\n72.4", "4\n72.5")).toBe(false);
    expect(predictionAnswersMatch("4\n72.5 extra", "4\n72.5")).toBe(false);
  });

  it("continues to accept correct single-line answers", () => {
    expect(predictionAnswersMatch("done", "done")).toBe(true);
  });
});