<div align="center">

# ⚔️ JavaQuets

### Learn Java by completing quests, solving challenges, debugging code, and building real projects.

**JavaQuets** is a full-stack, quest-based Java learning platform designed to take learners from their first line of Java to object-oriented programming, databases, software architecture, and complete projects.

Instead of passively reading tutorials, learners progress through a structured loop:

**Learn → Predict → Code → Debug → Challenge → Build**

---

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Web-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Full%20Stack-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo)

### [🚀 Live Application](https://java-quest-web-sable.vercel.app/) · [📦 Repository](https://github.com/vsingh13112006-art/JavaQuest)

</div>

---

## 📖 About JavaQuets

Learning programming should involve programming.

JavaQuets is built around that idea.

Traditional tutorials often follow:

```text
Read theory
    ↓
Watch examples
    ↓
Move to next topic
```

JavaQuets instead follows:

```text
Concept
   ↓
Example
   ↓
Predict
   ↓
Code
   ↓
Debug
   ↓
Challenge
   ↓
Module Build
   ↓
Capstone
```

Learners repeatedly apply concepts instead of only consuming them.

The curriculum starts highly guided and progressively removes assistance. By the later stages, learners are expected to read requirements, design solutions, debug problems, and build applications independently.

---

# ✨ Core Features

### 🗺️ Structured Learning Journey

The Java curriculum is organized as:

```text
Course
  ↓
Week
  ↓
Module
  ↓
Quest
  ↓
Lesson / Exercise
```

Each week represents a major learning milestone rather than presenting learners with one enormous flat list of lessons.

---

### ⚔️ Quest-Based Learning

Topics are broken into small focused quests containing combinations of:

- theory
- visual explanations
- worked examples
- output prediction
- coding exercises
- debugging exercises
- checkpoints
- challenges
- module builds

---

### 💻 Isolated Java & Python Execution

Coding exercises are not simple text comparisons.

Learner submissions are routed by course language and evaluated in isolated language-specific environments. Java uses the existing JDK runner; Python uses a dedicated Python 3.12 interpreter image. Neither Python execution nor its test evaluation depends on an online compiler API.

```text
Browser
   ↓
Web Application
   ↓
API
   ↓
Submission Service
   ↓
Isolated Java Runner
   ↓
Compile
   ↓
Execute
   ↓
Evaluate Test Cases
   ↓
Result
```

CODE exercises cannot simply be marked complete by calling the progress API directly.

---

### 🧠 Output Prediction

Not every programming skill requires writing an entire program.

Prediction exercises train learners to mentally execute code:

```java
int xp = 100;
xp += 50;

System.out.println(xp);
```

The learner must determine:

```text
150
```

This reinforces code tracing and program comprehension.

---

### 🐛 Debugging Challenges

Learners are intentionally given broken programs.

Example:

```java
Player player = Player();
```

They must identify and repair the issue:

```java
Player player = new Player();
```

Debugging is treated as a core programming skill rather than an afterthought.

---

### 🏆 Module Builds & Capstones

Concepts eventually combine into larger builds.

Examples include:

```text
Java XP Tracker
Student Result Analyzer
Player Profile System
JavaQuets Academy
Inventory Management System
Expense Tracker
Persistent Student Management System
Final Java Application
```

The amount of starter code decreases as the learner progresses.

---

### 📊 Progress Tracking

JavaQuets tracks learner progress across:

```text
Enrollment
   ↓
Course Progress
   ↓
Quest Progress
   ↓
Exercise Progress
```

Learners can leave and continue from their current position.

The course interface groups content by week and highlights the learner's current learning stage.

---

### 🎮 XP & Gamification

Learners earn XP for completing learning activities.

The progression system supports rewards for:

- exercise completion
- quest completion
- course milestones

Gamification is connected to actual learning progress rather than arbitrary clicks.

---

### 🔐 Authentication & Sessions

JavaQuets includes real authentication with server-managed sessions.

Learner routes use HttpOnly cookie sessions rather than trusting a client-provided user identity header.

Security work includes areas such as:

- session handling
- HTTP security
- abuse controls
- validation
- isolated execution safeguards
- structured application errors

---

### 🛡️ Admin & Platform Controls

The architecture contains dedicated learner and administrative functionality.

Curriculum content can be managed independently from learner progress while public curriculum APIs intentionally avoid exposing sensitive evaluator information such as solutions and hidden test cases.

