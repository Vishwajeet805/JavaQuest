export function buildPythonModule({ slug, title, description, position, quests }) {
  return {
    slug, title, description, position,
    quests: { create: quests.map((q, i) => ({
      slug: q.slug, title: q.title, description: q.description,
      status: "PUBLISHED", difficulty: q.difficulty ?? "BEGINNER",
      position: i + 1, estimatedMinutes: q.minutes ?? 15,
      lessons: { create: [
        { slug: q.slug + "-concept", title: q.conceptTitle, kind: "THEORY", position: 1, content: q.concept },
        { slug: q.slug + "-example", title: "Worked Example", kind: "EXAMPLE", position: 2, content: q.example },
        { slug: q.slug + "-recap", title: "Quick Recap", kind: "RECAP", position: 3, content: q.recap },
      ]},
      exercises: { create: [
        { slug: q.slug + "-coding", title: q.exerciseTitle, prompt: q.prompt, kind: "CODE", difficulty: q.difficulty ?? "BEGINNER", position: 1, starterCode: q.starter, solution: q.solution, testCases: { create: [{ position: 1, input: q.input ?? "", expectedOutput: q.expected, isHidden: false }, ...(q.hiddenExpected === undefined ? [] : [{ position: 2, input: q.hiddenInput ?? "", expectedOutput: q.hiddenExpected, isHidden: true }])] }},
        { slug: q.slug + "-predict", title: "Predict the Output", prompt: q.predictionPrompt, kind: "OUTPUT_PREDICTION", difficulty: q.difficulty ?? "BEGINNER", position: 2, solution: q.predictionAnswer },
      ]},
    }))},
  };
}
