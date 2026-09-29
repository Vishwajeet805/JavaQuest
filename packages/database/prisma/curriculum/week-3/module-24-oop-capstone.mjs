import { specModule, tests } from "./spec-module-builder.mjs";

const rows = [
  {
    slug: "academy-requirements-to-objects",
    title: "Requirements → Object Model",
    description:
      "Plain-English academy requirements ko instance state, behaviour, class-level state aur collection responsibility me classify karo.",
    problem:
      "Capstone me coding se pehle decide karna hai ki har requirement ka owner kaun hai.",
    why: "Good OOP design syntax se pehle responsibility aur ownership decisions se banta hai.",
    model:
      "Student owns:\n- name, xp, level, completedQuests\n- completeQuest(reward)\n\nPlayer class owns:\n- studentCount\n\nAcademy flow owns:\n- Student[] roster\n- search / ranking",
    syntax:
      "instance state → each Student\nbehaviour → Student action\nstatic state → whole class\nStudent[] → group management",
    remember:
      "Noun ko blindly field mat banao. Pehle poochho: one object, whole class, ya collection flow?",
    example:
      "`completedQuests` → Student instance | `studentCount` → class | `completeQuest` → behaviour",
    trace: "requirements → classify ownership → define Student API → then code",
    mistake:
      "Saari requirements ko fields bana dena ya saari logic `main()` me rakhna.",
    fix: "Responsibility ko correct owner ke paas place karo.",
    predict: ["`completeQuest` field hai ya behaviour?", "behaviour"],
    predict2: ["Total created Students instance ya class ownership?", "class"],
    prompt:
      "Given academy requirements ko classify karke exact output print karo:\nname -> instance\ncompleteQuest -> behaviour\nstudentCount -> class\nroster -> collection",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Print the ownership classification from the requirements.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("name -> instance");\n        System.out.println("completeQuest -> behaviour");\n        System.out.println("studentCount -> class");\n        System.out.println("roster -> collection");\n    }\n}',
    tests: tests(
      "name -> instance\ncompleteQuest -> behaviour\nstudentCount -> class\nroster -> collection",
    ),
  },
  {
    slug: "academy-student-class",
    title: "Design the Student API",
    description:
      "Requirements se minimum encapsulated Student state aur read API design karo—unnecessary setters expose kiye bina.",
    problem:
      "Academy report ko Student state read karni hai, but callers ko XP/level/completed count directly overwrite nahi karna chahiye.",
    why: "Capstone me learner ko fields copy karne ke bajay minimum useful public interface decide karna chahiye.",
    model:
      "private state\nname\nxp\nlevel\ncompletedQuests\n     ↓ controlled read\ngetName / getXp / getLevel / getCompletedQuests\n\nNo direct mutation API yet",
    syntax:
      "private String name;\nprivate int xp;\nprivate int level;\nprivate int completedQuests;",
    remember:
      "Private field ka matlab automatic getter/setter pair nahi. Sirf required API expose karo.",
    example:
      "Report getters se read karega; quest progress later behaviour se change hogi.",
    trace:
      "requirements → private source of truth → report needs reads → add required getters",
    mistake:
      "Public fields ya `setXp`, `setLevel`, `setCompletedQuests` add kar dena.",
    fix: "State private rakho; minimum required reads expose karo.",
    predict: ["XP ko direct public field banana chahiye? yes/no", "no"],
    predict2: [
      "Report ke liye state read karne ka controlled API? Enter: getters",
      "getters",
    ],
    prompt:
      "Student API design karo with private `name`, `xp`, `level`, `completedQuests`, constructor and required getters. `Aman | L1 | XP 0 | Quests 0` print karo. Direct setters mat banao.",
    starter:
      'class Student {\n    // Decide the four private fields.\n\n    Student(String name) {\n        // Establish only the starting state needed for this quest.\n    }\n\n    // Expose only the reads needed by the report.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student("Aman");\n\n        // Print the report using Student\'s public read API.\n    }\n}',
    solution:
      'class Student {\n    private String name;\n    private int xp;\n    private int level;\n    private int completedQuests;\n\n    Student(String name) {\n        this.name = name;\n        this.level = 1;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student("Aman");\n\n        System.out.println(\n            student.getName()\n                + " | L" + student.getLevel()\n                + " | XP " + student.getXp()\n                + " | Quests " + student.getCompletedQuests()\n        );\n    }\n}',
    tests: tests("Aman | L1 | XP 0 | Quests 0"),
  },
  {
    slug: "academy-constructor-this",
    title: "Establish a Valid Starting State",
    description:
      "Constructor, `this`, defaults aur static count ko ek creation invariant me integrate karo.",
    problem:
      "Har new Student ko predictable valid state me start hona chahiye aur class-wide total exactly once increment hona chahiye.",
    why: "Constructor object creation contract enforce karta hai; static counter whole class ka creation fact track karta hai.",
    model:
      'new Student("Aman")\n      ↓\nname = Aman\nlevel = 1\nxp = 0\nquests = 0\nstudentCount += 1',
    syntax:
      "Student(String name) {\n    this.name = name;\n    this.level = 1;\n    studentCount++;\n}",
    remember:
      "Valid starting state ek invariant hai: every successfully constructed Student same rules follow kare.",
    example: "Aman + Riya create → both L1/XP0/Q0; class count 2",
    trace:
      "count0 → construct Aman valid state/count1 → construct Riya valid state/count2",
    mistake:
      "`studentCount` ko instance field banana ya constructor me reset karna.",
    fix: "Per-student defaults instance state me; creation total static state me.",
    predict: ["New Student ka starting level?", "1"],
    predict2: ["2 constructed Students ke baad shared count?", "2"],
    prompt:
      "Constructor contract complete karo. Aman aur Riya create karke exact output:\nStudents: 2\nAman | L1 | XP 0 | Quests 0\nRiya | L1 | XP 0 | Quests 0",
    starter:
      'class Student {\n    private String name;\n    private int xp;\n    private int level;\n    private int completedQuests;\n    private static int studentCount;\n\n    Student(String name) {\n        // Establish valid starting state and update class-wide count.\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n\n    public static int getStudentCount() {\n        return studentCount;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student aman = new Student("Aman");\n        Student riya = new Student("Riya");\n\n        System.out.println("Students: " + Student.getStudentCount());\n\n        Student[] students = {aman, riya};\n        for (Student student : students) {\n            System.out.println(\n                student.getName()\n                    + " | L" + student.getLevel()\n                    + " | XP " + student.getXp()\n                    + " | Quests " + student.getCompletedQuests()\n            );\n        }\n    }\n}',
    solution:
      'class Student {\n    private String name;\n    private int xp;\n    private int level;\n    private int completedQuests;\n    private static int studentCount;\n\n    Student(String name) {\n        this.name = name;\n        this.xp = 0;\n        this.level = 1;\n        this.completedQuests = 0;\n        studentCount++;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n\n    public static int getStudentCount() {\n        return studentCount;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student aman = new Student("Aman");\n        Student riya = new Student("Riya");\n\n        System.out.println("Students: " + Student.getStudentCount());\n\n        Student[] students = {aman, riya};\n        for (Student student : students) {\n            System.out.println(\n                student.getName()\n                    + " | L" + student.getLevel()\n                    + " | XP " + student.getXp()\n                    + " | Quests " + student.getCompletedQuests()\n            );\n        }\n    }\n}',
    tests: tests(
      "Students: 2\nAman | L1 | XP 0 | Quests 0\nRiya | L1 | XP 0 | Quests 0",
    ),
  },
  {
    slug: "academy-complete-quest-behaviour",
    title: "Design the Quest-Completion Contract",
    description:
      "One meaningful domain action me validation aur related state changes ko atomic transition ki tarah design karo.",
    problem:
      "Valid quest completion XP aur completed count dono change karta hai; invalid reward par dono unchanged rehne chahiye.",
    why: "Behaviour contract caller ko raw fields manipulate karne se bachata hai aur related updates consistent rakhta hai.",
    model:
      "PRECONDITION\nreward > 0\n    ↓\nTRANSITION\nxp += reward\ncompletedQuests++\n    ↓\nPOSTCONDITION\nboth changed together",
    syntax:
      "public void completeQuest(int reward) {\n    if (reward <= 0) return;\n    xp += reward;\n    completedQuests++;\n}",
    remember: "Invalid action ke baad partial state change bhi bug hai.",
    example:
      "XP0/Q0 → completeQuest(50) → XP50/Q1 → completeQuest(-10) → unchanged",
    trace:
      "validate first → apply XP → increment completion → preserve both on rejection",
    mistake:
      "Invalid reward reject karna but completedQuests already increment kar dena.",
    fix: "Guard clause all mutations se pehle rakho.",
    predict: ["XP0/Q0 + valid 50 ke baad completed quests?", "1"],
    predict2: ["Uske baad invalid -10 ke baad XP?", "50"],
    prompt:
      "`completeQuest` contract implement karo. 50 valid aur -10 invalid ke baad exact output:\nXP: 50\nCompleted: 1",
    starter:
      'class Student {\n    private int xp;\n    private int completedQuests;\n\n    public void completeQuest(int reward) {\n        // Guard invalid reward, then update related state together.\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student();\n\n        student.completeQuest(50);\n        student.completeQuest(-10);\n\n        System.out.println("XP: " + student.getXp());\n        System.out.println("Completed: " + student.getCompletedQuests());\n    }\n}',
    solution:
      'class Student {\n    private int xp;\n    private int completedQuests;\n\n    public void completeQuest(int reward) {\n        if (reward <= 0) {\n            return;\n        }\n\n        xp += reward;\n        completedQuests++;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student();\n\n        student.completeQuest(50);\n        student.completeQuest(-10);\n\n        System.out.println("XP: " + student.getXp());\n        System.out.println("Completed: " + student.getCompletedQuests());\n    }\n}',
    tests: tests("XP: 50\nCompleted: 1"),
  },
  {
    slug: "academy-automatic-levels",
    title: "Multi-Step State Transition",
    description:
      "Large reward ko repeated 100-XP thresholds ke through correct level aur leftover XP me convert karo.",
    problem:
      "Ek quest reward multiple level thresholds cross kar sakta hai, so one-time `if` sufficient nahi.",
    why: "`while` current remaining XP par same domain rule repeatedly apply karta hai.",
    model:
      "L1 / XP0\n +280\n    ↓\nL1 / XP280\n    ↓ threshold\nL2 / XP180\n    ↓ threshold\nL3 / XP80",
    syntax: "while (xp >= 100) {\n    xp -= 100;\n    level++;\n}",
    remember:
      "Completed quest count once increment hota hai; level transition reward ke size ke according multiple times ho sakta hai.",
    example: "completeQuest(280) → Level 3, XP 80, Completed 1",
    trace: "reward valid → add 280/Q1 → loop 280→180/L2 → 180→80/L3 → stop",
    mistake: "`if (xp >= 100)` use karke only one level process karna.",
    fix: "Repeated threshold ke liye `while` use karo.",
    predict: ["L1 + 280 XP final level?", "3"],
    predict2: ["Remaining XP?", "80"],
    prompt:
      "Quest completion me repeated level transition add karo. `completeQuest(280)` ke baad exact output:\nLevel: 3\nXP: 80\nCompleted: 1",
    starter:
      'class Student {\n    private int xp;\n    private int level = 1;\n    private int completedQuests;\n\n    public void completeQuest(int reward) {\n        if (reward <= 0) {\n            return;\n        }\n\n        xp += reward;\n        completedQuests++;\n\n        // Convert every available 100 XP into one level.\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student();\n        student.completeQuest(280);\n\n        System.out.println("Level: " + student.getLevel());\n        System.out.println("XP: " + student.getXp());\n        System.out.println("Completed: " + student.getCompletedQuests());\n    }\n}',
    solution:
      'class Student {\n    private int xp;\n    private int level = 1;\n    private int completedQuests;\n\n    public void completeQuest(int reward) {\n        if (reward <= 0) {\n            return;\n        }\n\n        xp += reward;\n        completedQuests++;\n\n        while (xp >= 100) {\n            xp -= 100;\n            level++;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student();\n        student.completeQuest(280);\n\n        System.out.println("Level: " + student.getLevel());\n        System.out.println("XP: " + student.getXp());\n        System.out.println("Completed: " + student.getCompletedQuests());\n    }\n}',
    tests: tests("Level: 3\nXP: 80\nCompleted: 1"),
  },
  {
    slug: "academy-multiple-students",
    title: "Academy Roster Integration",
    description:
      "Multiple Students ko sirf create/list nahi, different behaviour histories ke saath collection me integrate karke report karo.",
    problem:
      "Capstone roster ko meaningful evolved object states manage karni chahiye, not just names.",
    why: "Student individual rules own karta hai; Student[] group traversal/report responsibility handle karta hai.",
    model:
      "Aman → completeQuest(120)\nRiya → completeQuest(80)\nKabir → completeQuest(40)\n        ↓\nStudent[] roster\n        ↓\nreport actual evolved state",
    syntax:
      "Student[] students = {aman, riya, kabir};\nfor (Student student : students) {\n    // report through getters\n}",
    remember:
      "Collection objects ko organize karta hai; state transition still each Student behaviour ke through hota hai.",
    example: "Different rewards → different states → one roster report",
    trace:
      "create objects → call behaviour on each receiver → store references → traverse evolved objects",
    mistake:
      "Report values hardcode karna ya Main me XP manually calculate karna.",
    fix: "All displayed progress actual Student state se read karo.",
    predict: ["Roster loop element type?", "Student"],
    predict2: [
      "Aman ko reward dene ke liye receiver kaun? Enter: aman",
      "aman",
    ],
    prompt:
      "Three Students ko different quest rewards do and roster report generate karo. Exact output:\nAman | Level 2 | XP 20 | Quests 1\nRiya | Level 1 | XP 80 | Quests 1\nKabir | Level 1 | XP 40 | Quests 1",
    starter:
      "class Student {\n    private String name;\n    private int xp;\n    private int level = 1;\n    private int completedQuests;\n\n    Student(String name) {\n        this.name = name;\n    }\n\n    public void completeQuest(int reward) {\n        if (reward <= 0) {\n            return;\n        }\n\n        xp += reward;\n        completedQuests++;\n\n        while (xp >= 100) {\n            xp -= 100;\n            level++;\n        }\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Aman, Riya, Kabir.\n        // Apply rewards 120, 80, 40 through Student behaviour.\n        // Put references in Student[] and report every evolved object.\n    }\n}",
    solution:
      'class Student {\n    private String name;\n    private int xp;\n    private int level = 1;\n    private int completedQuests;\n\n    Student(String name) {\n        this.name = name;\n    }\n\n    public void completeQuest(int reward) {\n        if (reward <= 0) {\n            return;\n        }\n\n        xp += reward;\n        completedQuests++;\n\n        while (xp >= 100) {\n            xp -= 100;\n            level++;\n        }\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student aman = new Student("Aman");\n        Student riya = new Student("Riya");\n        Student kabir = new Student("Kabir");\n\n        aman.completeQuest(120);\n        riya.completeQuest(80);\n        kabir.completeQuest(40);\n\n        Student[] students = {aman, riya, kabir};\n\n        for (Student student : students) {\n            System.out.println(\n                student.getName()\n                    + " | Level " + student.getLevel()\n                    + " | XP " + student.getXp()\n                    + " | Quests " + student.getCompletedQuests()\n            );\n        }\n    }\n}',
    tests: tests(
      "Aman | Level 2 | XP 20 | Quests 1\nRiya | Level 1 | XP 80 | Quests 1\nKabir | Level 1 | XP 40 | Quests 1",
    ),
  },
  {
    slug: "academy-search-statistics",
    title: "Academy Queries & Ranking",
    description:
      "Search aur best-object patterns ko explicit academy ranking specification ke against apply karo.",
    problem: "`Top Student` ambiguous hai jab tak ranking rule define na ho.",
    why: "Algorithm ko business/domain specification follow karni chahiye: higher level wins; tie ho to higher remaining XP wins.",
    model:
      "SEARCH:\nname equals target → found reference\n\nRANK:\nhigher level wins\nif level tie → higher XP wins\n\nKeep full Student reference.",
    syntax:
      "if (student.getLevel() > top.getLevel()\n    || (student.getLevel() == top.getLevel()\n        && student.getXp() > top.getXp())) {\n    top = student;\n}",
    remember: "Best algorithm se pehle 'best' ka exact rule define karo.",
    example: "Aman L3/20 vs Riya L3/80 → Riya wins tie-break",
    trace:
      "search Riya → found reference | top Aman → Riya same level but higher XP → top Riya → Kabir lower level → keep Riya",
    mistake: "Undefined 'top' assumption ya sirf one number retain karna.",
    fix: "Explicit ranking rule + full Student candidate reference.",
    predict: ["Same level par ranking tie-break kis value se? Enter: XP", "XP"],
    predict2: [
      "Top candidate initial reference? Exactly enter: students[0]",
      "students[0]",
    ],
    prompt:
      "Riya search karo and explicit ranking rule apply karo: higher level wins; tie ho to higher XP. Aman L3/20, Riya L3/80, Kabir L2/90. Exact output:\nFound: Riya\nTop: Riya",
    starter:
      'class Student {\n    private String name;\n    private int level;\n    private int xp;\n\n    Student(String name, int level, int xp) {\n        this.name = name;\n        this.level = level;\n        this.xp = xp;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student[] students = {\n            new Student("Aman", 3, 20),\n            new Student("Riya", 3, 80),\n            new Student("Kabir", 2, 90)\n        };\n\n        // 1) Search Riya and retain the Student reference.\n        // 2) Find top Student:\n        //    higher level wins; if tied, higher XP wins.\n    }\n}',
    solution:
      'class Student {\n    private String name;\n    private int level;\n    private int xp;\n\n    Student(String name, int level, int xp) {\n        this.name = name;\n        this.level = level;\n        this.xp = xp;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student[] students = {\n            new Student("Aman", 3, 20),\n            new Student("Riya", 3, 80),\n            new Student("Kabir", 2, 90)\n        };\n\n        Student found = null;\n        for (Student student : students) {\n            if (student.getName().equals("Riya")) {\n                found = student;\n                break;\n            }\n        }\n\n        Student top = students[0];\n        for (Student student : students) {\n            if (\n                student.getLevel() > top.getLevel()\n                    || (\n                        student.getLevel() == top.getLevel()\n                            && student.getXp() > top.getXp()\n                    )\n            ) {\n                top = student;\n            }\n        }\n\n        System.out.println("Found: " + found.getName());\n        System.out.println("Top: " + top.getName());\n    }\n}',
    tests: tests("Found: Riya\nTop: Riya"),
  },
  {
    slug: "javaquets-academy-final-build",
    title: "🏆 JavaQuets Academy",
    description:
      "Week 3 ke complete OOP model ko requirements-only independent build me integrate karo.",
    problem:
      "Student model, valid construction, encapsulated quest behaviour, repeated level transitions, static count, object collection aur explicit ranking ko one coherent system me design karo.",
    why: "Capstone ka goal syntax recall nahi—requirements ko responsible objects aur algorithms me independently translate karna hai.",
    model:
      "Student owns:\nprivate name/xp/level/completedQuests\nconstructor + completeQuest + getters\n\nClass owns:\nstudentCount\n\nAcademy flow owns:\nStudent[] + rewards + report + ranking",
    syntax:
      "Use only Week 3 tools:\nclass, objects, constructor, this, private, methods, arrays, loops, static",
    remember:
      "No inheritance, ArrayList, streams, private helper methods, ya other untaught major concepts required.",
    example: "Higher level wins; if tied, higher remaining XP wins.",
    trace:
      "design Student → create 3 → apply rewards through behaviour → build roster → report state → rank references",
    mistake:
      "Public fields, manual XP updates in Main, hardcoded final report, or undefined top-student rule.",
    fix: "Every displayed value actual object state/API se derive karo and follow the written ranking contract.",
    predict: [
      "Final system ka class-wide shared fact? Exactly enter: student count",
      "student count",
    ],
    predict2: ["Individual level static? yes/no", "no"],
    prompt:
      "JavaQuets Academy independently build karo.\n\nSTUDENT CONTRACT\n- private state: `name`, `xp`, `level`, `completedQuests`\n- constructor receives name\n- every new Student starts Level 1, XP 0, Quests 0\n- class-level static student count increments once per constructed Student\n- expose getters required by the report\n- `completeQuest(int reward)` rejects reward <= 0\n- valid reward adds XP and increments completedQuests exactly once\n- every 100 XP produces one level; leftover XP remains\n\nACADEMY FLOW\n- create Aman, Riya, Kabir\n- Aman rewards: 120, 120, 100, 100\n- Riya rewards: 80, 100, 100\n- Kabir rewards: 50, 40\n- store the same Student references in `Student[]`\n- report all students from actual object state\n- Top Student rule: higher level wins; if levels tie, higher remaining XP wins\n\nExact output:\n=== JAVAQUETS ACADEMY ===\nStudents: 3\nAman | Level 5 | XP 40 | Quests 4\nRiya | Level 3 | XP 80 | Quests 3\nKabir | Level 1 | XP 90 | Quests 2\nTop Student: Aman\n=========================",
    starter:
      "class Student {\n    // Design the Student model from the contract.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build JavaQuets Academy from the requirements.\n        // Do not hardcode final state values.\n    }\n}",
    solution:
      'class Student {\n    private String name;\n    private int xp;\n    private int level;\n    private int completedQuests;\n    private static int studentCount;\n\n    Student(String name) {\n        this.name = name;\n        this.xp = 0;\n        this.level = 1;\n        this.completedQuests = 0;\n        studentCount++;\n    }\n\n    public void completeQuest(int reward) {\n        if (reward <= 0) {\n            return;\n        }\n\n        xp += reward;\n        completedQuests++;\n\n        while (xp >= 100) {\n            xp -= 100;\n            level++;\n        }\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public int getCompletedQuests() {\n        return completedQuests;\n    }\n\n    public static int getStudentCount() {\n        return studentCount;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student aman = new Student("Aman");\n        Student riya = new Student("Riya");\n        Student kabir = new Student("Kabir");\n\n        int[] amanRewards = {120, 120, 100, 100};\n        for (int reward : amanRewards) {\n            aman.completeQuest(reward);\n        }\n\n        int[] riyaRewards = {80, 100, 100};\n        for (int reward : riyaRewards) {\n            riya.completeQuest(reward);\n        }\n\n        kabir.completeQuest(50);\n        kabir.completeQuest(40);\n\n        Student[] students = {aman, riya, kabir};\n\n        Student top = students[0];\n        for (Student student : students) {\n            if (\n                student.getLevel() > top.getLevel()\n                    || (\n                        student.getLevel() == top.getLevel()\n                            && student.getXp() > top.getXp()\n                    )\n            ) {\n                top = student;\n            }\n        }\n\n        System.out.println("=== JAVAQUETS ACADEMY ===");\n        System.out.println("Students: " + Student.getStudentCount());\n\n        for (Student student : students) {\n            System.out.println(\n                student.getName()\n                    + " | Level " + student.getLevel()\n                    + " | XP " + student.getXp()\n                    + " | Quests " + student.getCompletedQuests()\n            );\n        }\n\n        System.out.println("Top Student: " + top.getName());\n        System.out.println("=========================");\n    }\n}',
    tests: tests(
      "=== JAVAQUETS ACADEMY ===\nStudents: 3\nAman | Level 5 | XP 40 | Quests 4\nRiya | Level 3 | XP 80 | Quests 3\nKabir | Level 1 | XP 90 | Quests 2\nTop Student: Aman\n=========================",
    ),
    minutes: 55,
  },
];

export const oopCapstoneModule = specModule(
  {
    slug: "week-3-oop-capstone",
    title: "Week 3 — 🏆 JavaQuets Academy",
    description:
      "Week 3 ke OOP concepts ko requirements, ownership, behaviour contracts, multiple objects, static state aur ranking algorithms ke through independent academy system me integrate karo.",
    position: 24,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
