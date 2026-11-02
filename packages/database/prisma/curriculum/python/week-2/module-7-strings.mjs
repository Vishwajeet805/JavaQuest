import { buildPythonModule } from "../shared/module-builder.mjs";
export const pythonStringsModule = buildPythonModule({
  slug: "python-week-2-strings", title: "Python 7 — Strings & Text Processing", position: 7,
  description: "String indexing, slicing, methods aur text processing.",
  quests: [
    {
      slug: "string-indexing", title: "String Indexing", description: "Characters ko index se access karo.",
      conceptTitle: "String Indexing", concept: "String indexing zero se start hoti hai. Negative index end se count karta hai: text[-1] last character deta hai. Strings immutable hoti hain, direct character assignment allowed nahi.",
      example: "~~~python\nword = 'Python'\nprint(word[0])\nprint(word[-1])\n~~~\nOutput: P, o.", recap: "Characters ko index se access karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: String Indexing", prompt: "Python code likho: word = 'Python'\nprint(word[1])",
      starter: "# Write your solution below\n", solution: "word = 'Python'\nprint(word[0])\nprint(word[-1])", expected: "P\no",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nword = 'Python'\nprint(word[0])\nprint(word[-1])\n~~~", predictionAnswer: "P\no",
    },
    {
      slug: "slicing-methods", title: "Slicing & Methods", description: "Text ko slice aur clean karo.",
      conceptTitle: "Slicing & Methods", concept: "slice[start:stop:step] stop ko include nahi karta. Common methods: lower(), upper(), strip(), replace(), split(), join(). Methods original string mutate nahi karte; nayi string return karte hain.",
      example: "~~~python\nname = '  Python Quest  '\nprint(name.strip().upper())\n~~~\nOutput: PYTHON QUEST.", recap: "Text ko slice aur clean karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Slicing & Methods", prompt: "Python code likho: text = 'python'\nprint(text[1:4])",
      starter: "# Write your solution below\n", solution: "name = '  Python Quest  '\nprint(name.strip().upper())", expected: "PYTHON QUEST",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nname = '  Python Quest  '\nprint(name.strip().upper())\n~~~", predictionAnswer: "PYTHON QUEST",
    },
    {
      slug: "text-processing", title: "Text Processing", description: "Text se useful information extract karo.",
      conceptTitle: "Text Processing", concept: "in operator substring check karta hai. count() occurrences count karta hai, find() first index deta hai ya -1. f-string se values readable text mein insert hoti hain.",
      example: "~~~python\nmessage = 'learn python python'\nprint(message.count('python'))\n~~~\nOutput: 2.", recap: "Text se useful information extract karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Text Processing", prompt: "Python code likho: line = 'red,blue,green'\nprint(line.split(','))",
      starter: "# Write your solution below\n", solution: "message = 'learn python python'\nprint(message.count('python'))", expected: "2",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nmessage = 'learn python python'\nprint(message.count('python'))\n~~~", predictionAnswer: "2",
    }
  ],
});
