import { buildPythonModule } from "../shared/module-builder.mjs";
export const pythonProblemSolvingModule = buildPythonModule({
  slug: "python-week-2-problem-solving", title: "Python 12 — Problem Solving Patterns", position: 12,
  description: "Input breakdown, edge cases, searching aur aggregation.",
  quests: [
    {
      slug: "break-down-problem", title: "Break Down a Problem", description: "Problem ko small executable steps mein convert karo.",
      conceptTitle: "Break Down a Problem", concept: "Problem solving: input identify karo, expected output define karo, examples/edge cases likho, algorithm steps banao, phir code. Pehle simplest correct solution; baad mein optimize.",
      example: "~~~python\nnumbers = [5, 2, 9]\nprint(max(numbers))\n~~~\nOutput: 9.", recap: "Problem ko small executable steps mein convert karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Break Down a Problem", prompt: "Python code likho: values = [8, 3, 6]\nprint(min(values))",
      starter: "# Write your solution below\n", solution: "numbers = [5, 2, 9]\nprint(max(numbers))", expected: "9",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nnumbers = [5, 2, 9]\nprint(max(numbers))\n~~~", predictionAnswer: "9",
    },
    {
      slug: "search-aggregate", title: "Search & Aggregate", description: "Collections scan karke answer nikalo.",
      conceptTitle: "Search & Aggregate", concept: "Linear search items ko one-by-one check karta hai; worst case O(n). Aggregation mein sum, min, max ya custom accumulator use hota hai. Empty collection ka behavior pehle decide karo.",
      example: "~~~python\nscores = [45, 80, 75]\npassed = [s for s in scores if s >= 50]\nprint(len(passed))\n~~~\nOutput: 2.", recap: "Collections scan karke answer nikalo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Search & Aggregate", prompt: "Python code likho: nums = [2, 4, 6]\nprint(sum(nums))",
      starter: "# Write your solution below\n", solution: "scores = [45, 80, 75]\npassed = [s for s in scores if s >= 50]\nprint(len(passed))", expected: "2",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nscores = [45, 80, 75]\npassed = [s for s in scores if s >= 50]\nprint(len(passed))\n~~~", predictionAnswer: "2",
    },
    {
      slug: "edge-cases-tests", title: "Edge Cases & Testing", description: "Boundary cases se solution verify karo.",
      conceptTitle: "Edge Cases & Testing", concept: "Edge cases: empty input, one item, duplicates, negative values, missing keys aur unexpected casing. Har problem ke normal, boundary aur invalid examples test karo. Assertions simple checks automate karte hain.",
      example: "~~~python\ndef average(values):\n    if not values:\n        return 0\n    return sum(values) / len(values)\nassert average([]) == 0\nprint(average([2, 4]))\n~~~\nOutput: 3.0.", recap: "Boundary cases se solution verify karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Edge Cases & Testing", prompt: "Python code likho: assert 2 + 2 == 4\nprint('tests passed')",
      starter: "# Write your solution below\n", solution: "def average(values):\n    if not values:\n        return 0\n    return sum(values) / len(values)\nassert average([]) == 0\nprint(average([2, 4]))", expected: "3.0",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\ndef average(values):\n    if not values:\n        return 0\n    return sum(values) / len(values)\nassert average([]) == 0\nprint(average([2, 4]))\n~~~", predictionAnswer: "3.0",
    }
  ],
});
