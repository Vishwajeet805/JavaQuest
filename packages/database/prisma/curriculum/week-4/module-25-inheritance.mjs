import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "inheritance-parent-aur-child-class",
    title: "Parent aur Child Class",
    description:
      "Duplicate related classes se shared abstraction discover karo aur parent/child responsibility identify karo.",
    problem:
      "Warrior aur Mage dono ke paas same `name` aur `move()` ho to copy-paste duplication batata hai ki shared identity missing ho sakti hai.",
    why: "Inheritance ka reason `extends` syntax nahi; genuinely related types ke common state/behaviour ko correct owner dena hai.",
    model:
      "Before:\nWarrior: name + move + attack\nMage: name + move + castSpell\n\nAfter modelling:\nCharacter: name + move\n   ↑\nWarrior: attack\nMage: castSpell",
    syntax:
      "Parent → common identity/state/behaviour\nChild → parent relationship + specialised members",
    remember:
      "Common code dikhna inheritance prove nahi karta. Pehle real relationship identify karo.",
    example: "Warrior IS-A Character; Mage IS-A Character.",
    trace:
      "spot duplication → ask shared identity → move common responsibility to Character → keep specialised capability in child",
    mistake:
      "Sirf duplicate lines reduce karne ke liye unrelated classes ko parent-child banana.",
    fix: "Ask: child ko naturally parent ke roop me describe kar sakte ho?",
    predict: ["Warrior aur Mage ka common base concept?", "Character"],
    predict2: ["`attack()` common Character behaviour hai? yes/no", "no"],
    prompt:
      "Duplicated design ko analyse karke exact ownership report print karo:\nParent: Character\nShared: name, move\nWarrior owns: attack\nMage owns: castSpell",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Requirements:\n        // Warrior: name, move, attack\n        // Mage: name, move, castSpell\n        //\n        // Print the better ownership model.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Parent: Character");\n        System.out.println("Shared: name, move");\n        System.out.println("Warrior owns: attack");\n        System.out.println("Mage owns: castSpell");\n    }\n}',
    tests: tests(
      "Parent: Character\nShared: name, move\nWarrior owns: attack\nMage owns: castSpell",
    ),
  },
  {
    slug: "inheritance-extends-keyword",
    title: "`extends` Keyword",
    description:
      "Identified IS-A relationship ko Java inheritance declaration me express karo.",
    problem:
      "Design me Warrior ko Character ka specialised type decide kar liya; ab Java ko relationship explicitly batani hai.",
    why: "`extends` child ko parent type ke accessible members reuse karne aur apni capability add karne deta hai.",
    model:
      "Character\n    ↑\n    │ extends\n Warrior\n\nWarrior IS-A Character",
    syntax:
      "class Warrior extends Character {\n    // Warrior-specific members\n}",
    remember:
      "`extends` relationship declare karta hai; ye arbitrary code-copy shortcut nahi.",
    example:
      "class Character { void move() { ... } }\nclass Warrior extends Character { void attack() { ... } }",
    trace:
      "declare Character → Warrior extends Character → create Warrior → inherited `move()` becomes available",
    mistake: "Parent class ka code child me manually copy karna.",
    fix: "Genuine IS-A relationship ho to `extends` se relationship express karo.",
    predict: ["Java class inheritance keyword?", "extends"],
    predict2: [
      "Warrior extends Character means Warrior IS-A Character? yes/no",
      "yes",
    ],
    prompt:
      "`Warrior extends Character` complete karo. Warrior object se inherited `move()` aur own `attack()` call karke exact output:\nCharacter moves\nWarrior attacks",
    starter:
      'class Character {\n    void move() {\n        System.out.println("Character moves");\n    }\n}\n\n// Establish the inheritance relationship.\nclass Warrior {\n    void attack() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n\n        // Call inherited and Warrior-specific behaviour.\n    }\n}',
    solution:
      'class Character {\n    void move() {\n        System.out.println("Character moves");\n    }\n}\n\nclass Warrior extends Character {\n    void attack() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n\n        warrior.move();\n        warrior.attack();\n    }\n}',
    tests: tests("Character moves\nWarrior attacks"),
  },
  {
    slug: "inheritance-inherited-fields",
    title: "Inherited Fields",
    description:
      "Child object me parent-defined state aur child-specific state ko ek combined object model ke roop me reason karo.",
    problem:
      "Warrior ka `name` Character me defined hai aur `strength` Warrior me. Learner ko samajhna hai ki Warrior object dono state requirements carry karta hai.",
    why: "Inheritance source code duplicate nahi karta; child object parent contract/state plus specialised state ke saath exist karta hai.",
    model:
      "Warrior object\n┌──────────────────┐\n│ Character part   │\n│ name = Aman      │\n├──────────────────┤\n│ Warrior part     │\n│ strength = 80    │\n└──────────────────┘",
    syntax:
      "class Character {\n    String name;\n}\n\nclass Warrior extends Character {\n    int strength;\n}",
    remember:
      "Field parent me declared ho sakta hai, but each Warrior object apni inherited instance-state value rakhta hai.",
    example: 'warrior.name = "Aman";\nwarrior.strength = 80;',
    trace:
      "new Warrior → object has inherited `name` slot + own `strength` slot → values remain part of same Warrior object",
    mistake: "Inherited instance field ko one shared/static value samajhna.",
    fix: "Instance inheritance ko per-object state ke mental model se trace karo.",
    predict: [
      "Warrior object ko parent-defined `name` state milti hai? yes/no",
      "yes",
    ],
    predict2: [
      "Do Warrior objects ka inherited `name` automatically same hota hai? yes/no",
      "no",
    ],
    prompt:
      "Prediction verify karo: do Warrior objects ki inherited `name` aur own `strength` independently set karo. Exact output:\nAman | Strength 80\nRiya | Strength 65",
    starter:
      "class Character {\n    String name;\n}\n\nclass Warrior extends Character {\n    int strength;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior aman = new Warrior();\n        Warrior riya = new Warrior();\n\n        // Set inherited and child-specific state independently.\n\n        // Print both objects.\n    }\n}",
    solution:
      'class Character {\n    String name;\n}\n\nclass Warrior extends Character {\n    int strength;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior aman = new Warrior();\n        Warrior riya = new Warrior();\n\n        aman.name = "Aman";\n        aman.strength = 80;\n\n        riya.name = "Riya";\n        riya.strength = 65;\n\n        System.out.println(aman.name + " | Strength " + aman.strength);\n        System.out.println(riya.name + " | Strength " + riya.strength);\n    }\n}',
    tests: tests("Aman | Strength 80\nRiya | Strength 65"),
  },
  {
    slug: "inheritance-inherited-methods",
    title: "Inherited Methods",
    description:
      "Child ki capability set trace karo: inherited behaviour reuse karo aur child-specific behaviour add karo without overriding.",
    problem:
      "Warrior ko Character ka `showName()` reuse karna hai aur apna `attack()` add karna hai.",
    why: "Inheritance common behaviour ko one parent implementation me rakhta hai while child additional capability expose kar sakta hai.",
    model:
      "Character capability:\nshowName()\n     ↓ inherited\nWarrior capability:\nshowName() + attack()",
    syntax: "class Warrior extends Character {\n    void attack() { ... }\n}",
    remember:
      "Is module me child inherited method ko change nahi kar raha. Behaviour replacement/overriding Module 26 ka job hai.",
    example: "warrior.showName();\nwarrior.attack();",
    trace:
      "Warrior receiver → `showName` lookup available from Character → `attack` available from Warrior",
    mistake:
      "Inherited method ko child me same implementation ke saath dobara likhna.",
    fix: "Unchanged shared behaviour parent se reuse karo.",
    predict: [
      "Warrior me `showName()` manually duplicate karna required hai? yes/no",
      "no",
    ],
    predict2: [
      "Warrior object inherited + own dono methods call kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Common `showName()` parent me rakho; Warrior me sirf `attack()` add karo. Exact output:\nName: Aman\nAman attacks",
    starter:
      'class Character {\n    String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    void showName() {\n        System.out.println("Name: " + name);\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    // Add only Warrior-specific behaviour.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n\n        // Reuse inherited behaviour, then call specialised behaviour.\n    }\n}',
    solution:
      'class Character {\n    String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    void showName() {\n        System.out.println("Name: " + name);\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    void attack() {\n        System.out.println(name + " attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n\n        warrior.showName();\n        warrior.attack();\n    }\n}',
    tests: tests("Name: Aman\nAman attacks"),
  },
  {
    slug: "inheritance-constructor-chain-ka-intro",
    title: "Constructor Chain ka Intro",
    description:
      "Child object creation ke waqt parent initialization pehle aur child initialization baad me hone ka trace build karo.",
    problem:
      "`new Warrior()` ek child object create karta hai, but inherited parent state bhi initialize honi hoti hai.",
    why: "Constructor chain explain karta hai ki hierarchy ka parent part child-specific setup se pehle kaise initialize hota hai.",
    model:
      "new Warrior()\n      ↓\nCharacter constructor\n      ↓\nWarrior constructor\n      ↓\nready Warrior object",
    syntax:
      "class Warrior extends Character {\n    Warrior() {\n        super();\n        // child setup\n    }\n}",
    remember:
      "Constructor inherit nahi hota. Child construction parent constructor chain ko invoke karta hai.",
    example:
      "Character constructor prints first; Warrior constructor prints second.",
    trace:
      "new Warrior → enter parent constructor → parent output → return to child constructor → child output",
    mistake:
      "Child constructor ko parent constructor se completely independent samajhna.",
    fix: "Object creation ko top/base initialization → child initialization order me trace karo.",
    predict: [
      "`new Warrior()` par pehle kaunsa constructor output? Enter: Character",
      "Character",
    ],
    predict2: [
      "Constructors inherited methods ki tarah inherit hote hain? yes/no",
      "no",
    ],
    prompt:
      "Code run karne se pehle constructor order predict karo, then exact output produce karo:\nCharacter constructor\nWarrior constructor",
    starter:
      'class Character {\n    Character() {\n        System.out.println("Character constructor");\n    }\n}\n\nclass Warrior extends Character {\n    Warrior() {\n        // Parent construction happens before this body finishes.\n        System.out.println("Warrior constructor");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create one Warrior and observe constructor order.\n    }\n}',
    solution:
      'class Character {\n    Character() {\n        System.out.println("Character constructor");\n    }\n}\n\nclass Warrior extends Character {\n    Warrior() {\n        System.out.println("Warrior constructor");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Warrior();\n    }\n}',
    tests: tests("Character constructor\nWarrior constructor"),
  },
  {
    slug: "inheritance-protected-vs-private-access",
    title: "Protected vs Private Access",
    description:
      "Inheritance aur direct field access ko separate concepts samjho; private parent state ko controlled API se use karo.",
    problem:
      "Child parent se related hai, lekin `private` ka matlab child ko direct field access automatically nahi milta.",
    why: "Encapsulation inheritance ke baad bhi valid rehti hai. Relationship boundaries ko erase nahi karta.",
    model:
      "Character\nprivate name\n   │ direct child access ✗\n   │ getter/API ✓\n   ▼\nWarrior\n\nprotected member → child direct access allowed",
    syntax: "private String name;\n\nString getName() {\n    return name;\n}",
    remember: "inherits from ≠ can directly access everything.",
    example: "`name` private ho to Warrior `getName()` use kar sakta hai.",
    trace:
      "Warrior.attack → needs name → direct private access invalid → inherited/accessible getter call → value returned",
    mistake: "Parent ka `private` field child me direct use karna.",
    fix: "Prefer controlled parent API when possible; `protected` direct subclass access deta hai but boundary wider karta hai.",
    predict: [
      "Child parent ke private field ko directly access kar sakta hai? yes/no",
      "no",
    ],
    predict2: [
      "Private state ko getter se read karna possible hai? yes/no",
      "yes",
    ],
    prompt:
      "Bug fix karo: Warrior parent ke private `name` ko directly access kar raha hai. Parent API use karke exact output: `Aman attacks`.",
    starter:
      'class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    String getName() {\n        return name;\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    void attack() {\n        // BUG: name is private in Character.\n        System.out.println(name + " attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        warrior.attack();\n    }\n}',
    solution:
      'class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    String getName() {\n        return name;\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    void attack() {\n        System.out.println(getName() + " attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        warrior.attack();\n    }\n}',
    tests: tests("Aman attacks"),
  },
  {
    slug: "inheritance-is-a-relationship",
    title: "Is-a Relationship",
    description:
      "Transfer cases me inheritance suitability decide karo instead of treating code reuse as the decision rule.",
    problem:
      "Har object collaboration inheritance nahi hota. `Engine` aur `Car` related hain, but Engine IS-A Car nahi hai.",
    why: "Inheritance type identity claim karta hai. Wrong IS-A relationship confusing APIs aur fragile designs banata hai.",
    model:
      "IS-A → inheritance candidate\nWarrior IS-A Character ✓\nDog IS-A Animal ✓\n\nHAS-A / uses-a → not inheritance\nCar HAS-A Engine\nGuild HAS-A members",
    syntax: "class Dog extends Animal { }\n\n// Not: class Engine extends Car",
    remember:
      "Sentence test useful heuristic hai: 'Child is a Parent' naturally true hona chahiye.",
    example: "Mage IS-A Character ✓ | Course IS-A Student ✗",
    trace:
      "read relationship → say IS-A sentence → decide candidate/not candidate → don't force inheritance for reuse",
    mistake: "HAS-A relationship ko `extends` se model karna.",
    fix: "If IS-A fails, inheritance reject karo; composition Module 30 me deeply aayega.",
    predict: ["Engine IS-A Car? yes/no", "no"],
    predict2: ["Dog IS-A Animal? yes/no", "yes"],
    prompt:
      "Relationships classify karo. Exact output:\nWarrior -> inheritance\nDog -> inheritance\nEngine -> not inheritance\nCourse -> not inheritance",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Apply the IS-A test:\n        // Warrior / Character\n        // Dog / Animal\n        // Engine / Car\n        // Course / Student\n\n        // Print each decision exactly as requested.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Warrior -> inheritance");\n        System.out.println("Dog -> inheritance");\n        System.out.println("Engine -> not inheritance");\n        System.out.println("Course -> not inheritance");\n    }\n}',
    tests: tests(
      "Warrior -> inheritance\nDog -> inheritance\nEngine -> not inheritance\nCourse -> not inheritance",
    ),
  },
  {
    slug: "inheritance-inheritance-recap",
    title: "🏆 Character Hierarchy Build",
    description:
      "Requirements se common parent aur specialised children independently design karke inheritance ka full module payoff prove karo.",
    problem:
      "Character, Warrior aur Mage me common vs specialised responsibilities ko correct classes me place karna hai.",
    why: "Final proof `extends` likhna nahi; duplication avoid karte hue genuine IS-A hierarchy design karna hai.",
    model:
      "Character\n- private name\n- move()\n- getName()\n    ↑\n ┌──┴────┐\nWarrior   Mage\nattack()  castSpell()",
    syntax:
      "class Warrior extends Character { ... }\nclass Mage extends Character { ... }",
    remember:
      "Module 25 boundary: shared inheritance + added child capability. Same inherited method ko child-specific replace/override karna Module 26 me aayega.",
    example:
      "Warrior and Mage both reuse Character.move(), then each adds one own action.",
    trace:
      "requirements → identify common identity → build parent → extend children → construct each → reuse parent behaviour → call specialised behaviour",
    mistake:
      "`move()` and `name` dono child classes me duplicate karna, ya child-specific actions parent me dump karna.",
    fix: "Common responsibility parent; specialised capability correct child.",
    predict: ["`move()` common ho to best owner?", "Character"],
    predict2: ["`castSpell()` Warrior me belong karta hai? yes/no", "no"],
    prompt:
      "Character hierarchy independently build karo.\n\nRequirements:\n- `Character` owns private `name`, constructor, `getName()`, and shared `move()` that prints `<name> moves`\n- `Warrior` IS-A Character and adds `attack()` → `<name> attacks`\n- `Mage` IS-A Character and adds `castSpell()` → `<name> casts spell`\n- Do NOT override `move()` yet\n- Create Warrior Aman and Mage Riya\n\nExact output:\nAman moves\nAman attacks\nRiya moves\nRiya casts spell",
    starter:
      "class Character {\n    // Design common state and behaviour.\n}\n\nclass Warrior {\n    // Establish the correct relationship and add Warrior capability.\n}\n\nclass Mage {\n    // Establish the correct relationship and add Mage capability.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Aman the Warrior and Riya the Mage.\n        // Demonstrate inherited + specialised behaviour.\n    }\n}",
    solution:
      'class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    String getName() {\n        return name;\n    }\n\n    void move() {\n        System.out.println(name + " moves");\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    void attack() {\n        System.out.println(getName() + " attacks");\n    }\n}\n\nclass Mage extends Character {\n    Mage(String name) {\n        super(name);\n    }\n\n    void castSpell() {\n        System.out.println(getName() + " casts spell");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        Mage mage = new Mage("Riya");\n\n        warrior.move();\n        warrior.attack();\n\n        mage.move();\n        mage.castSpell();\n    }\n}',
    tests: tests("Aman moves\nAman attacks\nRiya moves\nRiya casts spell"),
    minutes: 40,
  },
];

export const inheritanceModule = specModule(
  {
    slug: "inheritance",
    title: "Module 25 — Inheritance",
    description:
      "Related types me common responsibility identify karo, genuine IS-A hierarchy design karo, inherited state/behaviour trace karo aur access/constructor boundaries reason karo.",
    position: 25,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
