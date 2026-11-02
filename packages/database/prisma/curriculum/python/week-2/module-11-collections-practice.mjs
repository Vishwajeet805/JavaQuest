import { buildPythonModule } from "../shared/module-builder.mjs";
export const pythonCollectionsPracticeModule = buildPythonModule({
  slug: "python-week-2-collections-practice", title: "Python 11 — Choosing the Right Collection", position: 11,
  description: "Lists, tuples, sets aur dictionaries ko combine karke solve karo.",
  quests: [
    {
      slug: "frequency-counter", title: "Frequency Counter", description: "Dictionary se item counts build karo.",
      conceptTitle: "Frequency Counter", concept: "Frequency counter pattern mein dictionary value ko increment karte hain. get(item, 0) missing count ko zero se start karta hai. Ye words, votes aur events count karne mein useful hai.",
      example: "~~~python\nwords = ['hi', 'hey', 'hi']\ncounts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['hi'])\n~~~\nOutput: 2.", recap: "Dictionary se item counts build karo. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Frequency Counter", prompt: "Python code likho: letters = ['a', 'b', 'a']\ncounts = {}\nfor ch in letters:\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts['a'])",
      starter: "# Write your solution below\n", solution: "words = ['hi', 'hey', 'hi']\ncounts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['hi'])", expected: "2",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nwords = ['hi', 'hey', 'hi']\ncounts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\nprint(counts['hi'])\n~~~", predictionAnswer: "2",
    },
    {
      slug: "deduplicate-sort", title: "Deduplicate & Sort", description: "Set aur sorted() se clean data banao.",
      conceptTitle: "Deduplicate & Sort", concept: "set() duplicates remove karta hai, lekin order preserve nahi karta. sorted() iterable se nayi sorted list return karta hai. Stable output chahiye to sorted(set(values)) use karo.",
      example: "~~~python\nids = [4, 2, 4, 1]\nprint(sorted(set(ids)))\n~~~\nOutput: [1, 2, 4].", recap: "Set aur sorted() se clean data banao. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Deduplicate & Sort", prompt: "Python code likho: values = ['b', 'a', 'b']\nprint(sorted(set(values)))",
      starter: "# Write your solution below\n", solution: "ids = [4, 2, 4, 1]\nprint(sorted(set(ids)))", expected: "[1, 2, 4]",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nids = [4, 2, 4, 1]\nprint(sorted(set(ids)))\n~~~", predictionAnswer: "[1, 2, 4]",
    },
    {
      slug: "transform-filter", title: "Transform & Filter", description: "Comprehension se data pipeline banao.",
      conceptTitle: "Transform & Filter", concept: "Comprehensions filtering aur transformation combine karte hain. [f(x) for x in data if condition] pehle condition check karta hai, phir expression output list mein add karta hai.",
      example: "~~~python\nprices = [100, 250, 80]\nlarge = [p for p in prices if p >= 100]\nprint(large)\n~~~\nOutput: [100, 250].", recap: "Comprehension se data pipeline banao. Core concept aur syntax ko small examples ke saath practice karo.",
      exerciseTitle: "Practice: Transform & Filter", prompt: "Python code likho: nums = [1, 2, 3]\nprint([n*2 for n in nums if n > 1])",
      starter: "# Write your solution below\n", solution: "prices = [100, 250, 80]\nlarge = [p for p in prices if p >= 100]\nprint(large)", expected: "[100, 250]",
      predictionPrompt: "Is code ka output kya hoga?\n~~~python\nprices = [100, 250, 80]\nlarge = [p for p in prices if p >= 100]\nprint(large)\n~~~", predictionAnswer: "[100, 250]",
    }
  ],
});
