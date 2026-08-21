import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const prisma = new PrismaClient();

async function main() {
  const salt = randomBytes(16).toString("hex");
  const key = await promisify(scrypt)("AdminPass123!", salt, 64);
  await prisma.user.upsert({
    where: { email: "admin@javaquets.dev" },
    update: { role: "ADMIN", passwordHash: `scrypt$${salt}$${key.toString("hex")}` },
    create: { email: "admin@javaquets.dev", displayName: "JavaQuets Admin", role: "ADMIN", passwordHash: `scrypt$${salt}$${key.toString("hex")}` },
  });
  const courseSlug = "java-foundations";

  await prisma.course.deleteMany({ where: { slug: courseSlug } });

  await prisma.course.create({
    data: {
      slug: courseSlug,
      title: "Java Foundations",
      description: "Build a strong Java base through short lessons and focused practice quests.",
      status: "PUBLISHED",
      difficulty: "BEGINNER",
      modules: {
        create: [
          {
            slug: "getting-started",
            title: "Getting Started",
            description: "Understand Java programs, values, variables, and basic output.",
            position: 1,
            quests: {
              create: [
                {
                  slug: "hello-java",
                  title: "Hello, Java",
                  description: "Learn the shape of a Java program and print your first output.",
                  status: "PUBLISHED",
                  difficulty: "BEGINNER",
                  position: 1,
                  estimatedMinutes: 15,
                  lessons: {
                    create: [
                      {
                        slug: "program-shape",
                        title: "The Shape of a Java Program",
                        kind: "THEORY",
                        position: 1,
                        content: "A Java program is organized into classes. Execution starts in the main method for a basic command-line program.",
                      },
                      {
                        slug: "printing-output",
                        title: "Printing Output",
                        kind: "EXAMPLE",
                        position: 2,
                        content: "Use System.out.println(...) to print a value followed by a new line.",
                      },
                    ],
                  },
                  exercises: {
                    create: [
                      {
                        slug: "print-javaquets",
                        title: "Print JavaQuets",
                        prompt: "Complete the program so it prints exactly: JavaQuets",
                        kind: "CODE",
                        difficulty: "BEGINNER",
                        position: 1,
                        starterCode: "public class Main {\n  public static void main(String[] args) {\n    // your code here\n  }\n}",
                        solution: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"JavaQuets\");\n  }\n}",
                        testCases: {
                          create: [
                            { position: 1, expectedOutput: "JavaQuets", isHidden: false },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  slug: "variables-and-types",
                  title: "Variables & Types",
                  description: "Store values in variables and understand Java's basic primitive types.",
                  status: "PUBLISHED",
                  difficulty: "BEGINNER",
                  position: 2,
                  estimatedMinutes: 20,
                  lessons: {
                    create: [
                      {
                        slug: "declaring-variables",
                        title: "Declaring Variables",
                        kind: "THEORY",
                        position: 1,
                        content: "A variable declaration gives a value a type and a name, for example: int score = 10;",
                      },
                    ],
                  },
                  exercises: {
                    create: [
                      {
                        slug: "predict-variable-output",
                        title: "Predict the Output",
                        prompt: "What does this print? int level = 3; System.out.println(level);",
                        kind: "OUTPUT_PREDICTION",
                        difficulty: "BEGINNER",
                        position: 1,
                        solution: "3",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seeded Java Foundations curriculum.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
