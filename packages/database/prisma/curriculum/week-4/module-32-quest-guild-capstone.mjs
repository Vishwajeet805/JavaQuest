import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "week-4-quest-guild-capstone-guild-requirements",
    title: "Requirements → Object Model",
    description:
      "Quest Guild requirements ko Java keywords me jump kiye bina responsibilities aur relationships me break karo.",
    problem:
      "Quest Guild requirements ko Java keywords me jump kiye bina responsibilities aur relationships me break karo.",
    why: "Capstone ka first skill implementation nahi, requirements se model derive karna hai.",
    model:
      "Character = shared identity\nWarrior/Mage = specialisations\nRank = closed state\nAbility = capability\nGuild HAS-A Character[]",
    syntax:
      "IS-A → inheritance\nCAN-DO → interface\nHAS-A → composition\nclosed finite state → enum",
    remember:
      "Tool pehle choose mat karo. Requirement ka relationship identify karo, phir Java construct select karo.",
    example:
      "Warrior IS-A Character; Guild HAS-A party; Rank has finite values.",
    trace: "requirement → responsibility → relationship → Java construct",
    mistake: "Har noun ko class aur har reuse ko inheritance bana dena.",
    fix: "Identity, capability, collaboration aur closed state separately classify karo.",
    predict: ["Guild/Character relation?", "composition"],
    predict2: ["Rank finite vocabulary ko model karne ka tool?", "enum"],
    prompt:
      "Requirements analysis ka exact report print karo:\nCharacter -> shared identity\nWarrior/Mage -> specialisations\nRank -> closed state\nAbility -> capability\nGuild -> has Characters",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Translate requirements into modelling decisions.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Character -> shared identity");\n        System.out.println("Warrior/Mage -> specialisations");\n        System.out.println("Rank -> closed state");\n        System.out.println("Ability -> capability");\n        System.out.println("Guild -> has Characters");\n    }\n}',
    tests: tests(
      "Character -> shared identity\nWarrior/Mage -> specialisations\nRank -> closed state\nAbility -> capability\nGuild -> has Characters",
    ),
  },
  {
    slug: "week-4-quest-guild-capstone-abstract-character-base",
    title: "Choose the Base Abstraction",
    description:
      "Character generic playable object meaningful nahi, but name/rank/reporting shared hai aur action every concrete role ko define karna hai.",
    problem:
      "Character generic playable object meaningful nahi, but name/rank/reporting shared hai aur action every concrete role ko define karna hai.",
    why: "Related types ko shared implementation + mandatory variation chahiye, so incomplete base abstraction design karni hai.",
    model:
      "abstract Character\n├ name + rank + showInfo() [shared]\n└ action() [required]\n   ├ Warrior\n   └ Mage",
    syntax: "abstract class Character {\n    abstract void action();\n}",
    remember:
      "Abstract base tab choose karo jab shared identity/implementation ho but base itself intentionally incomplete ho.",
    example:
      "Character owns shared name; concrete roles own action implementation.",
    trace:
      "shared identity → base object invalid → abstract class → shared members + abstract requirement",
    mistake:
      "Fake generic Character.action() body dena just to make base concrete.",
    fix: "Meaningless generic behaviour ko abstract requirement banao.",
    predict: ["Character directly instantiate hona chahiye? yes/no", "no"],
    predict2: ["Concrete child ko action implement karna hoga? yes/no", "yes"],
    prompt:
      "Abstract Character design complete karo. Exact output `Name: Aman`.",
    starter:
      'abstract class Character {\n    // Store private name, add constructor/getName/showInfo,\n    // and require action().\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        // Initialise Character.\n    }\n\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character character = new Warrior("Aman");\n        character.showInfo();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    String getName() {\n        return name;\n    }\n\n    void showInfo() {\n        System.out.println("Name: " + name);\n    }\n\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    @Override\n    void action() {\n        System.out.println("Warrior attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character character = new Warrior("Aman");\n        character.showInfo();\n    }\n}',
    tests: tests("Name: Aman"),
  },
  {
    slug: "week-4-quest-guild-capstone-warrior-override",
    title: "Design Warrior Specialisation",
    description:
      "Warrior ko Character identity reuse karni hai but action role-specific hona chahiye.",
    problem:
      "Warrior ko Character identity reuse karni hai but action role-specific hona chahiye.",
    why: "Specialisation ka purpose duplicate base state banana nahi; inherited contract ko meaningful concrete behaviour dena hai.",
    model:
      "Character.action requirement\n        ↓\nWarrior.action → <name> attacks",
    syntax: "@Override\nvoid action() { ... }",
    remember:
      "Child sirf genuinely specialised behaviour own kare; shared state base me duplicate mat karo.",
    example: "Warrior inherits name/getName and implements action.",
    trace:
      "construct Warrior → super initialises name → Character reference → runtime Warrior.action",
    mistake: "Warrior me second name field create karna.",
    fix: "Base state reuse karo and specialised method override karo.",
    predict: ["Warrior name ka shared owner?", "Character"],
    predict2: ["action implementation ka owner?", "Warrior"],
    prompt:
      "Warrior specialisation complete karo. Exact output `Aman attacks`.",
    starter:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    // Implement specialised action.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character member = new Warrior("Aman");\n        member.action();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name) {\n        super(name);\n    }\n\n    @Override\n    void action() {\n        System.out.println(getName() + " attacks");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character member = new Warrior("Aman");\n        member.action();\n    }\n}',
    tests: tests("Aman attacks"),
  },
  {
    slug: "week-4-quest-guild-capstone-mage-override",
    title: "Design Mage Specialisation",
    description:
      "Mage bhi same Character contract fulfil karta hai, but behaviour Warrior se different hai.",
    problem:
      "Mage bhi same Character contract fulfil karta hai, but behaviour Warrior se different hai.",
    why: "Second subtype prove karta hai ki abstraction actual variation support karti hai, sirf one-child wrapper nahi.",
    model: "Character ref\n├ Warrior → attacks\n└ Mage → casts spell",
    syntax:
      "class Mage extends Character {\n    @Override void action() { ... }\n}",
    remember:
      "Common contract same reh sakta hai while runtime implementation subtype-specific hoti hai.",
    example: "Riya Mage uses inherited name and supplies casting action.",
    trace:
      "Character reference → Mage actual object → action() → Mage override",
    mistake: "Caller me role check karke Mage behaviour manually choose karna.",
    fix: "Variation subtype override me rakho.",
    predict: ["Character ref Mage object hold kar sakta hai? yes/no", "yes"],
    predict2: ["action call ka implementation?", "Mage"],
    prompt:
      "Mage specialisation complete karo. Exact output `Riya casts spell`.",
    starter:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n    abstract void action();\n}\n\nclass Mage extends Character {\n    // Add constructor and action implementation.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character member = new Mage("Riya");\n        member.action();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n    abstract void action();\n}\n\nclass Mage extends Character {\n    Mage(String name) {\n        super(name);\n    }\n\n    @Override\n    void action() {\n        System.out.println(getName() + " casts spell");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character member = new Mage("Riya");\n        member.action();\n    }\n}',
    tests: tests("Riya casts spell"),
  },
  {
    slug: "week-4-quest-guild-capstone-rank-enum",
    title: "Model Rank as a Closed Domain",
    description:
      "Guild rank sirf BRONZE, SILVER, GOLD ho sakta hai; free-form String invalid vocabulary allow karega.",
    problem:
      "Guild rank sirf BRONZE, SILVER, GOLD ho sakta hai; free-form String invalid vocabulary allow karega.",
    why: "Capstone me enum ko domain constraint ke roop me use karo, decorative label ke roop me nahi.",
    model: "Rank = BRONZE | SILVER | GOLD\nCharacter ── has typed Rank state",
    syntax: "enum Rank { BRONZE, SILVER, GOLD }",
    remember:
      "Closed domain ko type me encode karo so object state valid vocabulary use kare.",
    example: "Character constructor receives Rank, not arbitrary String.",
    trace: "requirement closed set → enum → typed field → report",
    mistake: 'private String rank = "GLOD";',
    fix: "Rank field + Rank constants use karo.",
    predict: ["Rank field ka type?", "Rank"],
    predict2: ["GLOD valid enum constant hai? yes/no", "no"],
    prompt: "Rank ko typed Character state banao. Exact output `Aman | GOLD`.",
    starter:
      "// Define Rank.\n\nclass Character {\n    private String name;\n    // Add typed rank field.\n\n    Character(String name, Rank rank) {\n        this.name = name;\n        // Store rank.\n    }\n\n    void showInfo() {\n        // Print <name> | <rank>\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Aman at GOLD and show info.\n    }\n}",
    solution:
      'enum Rank { BRONZE, SILVER, GOLD }\n\nclass Character {\n    private String name;\n    private Rank rank;\n\n    Character(String name, Rank rank) {\n        this.name = name;\n        this.rank = rank;\n    }\n\n    void showInfo() {\n        System.out.println(name + " | " + rank);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character aman = new Character("Aman", Rank.GOLD);\n        aman.showInfo();\n    }\n}',
    tests: tests("Aman | GOLD"),
  },
  {
    slug: "week-4-quest-guild-capstone-ability-interface",
    title: "Add a Capability Contract",
    description:
      "Some guild members special ability use kar sakte hain, but capability ko Character hierarchy ke har child par force nahi karna.",
    problem:
      "Some guild members special ability use kar sakte hain, but capability ko Character hierarchy ke har child par force nahi karna.",
    why: "Optional/orthogonal behaviour ko focused interface contract se model karna hierarchy ko cleaner rakhta hai.",
    model:
      "Character identity\n\nAbility capability ← Mage\n                 ← Healer\nWarrior need not implement it",
    syntax: "interface Ability {\n    void useAbility();\n}",
    remember: "Capability contract ko only relevant classes implement karvao.",
    example: "Mage IS-A Character and CAN use Ability.",
    trace:
      "identify optional capability → interface → relevant subtype implements → helper accepts Ability",
    mistake:
      "useAbility() ko Character me daalna so every child gets irrelevant operation.",
    fix: "Focused interface extract karo.",
    predict: ["Ability identity hai ya capability?", "capability"],
    predict2: [
      "Every Character ko Ability implement karna required? yes/no",
      "no",
    ],
    prompt:
      "Ability contract use karo. Mage Riya se exact output `Riya uses magic ability` lao.",
    starter:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n}\n\ninterface Ability {\n    // Define capability.\n}\n\nclass Mage extends Character {\n    Mage(String name) { super(name); }\n    // Implement Ability.\n}\n\npublic class Main {\n    static void trigger(Ability ability) {\n        // Use only the capability contract.\n    }\n\n    public static void main(String[] args) {\n        trigger(new Mage("Riya"));\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n}\n\ninterface Ability {\n    void useAbility();\n}\n\nclass Mage extends Character implements Ability {\n    Mage(String name) { super(name); }\n\n    @Override\n    public void useAbility() {\n        System.out.println(getName() + " uses magic ability");\n    }\n}\n\npublic class Main {\n    static void trigger(Ability ability) {\n        ability.useAbility();\n    }\n\n    public static void main(String[] args) {\n        trigger(new Mage("Riya"));\n    }\n}',
    tests: tests("Riya uses magic ability"),
  },
  {
    slug: "week-4-quest-guild-capstone-guild-composition",
    title: "Compose the Guild",
    description:
      "Guild ek Character nahi hai; Guild ke paas members hain aur roster reporting coordinate karta hai.",
    problem:
      "Guild ek Character nahi hai; Guild ke paas members hain aur roster reporting coordinate karta hai.",
    why: "Capstone architecture me HAS-A collaboration ko inheritance se separate rakhna hai.",
    model:
      "Guild\n└─ members ──► Character[]\n               ├ Warrior\n               └ Mage",
    syntax:
      "class Guild {\n    private Character[] members;\n    Guild(Character[] members) { this.members = members; }\n}",
    remember:
      "Container/coordinator object ko contained object ka subtype mat banao.",
    example:
      "Guild receives a Character[] and delegates each member's report/action.",
    trace:
      "build members → inject array into Guild → Guild loops common Character API",
    mistake: "class Guild extends Character just to reuse/report members.",
    fix: "Guild HAS-A Character[] composition use karo.",
    predict: ["Guild IS-A Character? yes/no", "no"],
    predict2: ["Guild HAS-A Characters? yes/no", "yes"],
    prompt: "Guild composition complete karo. Exact output:\nAman\nRiya",
    starter:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) { super(name); }\n}\n\nclass Mage extends Character {\n    Mage(String name) { super(name); }\n}\n\nclass Guild {\n    // Store Character[] via constructor.\n\n    void showMembers() {\n        // Print every member name.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {new Warrior("Aman"), new Mage("Riya")};\n        Guild guild = new Guild(party);\n        guild.showMembers();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n}\n\nclass Warrior extends Character {\n    Warrior(String name) { super(name); }\n}\n\nclass Mage extends Character {\n    Mage(String name) { super(name); }\n}\n\nclass Guild {\n    private Character[] members;\n\n    Guild(Character[] members) {\n        this.members = members;\n    }\n\n    void showMembers() {\n        for (Character member : members) {\n            System.out.println(member.getName());\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {new Warrior("Aman"), new Mage("Riya")};\n        Guild guild = new Guild(party);\n        guild.showMembers();\n    }\n}',
    tests: tests("Aman\nRiya"),
  },
  {
    slug: "week-4-quest-guild-capstone-polymorphic-party-report",
    title: "Polymorphic Party Processing",
    description:
      "Guild ko mixed party ke actions run karne hain without subtype checks or separate loops.",
    problem:
      "Guild ko mixed party ke actions run karne hain without subtype checks or separate loops.",
    why: "Week 4 relationships ka runtime payoff common Character contract ke through heterogeneous objects process karna hai.",
    model:
      "Character[] party\n├ Warrior → action → attacks\n└ Mage → action → casts\n\nGuild: for member → member.action()",
    syntax: "for (Character member : members) {\n    member.action();\n}",
    remember:
      "Common API already variation express karti ho to caller ko instanceof/type branching nahi chahiye.",
    example: "Guild knows Character, not concrete action implementation.",
    trace:
      "loop Character ref → actual subtype → dynamic dispatch → next member",
    mistake: "if Warrior / if Mage branches se action manually select karna.",
    fix: "One common action() call use karo.",
    predict: ["Loop variable type?", "Character"],
    predict2: [
      "Runtime override actual subtype se select hota hai? yes/no",
      "yes",
    ],
    prompt:
      "Polymorphic party processing complete karo. Exact output:\nAman attacks\nRiya casts spell",
    starter:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name) { super(name); }\n    @Override void action() { System.out.println(getName() + " attacks"); }\n}\n\nclass Mage extends Character {\n    Mage(String name) { super(name); }\n    @Override void action() { System.out.println(getName() + " casts spell"); }\n}\n\nclass Guild {\n    private Character[] members;\n    Guild(Character[] members) { this.members = members; }\n\n    void runParty() {\n        // One common-API loop. No subtype checks.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {new Warrior("Aman"), new Mage("Riya")};\n        new Guild(party).runParty();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n    Character(String name) { this.name = name; }\n    String getName() { return name; }\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name) { super(name); }\n    @Override void action() { System.out.println(getName() + " attacks"); }\n}\n\nclass Mage extends Character {\n    Mage(String name) { super(name); }\n    @Override void action() { System.out.println(getName() + " casts spell"); }\n}\n\nclass Guild {\n    private Character[] members;\n    Guild(Character[] members) { this.members = members; }\n\n    void runParty() {\n        for (Character member : members) {\n            member.action();\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character[] party = {new Warrior("Aman"), new Mage("Riya")};\n        new Guild(party).runParty();\n    }\n}',
    tests: tests("Aman attacks\nRiya casts spell"),
  },
  {
    slug: "week-4-quest-guild-capstone-final-quest-guild-build",
    title: "🏆 Quest Guild Final Build",
    description:
      "Ab architecture spoon-fed nahi hogi: requirements se correct inheritance, abstraction, interface, composition, enum aur polymorphism choices independently integrate karo.",
    problem:
      "Ab architecture spoon-fed nahi hogi: requirements se correct inheritance, abstraction, interface, composition, enum aur polymorphism choices independently integrate karo.",
    why: "Week 4 capstone ka goal syntax recall nahi; collaborating type system ko requirements se design aur implement karna hai.",
    model:
      "Requirements\n→ choose relationships\n→ design contracts/state\n→ implement concrete roles\n→ compose Guild\n→ process party through abstractions\n→ verify exact behaviour",
    syntax:
      "No single syntax recipe. Use Week 4 tools only where requirement justifies them.",
    remember:
      "Final solution ka structure requirements se emerge hona chahiye. Unnecessary inheritance, giant interfaces, magic strings aur subtype branching avoid karo.",
    example:
      "Character shared identity; Rank closed state; Ability optional capability; Guild owns party; action dispatch polymorphically.",
    trace:
      "analyse → model → implement → integrate → test → inspect edge/design choices",
    mistake:
      "Quest 2–8 ko blindly paste karke final requirements ko ignore karna.",
    fix: "Requirements-only starter se architecture independently reconstruct karo.",
    predict: ["Guild/party relationship?", "composition"],
    predict2: ["Mixed party action processing ka common type?", "Character"],
    prompt:
      "Independent Quest Guild build:\n\nRequirements:\n- Rank is a closed domain: BRONZE, SILVER, GOLD.\n- Generic Character must NOT be directly instantiable.\n- Every Character has private name and private Rank, constructor, getName(), getRank(), and showInfo().\n- showInfo(): `<name> | <rank>`.\n- Every concrete Character must provide action().\n- Warrior action: `<name> attacks`.\n- Mage action: `<name> casts spell`.\n- Ability is an independent capability with `useAbility()`.\n- Mage implements Ability: `<name> uses Arcane Burst`.\n- Guild HAS-A Character[] supplied through constructor.\n- Guild.showParty() loops once over Character[]; for each member call showInfo() then action().\n- No instanceof/type branching.\n- Create Aman Warrior GOLD and Riya Mage SILVER.\n- After showParty(), trigger Riya's ability through an Ability reference.\n\nExact output:\nAman | GOLD\nAman attacks\nRiya | SILVER\nRiya casts spell\nRiya uses Arcane Burst",
    starter:
      "// Design the required Rank domain, Character abstraction,\n// concrete roles, Ability capability, and Guild collaboration.\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build the required guild party and demonstrate the system.\n    }\n}",
    solution:
      'enum Rank {\n    BRONZE, SILVER, GOLD\n}\n\ninterface Ability {\n    void useAbility();\n}\n\nabstract class Character {\n    private String name;\n    private Rank rank;\n\n    Character(String name, Rank rank) {\n        this.name = name;\n        this.rank = rank;\n    }\n\n    String getName() {\n        return name;\n    }\n\n    Rank getRank() {\n        return rank;\n    }\n\n    void showInfo() {\n        System.out.println(name + " | " + rank);\n    }\n\n    abstract void action();\n}\n\nclass Warrior extends Character {\n    Warrior(String name, Rank rank) {\n        super(name, rank);\n    }\n\n    @Override\n    void action() {\n        System.out.println(getName() + " attacks");\n    }\n}\n\nclass Mage extends Character implements Ability {\n    Mage(String name, Rank rank) {\n        super(name, rank);\n    }\n\n    @Override\n    void action() {\n        System.out.println(getName() + " casts spell");\n    }\n\n    @Override\n    public void useAbility() {\n        System.out.println(getName() + " uses Arcane Burst");\n    }\n}\n\nclass Guild {\n    private Character[] members;\n\n    Guild(Character[] members) {\n        this.members = members;\n    }\n\n    void showParty() {\n        for (Character member : members) {\n            member.showInfo();\n            member.action();\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior aman = new Warrior("Aman", Rank.GOLD);\n        Mage riya = new Mage("Riya", Rank.SILVER);\n\n        Character[] party = {aman, riya};\n        Guild guild = new Guild(party);\n        guild.showParty();\n\n        Ability ability = riya;\n        ability.useAbility();\n    }\n}',
    tests: tests(
      "Aman | GOLD\nAman attacks\nRiya | SILVER\nRiya casts spell\nRiya uses Arcane Burst",
    ),
  },
];

export const questGuildCapstoneModule = specModule(
  {
    slug: "week-4-quest-guild-capstone",
    title: "Module 32 — Quest Guild Capstone",
    description:
      "Week 4 ke relationship-design tools ko requirements se independently choose karke ek coherent Quest Guild system build karo.",
    position: 32,
    difficulty: "INTERMEDIATE",
    isCapstone: true,
  },
  rows,
);