---

# 🗺️ Java Mastery Path

JavaQuets is designed as an **8-week Core Java journey**.

| Week | Stage | Main Goal |
|---|---|---|
| **Week 1** | Java Foundations | Syntax and programming fundamentals |
| **Week 2** | Arrays, Strings & Problem Solving | Data processing and algorithmic thinking |
| **Week 3** | Object-Oriented Programming | Classes, objects and application modeling |
| **Week 4** | Advanced OOP | Inheritance, interfaces, abstraction and polymorphism |
| **Week 5** | Collections & Generics | Production-style data management |
| **Week 6** | Robust & Modern Java | Exceptions, files, lambdas and streams |
| **Week 7** | Database & JDBC | Persistent Java applications |
| **Week 8** | Java Mastery | Architecture, testing and final capstone |

---

## 🌱 Week 1 — Java Foundations

The learner starts from zero and builds a strong programming foundation.

```text
First Steps in Java
        ↓
Variables & Data Types
        ↓
Operators & Expressions
        ↓
User Input
        ↓
Conditions
        ↓
Loops
        ↓
Methods
        ↓
🏆 Java XP Tracker
```

Core topics include:

- Java program structure
- printing output
- variables
- primitive values
- strings
- casting
- constants
- arithmetic
- comparison and logical operators
- `Scanner`
- conditions
- `switch`
- loops
- methods
- parameters
- return values

---

## 🧩 Week 2 — Arrays, Strings & Problem Solving

Week 2 shifts the learner from basic syntax toward structured problem solving.

```text
Arrays Fundamentals
        ↓
Working with Arrays
        ↓
Strings
        ↓
String Processing
        ↓
Nested Loops & 2D Arrays
        ↓
Problem-Solving Patterns
        ↓
Mixed Practice & Debugging
        ↓
🏆 Student Score Analyzer
```

Learners practice patterns such as:

```text
counter
accumulator
flag
search
min / max
validation
frequency
traversal
```

---

## 🧱 Week 3 — Object-Oriented Programming

Week 3 moves from procedural programs to object-oriented modeling.

```text
Classes & Objects
       ↓
Constructors
       ↓
this & Object State
       ↓
Encapsulation
       ↓
Object Behaviour
       ↓
Multiple Objects
       ↓
static Members
       ↓
🏆 JavaQuets Academy
```

The learner progresses from:

```java
String name = "Aman";
int xp = 100;
int level = 2;
```

toward:

```java
Player player = new Player("Aman", 2);

player.addXp(100);

System.out.println(player.getLevel());
```

---

## 🧬 Week 4 — Advanced OOP

Planned progression:

```text
Inheritance
Method Overriding
Polymorphism
Abstract Classes
Interfaces
Composition
Enums & Packages
🏆 Role-Based Learning Platform
```

---

## 📦 Week 5 — Collections & Generics

```text
ArrayList
HashSet
HashMap
Collection Iteration
Sorting
Generics
Choosing Data Structures
🏆 Inventory Management System
```

---

## 🛡️ Week 6 — Robust & Modern Java

```text
Exceptions
Exception Handling
Custom Exceptions
File Handling
Lambdas
Streams
Date & Time APIs
🏆 Expense Tracker
```

---

## 🗄️ Week 7 — Database & JDBC

```text
Database Fundamentals
SQL Basics
JDBC
Database Connections
CRUD
PreparedStatement
Repository / DAO Pattern
🏆 Persistent Student Management System
```

---

## 🏁 Week 8 — Java Mastery

The final stage focuses less on isolated syntax and more on software construction.

```text
Project Architecture
Requirements → Design
Validation
Debugging
Testing
Refactoring
Project Planning
🏆 Final JavaQuets Capstone
```

The goal is for learners to move from:

```text
"Tell me what code to write"
```

toward:

```text
"Give me the requirements — I'll design and build it."
```

---

# 🏗️ Platform Architecture

JavaQuets uses a monorepo architecture.

```text
                    ┌─────────────────┐
                    │     Learner     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Next.js Web   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Express API   │
                    └───────┬─────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │ PostgreSQL      │       │ Submission      │
      │ + Prisma        │       │ Evaluation      │
      └─────────────────┘       └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │ Isolated Java   │
                               │ Runner          │
                               └─────────────────┘
```

---

