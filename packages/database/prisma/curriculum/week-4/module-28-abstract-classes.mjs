import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "abstract-classes-abstract-class-idea",
    title: "Why an Abstract Base?",
    description:
      "Concrete parent object ka meaning na ho, lekin related children ko shared state/behaviour chahiye—aisi modelling problem identify karo.",
    problem:
      "`Character` shared concept hai, but game me generic Character create karna meaningful nahi; actual playable types Warrior/Mage hain.",
    why: "Abstract class shared base identity ko represent kar sakti hai while direct base-object creation prevent karti hai.",
    model:
      "Character = shared but incomplete concept\n   ↑\nWarrior   Mage\nactual usable specialisations",
    syntax: "abstract class Character { ... }",
    remember:
      "Abstract ka reason 'fancy inheritance' nahi; base concept intentionally incomplete ho sakta hai.",
    example:
      "Character common name/showInfo own kare, but playable object concrete child ho.",
    trace:
      "requirements → identify common identity → ask whether base object itself valid → if no, abstract base candidate",
    mistake: "Har parent class ko abstract bana dena.",
    fix: "Abstract tab choose karo jab base intentionally incomplete/non-instantiable model ho.",
    predict: ["Generic Character object required hai? yes/no", "no"],
    predict2: [
      "Shared incomplete base ko Java me mark karne ka keyword?",
      "abstract",
    ],
    prompt:
      "Design decision report print karo. Exact output:\nBase: Character\nDirect object: not allowed\nConcrete types: Warrior, Mage",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Requirements say Character is only a shared base concept.\n        // Print the modelling decision.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Base: Character");\n        System.out.println("Direct object: not allowed");\n        System.out.println("Concrete types: Warrior, Mage");\n    }\n}',
    tests: tests(
      "Base: Character\nDirect object: not allowed\nConcrete types: Warrior, Mage",
    ),
  },
  {
    slug: "abstract-classes-abstract-methods",
    title: "Declaring an Abstract Class",
    description:
      "Abstract base ko declare karke shared concrete state/behaviour reuse karo.",
    problem:
      "Character direct object nahi banega, but every child ko name aur showName() common chahiye.",
    why: "Abstract class incomplete ho sakti hai and still constructors, fields, and concrete methods own kar sakti hai.",
    model:
      "abstract Character\n├─ shared state: name\n├─ concrete behaviour: showName()\n└─ child construction uses base constructor",
    syntax:
      "abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    void showName() { ... }\n}",
    remember: "Abstract class ka matlab 'methods body nahi ho sakti' nahi hai.",
    example:
      "Warrior constructor `super(name)` se abstract Character ka shared state initialise karta hai.",
    trace:
      "new Warrior → Character constructor → Warrior ready → inherited showName works",
    mistake: "Abstract class ko interface jaisa body-less container samajhna.",
    fix: "Shared implementation jo hierarchy ka natural part hai, abstract base me rakh sakte ho.",
    predict: ["Abstract class concrete methods rakh sakti hai? yes/no", "yes"],
    predict2: [
      "Abstract base ka constructor child creation me run ho sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Abstract Character me shared name + showName implement karo; Warrior create karke exact output `Name: Aman` lao.",
    starter:
      'abstract class Character {\n    // Add private name, constructor, and showName().\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        // Initialise the Character part.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        warrior.showName();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    void showName() {\n        System.out.println("Name: " + name);\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        warrior.showName();\n    }\n}',
    tests: tests("Name: Aman"),
  },
  {
    slug: "abstract-classes-concrete-methods",
    title: "Abstract Methods",
    description:
      "Base ko required operation define karne do without pretending one generic implementation makes sense.",
    problem:
      "Every Character must have `action()`, but Character level par correct generic action implementation nahi hai.",
    why: "Abstract method contract says concrete children must supply behaviour.",
    model:
      "abstract Character\n└─ abstract action() = required, no base implementation\n   ├─ Warrior supplies action\n   └─ Mage supplies action",
    syntax: "abstract void action();",
    remember:
      "Abstract method requirement define karta hai; us method ki body base class provide nahi karti.",
    example: "Character declares action(); concrete Warrior implements it.",
    trace:
      "compiler sees concrete child → checks inherited abstract obligations → child must implement action",
    mistake:
      "Meaningless placeholder implementation like `Character acts` rakhna only to satisfy method presence.",
    fix: "Jab base implementation meaningful nahi, method ko abstract requirement banao.",
    predict: ["Abstract method ki base body hoti hai? yes/no", "no"],
    predict2: [
      "Concrete child ko inherited abstract method implement karna hota hai? yes/no",
      "yes",
    ],
    prompt:
      "Character.action ko abstract requirement banao and Warrior implementation se exact output `Warrior attacks` lao.",
    starter:
      "abstract class Character {\n    // Declare action as a required operation.\n}\n\nclass Warrior extends Character {\n    // Fulfil the required action.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        warrior.action();\n    }\n}",
    solution:
      'abstract class Character {\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior();\n        warrior.action();\n    }\n}',
    tests: tests("Warrior attacks"),
  },
  {
    slug: "abstract-classes-shared-state",
    title: "Shared + Required Behaviour",
    description:
      "Abstract class ki main design power combine karo: kuch implementation share karo aur kuch variation force karo.",
    problem:
      "Warrior aur Mage dono ko name/reporting common chahiye, but action implementation necessarily different hai.",
    why: "Partial abstraction duplication reduce karti hai without inventing fake generic behaviour.",
    model:
      "Character\n├─ name + showName()  [shared implementation]\n└─ action()           [required variation]\n   ├ Warrior override\n   └ Mage override",
    syntax:
      "abstract class Character {\n    void showName() { ... }\n    abstract void action();\n}",
    remember:
      "Abstract class = all abstract methods nahi. Shared concrete + required abstract behaviour coexist kar sakte hain.",
    example: "Both children reuse showName and independently fulfil action.",
    trace:
      "construct child → shared base state ready → showName reused → action dispatched to child implementation",
    mistake:
      "Everything abstract kar dena, causing children to duplicate genuinely shared logic.",
    fix: "Stable common implementation base me; required variation abstract method me.",
    predict: [
      "showName common implementation base me reh sakti hai? yes/no",
      "yes",
    ],
    predict2: [
      "action child-specific ho to abstract requirement useful hai? yes/no",
      "yes",
    ],
    prompt:
      "Shared + required design complete karo. Exact output:\nName: Aman\nWarrior attacks\nName: Riya\nMage casts spell",
    starter:
      'abstract class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    void showName() {\n        System.out.println("Name: " + name);\n    }\n\n    // Require every concrete Character to define action().\n}\n\nclass Warrior extends Character {\n    Warrior(String name) { super(name); }\n    // Implement action.\n}\n\nclass Mage extends Character {\n    Mage(String name) { super(name); }\n    // Implement action.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        Mage mage = new Mage("Riya");\n\n        warrior.showName();\n        warrior.action();\n        mage.showName();\n        mage.action();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    void showName() {\n        System.out.println("Name: " + name);\n    }\n\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name) { super(name); }\n\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\nclass Mage extends Character {\n    Mage(String name) { super(name); }\n\n    @Override\n    void action() {\n        System.out.println("Mage casts spell");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior("Aman");\n        Mage mage = new Mage("Riya");\n\n        warrior.showName();\n        warrior.action();\n        mage.showName();\n        mage.action();\n    }\n}',
    tests: tests("Name: Aman\nWarrior attacks\nName: Riya\nMage casts spell"),
  },
  {
    slug: "abstract-classes-concrete-child",
    title: "Instantiation Boundary",
    description:
      "Abstract base reference aur abstract base object ko confuse na karo.",
    problem:
      "`new Character()` invalid hai, but `Character ref = new Warrior()` valid ho sakta hai.",
    why: "Abstractness object creation ko base level par block karti hai; polymorphic reference use ko nahi.",
    model:
      "new Character() ✗\nCharacter ref = new Warrior() ✓\nref.action() → Warrior implementation",
    syntax: "Character member = new Warrior();",
    remember:
      "Abstract class instantiate nahi hoti, but uska reference concrete child object hold kar sakta hai.",
    example:
      "Module 27 polymorphism abstract hierarchy ke saath naturally continue hota hai.",
    trace:
      "compile creation target → abstract? direct new invalid; child concrete? valid → assign to parent reference",
    mistake:
      "Abstract type ko reference type ke roop me bhi unusable samajhna.",
    fix: "Instantiation restriction aur reference capability separate rakho.",
    predict: ["`new Character()` valid if Character abstract? yes/no", "no"],
    predict2: [
      "`Character c = new Warrior()` valid ho sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Invalid direct base creation avoid karo. Character reference me Warrior store karke exact output `Warrior attacks` lao.",
    starter:
      'abstract class Character {\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Do not instantiate Character directly.\n        // Use an abstract-base reference with a concrete child.\n    }\n}',
    solution:
      'abstract class Character {\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character member = new Warrior();\n        member.action();\n    }\n}',
    tests: tests("Warrior attacks"),
  },
  {
    slug: "abstract-classes-constructor-in-abstract-class",
    title: "Concrete Child Contract Bug Hunt",
    description:
      "Concrete subclass ke missing abstract obligation ko compiler-driven bug hunt se diagnose karo.",
    problem:
      "Character requires action(), but Mage concrete class implementation bhool gaya.",
    why: "Abstract method hierarchy ke concrete leaves par enforceable contract banata hai.",
    model:
      "Character: abstract action()\n       ↓ obligation\nMage concrete\n       ↓ must implement\nMage.action()",
    syntax: "@Override\nvoid action() { ... }",
    remember:
      "Concrete child inherited abstract methods unresolved nahi chhod sakta.",
    example:
      "If child bhi intentionally incomplete hai, it may remain abstract; otherwise implement requirement.",
    trace:
      "compiler error on concrete Mage → inspect abstract parent → find missing action → implement → verify",
    mistake:
      "Compiler error fix karne ke liye required method remove kar dena.",
    fix: "Parent contract preserve karo; concrete child obligation fulfil karo.",
    predict: [
      "Concrete child abstract method skip kar sakta hai? yes/no",
      "no",
    ],
    predict2: [
      "Incomplete child ko abstract mark karna possible hai? yes/no",
      "yes",
    ],
    prompt:
      "Bug hunt: Mage ko valid concrete child banao. Exact output `Mage casts spell`.",
    starter:
      "abstract class Character {\n    abstract void action();\n}\n\nclass Mage extends Character {\n    // BUG: required action() is missing.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Mage mage = new Mage();\n        mage.action();\n    }\n}",
    solution:
      'abstract class Character {\n    abstract void action();\n}\n\nclass Mage extends Character {\n    @Override\n    void action() {\n        System.out.println("Mage casts spell");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Mage mage = new Mage();\n        mage.action();\n    }\n}',
    tests: tests("Mage casts spell"),
  },
  {
    slug: "abstract-classes-when-to-choose-abstract-base",
    title: "Abstract Class Design Decision",
    description:
      "Transfer requirement me decide karo ki abstract class appropriate hai ya plain concrete parent better.",
    problem:
      "Delivery system me every Delivery has shared trackingId and printTracking(), but deliveryCost() differs and generic Delivery object meaningful nahi.",
    why: "Abstract class tab strong fit hai jab related hierarchy ko shared state/implementation + mandatory variation dono chahiye.",
    model:
      "Delivery [incomplete shared base]\n├ trackingId + printTracking shared\n└ deliveryCost abstract\n   ├ BikeDelivery\n   └ VanDelivery",
    syntax:
      "abstract class Delivery {\n    ...\n    abstract int deliveryCost();\n}",
    remember: "Choice syntax se nahi, modelling requirements se derive karo.",
    example:
      "Transfer domain proves abstract-class reasoning RPG example tak limited nahi.",
    trace:
      "requirements → related IS-A types → shared implementation? yes → required variation? yes → base object meaningful? no → abstract class candidate",
    mistake:
      "Sirf 'multiple child classes hain' dekhkar abstract choose karna.",
    fix: "Shared identity + partial implementation + incomplete base need ko together inspect karo.",
    predict: [
      "Shared state + required variation + invalid generic base: abstract class candidate? yes/no",
      "yes",
    ],
    predict2: [
      "Abstract class choose karne ka reason sirf code reuse hai? yes/no",
      "no",
    ],
    prompt:
      "Transfer design implement karo. BikeDelivery tracking `BK-7`, cost 40. Exact output:\nTracking: BK-7\nCost: 40",
    starter:
      'abstract class Delivery {\n    // Store trackingId.\n    // Add shared printTracking().\n    // Require deliveryCost().\n}\n\nclass BikeDelivery {\n    // Extend Delivery and return cost 40.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create BikeDelivery("BK-7"), print tracking and cost.\n    }\n}',
    solution:
      'abstract class Delivery {\n    private String trackingId;\n\n    Delivery(String trackingId) {\n        this.trackingId = trackingId;\n    }\n\n    void printTracking() {\n        System.out.println("Tracking: " + trackingId);\n    }\n\n    abstract int deliveryCost();\n}\n\nclass BikeDelivery extends Delivery {\n    BikeDelivery(String trackingId) {\n        super(trackingId);\n    }\n\n    @Override\n    int deliveryCost() {\n        return 40;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Delivery delivery = new BikeDelivery("BK-7");\n        delivery.printTracking();\n        System.out.println("Cost: " + delivery.deliveryCost());\n    }\n}',
    tests: tests("Tracking: BK-7\nCost: 40"),
  },
  {
    slug: "abstract-classes-abstract-class-recap",
    title: "🏆 Abstract Character Base Build",
    description:
      "Shared implementation + mandatory child variation wala hierarchy independently design karke abstract-class capability prove karo.",
    problem:
      "Guild characters share name/level/reporting, but generic Character action meaningless hai and each concrete role must define it.",
    why: "Final proof abstract base ko inheritance/polymorphism ke purposeful extension ki tarah use karta hai—not as syntax checklist.",
    model:
      "abstract Character\n├ name, level, showInfo() [shared]\n└ action() [required]\n   ├ Warrior\n   └ Mage\n\nCharacter[] processes concrete children",
    syntax: "abstract class Character { ... abstract void action(); }",
    remember:
      "Abstract base should own genuinely shared implementation and enforce only genuinely required variation.",
    example:
      "Warrior and Mage reuse showInfo, implement action, then work through Character[].",
    trace:
      "requirements → design incomplete base → shared constructor/state → concrete method → abstract requirement → children fulfil → polymorphic verification",
    mistake:
      "Everything child me duplicate karna ya fake generic Character action provide karna.",
    fix: "Stable common pieces base me; unavoidable variation abstract contract me.",
    predict: [
      "Generic Character directly instantiate karna chahiye? yes/no",
      "no",
    ],
    predict2: ["Final party common reference type?", "Character"],
    prompt:
      "Independent build:\n- abstract Character owns private name + level, constructor, and concrete `showInfo()` → `<name> | Level <level>`\n- Character declares abstract `void action()`\n- Warrior and Mage extend Character and implement action\n- Warrior Aman level 5 → `Aman attacks`\n- Mage Riya level 3 → `Riya casts spell`\n- Store both in one Character[]\n- For each member call showInfo() then action()\n\nExact output:\nAman | Level 5\nAman attacks\nRiya | Level 3\nRiya casts spell",
    starter:
      "abstract class Character {\n    // Design shared state, constructor, concrete showInfo(),\n    // and required action().\n}\n\nclass Warrior {\n    // Complete the concrete child.\n}\n\nclass Mage {\n    // Complete the concrete child.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build one Character[] with Aman and Riya.\n        // For each member: showInfo(), then action().\n    }\n}",
    solution:
      'abstract class Character {\n    private String name;\n    private int level;\n\n    Character(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    String getName() {\n        return name;\n    }\n\n    void showInfo() {\n        System.out.println(name + " | Level " + level);\n    }\n\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name, int level) {\n        super(name, level);\n    }\n\n    @Override\n    void action() {\n        System.out.println(getName() + " attacks");\n    }\n}\n\nclass Mage extends Character {\n    Mage(String name, int level) {\n        super(name, level);\n    }\n\n    @Override\n    void action() {\n        System.out.println(getName() + " casts spell");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {\n            new Warrior("Aman", 5),\n            new Mage("Riya", 3)\n        };\n\n        for (Character member : party) {\n            member.showInfo();\n            member.action();\n        }\n    }\n}',
    tests: tests(
      "Aman | Level 5\nAman attacks\nRiya | Level 3\nRiya casts spell",
    ),
  },
];

export const abstractClassesModule = specModule(
  {
    slug: "abstract-classes",
    title: "Module 28 — Abstract Classes",
    description:
      "Incomplete shared base models design karo jo common state/implementation reuse karein aur concrete children se required behaviour enforce karein.",
    position: 28,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
