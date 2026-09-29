import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "enums-oop-design-why-enums",
    title: "Invalid States ka Problem",
    description:
      "Rank sirf BRONZE, SILVER, GOLD ho sakta hai, but String field typo `GLOD` bhi accept kar leti hai.",
    problem:
      "Rank sirf BRONZE, SILVER, GOLD ho sakta hai, but String field typo `GLOD` bhi accept kar leti hai.",
    why: "Finite valid choices ko dedicated type me encode karna invalid vocabulary ko reduce karta hai.",
    model:
      'String: "GOLD" / "GLOD" → both compile\nRank: BRONZE | SILVER | GOLD → closed set',
    syntax: "enum Rank { BRONZE, SILVER, GOLD }",
    remember:
      "Enum ka learning job syntax recall nahi; closed domain ko explicit type banana hai.",
    example: "Player rank is a finite domain; player name is not.",
    trace:
      "requirements → list valid values → set closed hai? → enum candidate",
    mistake: "Har category ko free-form String rakhna.",
    fix: "Finite domain vocabulary ko enum type do.",
    predict: ["BRONZE/SILVER/GOLD closed set hai? yes/no", "yes"],
    predict2: ["Unknown enum constant valid hota hai? yes/no", "no"],
    prompt:
      "Exact output print karo:\nValid ranks: BRONZE, SILVER, GOLD\nInvalid text blocked by type",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Print the modelling conclusion.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Valid ranks: BRONZE, SILVER, GOLD");\n        System.out.println("Invalid text blocked by type");\n    }\n}',
    tests: tests(
      "Valid ranks: BRONZE, SILVER, GOLD\nInvalid text blocked by type",
    ),
  },
  {
    slug: "enums-oop-design-declaring-enum",
    title: "First Enum Type",
    description:
      "Rank ko quoted string ke bajay typed constant ke roop me store karna hai.",
    problem:
      "Rank ko quoted string ke bajay typed constant ke roop me store karna hai.",
    why: "Enum constants same domain type ke values hote hain and typo-prone magic strings avoid karte hain.",
    model: "Rank.GOLD → value of type Rank",
    syntax: "enum Rank { BRONZE, SILVER, GOLD }\nRank rank = Rank.GOLD;",
    remember:
      "Enum constant quoted String nahi hota; Type.CONSTANT use hota hai.",
    example: "`Rank current = Rank.GOLD` constrains current to Rank domain.",
    trace:
      "declare enum → select constant → store in Rank variable → print/compare",
    mistake: '`String rank = "GOLD"` rakhkar enum benefit lose karna.',
    fix: "Variable/field ko Rank type do.",
    predict: ["Rank.GOLD ka type?", "Rank"],
    predict2: ["Enum constant String hai? yes/no", "no"],
    prompt: "Rank enum use karke exact output `Current rank: GOLD` lao.",
    starter:
      "enum Rank { BRONZE, SILVER, GOLD }\n\npublic class Main {\n    public static void main(String[] args) {\n        // Store GOLD in a Rank variable and print it.\n    }\n}",
    solution:
      'enum Rank { BRONZE, SILVER, GOLD }\n\npublic class Main {\n    public static void main(String[] args) {\n        Rank currentRank = Rank.GOLD;\n        System.out.println("Current rank: " + currentRank);\n    }\n}',
    tests: tests("Current rank: GOLD"),
  },
  {
    slug: "enums-oop-design-using-enum-values",
    title: "Enum in Object State",
    description:
      "GuildMember ka rank arbitrary text nahi; valid Rank state hona chahiye.",
    problem:
      "GuildMember ka rank arbitrary text nahi; valid Rank state hona chahiye.",
    why: "Enum field allowed object-state vocabulary ko explicit karta hai.",
    model: "GuildMember\n├ name: String\n└ rank: Rank → BRONZE | SILVER | GOLD",
    syntax:
      "private Rank rank;\nGuildMember(String name, Rank rank) { this.rank = rank; }",
    remember:
      "Enum standalone syntax feature nahi; OOP model me constrained state type hai.",
    example:
      "Constructor Rank accept karta hai, so caller typed domain value pass karta hai.",
    trace:
      "new member → Rank constant passed → private field stores typed state → report",
    mistake: "Enum names ko String field me store karna.",
    fix: "Field aur constructor parameter dono Rank type rakho.",
    predict: ["Rank field ka type?", "Rank"],
    predict2: [
      "Constructor Rank parameter accept kar sakta hai? yes/no",
      "yes",
    ],
    prompt: "GuildMember me Rank state store karo. Exact output `Aman | GOLD`.",
    starter:
      'enum Rank { BRONZE, SILVER, GOLD }\n\nclass GuildMember {\n    private String name;\n    // Add typed rank field.\n\n    GuildMember(String name, Rank rank) {\n        this.name = name;\n        // Store rank.\n    }\n\n    void showInfo() {\n        // Print <name> | <rank>\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new GuildMember("Aman", Rank.GOLD).showInfo();\n    }\n}',
    solution:
      'enum Rank { BRONZE, SILVER, GOLD }\n\nclass GuildMember {\n    private String name;\n    private Rank rank;\n\n    GuildMember(String name, Rank rank) {\n        this.name = name;\n        this.rank = rank;\n    }\n\n    void showInfo() {\n        System.out.println(name + " | " + rank);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new GuildMember("Aman", Rank.GOLD).showInfo();\n    }\n}',
    tests: tests("Aman | GOLD"),
  },
  {
    slug: "enums-oop-design-enum-in-fields",
    title: "State-Driven Behaviour",
    description:
      "Reward rule current Rank state par depend karta hai; scattered magic strings nahi chahiye.",
    problem:
      "Reward rule current Rank state par depend karta hai; scattered magic strings nahi chahiye.",
    why: "Typed finite state business rules ko readable aur typo-resistant banati hai.",
    model: "BRONZE → 1x\nSILVER → 2x\nGOLD → 3x",
    syntax: "if (rank == Rank.GOLD) { ... }",
    remember: "Business rules directly enum constants par express karo.",
    example: "GOLD member gets 3x base XP.",
    trace:
      "read rank → compare typed constants → choose multiplier → return reward",
    mistake: "Rank ko String me convert karke string compare karna.",
    fix: "Rank constants directly compare karo.",
    predict: ["GOLD multiplier?", "3"],
    predict2: ["Enum constants `==` se compare ho sakte hain? yes/no", "yes"],
    prompt:
      "Reward implement karo: BRONZE 1x, SILVER 2x, GOLD 3x. Exact output `Reward: 300`.",
    starter:
      'enum Rank { BRONZE, SILVER, GOLD }\n\nclass GuildMember {\n    private Rank rank;\n    GuildMember(Rank rank) { this.rank = rank; }\n\n    int reward(int baseXp) {\n        // Apply rank rule.\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Reward: " + new GuildMember(Rank.GOLD).reward(100));\n    }\n}',
    solution:
      'enum Rank { BRONZE, SILVER, GOLD }\n\nclass GuildMember {\n    private Rank rank;\n    GuildMember(Rank rank) { this.rank = rank; }\n\n    int reward(int baseXp) {\n        if (rank == Rank.GOLD) return baseXp * 3;\n        if (rank == Rank.SILVER) return baseXp * 2;\n        return baseXp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Reward: " + new GuildMember(Rank.GOLD).reward(100));\n    }\n}',
    tests: tests("Reward: 300"),
  },
  {
    slug: "enums-oop-design-enum-with-switch",
    title: "Valid State Transitions",
    description:
      "Rank progression BRONZE → SILVER → GOLD hai; caller ko arbitrary jumps nahi dene.",
    problem:
      "Rank progression BRONZE → SILVER → GOLD hai; caller ko arbitrary jumps nahi dene.",
    why: "Closed states + meaningful transition method predictable object lifecycle banate hain.",
    model: "BRONZE ─promote→ SILVER ─promote→ GOLD\nGOLD ─promote→ GOLD",
    syntax:
      "void promote() {\n    if (rank == Rank.BRONZE) rank = Rank.SILVER;\n    else if (rank == Rank.SILVER) rank = Rank.GOLD;\n}",
    remember: "Enum state ko object behaviour ke through transition karwao.",
    example: "No public setRank(String); member owns promotion rule.",
    trace: "BRONZE → promote → SILVER → promote → GOLD → promote → GOLD",
    mistake: "Public setter se arbitrary rank jumps allow karna.",
    fix: "Domain transition ko promote() me encapsulate karo.",
    predict: ["BRONZE ke baad?", "SILVER"],
    predict2: ["GOLD promote ke baad GOLD reh sakta hai? yes/no", "yes"],
    prompt:
      "Start BRONZE and promote three times. Exact output:\nSILVER\nGOLD\nGOLD",
    starter:
      "enum Rank { BRONZE, SILVER, GOLD }\n\nclass GuildMember {\n    private Rank rank = Rank.BRONZE;\n\n    void promote() {\n        // Encode valid transition.\n    }\n\n    void showRank() { System.out.println(rank); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        GuildMember member = new GuildMember();\n        member.promote(); member.showRank();\n        member.promote(); member.showRank();\n        member.promote(); member.showRank();\n    }\n}",
    solution:
      "enum Rank { BRONZE, SILVER, GOLD }\n\nclass GuildMember {\n    private Rank rank = Rank.BRONZE;\n\n    void promote() {\n        if (rank == Rank.BRONZE) rank = Rank.SILVER;\n        else if (rank == Rank.SILVER) rank = Rank.GOLD;\n    }\n\n    void showRank() { System.out.println(rank); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        GuildMember member = new GuildMember();\n        member.promote(); member.showRank();\n        member.promote(); member.showRank();\n        member.promote(); member.showRank();\n    }\n}",
    tests: tests("SILVER\nGOLD\nGOLD"),
  },
  {
    slug: "enums-oop-design-enum-methods-ka-intro",
    title: "Enum vs String Bug Hunt",
    description: "String rank typo `GLOD` silently Gold bonus miss karta hai.",
    problem: "String rank typo `GLOD` silently Gold bonus miss karta hai.",
    why: "Enum refactor same bug class ko harder banata hai by replacing free-form vocabulary with known constants.",
    model:
      'BEFORE: "GLOD" → compiles, wrong branch\nAFTER: Rank.GOLD → valid constant',
    syntax:
      "enum Rank { BRONZE, SILVER, GOLD }\nprivate Rank rank = Rank.GOLD;",
    remember: "Bug fix sirf spelling correction nahi; model ko safer banao.",
    example: "String comparison becomes typed Rank comparison.",
    trace:
      "find magic string → identify closed domain → enum → change field/comparison → verify",
    mistake: "Only GLOD spelling fix karke free-form model leave karna.",
    fix: "Closed rank domain ko enum me encode karo.",
    predict: ["String typo compiler reliably catch karta hai? yes/no", "no"],
    predict2: [
      "Unknown enum constant compile issue ban sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Buggy String model ko enum me refactor karo. Exact output `Gold bonus: 50`.",
    starter:
      'class Player {\n    private String rank = "GLOD";\n\n    int bonus() {\n        if (rank.equals("GOLD")) return 50;\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Gold bonus: " + new Player().bonus());\n    }\n}',
    solution:
      'enum Rank { BRONZE, SILVER, GOLD }\n\nclass Player {\n    private Rank rank = Rank.GOLD;\n\n    int bonus() {\n        if (rank == Rank.GOLD) return 50;\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Gold bonus: " + new Player().bonus());\n    }\n}',
    tests: tests("Gold bonus: 50"),
  },
  {
    slug: "enums-oop-design-domain-modelling",
    title: "Domain Modelling Decision",
    description:
      "Order status finite hai, customer name open-ended. Dono ko same modelling tool nahi dena.",
    problem:
      "Order status finite hai, customer name open-ended. Dono ko same modelling tool nahi dena.",
    why: "Good domain modelling closed categories ko enum aur open-ended data ko suitable normal type deta hai.",
    model:
      "Order\n├ status: OrderStatus [closed] → enum\n└ customerName: String [open-ended] → String",
    syntax: "enum OrderStatus { PENDING, PAID, SHIPPED, CANCELLED }",
    remember:
      "Har String enum candidate nahi; valid set intentionally finite hona chahiye.",
    example: "OrderStatus enum; customerName remains String.",
    trace:
      "classify value → finite known alternatives? enum → open-ended? normal data type",
    mistake: "Names/messages/IDs ko enum banana.",
    fix: "Enums domain-significant closed vocabularies ke liye use karo.",
    predict: ["Order status closed set? yes/no", "yes"],
    predict2: ["Customer name enum hona chahiye? yes/no", "no"],
    prompt: "Riya ka SHIPPED order model karo. Exact output `Riya | SHIPPED`.",
    starter:
      "// Define the finite order-status type.\n\nclass Order {\n    private String customerName;\n    // Add typed status.\n\n    Order(String customerName, /* status type */ status) {\n        // Store both.\n    }\n\n    void show() {\n        // Print <customerName> | <status>\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Riya's SHIPPED order.\n    }\n}",
    solution:
      'enum OrderStatus { PENDING, PAID, SHIPPED, CANCELLED }\n\nclass Order {\n    private String customerName;\n    private OrderStatus status;\n\n    Order(String customerName, OrderStatus status) {\n        this.customerName = customerName;\n        this.status = status;\n    }\n\n    void show() {\n        System.out.println(customerName + " | " + status);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Order("Riya", OrderStatus.SHIPPED).show();\n    }\n}',
    tests: tests("Riya | SHIPPED"),
  },
  {
    slug: "enums-oop-design-enums-recap",
    title: "🏆 Guild Rank State Build",
    description:
      "Guild member rank valid set se bahar nahi ja sakta; promotion rules object own kare; caller arbitrary state corrupt na kare.",
    problem:
      "Guild member rank valid set se bahar nahi ja sakta; promotion rules object own kare; caller arbitrary state corrupt na kare.",
    why: "Final proof enum ko syntax feature nahi, invalid states reduce karne aur domain lifecycle express karne ke tool ki tarah use karta hai.",
    model:
      "Rank = BRONZE | SILVER | GOLD\nGuildMember: private rank → promote() → reward() → showInfo()",
    syntax: "enum Rank { BRONZE, SILVER, GOLD }",
    remember:
      "Closed state type + private state + meaningful transitions = stronger domain model.",
    example: "Aman starts BRONZE, progresses to GOLD, GOLD reward is 3x.",
    trace:
      "requirements → enum → private state → transition → state-driven behaviour → GOLD edge case",
    mistake: "Public setRank(String) se arbitrary values/jumps allow karna.",
    fix: "Typed private state and domain methods use karo.",
    predict: ["Initial rank?", "BRONZE"],
    predict2: ["GOLD ke beyond promotion allowed? yes/no", "no"],
    prompt:
      "Independent build:\n- Rank: BRONZE, SILVER, GOLD\n- GuildMember(name) starts BRONZE\n- promote(): BRONZE → SILVER → GOLD; GOLD stays GOLD\n- reward(baseXp): 1x/2x/3x\n- showInfo(): `<name> | <rank>`\n- Aman: show, promote+show, promote+show, promote once more, then reward(100)\n\nExact output:\nAman | BRONZE\nAman | SILVER\nAman | GOLD\nReward: 300",
    starter:
      "enum Rank {\n    // Define the closed rank domain.\n}\n\nclass GuildMember {\n    // Private name + Rank state.\n    // Constructor starts at BRONZE.\n    // Add promote(), reward(baseXp), showInfo().\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build Aman and execute the required progression.\n    }\n}",
    solution:
      'enum Rank { BRONZE, SILVER, GOLD }\n\nclass GuildMember {\n    private String name;\n    private Rank rank;\n\n    GuildMember(String name) {\n        this.name = name;\n        this.rank = Rank.BRONZE;\n    }\n\n    void promote() {\n        if (rank == Rank.BRONZE) rank = Rank.SILVER;\n        else if (rank == Rank.SILVER) rank = Rank.GOLD;\n    }\n\n    int reward(int baseXp) {\n        if (rank == Rank.GOLD) return baseXp * 3;\n        if (rank == Rank.SILVER) return baseXp * 2;\n        return baseXp;\n    }\n\n    void showInfo() {\n        System.out.println(name + " | " + rank);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        GuildMember aman = new GuildMember("Aman");\n        aman.showInfo();\n        aman.promote(); aman.showInfo();\n        aman.promote(); aman.showInfo();\n        aman.promote();\n        System.out.println("Reward: " + aman.reward(100));\n    }\n}',
    tests: tests("Aman | BRONZE\nAman | SILVER\nAman | GOLD\nReward: 300"),
  },
];

export const enumsOopDesignModule = specModule(
  {
    slug: "enums-oop-design",
    title: "Module 31 — Enums + OOP Design",
    description:
      "Finite domain states ko enums se type-safe model karo, invalid states reduce karo aur state transitions ko object behaviour me encapsulate karo.",
    position: 31,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
