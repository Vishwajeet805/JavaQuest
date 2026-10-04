import { PrismaClient } from "@prisma/client";



import { javaMasteryModules } from "./curriculum/index.mjs";



const prisma = new PrismaClient();





function createdItems(relation) {

  return relation?.create ?? [];

}



function sourceSlugs(items) {

  return items.map((item) => item.slug);

}



function maxPosition(rows) {

  return rows.reduce(

    (max, row) => Math.max(max, row.position),

    0,

  );

}



async function parkPositions(model, where, rows, sourceItems = []) {

  if (rows.length === 0) {

    return;

  }



  const highestPosition = Math.max(

    maxPosition(rows),

    ...sourceItems.map((item) => item.position),

    0,

  );



  const offset = highestPosition + rows.length + sourceItems.length + 1000;



  for (let index = 0; index < rows.length; index += 1) {

    await model.update({

      where: {

        id: rows[index].id,

      },

      data: {

        position: offset + index,

      },

    });

  }

}



async function assertNoProtectedExerciseData(

  tx,

  staleExercises,

  context,

  sourceExercises = [],

) {

  if (staleExercises.length === 0) {

    return;

  }



  const problems = [];



  for (const exercise of staleExercises) {

    const [submissions, progress] = await Promise.all([

      tx.submission.count({

        where: {

          exerciseId: exercise.id,

        },

      }),

      tx.exerciseProgress.count({

        where: {

          exerciseId: exercise.id,

        },

      }),

    ]);



    if (submissions > 0 || progress > 0) {

      problems.push({

        slug: exercise.slug,

        position: exercise.position,

        submissions,

        progress,

      });

    }

  }



  if (problems.length === 0) {

    return;

  }



  const staleDetails = problems

    .map(

      (exercise) =>

        `  - ${exercise.slug} | position ${exercise.position} | submissions ${exercise.submissions} | progress ${exercise.progress}`,

    )

    .join("\n");



  const sourceDetails =

    sourceExercises.length === 0

      ? "  (none)"

      : sourceExercises

          .map(

            (exercise) =>

              `  - ${exercise.slug} | position ${exercise.position}`,

          )

          .join("\n");



  throw new Error(

    [

      "",

      "STALE CURRICULUM EXERCISE DETECTED",

      `Context: ${context}`,

      "",

      "Stale DB exercise(s) with learner data:",

      staleDetails,

      "",

      "Current source exercise(s):",

      sourceDetails,

      "",

      "Seed stopped intentionally. No learner progress was deleted.",

    ].join("\n"),

  );

}



async function assertNoProtectedQuestData(tx, questIds, context) {

  if (questIds.length === 0) {

    return;

  }



  const progress = await tx.questProgress.count({

    where: {

      questId: {

        in: questIds,

      },

    },

  });



  const exercises = await tx.exercise.findMany({

    where: {

      questId: {

        in: questIds,

      },

    },

    select: {

      id: true,

      slug: true,

    position: true,

    },

  });



  await assertNoProtectedExerciseData(
    tx,
    exercises,
    context,
  );



  if (progress > 0) {

    throw new Error(

      `Refusing to delete stale quests in ${context}: ` +

        `${progress} quest progress row(s) still reference them. ` +

        "Preserve/rename the source slug or add an explicit data migration.",

    );

  }

}



async function syncTestCases(tx, exerciseId, testCasesRelation) {

  const testCases = createdItems(testCasesRelation);



  // TestCase has no user-owned relations. Replacing this child collection

  // guarantees that removed/renumbered hidden tests cannot remain stale.

  await tx.testCase.deleteMany({

    where: {

      exerciseId,

    },

  });



  for (const testCase of testCases) {

    await tx.testCase.create({

      data: {

        exerciseId,

        position: testCase.position,

        input: testCase.input ?? null,

        expectedOutput: testCase.expectedOutput,

        isHidden: testCase.isHidden ?? false,

      },

    });

  }

}



