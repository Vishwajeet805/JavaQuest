import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "polymorphism-parent-reference",
    title: "Parent Reference",
    description:
      "Reference type aur actual object ko separate concepts ki tarah reason karo.",
    problem:
      "`Character ref = new Warrior()` me variable ka declared type Character hai, actual object Warrior hai.",
    why: "Polymorphism samajhne ke liye do facts ek saath hold karne padte hain: reference kis type ka hai aur object actually kis type ka bana hai.",
    model:
      "Character ref = new Warrior()\n^^^^^^^^^       ^^^^^^^^^^^^^\nreference type  actual object",
    syntax: "Character ref = new Warrior();",
    remember:
      "Reference type aur actual object type same hona required nahi when child IS-A parent.",
    example: "`Character` reference ek `Warrior` object hold kar sakta hai.",
    trace:
      "read left side → reference type Character; read new expression → actual object Warrior",
    mistake:
      "`new Warrior()` dekhkar variable ka declared type bhi Warrior assume karna.",
    fix: "Declaration aur object creation ko separately label karo.",
    predict: [
      "`Character ref = new Warrior()` ka reference type?",
      "Character",
    ],
    predict2: ["Actual object type?", "Warrior"],
    prompt:
      "Reference/object distinction verify karne ke liye exact output print karo:\nReference type: Character\nActual object: Warrior",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Given design: Character ref = new Warrior()\n        // Print the two type roles exactly as requested.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Reference type: Character");\n        System.out.println("Actual object: Warrior");\n    }\n}',
    tests: tests("Reference type: Character\nActual object: Warrior"),
  },
  {
    slug: "polymorphism-child-object",
    title: "Child Object Through Parent Reference",
    description:
      "Module 26 ke overrides ko common parent reference ke through invoke karke first polymorphic payoff observe karo.",
    problem:
      "Reference Character hai, but object Warrior. `action()` call par kaunsi implementation chalegi?",
    why: "Overridden instance method ka runtime behaviour actual object se aata hai.",
    model:
      "Character ref ─────► Warrior object\nref.action()             │\n                         └─ Warrior.action()",
    syntax: "Character ref = new Warrior();\nref.action();",
    remember:
      "Common parent reference child object ko hold kar sakta hai; overridden call child implementation tak dispatch hoti hai.",
    example:
      "Character ref = new Warrior(); ref.action(); prints Warrior behaviour.",
    trace:
      "reference accepts call from Character API → runtime sees Warrior object → Warrior override runs",
    mistake:
      "Sirf reference type dekhkar Character implementation predict karna.",
    fix: "Call availability aur runtime implementation ko separate reason karo.",
    predict: [
      "Character ref = new Warrior(); ref.action() overridden hai. Output source?",
      "Warrior",
    ],
    predict2: ["Runtime object Warrior hai? yes/no", "yes"],
    prompt:
      "`Character ref = new Warrior()` use karo and exact output `Warrior attacks` produce karo.",
    starter:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Store a Warrior in a Character reference.\n        // Call action through that reference.\n    }\n}',
    solution:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\n\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character ref = new Warrior();\n        ref.action();\n    }\n}',
    tests: tests("Warrior attacks"),
  },
  {
    slug: "polymorphism-dynamic-method-dispatch",
    title: "Dynamic Method Dispatch",
    description:
      "Same call expression ko different actual objects ke saath trace karke runtime dispatch mental model build karo.",
    problem:
      "`character.action()` text same reh sakta hai while assigned object Warrior ya Mage ho.",
    why: "Dynamic dispatch caller ko child-specific branching se bachata hai for overridden instance methods.",
    model:
      "Character ref\n   ├─ Warrior object → Warrior.action\n   └─ Mage object    → Mage.action",
    syntax:
      "Character ref = new Warrior();\nref.action();\nref = new Mage();\nref.action();",
    remember:
      "Same reference variable, same method call, different actual object → different override.",
    example: "One Character reference can point first to Warrior, then Mage.",
    trace:
      "call 1 actual Warrior → Warrior action; reassign Mage → call 2 actual Mage → Mage action",
    mistake:
      "Method choice ko permanently reference variable ke declared type se bind karna.",
    fix: "Har overridden call par current actual object trace karo.",
    predict: [
      "Same Character ref now points to Mage. action() source?",
      "Mage",
    ],
    predict2: [
      "Dispatch decision runtime actual object par hoti hai? yes/no",
      "yes",
    ],
    prompt:
      "One Character reference ko Warrior se Mage par reassign karke exact output produce karo:\nWarrior attacks\nMage casts spell",
    starter:
      'class Character {\n    void action() { System.out.println("Character acts"); }\n}\nclass Warrior extends Character {\n    @Override void action() { System.out.println("Warrior attacks"); }\n}\nclass Mage extends Character {\n    @Override void action() { System.out.println("Mage casts spell"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Character ref = new Warrior();\n        // Call action, then point ref to Mage and call again.\n    }\n}',
    solution:
      'class Character {\n    void action() { System.out.println("Character acts"); }\n}\nclass Warrior extends Character {\n    @Override void action() { System.out.println("Warrior attacks"); }\n}\nclass Mage extends Character {\n    @Override void action() { System.out.println("Mage casts spell"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Character ref = new Warrior();\n        ref.action();\n\n        ref = new Mage();\n        ref.action();\n    }\n}',
    tests: tests("Warrior attacks\nMage casts spell"),
  },
  {
    slug: "polymorphism-polymorphic-arrays",
    title: "Polymorphic Arrays",
    description:
      "Different child objects ko one parent-typed collection me store karke uniform traversal + runtime variation combine karo.",
    problem:
      "Warrior aur Mage ko separate loops/calls ki zarurat nahi if both are Characters with same action API.",
    why: "Parent array heterogeneous child objects ko one common operation se process kar sakta hai.",
    model:
      "Character[] party\n├─ [0] Warrior → action → attack\n├─ [1] Mage    → action → spell\n└─ [2] Warrior → action → attack",
    syntax:
      "Character[] party = { new Warrior(), new Mage() };\nfor (Character member : party) member.action();",
    remember:
      "Array slot/reference common type ka hai; each element ka actual object different ho sakta hai.",
    example:
      "Enhanced-for variable Character hai but dispatch each object's override use karti hai.",
    trace:
      "iterate element → actual type trace → action dispatch → next element",
    mistake:
      "Loop me `if type is Warrior...` karke manually child behaviour choose karna when common overridden API already exists.",
    fix: "Common API call karo; runtime dispatch ko variation handle karne do.",
    predict: [
      "Character[] me Warrior aur Mage dono store ho sakte hain? yes/no",
      "yes",
    ],
    predict2: [
      "Loop variable Character hone se child overrides stop ho jaate hain? yes/no",
      "no",
    ],
    prompt:
      "Party array complete karo. Exact output:\nWarrior attacks\nMage casts spell\nWarrior attacks",
    starter:
      'class Character {\n    void action() { System.out.println("Character acts"); }\n}\nclass Warrior extends Character {\n    @Override void action() { System.out.println("Warrior attacks"); }\n}\nclass Mage extends Character {\n    @Override void action() { System.out.println("Mage casts spell"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        // Build one Character[] containing Warrior, Mage, Warrior.\n        // Traverse it using the common Character API.\n    }\n}',
    solution:
      'class Character {\n    void action() { System.out.println("Character acts"); }\n}\nclass Warrior extends Character {\n    @Override void action() { System.out.println("Warrior attacks"); }\n}\nclass Mage extends Character {\n    @Override void action() { System.out.println("Mage casts spell"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {new Warrior(), new Mage(), new Warrior()};\n\n        for (Character member : party) {\n            member.action();\n        }\n    }\n}',
    tests: tests("Warrior attacks\nMage casts spell\nWarrior attacks"),
  },
  {
    slug: "polymorphism-common-api",
    title: "Common API",
    description:
      "Reference type ko available operations ka compile-time view samjho; child-only methods common reference se directly unavailable ho sakte hain.",
    problem:
      "Actual object Warrior hone ke bawajood `Character ref` se sirf Character API guaranteed hai.",
    why: "Polymorphism safe tab hai jab caller common contract par depend kare, child internals par nahi.",
    model:
      "Character ref → common API: action() ✓\nactual Warrior also has attackWithSword()\nref.attackWithSword() → not guaranteed by Character type",
    syntax: "Character ref = new Warrior();\nref.action(); // common API",
    remember:
      "Runtime object implementation choose karta hai; reference type decide karta hai caller ko kaunsa API visible/allowed hai.",
    example:
      "Common reference lets caller use action(), not arbitrary child-only methods.",
    trace:
      "compile call → is method in Character API? yes → runtime dispatch; no → compile error",
    mistake:
      "Actual object Warrior hai, isliye Character reference se every Warrior-only method call ho jayega assume karna.",
    fix: "Availability = reference type; overridden implementation = actual object.",
    predict: [
      "Character ref se child-only method directly guaranteed hai? yes/no",
      "no",
    ],
    predict2: [
      "Common action() available ho to runtime override still run kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Code ko common API par rakho. `attackWithSword()` ko Character reference se call mat karo. Exact output `Warrior acts through common API`.",
    starter:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior acts through common API");\n    }\n\n    void attackWithSword() {\n        System.out.println("Sword attack");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Character member = new Warrior();\n\n        // Use only the common API available through Character.\n    }\n}',
    solution:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\nclass Warrior extends Character {\n    @Override\n    void action() {\n        System.out.println("Warrior acts through common API");\n    }\n\n    void attackWithSword() {\n        System.out.println("Sword attack");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Character member = new Warrior();\n        member.action();\n    }\n}',
    tests: tests("Warrior acts through common API"),
  },
  {
    slug: "polymorphism-safe-design-thinking",
    title: "Safe Design Thinking",
    description:
      "Unnecessary downcasting/type checks ke badle common polymorphic operation design karna practise karo.",
    problem:
      "Party report ko Warrior/Mage-specific branches se behaviour choose nahi karna chahiye if every Character can provide `role()`.",
    why: "Common virtual API caller ko concrete child knowledge se decouple karta hai.",
    model:
      "BAD caller: inspect child type → choose branch\nBETTER: Character.role() → each child override → caller just calls role()",
    syntax:
      "for (Character member : party) {\n    System.out.println(member.role());\n}",
    remember:
      "Polymorphism ka goal child type discover karke branch karna nahi; common contract ke through variation hide karna hai.",
    example: "Warrior.role returns Warrior; Mage.role returns Mage.",
    trace:
      "loop gets Character → calls common role → actual object supplies result",
    mistake:
      "`instanceof` chain se har subtype manually detect karna for behaviour already expressible in common API.",
    fix: "Behaviour ko common method contract me model karo and override it.",
    predict: [
      "Common API ho to subtype branch often avoid ki ja sakti hai? yes/no",
      "yes",
    ],
    predict2: [
      "Caller ko every child class know karna required hai? yes/no",
      "no",
    ],
    prompt:
      "`instanceof` ke bina polymorphic role report banao. Exact output:\nWarrior\nMage",
    starter:
      'class Character {\n    String role() {\n        return "Character";\n    }\n}\nclass Warrior extends Character {\n    // Specialise role().\n}\nclass Mage extends Character {\n    // Specialise role().\n}\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {new Warrior(), new Mage()};\n\n        // Print each role using only the common Character API.\n    }\n}',
    solution:
      'class Character {\n    String role() {\n        return "Character";\n    }\n}\nclass Warrior extends Character {\n    @Override\n    String role() {\n        return "Warrior";\n    }\n}\nclass Mage extends Character {\n    @Override\n    String role() {\n        return "Mage";\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {new Warrior(), new Mage()};\n\n        for (Character member : party) {\n            System.out.println(member.role());\n        }\n    }\n}',
    tests: tests("Warrior\nMage"),
  },
  {
    slug: "polymorphism-when-polymorphism-helps",
    title: "When Polymorphism Helps",
    description:
      "Transfer scenario me identify karo ki common parent API + varying child behaviour duplication/branching reduce karta hai.",
    problem:
      "Payment processing me CardPayment aur UpiPayment dono `pay()` provide karte hain. Caller ko concrete payment type ki branch nahi chahiye.",
    why: "Polymorphism tab valuable hai jab multiple related implementations ko same operation ke through uniformly process karna ho.",
    model:
      "Payment ref/array\n├─ CardPayment → pay()\n└─ UpiPayment  → pay()\nCaller: payment.pay()",
    syntax:
      "Payment[] payments = { new CardPayment(), new UpiPayment() };\nfor (Payment p : payments) p.pay();",
    remember:
      "Transfer test: pattern game domain se bahar bhi same hai—common type, overridden operation, uniform caller.",
    example:
      "Payment hierarchy demonstrates the same dispatch idea in a different domain.",
    trace:
      "common reference → actual Card/UPI object → pay dispatch → caller unchanged",
    mistake: "Polymorphism ko sirf RPG class hierarchy trick samajhna.",
    fix: "Same design pattern ko unrelated domain requirement par recognise karo.",
    predict: [
      "CardPayment aur UpiPayment ko common pay() se process karna polymorphism use-case hai? yes/no",
      "yes",
    ],
    predict2: [
      "Caller ko each payment type ke liye branch required hai? yes/no",
      "no",
    ],
    prompt:
      "Transfer build: one Payment[] me CardPayment aur UpiPayment process karo. Exact output:\nPaid by card\nPaid by UPI",
    starter:
      'class Payment {\n    void pay() {\n        System.out.println("Generic payment");\n    }\n}\n\nclass CardPayment extends Payment {\n    // Override pay().\n}\n\nclass UpiPayment extends Payment {\n    // Override pay().\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build Payment[] and process every item through pay().\n    }\n}',
    solution:
      'class Payment {\n    void pay() {\n        System.out.println("Generic payment");\n    }\n}\n\nclass CardPayment extends Payment {\n    @Override\n    void pay() {\n        System.out.println("Paid by card");\n    }\n}\n\nclass UpiPayment extends Payment {\n    @Override\n    void pay() {\n        System.out.println("Paid by UPI");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Payment[] payments = {new CardPayment(), new UpiPayment()};\n\n        for (Payment payment : payments) {\n            payment.pay();\n        }\n    }\n}',
    tests: tests("Paid by card\nPaid by UPI"),
  },
  {
    slug: "polymorphism-polymorphism-recap",
    title: "🏆 Polymorphic Party Build",
    description:
      "Common Character API par depend karte hue mixed party ko independently process karo aur runtime dispatch prove karo.",
    problem:
      "Guild party me Warrior, Mage, Healer hain. Report code ko concrete type branches ke bina sabka action execute karna hai.",
    why: "Final proof: reference type vs actual object, overridden dispatch, polymorphic array and common API ek coherent program me combine hote hain.",
    model:
      "Character[] party\n├ Warrior → Aman attacks\n├ Mage    → Riya casts spell\n└ Healer  → Kabir heals\n\none loop: member.action()",
    syntax:
      "Character[] party = { ... };\nfor (Character member : party) {\n    member.action();\n}",
    remember:
      "Caller concrete subtype choose nahi karta; each actual object apna overridden action supply karta hai.",
    example: "Three child types, one Character[] and one action() loop.",
    trace:
      "construct mixed objects → store as Character refs → loop common API → runtime selects each override",
    mistake: "Three separate arrays/loops ya subtype checks bana dena.",
    fix: "One common Character contract and one uniform traversal use karo.",
    predict: ["Mixed child objects ka common array type?", "Character"],
    predict2: [
      "One loop me action() call each actual subtype ka override run karega? yes/no",
      "yes",
    ],
    prompt:
      "Independent build:\n- Character has `void action()`\n- Warrior(name), Mage(name), Healer(name) extend Character and each override action()\n- Build one Character[] with Aman Warrior, Riya Mage, Kabir Healer\n- One enhanced-for loop only; no instanceof/type branching\n\nExact output:\nAman attacks\nRiya casts spell\nKabir heals",
    starter:
      "class Character {\n    // Define the common action API.\n}\n\nclass Warrior {\n    // Extend Character, store name, override action.\n}\n\nclass Mage {\n    // Extend Character, store name, override action.\n}\n\nclass Healer {\n    // Extend Character, store name, override action.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build one mixed Character[].\n        // Process it with one common-API loop.\n    }\n}",
    solution:
      'class Character {\n    void action() {\n        System.out.println("Character acts");\n    }\n}\n\nclass Warrior extends Character {\n    private String name;\n    Warrior(String name) { this.name = name; }\n    @Override void action() { System.out.println(name + " attacks"); }\n}\n\nclass Mage extends Character {\n    private String name;\n    Mage(String name) { this.name = name; }\n    @Override void action() { System.out.println(name + " casts spell"); }\n}\n\nclass Healer extends Character {\n    private String name;\n    Healer(String name) { this.name = name; }\n    @Override void action() { System.out.println(name + " heals"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {\n            new Warrior("Aman"),\n            new Mage("Riya"),\n            new Healer("Kabir")\n        };\n\n        for (Character member : party) {\n            member.action();\n        }\n    }\n}',
    tests: tests("Aman attacks\nRiya casts spell\nKabir heals"),
  },
];

export const polymorphismModule = specModule(
  {
    slug: "polymorphism",
    title: "Module 27 — Polymorphism",
    description:
      "Common parent references ke through different child objects ko uniformly process karo aur overridden behaviour ka runtime dispatch reason karo.",
    position: 27,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
