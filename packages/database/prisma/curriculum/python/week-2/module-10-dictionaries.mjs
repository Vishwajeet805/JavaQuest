import { buildPythonModule } from "../shared/module-builder.mjs";
export const pythonDictionariesModule = buildPythonModule({
  slug: "python-week-2-dictionaries", title: "Python 10 — Dictionaries & Data Modeling", position: 10,
  description: "Key-value data, safe access, iteration aur nested structures.",
  quests: [
    {
      slug: "dict-basics", title: "Dictionary Basics", description: "Key-value pairs mein structured data rakho.",
      conceptTitle: "Dictionary Basics", concept: "Dictionary mutable key-value mapping hai. Keys unique aur hashable hoti hain. Literal syntax {'name': 'Asha'} hai. Value access dict[key] se hota hai; missing key par KeyError aa sakta hai.",
      example: "~~~python\nstudent = {'name': 'Asha', 'score': 88}\nprint(student['score'])\n~~~\nOutput: 88.", recap: "Key-value pairs mein structured data rakho. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Dictionary Basics", prompt: "Python code likho: profile = {'city': 'Jabalpur'}\nprint(profile['city'])",
      starter: "# Write your solution below\n", solution: "student = {'name': 'Asha', 'score': 88}\nprint(student['score'])", expected: "88",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nstudent = {'name': 'Asha', 'score': 88}\nprint(student['score'])\n~~~", predictionAnswer: "88",
    },
    {
      slug: "dict-methods", title: "Safe Access & Methods", description: "Dictionary ko robustly read/update karo.",
      conceptTitle: "Safe Access & Methods", concept: "get(key, default) missing key par safe fallback deta hai. update() multiple values merge karta hai; pop() key remove karke value return karta hai. in operator keys check karta hai.",
      example: "~~~python\nuser = {'name': 'Dev'}\nprint(user.get('role', 'learner'))\n~~~\nOutput: learner.", recap: "Dictionary ko robustly read/update karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Safe Access & Methods", prompt: "Python code likho: data = {'a': 1}\ndata.update({'b': 2})\nprint(len(data))",
      starter: "# Write your solution below\n", solution: "user = {'name': 'Dev'}\nprint(user.get('role', 'learner'))", expected: "learner",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nuser = {'name': 'Dev'}\nprint(user.get('role', 'learner'))\n~~~", predictionAnswer: "learner",
    },
    {
      slug: "nested-dicts", title: "Nested Data & Iteration", description: "Real-world records model karo.",
      conceptTitle: "Nested Data & Iteration", concept: "Nested dictionaries/lists JSON-like data represent karte hain. items() key-value pairs deta hai. Nested access mein har level ka key/index sahi hona chahiye.",
      example: "~~~python\norder = {'item': 'book', 'price': 250}\nfor key, value in order.items():\n    print(key, value)\n~~~\nOutput: item book, price 250.", recap: "Real-world records model karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Nested Data & Iteration", prompt: "Python code likho: course = {'python': {'level': 'beginner'}}\nprint(course['python']['level'])",
      starter: "# Write your solution below\n", solution: "order = {'item': 'book', 'price': 250}\nfor key, value in order.items():\n    print(key, value)", expected: "item book\nprice 250",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\norder = {'item': 'book', 'price': 250}\nfor key, value in order.items():\n    print(key, value)\n~~~", predictionAnswer: "item book\nprice 250",
    }
  ],
});