async function syncExercises(tx, questId, exercisesRelation) {

  const exercises = createdItems(exercisesRelation);

// Explicit curriculum identity migrations.

// Preserve the existing Exercise row/ID so learner progress remains attached.

const exerciseSlugMigrations = {
  // Week 4 legacy migration
  "inheritance-parent-aur-child-class-check":
    "inheritance-parent-aur-child-class-concept-check",

  // Week 5 legacy migration
  "arraylist-list-why-list-check":
    "arraylist-list-why-list-concept-check",
};



for (const [oldSlug, newSlug] of Object.entries(exerciseSlugMigrations)) {

  const sourceExercise = exercises.find(

    (exercise) => exercise.slug === newSlug,

  );



  if (!sourceExercise) {

    continue;

  }



  const oldExercise = await tx.exercise.findUnique({

    where: {

      questId_slug: {

        questId,

        slug: oldSlug,

      },

    },

  });



  if (!oldExercise) {

    continue;

  }



  const newExercise = await tx.exercise.findUnique({

    where: {

      questId_slug: {

        questId,

        slug: newSlug,

      },

    },

  });



  if (newExercise) {
    throw new Error(
      `Cannot migrate exercise slug ${oldSlug} -> ${newSlug}: both rows already exist.`,
    );
  }

  // This is an explicit identity migration, so the current DB position is
  // intentionally not used as an identity check. A previously interrupted
  // seed may have left the row at a temporary parked position. The existing
  // Exercise row/ID is preserved here; parkPositions() below will safely move
  // it out of the way and the normal upsert will restore the source position.
  console.log(
    `Migrating exercise identity: ${oldSlug} -> ${newSlug} ` +
      `(DB position ${oldExercise.position} -> source position ${sourceExercise.position})`,
  );



  await tx.exercise.update({

    where: {

      id: oldExercise.id,

    },

    data: {

      slug: newSlug,

    },

  });

}

  const existing = await tx.exercise.findMany({

    where: {

      questId,

    },

    select: {

      id: true,

      slug: true,

      position: true,

    },

  });



  // Move existing rows out of the source position range first. This makes

  // position swaps safe while preserving stable exercise IDs.

  await parkPositions(

    tx.exercise,

    { questId },

    existing,

    exercises,

  );



  const wantedSlugs = new Set(sourceSlugs(exercises));

  const stale = existing.filter(

    (exercise) => !wantedSlugs.has(exercise.slug),

  );



  await assertNoProtectedExerciseData(

  tx,

  stale,

  `quest ${questId}`,

  exercises,

);



  if (stale.length > 0) {

    await tx.exercise.deleteMany({

      where: {

        id: {

          in: stale.map((exercise) => exercise.id),

        },

      },

    });

  }



  for (const exercise of exercises) {

    const savedExercise = await tx.exercise.upsert({

      where: {

        questId_slug: {

          questId,

          slug: exercise.slug,

        },

      },



      update: {

        title: exercise.title,

        prompt: exercise.prompt,

        kind: exercise.kind,

        difficulty: exercise.difficulty ?? "BEGINNER",

        position: exercise.position,

        starterCode: exercise.starterCode ?? null,

        solution: exercise.solution ?? null,

        executionTimeoutMs: exercise.executionTimeoutMs ?? 5000,

      },



      create: {

        questId,

        slug: exercise.slug,

        title: exercise.title,

        prompt: exercise.prompt,

        kind: exercise.kind,

        difficulty: exercise.difficulty ?? "BEGINNER",

        position: exercise.position,

        starterCode: exercise.starterCode ?? null,

        solution: exercise.solution ?? null,

        executionTimeoutMs: exercise.executionTimeoutMs ?? 5000,

      },

    });



    await syncTestCases(

      tx,

      savedExercise.id,

      exercise.testCases,

    );

  }

}



