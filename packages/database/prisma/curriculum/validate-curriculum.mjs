import { javaMasteryModules } from "./index.mjs";
import { pythonCourseModules } from "./python/index.mjs";

const allowedKinds = new Set(["MULTIPLE_CHOICE", "CODE", "OUTPUT_PREDICTION"]);

function validateCurriculum(modules, expectedCount, label) {
  const questSlugs = new Set();
  const modulePositions = new Set();
  let quests = 0, lessons = 0, exercises = 0, code = 0;

  for (const mod of modules) {
    if (modulePositions.has(mod.position)) throw new Error(`${label}: duplicate module position ${mod.position}`);
    modulePositions.add(mod.position);
    const questPositions = new Set();
    for (const quest of mod.quests?.create ?? []) {
      quests++;
      if (questSlugs.has(quest.slug)) throw new Error(`${label}: duplicate quest slug ${quest.slug}`);
      questSlugs.add(quest.slug);
      if (questPositions.has(quest.position)) throw new Error(`${label}: duplicate quest position in ${mod.slug}`);
      questPositions.add(quest.position);
      const lessonPositions = new Set();
      const exercisePositions = new Set();
      for (const lesson of quest.lessons?.create ?? []) {
        lessons++;
        if (lessonPositions.has(lesson.position)) throw new Error(`${label}: duplicate lesson position in ${quest.slug}`);
        lessonPositions.add(lesson.position);
        if (!lesson.content?.trim()) throw new Error(`${label}: empty lesson ${lesson.slug}`);
      }
      for (const exercise of quest.exercises?.create ?? []) {
        exercises++;
        if (!allowedKinds.has(exercise.kind)) throw new Error(`${label}: invalid exercise kind ${exercise.kind}`);
        if (exercisePositions.has(exercise.position)) throw new Error(`${label}: duplicate exercise position in ${quest.slug}`);
        exercisePositions.add(exercise.position);
        if (!exercise.prompt?.trim() || !exercise.solution) throw new Error(`${label}: incomplete exercise ${exercise.slug}`);
        if (exercise.kind === "CODE") {
          code++;
          if (!exercise.starterCode || !(exercise.testCases?.create ?? []).length) throw new Error(`${label}: incomplete CODE exercise ${exercise.slug}`);
        }
      }
    }
  }

  if (modules.length !== expectedCount) throw new Error(`${label}: expected ${expectedCount} modules, found ${modules.length}`);
  for (let position = 1; position <= expectedCount; position++) {
    if (!modulePositions.has(position)) throw new Error(`${label}: missing module position ${position}`);
  }
  return { modules: modules.length, quests, lessons, exercises, code };
}

const java = validateCurriculum(javaMasteryModules, 48, "Java");
const python = validateCurriculum(pythonCourseModules, 42, "Python");
console.log(JSON.stringify({ java, python }, null, 2));
console.log("Curriculum validation passed.");
