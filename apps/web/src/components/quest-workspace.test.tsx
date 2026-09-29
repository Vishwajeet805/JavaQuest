import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NonCodeAnswer } from "./quest-workspace";

function PredictionAnswerHarness({ onRun }: { onRun: () => void }) {
  const [answer, setAnswer] = useState("");

  return (
    <NonCodeAnswer
      answer={answer}
      setAnswer={setAnswer}
      busy={false}
      completed={false}
      answerCorrect={false}
      multiline
      label="What will the program output?"
      placeholder="Type the exact output..."
      onRun={onRun}
      onNext={vi.fn()}
    />
  );
}

afterEach(cleanup);

describe("prediction answer input", () => {
  it("inserts a newline on normal Enter without submitting", async () => {
    const onRun = vi.fn();
    const user = userEvent.setup();
    render(<PredictionAnswerHarness onRun={onRun} />);
    const answer = screen.getByRole("textbox", {
      name: "What will the program output?",
    });

    await user.type(answer, "4");
    await user.keyboard("{Enter}");

    expect((answer as HTMLTextAreaElement).value).toBe("4\n");
    expect(onRun).not.toHaveBeenCalled();
  });

  it("accepts multiline text and submits when Check answer is clicked", async () => {
    const onRun = vi.fn();
    const user = userEvent.setup();
    render(<PredictionAnswerHarness onRun={onRun} />);
    const answer = screen.getByRole("textbox", {
      name: "What will the program output?",
    });

    await user.type(answer, "4{Enter}72.5");
    expect((answer as HTMLTextAreaElement).value).toBe("4\n72.5");

    await user.click(screen.getByRole("button", { name: "Check answer →" }));
    expect(onRun).toHaveBeenCalledOnce();
  });

  it.each([
    ["Ctrl+Enter", { ctrlKey: true }],
    ["Cmd+Enter", { metaKey: true }],
  ])("submits with %s", (shortcut, modifiers) => {
    const onRun = vi.fn();
    render(<PredictionAnswerHarness onRun={onRun} />);
    const answer = screen.getByRole("textbox", {
      name: "What will the program output?",
    });
    fireEvent.change(answer, { target: { value: "4\n72.5" } });

    fireEvent.keyDown(answer, { key: "Enter", ...modifiers });

    expect(onRun).toHaveBeenCalledOnce();
  });
});