async function syncLessons(tx, questId, lessonsRelation) {

  const lessons = createdItems(lessonsRelation);



  const existing = await tx.lesson.findMany({

    where: {

      questId,

    },

    select: {

      id: true,

      slug: true,

      position: true,

    },

  });



  await parkPositions(

    tx.lesson,

    { questId },

    existing,

    lessons,

  );



  // Lesson currently has no learner-progress/submission relation, so stale

  // lesson rows can be removed without destroying learner-owned records.

  const wantedSlugs = new Set(sourceSlugs(lessons));

  const staleIds = existing

    .filter((lesson) => !wantedSlugs.has(lesson.slug))

    .map((lesson) => lesson.id);



  if (staleIds.length > 0) {

    await tx.lesson.deleteMany({

      where: {

        id: {

          in: staleIds,

        },

      },

    });

  }



  for (const lesson of lessons) {

    await tx.lesson.upsert({

      where: {

        questId_slug: {

          questId,

          slug: lesson.slug,

        },

      },



      update: {

        title: lesson.title,

        kind: lesson.kind ?? "THEORY",

        content: lesson.content,

        position: lesson.position,

      },



      create: {

        questId,

        slug: lesson.slug,

        title: lesson.title,

        kind: lesson.kind ?? "THEORY",

        content: lesson.content,

        position: lesson.position,

      },

    });

  }

}



async function syncQuests(tx, moduleId, questsRelation) {

  const quests = createdItems(questsRelation);



  const existing = await tx.quest.findMany({

    where: {

      moduleId,

    },

    select: {

      id: true,

      slug: true,

      position: true,

    },

  });



  await parkPositions(

    tx.quest,

    { moduleId },

    existing,

    quests,

  );



  const wantedSlugs = new Set(sourceSlugs(quests));

  const stale = existing.filter(

    (quest) => !wantedSlugs.has(quest.slug),

  );



  await assertNoProtectedQuestData(

    tx,

    stale.map((quest) => quest.id),

    `module ${moduleId}`,

  );



  if (stale.length > 0) {

    await tx.quest.deleteMany({

      where: {

        id: {

          in: stale.map((quest) => quest.id),

        },

      },

    });

  }



  for (const quest of quests) {

    const savedQuest = await tx.quest.upsert({

      where: {

        slug: quest.slug,

      },



      update: {

        moduleId,

        title: quest.title,

        description: quest.description,

        status: quest.status ?? "DRAFT",

        difficulty: quest.difficulty ?? "BEGINNER",

        position: quest.position,

        estimatedMinutes: quest.estimatedMinutes ?? 15,

      },



      create: {

        moduleId,

        slug: quest.slug,

        title: quest.title,

        description: quest.description,

        status: quest.status ?? "DRAFT",

        difficulty: quest.difficulty ?? "BEGINNER",

        position: quest.position,

        estimatedMinutes: quest.estimatedMinutes ?? 15,

      },

    });



    await syncLessons(

      tx,

      savedQuest.id,

      quest.lessons,

    );



    await syncExercises(

      tx,

      savedQuest.id,

      quest.exercises,

    );

  }

}



async function syncModules(tx, courseId, modules) {

  const existing = await tx.courseModule.findMany({

    where: {

      courseId,

    },

    select: {

      id: true,

      slug: true,

      position: true,

    },

  });



  await parkPositions(

    tx.courseModule,

    { courseId },

    existing,

    modules,

  );



  const wantedSlugs = new Set(sourceSlugs(modules));

  const staleModules = existing.filter(

    (module) => !wantedSlugs.has(module.slug),

  );



  for (const staleModule of staleModules) {

    const staleQuests = await tx.quest.findMany({

      where: {

        moduleId: staleModule.id,

      },

      select: {

        id: true,

      },

    });



    await assertNoProtectedQuestData(

      tx,

      staleQuests.map((quest) => quest.id),

      `module ${staleModule.slug}`,

    );

  }



  if (staleModules.length > 0) {

    await tx.courseModule.deleteMany({

      where: {

        id: {

          in: staleModules.map((module) => module.id),

        },

      },

    });

  }



  for (const module of modules) {

    console.log(

      `Syncing module ${module.position}: ${module.title}`,

    );



    const savedModule =

      await tx.courseModule.upsert({

        where: {

          courseId_slug: {

            courseId,

            slug: module.slug,

          },

        },



        update: {

          title: module.title,

          description:

            module.description ?? null,

          position: module.position,

        },



        create: {

          courseId,

          slug: module.slug,

          title: module.title,

          description:

            module.description ?? null,

          position: module.position,

        },

      });



    await syncQuests(

      tx,

      savedModule.id,

      module.quests,

    );

  }

}



