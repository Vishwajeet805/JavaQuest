import { buildPythonModule } from "../shared/module-builder.mjs";
export const pythonListsModule = buildPythonModule({
  slug: "python-week-2-lists", title: "Python 8 — Lists & Mutability", position: 8,
  description: "List creation, indexing, mutation aur iteration.",
  quests: [
    {
      slug: "list-basics", title: "List Basics", description: "Ordered collection mein multiple values rakho.",
      conceptTitle: "List Basics", concept: "List ordered aur mutable collection hai. Indexing, slicing aur len() supported hain. Empty list [] se banti hai; mixed data types bhi store kar sakti hai.",
      example: "~~~python\nscores = [70, 85, 92]\nprint(scores[1])\n~~~\nOutput: 85.", recap: "Ordered collection mein multiple values rakho. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: List Basics", prompt: "Python code likho: items = ['a', 'b', 'c']\nprint(len(items))",
      starter: "# Write your solution below\n", solution: "scores = [70, 85, 92]\nprint(scores[1])", expected: "85",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nscores = [70, 85, 92]\nprint(scores[1])\n~~~", predictionAnswer: "85",
    },
    {
      slug: "list-mutation", title: "List Methods & Mutation", description: "List ko safely update karo.",
      conceptTitle: "List Methods & Mutation", concept: "append() end par ek item add karta hai; extend() iterable ke items add karta hai. insert() position par add, remove() value delete, pop() item return karke remove karta hai. sort() list ko in-place sort karta hai.",
      example: "~~~python\ntasks = ['read', 'code']\ntasks.append('test')\nprint(tasks)\n~~~\nOutput: ['read', 'code', 'test'].", recap: "List ko safely update karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: List Methods & Mutation", prompt: "Python code likho: nums = [3, 1, 2]\nnums.sort()\nprint(nums)",
      starter: "# Write your solution below\n", solution: "tasks = ['read', 'code']\ntasks.append('test')\nprint(tasks)", expected: "['read', 'code', 'test']",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\ntasks = ['read', 'code']\ntasks.append('test')\nprint(tasks)\n~~~", predictionAnswer: "['read', 'code', 'test']",
    },
    {
      slug: "list-patterns", title: "List Iteration & Patterns", description: "Lists par loops aur comprehensions use karo.",
      conceptTitle: "List Iteration & Patterns", concept: "for loop se list traverse karo. enumerate() index aur value deta hai. List comprehension concise transformed list banata hai: [expression for item in iterable if condition].",
      example: "~~~python\nvalues = [1, 2, 3, 4]\nsquares = [n*n for n in values]\nprint(squares)\n~~~\nOutput: [1, 4, 9, 16].", recap: "Lists par loops aur comprehensions use karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: List Iteration & Patterns", prompt: "Python code likho: names = ['A', 'B']\nfor i, name in enumerate(names):\n    print(i, name)",
      starter: "# Write your solution below\n", solution: "values = [1, 2, 3, 4]\nsquares = [n*n for n in values]\nprint(squares)", expected: "[1, 4, 9, 16]",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nvalues = [1, 2, 3, 4]\nsquares = [n*n for n in values]\nprint(squares)\n~~~", predictionAnswer: "[1, 4, 9, 16]",
    }
  ],
});