# 🗂️ Repository Structure

```text
JavaQuest/
│
├── apps/
│   ├── web/                 # Next.js learner/admin frontend
│   └── api/                 # Express backend API
│
├── packages/
│   ├── database/            # Prisma client, schema & curriculum
│   ├── shared/              # Shared DTOs/types
│   ├── validation/          # Shared Zod schemas
│   ├── config/              # Environment/configuration
│   └── ui/                  # Shared UI functionality
│
├── infra/
│   ├── docker/              # Local infrastructure
│   └── runner/              # Isolated Java runner
│
├── docs/                    # Architecture / production documentation
│
├── scripts/                 # Repository automation
│
├── .github/
│   └── workflows/           # CI and deployment workflows
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# 🧬 Curriculum Data Model

The core learning hierarchy is:

```text
Course
  │
  └── CourseModule
        │
        └── Quest
              │
              ├── Lesson
              │
              └── Exercise
                    │
                    └── TestCase
```

Learner state is stored separately from curriculum content.

Conceptually:

```text
User
 │
 ├── Enrollment
 │
 ├── QuestProgress
 │
 ├── ExerciseProgress
 │
 └── Submission
```

This separation allows curriculum content to evolve without coupling it directly to individual learner records.

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript

## Backend

- Node.js
- Express
- TypeScript
- Zod

## Database

- PostgreSQL 17
- Prisma ORM

## Code Execution

- Java 21 isolated runner with JDK compilation and execution
- Python 3.12 isolated interpreter runner; no online compiler API required
- language-aware submission routing and shared test-case evaluation
- bounded, network-disabled Docker execution with non-root Python containers
- evaluator-driven CODE exercise completion

## Testing

- Vitest
- Supertest
- integration tests

## Infrastructure

- Docker
- Docker Compose
- GitHub Actions

## Monorepo

- pnpm workspaces
- Turborepo

## Observability & Security

- Pino structured logging
- health probes
- session security
- HTTP security controls
- runner safeguards
- environment validation

---

# 🚀 Getting Started

## Prerequisites

Install:

- Node.js 20+
- pnpm 10
- Docker
- Docker Compose

Verify:

```bash
node --version
pnpm --version
docker --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/vsingh13112006-art/JavaQuest.git
cd JavaQuest
```

---

## 2. Install Dependencies

```bash
pnpm install
```

The repository uses pnpm workspaces and Turborepo to manage the monorepo.

---

## 3. Configure Environment Variables

Create the local environment file from the provided example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the required environment variables before starting the platform.

> Never commit production credentials or secrets to the repository.

---

## 4. Start PostgreSQL

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

Verify that the containers are running:

```bash
docker ps
```

---

## 5. Generate Prisma Client

```bash
pnpm db:generate
```

---

## 6. Synchronize the Database

```bash
pnpm db:push
```

---

## 7. Seed Curriculum

```bash
pnpm db:seed
```

The curriculum seeder is designed around stable slugs and upsert-based synchronization so curriculum content can be updated without blindly recreating the entire database.

---

## 8. Build the Language Runners

When working with CODE exercises:

```bash
pnpm runner:build
```

This builds both local images: `javaquets-java-runner:local` and `javaquets-python-runner:local`. The runner worker must have access to the Docker daemon that owns these images. Configure the API with `RUNNER_SERVICE_URL` and a strong `RUNNER_SERVICE_TOKEN` when Python course execution is enabled. Keep the worker private; access to its Docker daemon is highly privileged.

---

## 9. Start Development

```bash
pnpm dev
```

The development environment starts the workspace applications through Turborepo.

Typical local endpoints:

```text
Web
http://localhost:3000

API
http://localhost:4000

Health
http://localhost:4000/health
```

---

# 🧪 Quality Checks

Before pushing changes, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For database-related changes:

```bash
pnpm db:generate
pnpm db:seed
```

A useful pre-push workflow is:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

# ⚙️ Useful Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start development services |
| `pnpm build` | Build workspace projects |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run tests |
| `pnpm format` | Format repository files |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:push` | Push Prisma schema |
| `pnpm db:migrate:deploy` | Apply database migrations |
| `pnpm db:seed` | Synchronize seeded curriculum |
| `pnpm runner:build` | Build isolated Java and Python runner images |

---

# 🔄 CI/CD

JavaQuets uses GitHub Actions for automated verification and deployment workflows.