async function verifyCurriculum(tx, courseId, modules) {

  const dbModules = await tx.courseModule.findMany({

    where: {

      courseId,

    },

    include: {

      quests: {

        include: {

          lessons: true,

          exercises: {

            include: {

              testCases: true,

            },

          },

        },

      },

    },

  });



  if (dbModules.length !== modules.length) {

    throw new Error(

      `Curriculum convergence failed: source has ${modules.length} modules, DB has ${dbModules.length}.`,

    );

  }



  for (const module of modules) {

    const dbModule = dbModules.find(

      (candidate) => candidate.slug === module.slug,

    );



    if (!dbModule || dbModule.position !== module.position) {

      throw new Error(

        `Curriculum convergence failed for module ${module.slug}.`,

      );

    }



    const quests = createdItems(module.quests);



    if (dbModule.quests.length !== quests.length) {

      throw new Error(

        `Curriculum convergence failed for module ${module.slug}: quest count differs.`,

      );

    }



    for (const quest of quests) {

      const dbQuest = dbModule.quests.find(

        (candidate) => candidate.slug === quest.slug,

      );



      if (!dbQuest || dbQuest.position !== quest.position) {

        throw new Error(

          `Curriculum convergence failed for quest ${quest.slug}.`,

        );

      }



      const lessons = createdItems(quest.lessons);

      const exercises = createdItems(quest.exercises);



      if (dbQuest.lessons.length !== lessons.length) {

        throw new Error(

          `Curriculum convergence failed for quest ${quest.slug}: lesson count differs.`,

        );

      }



      if (dbQuest.exercises.length !== exercises.length) {

        throw new Error(

          `Curriculum convergence failed for quest ${quest.slug}: exercise count differs.`,

        );

      }



      for (const exercise of exercises) {

        const dbExercise = dbQuest.exercises.find(

          (candidate) => candidate.slug === exercise.slug,

        );



        if (!dbExercise || dbExercise.position !== exercise.position) {

          throw new Error(

            `Curriculum convergence failed for exercise ${quest.slug}/${exercise.slug}.`,

          );

        }



        const testCases = createdItems(exercise.testCases);



        if (dbExercise.testCases.length !== testCases.length) {

          throw new Error(

            `Curriculum convergence failed for exercise ${quest.slug}/${exercise.slug}: test count differs.`,

          );

        }

      }

    }

  }



  console.log("Curriculum source ↔ database convergence verified.");

}



async function main() {

  // --------------------------------------------

  // ADMIN

  // --------------------------------------------



  // Curriculum seeding must never rotate an existing account password.

  // The bootstrap admin is created only if it does not already exist.

  await prisma.user.upsert({

    where: {

      email: "admin@javaquets.dev",

    },



    update: {

      role: "ADMIN",

    },



    create: {

      email: "admin@javaquets.dev",

      displayName: "JavaQuets Admin",

      role: "ADMIN",

      passwordHash: null,

    },

  });



  // --------------------------------------------

  // COURSE

  // --------------------------------------------



  const course = await prisma.course.upsert({

    where: {

      slug: "java-foundations",

    },



    update: {

      title: "Java Mastery Path",

      description:

        "8-stage self-paced Java journey — basics se advanced tak. Short Hinglish lessons, coding challenges, practice quests aur milestone projects ke through seekho.",

      status: "PUBLISHED",

      difficulty: "BEGINNER",

    },



    create: {

      slug: "java-foundations",

      title: "Java Mastery Path",

      description:

        "8-stage self-paced Java journey — basics se advanced tak. Short Hinglish lessons, coding challenges, practice quests aur milestone projects ke through seekho.",

      status: "PUBLISHED",

      difficulty: "BEGINNER",

    },

  });



  // --------------------------------------------

  // CURRICULUM

  // --------------------------------------------





      await syncModules(

        prisma,

        course.id,

        javaMasteryModules,

      );



      await verifyCurriculum(

        prisma,

        course.id,

        javaMasteryModules,

      );





  console.log(

    "Safely synced Java Foundations curriculum.",

  );

}



main()

  .catch((error) => {

    console.error(error);

    process.exitCode = 1;

  })

  .finally(async () => {

    await prisma.$disconnect();

  });
