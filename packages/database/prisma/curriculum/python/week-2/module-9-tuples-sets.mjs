import { buildPythonModule } from "../shared/module-builder.mjs";
export const pythonTuplesSetsModule = buildPythonModule({
  slug: "python-week-2-tuples-sets", title: "Python 9 — Tuples & Sets", position: 9,
  description: "Immutable tuples, unique sets aur set operations.",
  quests: [
    {
      slug: "tuple-basics", title: "Tuple Basics", description: "Fixed grouped data represent karo.",
      conceptTitle: "Tuple Basics", concept: "Tuple ordered aur immutable hota hai. Parentheses optional hain, lekin single-item tuple ke liye trailing comma zaroori hai: (5,). Unpacking se values variables mein assign hoti hain.",
      example: "~~~python\npoint = (4, 7)\nx, y = point\nprint(x + y)\n~~~\nOutput: 11.", recap: "Fixed grouped data represent karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Tuple Basics", prompt: "Python code likho: record = ('Mira', 21)\nprint(record[0])",
      starter: "# Write your solution below\n", solution: "point = (4, 7)\nx, y = point\nprint(x + y)", expected: "11",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\npoint = (4, 7)\nx, y = point\nprint(x + y)\n~~~", predictionAnswer: "11",
    },
    {
      slug: "set-basics", title: "Set & Unique Values", description: "Duplicates remove aur membership fast check karo.",
      conceptTitle: "Set & Unique Values", concept: "Set unordered unique elements ka collection hai. set() se banta hai; {} empty dictionary hota hai, empty set nahi. add(), discard() aur membership operator use karo.",
      example: "~~~python\ntags = {'python', 'api', 'python'}\nprint(len(tags))\n~~~\nOutput: 2.", recap: "Duplicates remove aur membership fast check karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Set & Unique Values", prompt: "Python code likho: colors = {'red', 'blue'}\ncolors.add('green')\nprint('green' in colors)",
      starter: "# Write your solution below\n", solution: "tags = {'python', 'api', 'python'}\nprint(len(tags))", expected: "2",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\ntags = {'python', 'api', 'python'}\nprint(len(tags))\n~~~", predictionAnswer: "2",
    },
    {
      slug: "set-operations", title: "Set Operations", description: "Collections compare karo.",
      conceptTitle: "Set Operations", concept: "Union (|) dono sets ke unique elements deta hai; intersection (&) common; difference (-) left-only; symmetric difference (^) non-common elements deta hai.",
      example: "~~~python\na = {1, 2, 3}\nb = {3, 4}\nprint(sorted(a & b))\n~~~\nOutput: [3].", recap: "Collections compare karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Set Operations", prompt: "Python code likho: a = {1, 2}\nb = {2, 3}\nprint(sorted(a | b))",
      starter: "# Write your solution below\n", solution: "a = {1, 2, 3}\nb = {3, 4}\nprint(sorted(a & b))", expected: "[3]",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\na = {1, 2, 3}\nb = {3, 4}\nprint(sorted(a & b))\n~~~", predictionAnswer: "[3]",
    }
  ],
});