The repository contains dedicated workflows for:

```text
CI
Production curriculum seeding
Staging
```

The CI pipeline is intended to catch issues before deployment through checks such as dependency installation, Prisma generation, curriculum/database verification, linting, type checking, tests and builds.

---

# 🔒 Security Model

Running arbitrary learner code requires stronger boundaries than a normal CRUD application.

JavaQuets therefore treats the runner as an isolated execution boundary.

The platform architecture includes protections around:

```text
Authentication
Session handling
HTTP security
Input validation
Abuse controls
Submission evaluation
Runner isolation
Execution limits
Error handling
Health monitoring
```

CODE exercise completion is evaluator-controlled rather than trusting the frontend to report that a learner passed.

---

# 🧑‍💻 Development Philosophy

JavaQuets follows several curriculum and engineering principles.

### 1. Learn by doing

Every important concept should eventually require the learner to write or reason about code.

### 2. Spiral learning

Old concepts return inside new concepts.

For example:

```text
Variables
    ↓
Object Fields

Methods
    ↓
Object Behaviour

Conditions
    ↓
Validation

Arrays
    ↓
Arrays of Objects

Search Pattern
    ↓
Find an Object
```

### 3. Progressive independence

Early:

```text
Detailed explanation
+ starter code
+ hints
```

Later:

```text
Requirements
+ expected behaviour
```

Final stage:

```text
Design it.
Build it.
Debug it.
```

### 4. Debugging is part of learning

Learners should understand broken code, not only successful code.

### 5. Capstones integrate knowledge

A module should not end because every syntax rule was mentioned.

It should end when the learner can use those concepts together.

---

# 🧭 Project Status

JavaQuets is under active development.

The platform foundation currently includes major pieces such as:

- monorepo infrastructure
- web application
- backend API
- PostgreSQL/Prisma persistence
- curriculum domain
- learner enrollment
- progress tracking
- submissions
- Java code evaluation
- authentication
- gamification
- administrative functionality
- security hardening
- CI/CD infrastructure
- production curriculum seeding

The Java Mastery curriculum itself is being developed progressively across the planned eight-week path.

---

# 🛣️ Roadmap

```text
Platform Foundation
        ✓
Authentication
        ✓
Progress Tracking
        ✓
Java Runner
        ✓
Gamification
        ✓
Production Hardening
        ✓
Structured Curriculum
        ↓
Week 1 — Foundations
        ✓
Week 2 — Arrays & Problem Solving
        ✓
Week 3 — OOP
        ↓
Week 4 — Advanced OOP
        ↓
Week 5 — Collections
        ↓
Week 6 — Modern Java
        ↓
Week 7 — JDBC
        ↓
Week 8 — Final Capstone
```

Beyond the core curriculum, future development can expand the platform with richer learner analytics, additional gamification, curriculum authoring improvements and more learning paths.

---

# 🤝 Contributing

JavaQuets is currently evolving rapidly.

If you want to contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-feature
```

3. Make your changes.
4. Run quality checks.

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

5. Commit the changes.

```bash
git commit -m "add my feature"
```

6. Push your branch.

```bash
git push origin feature/my-feature
```

7. Open a Pull Request.

Please keep curriculum changes consistent with the JavaQuets learning philosophy:

```text
Concept
→ Example
→ Predict
→ Code
→ Debug
→ Challenge
→ Build
```

---

# 🐞 Reporting Issues

When reporting a bug, include where possible:

```text
Expected behaviour
Actual behaviour
Steps to reproduce
Environment
Relevant logs
Screenshots
```

Never include passwords, tokens, database credentials or other secrets in an issue.

---

# 🌟 Why JavaQuets?

JavaQuets is not intended to be another collection of Java articles.

The goal is to create a learning environment where:

> **Every concept eventually becomes something the learner must reason about, debug, or build.**

The learner starts with:

```java
System.out.println("Hello, Java!");
```

and progressively moves toward designing applications with:

```text
Objects
Collections
Validation
Persistence
Repositories
Testing
Architecture
```

The destination is not simply knowing Java syntax.

The destination is being able to **build with Java**.

---

<div align="center">

## ⚔️ JavaQuets

### Learn. Code. Debug. Build.

Built around one principle:

**You learn programming by programming.**

⭐ If you find the project useful, consider starring the repository.

</div>
