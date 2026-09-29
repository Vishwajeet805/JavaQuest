import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "method-overriding-why-override",
    title: "Why Override?",
    description:
      "Identify karo ki inherited generic behaviour kab child ke domain meaning ke liye insufficient hai.",
    problem:
      "Character ka generic action Warrior ko inherit hota hai, but Warrior ka meaningful action attack hai.",
    why: "Overriding same inherited operation ko child-specific implementation deta hai.",
    model:
      "Character.action → inherited by Warrior → same operation needs specialised result → Warrior.action override",
    syntax:
      '@Override\nvoid action() {\n    System.out.println("Warrior attacks");\n}',
    remember:
      "Operation same, implementation child-specific: overriding candidate.",
    example:
      "Character defines action(); Warrior keeps the contract but changes its implementation.",
    trace:
      "Warrior object → action() call → matching Warrior override → Warrior implementation",
    mistake:
      "Child-specific behaviour ke liye unrelated naya method banana while parent already has the right operation.",
    fix: "Same operation ko matching signature ke saath override karo.",
    predict: [
      "Mechanism jo inherited method ko child-specific implementation deta hai?",
      "overriding",
    ],
    predict2: ["Override me operation same rehta hai? yes/no", "yes"],
    prompt:
      "Inherited generic behaviour specialise karo. Exact output: `Warrior attacks`.",
    starter:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\n\nclass Warrior extends Character {\n    // Specialise action().\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        warrior.action();\n    }\n}',
    solution:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        warrior.action();\n    }\n}',
    tests: tests("Warrior attacks"),
  },
  {
    slug: "method-overriding-matching-method-signature",
    title: "Matching Method Signature",
    description:
      "Actual override aur same-name near-miss ko parameter list inspect karke distinguish karo.",
    problem:
      "Parent move() aur child move(int speed) same name ke bawajood same method contract nahi hain.",
    why: "Matching inherited method signature child implementation ko parent operation replace karne deti hai.",
    model:
      "Parent move() + Child move() → override ✓\nParent move() + Child move(int) → different signature ✗",
    syntax: "@Override\nvoid move() {\n    ...\n}",
    remember:
      "Same name alone enough nahi; parameter list bhi match honi chahiye.",
    example:
      "`void action()` can override `void action()`; `void action(int)` us method ko override nahi karta.",
    trace:
      "compare method name → compare parameters → matching inherited method → override",
    mistake:
      "Parameters change karke assume karna ki inherited method replace ho gayi.",
    fix: "Parent declaration inspect karke child signature align karo.",
    predict: ["Parent move(); child move(int). Override? yes/no", "no"],
    predict2: [
      "Parent move(); child move(). Override candidate? yes/no",
      "yes",
    ],
    prompt:
      "Broken near-match fix karo so `warrior.move()` prints `Warrior charges`.",
    starter:
      'class Character {\n    void move() {\n        System.out.println("Character moves");\n    }\n}\n\nclass Warrior extends Character {\n    void move(int speed) {\n        System.out.println("Warrior charges");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        warrior.move();\n    }\n}',
    solution:
      'class Character {\n    void move() {\n        System.out.println("Character moves");\n    }\n}\n\nclass Warrior extends Character {\n    @Override\n    void move() {\n        System.out.println("Warrior charges");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        warrior.move();\n    }\n}',
    tests: tests("Warrior charges"),
  },
  {
    slug: "method-overriding-override-annotation",
    title: "@Override as a Safety Check",
    description:
      "`@Override` ko compiler-assisted correctness check ki tarah use karo, decoration ki tarah nahi.",
    problem:
      "Child method name me typo accidental new method bana sakta hai. Annotation intended override ko verify karwata hai.",
    why: "`@Override` compiler ko bolta hai: verify karo ki ye declaration inherited method ko actually override karti hai.",
    model:
      "override intention → @Override → compiler checks parent contract → mismatch catches bug",
    syntax: "@Override\nvoid train() {\n    ...\n}",
    remember:
      "Annotation override create nahi karti; intention verify karwati hai.",
    example:
      "Parent train(); child tran() typo ko @Override compile-time par expose karta hai.",
    trace:
      "annotation → compiler searches compatible inherited method → mismatch → repair declaration",
    mistake: "Compile error dekhkar annotation delete kar dena.",
    fix: "Intention override hai to annotation rakho aur mismatch fix karo.",
    predict: [
      "@Override ka main benefit compiler verification hai? yes/no",
      "yes",
    ],
    predict2: ["Annotation khud inheritance create karti hai? yes/no", "no"],
    prompt: "Typo repair karo so exact output `Mage studies magic` aaye.",
    starter:
      'class Character {\n    void train() {\n        System.out.println("Character trains");\n    }\n}\n\nclass Mage extends Character {\n    @Override\n    void tran() {\n        System.out.println("Mage studies magic");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Mage mage = new Mage();\n        mage.train();\n    }\n}',
    solution:
      'class Character {\n    void train() {\n        System.out.println("Character trains");\n    }\n}\n\nclass Mage extends Character {\n    @Override\n    void train() {\n        System.out.println("Mage studies magic");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Mage mage = new Mage();\n        mage.train();\n    }\n}',
    tests: tests("Mage studies magic"),
  },
  {
    slug: "method-overriding-runtime-behaviour",
    title: "Tracing Overridden Behaviour",
    description:
      "Concrete child receiver par overridden aur unchanged inherited methods ko separately trace karo.",
    problem:
      "Warrior action() override karta hai but rest() unchanged inherit karta hai.",
    why: "Ek child object specialised aur inherited behaviour dono combine kar sakta hai.",
    model:
      "Warrior receiver\n├─ action() → Warrior override\n└─ rest() → Character inherited implementation",
    syntax: "warrior.action();\nwarrior.rest();",
    remember:
      "Har called method independently resolve karo; one override saare parent methods replace nahi karta.",
    example:
      "Warrior.action is specialised; Warrior.rest is inherited unchanged.",
    trace:
      "action call → child match → Warrior; rest call → no child replacement → Character",
    mistake:
      "Ek override ke baad assume karna ki parent ke sab methods replace ho gaye.",
    fix: "Method-by-method lookup mentally trace karo.",
    predict: ["Warrior overrides only action(). rest() source?", "Character"],
    predict2: [
      "Concrete Warrior receiver par action() Warrior wala chalega? yes/no",
      "yes",
    ],
    prompt:
      "Calls complete karo. Exact output:\nWarrior attacks\nCharacter rests",
    starter:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n\n    void rest() {\n        System.out.println("Character rests");\n    }\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        // Call specialised action, then inherited rest.\n    }\n}',
    solution:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n\n    void rest() {\n        System.out.println("Character rests");\n    }\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        warrior.action();\n        warrior.rest();\n    }\n}',
    tests: tests("Warrior attacks\nCharacter rests"),
  },
  {
    slug: "method-overriding-calling-parent-with-super",
    title: "Calling Parent with super",
    description:
      "Override ke andar parent implementation explicitly reuse karke child-specific output extend karo.",
    problem:
      "Mage ko shared name output preserve karke mana detail add karni hai.",
    why: "`super.method()` useful parent implementation ko copy-paste ke bina reuse karne deta hai.",
    model:
      "Mage.showInfo → super.showInfo → parent common output → return → child extra output",
    syntax: "@Override\nvoid showInfo() {\n    super.showInfo();\n    ...\n}",
    remember:
      "`super.method()` parent implementation explicitly invoke karta hai.",
    example: "Parent name prints; Mage override calls parent then prints mana.",
    trace: "enter child override → call super → return → continue child code",
    mistake: "Parent logic child me manually copy karna.",
    fix: "Useful common implementation ko super call se reuse karo.",
    predict: [
      "Parent implementation explicitly call karne ka keyword?",
      "super",
    ],
    predict2: [
      "super call ke baad child method continue karta hai? yes/no",
      "yes",
    ],
    prompt: "Mage showInfo complete karo. Exact output:\nName: Riya\nMana: 90",
    starter:
      'class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    void showInfo() {\n        System.out.println("Name: " + name);\n    }\n}\n\nclass Mage extends Character {\n    private int mana;\n\n    Mage(String name, int mana) {\n        super(name);\n        this.mana = mana;\n    }\n\n    @Override\n    void showInfo() {\n        // Reuse parent output, then add mana.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Mage("Riya", 90).showInfo();\n    }\n}',
    solution:
      'class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    void showInfo() {\n        System.out.println("Name: " + name);\n    }\n}\n\nclass Mage extends Character {\n    private int mana;\n\n    Mage(String name, int mana) {\n        super(name);\n        this.mana = mana;\n    }\n\n    @Override\n    void showInfo() {\n        super.showInfo();\n        System.out.println("Mana: " + mana);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Mage("Riya", 90).showInfo();\n    }\n}',
    tests: tests("Name: Riya\nMana: 90"),
  },
  {
    slug: "method-overriding-overloading-vs-overriding",
    title: "Overloading vs Overriding",
    description:
      "Same-name methods ko relationship + parameters ke basis par classify karo.",
    problem:
      "`attack()`/`attack(int)` aur parent/child `action()` superficially similar lag sakte hain but mechanisms different hain.",
    why: "Overloading gives parameter variants; overriding gives a child implementation of an inherited matching operation.",
    model:
      "OVERLOAD: same name + different parameters\nOVERRIDE: parent/child + matching inherited method",
    syntax:
      "void attack() {}\nvoid attack(int power) {}\n\n@Override\nvoid action() {}",
    remember:
      "Different parameters → overloading; inherited matching contract → overriding.",
    example: "Warrior overloads attack; Warrior overrides Character.action.",
    trace: "check inheritance → compare parameters → classify mechanism",
    mistake: "Har same-name method ko overriding bol dena.",
    fix: "Relationship and parameter list dono inspect karo.",
    predict: ["attack() and attack(int): mechanism?", "overloading"],
    predict2: [
      "Parent action() + matching child action(): mechanism?",
      "overriding",
    ],
    prompt:
      "Exact classification report print karo:\nattack(int) -> overloading\naction() -> overriding",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Print the two classifications.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("attack(int) -> overloading");\n        System.out.println("action() -> overriding");\n    }\n}',
    tests: tests("attack(int) -> overloading\naction() -> overriding"),
  },
  {
    slug: "method-overriding-override-rules",
    title: "Override Rules Bug Hunt",
    description:
      "Broken intended override ko compiler signal aur parent contract comparison se diagnose karo.",
    problem:
      "Parent heal(int) hai but child heal() likha gaya hai; @Override mismatch catch karta hai.",
    why: "Debugging proves learner contract ko inspect karke repair kar sakta hai rather than annotation remove karke error hide karna.",
    model:
      "@Override error → inspect parent → compare name/parameters → repair mismatch → verify behaviour",
    syntax: "@Override\nvoid heal(int amount) {\n    ...\n}",
    remember:
      "Intended override fail ho to annotation mat hatao; contract mismatch repair karo.",
    example:
      "Parent heal(int) requires child override to accept matching int parameter.",
    trace:
      "compiler failure → inspect inherited declaration → find missing parameter → fix → call heal(25)",
    mistake: "`@Override` delete karke accidental non-override leave karna.",
    fix: "Annotation preserve karo and declaration repair karo.",
    predict: ["Parent heal(int), child heal(). Valid override? yes/no", "no"],
    predict2: ["Annotation delete karna best fix? yes/no", "no"],
    prompt: "Bug hunt repair karo. Exact output: `Healer restores 25 HP`.",
    starter:
      'class Character {\n    void heal(int amount) {\n        System.out.println("Character restores " + amount + " HP");\n    }\n}\n\nclass Healer extends Character {\n    @Override\n    void heal() {\n        System.out.println("Healer restores HP");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Healer healer = new Healer();\n        healer.heal(25);\n    }\n}',
    solution:
      'class Character {\n    void heal(int amount) {\n        System.out.println("Character restores " + amount + " HP");\n    }\n}\n\nclass Healer extends Character {\n    @Override\n    void heal(int amount) {\n        System.out.println("Healer restores " + amount + " HP");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Healer healer = new Healer();\n        healer.heal(25);\n    }\n}',
    tests: tests("Healer restores 25 HP"),
  },
  {
    slug: "method-overriding-override-recap",
    title: "🏆 Specialised Character Behaviour",
    description:
      "Shared operation ko multiple child-specific implementations me independently design karke Module 26 capability prove karo.",
    problem:
      "Character, Warrior aur Mage same `action()` operation share karte hain, but children ko different implementation chahiye.",
    why: "Final challenge verifies matching contract, @Override, concrete-child tracing and clean specialisation without stealing Module 27.",
    model:
      "Character.action\n      ↑\n ┌────┴────┐\nWarrior   Mage\n action   action",
    syntax: "@Override\nvoid action() { ... }",
    remember:
      "Concrete child receivers only. Parent-reference polymorphism next module ka payoff hai.",
    example: "Warrior action attacks; Mage action casts spell.",
    trace:
      "requirements → parent operation → children extend → matching overrides → concrete objects → verify outputs",
    mistake:
      "Separate attack()/castSpell() methods bana kar shared action contract ignore karna.",
    fix: "Same operation ko each child me matching override se specialise karo.",
    predict: ["Shared operation name?", "action"],
    predict2: ["Character reference required in this challenge? yes/no", "no"],
    prompt:
      "Independent build:\n- Character defines `void action()` printing `Character acts`\n- Warrior extends Character, stores name via constructor, overrides action → `<name> attacks`\n- Mage extends Character, stores name via constructor, overrides action → `<name> casts spell`\n- Use @Override\n- Instantiate concrete Warrior Aman and Mage Riya; no Character reference yet\n\nExact output:\nAman attacks\nRiya casts spell",
    starter:
      "class Character {\n    // Define shared action.\n}\n\nclass Warrior {\n    // Establish inheritance, store name, override action.\n}\n\nclass Mage {\n    // Establish inheritance, store name, override action.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create concrete Warrior and Mage objects.\n        // Call action() on each.\n    }\n}",
    solution:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\n\nclass Warrior extends Character {\n    private String name;\n\n    Warrior(String name) {\n        this.name = name;\n    }\n\n    @Override\n    void action() {\n        System.out.println(name + " attacks");\n    }\n}\n\nclass Mage extends Character {\n    private String name;\n\n    Mage(String name) {\n        this.name = name;\n    }\n\n    @Override\n    void action() {\n        System.out.println(name + " casts spell");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        Mage mage = new Mage("Riya");\n        warrior.action();\n        mage.action();\n    }\n}',
    tests: tests("Aman attacks\nRiya casts spell"),
  },
];

export const methodOverridingModule = specModule(
  {
    slug: "method-overriding",
    title: "Module 26 — Method Overriding",
    description:
      "Inherited method contract ko preserve karke child-specific behaviour implement, trace aur debug karo—without consuming Module 27 polymorphism.",
    position: 26,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
