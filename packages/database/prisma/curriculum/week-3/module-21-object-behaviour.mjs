import { specModule, tests } from "./spec-module-builder.mjs";

const rows = [
  {
    slug: "objects-own-behaviour",
    title: "Objects Own Behaviour",
    description:
      "External state manipulation ko meaningful domain action me move karke object ko apne rules ka owner banao.",
    problem:
      "Caller agar XP calculation aur mutation khud kare, Player sirf passive data container ban jata hai.",
    why: "`player.addXp(50)` caller ka intent express karta hai aur XP rule ko Player class ke andar central rakhta hai.",
    model:
      "caller: reward 50\n      ↓\nplayer.addXp(50)\n      ↓\nPlayer owns transition\nXP 0 → 50",
    syntax: "public void addXp(int amount) {\n    xp += amount;\n}",
    remember:
      "Caller event/action request kare; object apni state transition own kare.",
    example: "player.addXp(50);",
    trace: "XP 0 → addXp(50) → Player updates own XP → XP 50",
    mistake:
      "Caller me `player.setXp(player.getXp() + 50)` jaisa state calculation.",
    fix: "Meaningful action ko Player behaviour banao.",
    predict: ["XP 0 par `addXp(50)` ke baad XP?", "50"],
    predict2: ["XP reward ka meaningful domain method naam?", "addXp"],
    prompt: "`addXp` implement karke exact `XP: 50` print karo.",
    starter:
      'class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        // Player should own the XP update.\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(50);\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    solution:
      'class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        xp += amount;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(50);\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    tests: tests("XP: 50"),
  },
  {
    slug: "behaviour-state-changes",
    title: "State Transition Trace",
    description:
      "Different behaviour calls ko before → action → after transitions ke roop me trace karo.",
    problem:
      "Object behaviour samajhne ke liye sirf final value nahi, har action ke baad state kaise evolve hui ye reason karna zaroori hai.",
    why: "State-transition thinking complex OOP behaviour ko predictable banata hai.",
    model:
      "before state\n   ↓ action\nupdated state\n   ↓ next action\nnext state",
    syntax: "player.addXp(40);\nplayer.addXp(60);\nplayer.resetXp();",
    remember:
      "Same receiver ka previous state next behaviour call ka starting state hota hai.",
    example: "0 → addXp(40) → 40 → addXp(60) → 100",
    trace: "XP 0 → +40 = 40 → +60 = 100 → resetXp = 0",
    mistake: "Har method call ko fresh object state se calculate karna.",
    fix: "Chronological running state maintain karo.",
    predict: ["XP 0 → addXp(40) → addXp(60), final XP?", "100"],
    predict2: ["XP 100 par `resetXp()` ke baad?", "0"],
    prompt:
      "Existing behaviours use karke transitions complete karo. Exact output:\nAfter rewards: 100\nAfter reset: 0",
    starter:
      "class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        xp += amount;\n    }\n\n    public void resetXp() {\n        xp = 0;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        // Apply +40, then +60 and print the state.\n        // Then reset XP and print the new state.\n    }\n}",
    solution:
      'class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        xp += amount;\n    }\n\n    public void resetXp() {\n        xp = 0;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(40);\n        player.addXp(60);\n        System.out.println("After rewards: " + player.getXp());\n\n        player.resetXp();\n        System.out.println("After reset: " + player.getXp());\n    }\n}',
    tests: tests("After rewards: 100\nAfter reset: 0"),
  },
  {
    slug: "validate-object-behaviour",
    title: "Guard Invalid Actions",
    description:
      "Behaviour precondition se invalid XP rewards reject karke state unchanged rakho.",
    problem:
      "Negative XP meaningful reward nahi hai. Public method ko har incoming request blindly apply nahi karni chahiye.",
    why: "Object action ka rule own kare to every caller same validity contract follow karta hai.",
    model:
      "addXp(amount)\n      ↓\namount > 0 ?\n yes → accumulate\n no  → preserve state",
    syntax: "if (amount > 0) {\n    xp += amount;\n}",
    remember:
      "Rejected action ke baad last valid state unchanged rehni chahiye.",
    example: "XP 50 → addXp(-30) → XP 50",
    trace: "0 → +50 accepted → 50 → -30 rejected → 50",
    mistake: "`xp += amount` without checking action validity.",
    fix: "Transition se pehle behaviour precondition guard karo.",
    predict: ["XP 50 par `addXp(-30)` ke baad XP?", "50"],
    predict2: ["Valid reward condition `amount > ?`", "0"],
    prompt:
      "Positive reward accept aur invalid reward reject karo. Exact output: `XP: 50`.",
    starter:
      'class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        // Only meaningful positive rewards may change state.\n        xp += amount;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(50);\n        player.addXp(-30);\n\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    solution:
      'class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(50);\n        player.addXp(-30);\n\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    tests: tests("XP: 50"),
  },
  {
    slug: "query-behaviour",
    title: "Commands vs Queries",
    description:
      "State-changing command aur state-answering query ko distinguish karke level-up rule object ke andar central rakho.",
    problem:
      "Caller agar `getXp() >= 100` har jagah repeat kare, eligibility rule object ke bahar leak ho jata hai.",
    why: "Command object ko kuch karne bolta hai; query object se uski current state ke baare me answer poochti hai.",
    model:
      "COMMAND\naddXp(120) → state changes\n\nQUERY\ncanLevelUp() → true/false\nstate unchanged",
    syntax: "public boolean canLevelUp() {\n    return xp >= 100;\n}",
    remember:
      "Command usually transition request hai; query current state se answer derive karti hai.",
    example: "player.addXp(120);\nSystem.out.println(player.canLevelUp());",
    trace:
      "XP 0 → command addXp(120) → XP 120 → query canLevelUp → true → XP still 120",
    mistake: "Eligibility condition caller me duplicate karna.",
    fix: "Question ko named query behaviour banao.",
    predict: ["XP 99 par `canLevelUp()`?", "false"],
    predict2: ["`canLevelUp()` state modify karta hai? yes/no", "no"],
    prompt:
      "`canLevelUp()` implement karo. 120 XP ke baad exact `Can level up: true` print karo.",
    starter:
      'class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public boolean canLevelUp() {\n        // Answer from current state without changing it.\n        return false;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(120);\n        System.out.println("Can level up: " + player.canLevelUp());\n    }\n}',
    solution:
      'class Player {\n    private int xp;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public boolean canLevelUp() {\n        return xp >= 100;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(120);\n        System.out.println("Can level up: " + player.canLevelUp());\n    }\n}',
    tests: tests("Can level up: true"),
  },
  {
    slug: "level-up-behaviour",
    title: "Coordinated State Transition",
    description:
      "One domain action me multiple fields ko consistent before/after contract ke according update karo.",
    problem:
      "Level-up sirf `level++` nahi hai. Eligibility, level increment aur XP cost ek coordinated transition hain.",
    why: "Transition object ke andar hone se partial update ka risk kam hota hai aur rule one place par rehta hai.",
    model:
      "BEFORE\nLevel 1 | XP 140\n   ↓ levelUp()\ncheck XP >= 100\n   ↓\nAFTER\nLevel 2 | XP 40",
    syntax:
      "public void levelUp() {\n    if (xp >= 100) {\n        level++;\n        xp -= 100;\n    }\n}",
    remember:
      "Condition fail ho to transition ke saare related fields unchanged rahen.",
    example: "Level 1, XP 140 → levelUp() → Level 2, XP 40",
    trace: "140 eligible → level 1→2 → XP 140→40",
    mistake: "Level increment karna lekin XP cost subtract na karna.",
    fix: "Behaviour contract me saare required post-state changes list karo.",
    predict: ["Level 1, XP 140 ke baad `levelUp()` final level?", "2"],
    predict2: ["Same transition ke baad remaining XP?", "40"],
    prompt:
      "`levelUp()` complete karo. 140 XP ke baad exact output:\nLevel: 2\nXP: 40",
    starter:
      'class Player {\n    private int xp;\n    private int level = 1;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public void levelUp() {\n        // If eligible, update BOTH level and XP consistently.\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(140);\n        player.levelUp();\n\n        System.out.println("Level: " + player.getLevel());\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    solution:
      'class Player {\n    private int xp;\n    private int level = 1;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public void levelUp() {\n        if (xp >= 100) {\n            level++;\n            xp -= 100;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(140);\n        player.levelUp();\n\n        System.out.println("Level: " + player.getLevel());\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    tests: tests("Level: 2\nXP: 40"),
  },
  {
    slug: "derived-information",
    title: "Derived Information",
    description:
      "Stored source-of-truth state se rank calculate karo instead of duplicate mutable rank state.",
    problem:
      "Rank ko separately store aur manually synchronize karna inconsistent state create kar sakta hai.",
    why: "Agar rank completely level se determine hota hai, query current level se answer derive kar sakti hai.",
    model:
      "stored: level\n      ↓ getRank()\nderived: Bronze / Silver / Gold\n\nNo separate mutable rank field",
    syntax:
      'public String getRank() {\n    if (level >= 10) return "Gold";\n    if (level >= 5) return "Silver";\n    return "Bronze";\n}',
    remember:
      "Derived information ka source-of-truth duplicate field me mat store karo.",
    example: "Level 1 → Bronze | Level 5 → Silver | Level 10 → Gold",
    trace:
      "start L1 → nine successful levelUp transitions → L10 → getRank() → Gold",
    mistake:
      "`String rank` field ko har level change ke saath manually update karna.",
    fix: "Current level se rank on demand derive karo.",
    predict: ["Level 10 ka rank?", "Gold"],
    predict2: ["Level 6 ka rank?", "Silver"],
    prompt:
      "Player ko behaviour ke through Level 10 tak pahunchao, phir derived query se exact `Rank: Gold` print karo. `rank` field mat banao.",
    starter:
      'class Player {\n    private int xp;\n    private int level = 1;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public boolean canLevelUp() {\n        return xp >= 100;\n    }\n\n    public void levelUp() {\n        if (canLevelUp()) {\n            level++;\n            xp -= 100;\n        }\n    }\n\n    public String getRank() {\n        // Derive rank from level.\n        return "?";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        // Nine level-ups take Level 1 to Level 10.\n        for (int i = 0; i < 9; i++) {\n            player.addXp(100);\n            player.levelUp();\n        }\n\n        System.out.println("Rank: " + player.getRank());\n    }\n}',
    solution:
      'class Player {\n    private int xp;\n    private int level = 1;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public boolean canLevelUp() {\n        return xp >= 100;\n    }\n\n    public void levelUp() {\n        if (canLevelUp()) {\n            level++;\n            xp -= 100;\n        }\n    }\n\n    public String getRank() {\n        if (level >= 10) {\n            return "Gold";\n        }\n        if (level >= 5) {\n            return "Silver";\n        }\n        return "Bronze";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        for (int i = 0; i < 9; i++) {\n            player.addXp(100);\n            player.levelUp();\n        }\n\n        System.out.println("Rank: " + player.getRank());\n    }\n}',
    tests: tests("Rank: Gold"),
  },
  {
    slug: "behaviour-bug-hunt",
    title: "Behaviour Contract Bug Hunt",
    description:
      "Precondition, accumulation, threshold aur post-state bugs ko behaviour contract ke against systematically repair karo.",
    problem:
      "Behaviour code compile ho sakta hai aur phir bhi wrong transition produce kar sakta hai.",
    why: "Method ko `precondition → transition → postcondition` ke roop me audit karne se semantic bugs easier to isolate hote hain.",
    model:
      "PRECONDITION\namount > 0\n   ↓\nTRANSITION\nxp += amount\n   ↓\nLEVEL-UP CONTRACT\nxp >= 100 → level++ AND xp -= 100\n   ↓\nPOST-STATE\nLevel 2 | XP 10",
    syntax:
      "if (amount > 0) xp += amount;\nif (xp >= 100) {\n    level++;\n    xp -= 100;\n}",
    remember:
      "Correct syntax se zyada important correct before/after contract hai.",
    example: "0 → +50 → +60 = 110 → levelUp → Level 2 / XP 10",
    trace:
      "reward guards → accumulation → inclusive threshold → coordinated transition",
    mistake:
      "Negative-only update, assignment instead of accumulation, `> 100`, decrement level, add XP cost.",
    fix: "Har bug ko contract ke ek stage se map karke repair karo.",
    predict: ["Exactly 100 XP level-up ke liye eligible hai? yes/no", "yes"],
    predict2: [
      "Reward accumulation operator kya hona chahiye? Exactly enter: +=",
      "+=",
    ],
    prompt:
      "Behaviour contract ke saare bugs fix karo. 50 + 60 XP then level-up. Exact output: `Level: 2 | XP: 10`.",
    starter:
      'class Player {\n    private int xp;\n    private int level = 1;\n\n    public void addXp(int amount) {\n        if (amount < 0) {\n            xp = amount;\n        }\n    }\n\n    public void levelUp() {\n        if (xp > 100) {\n            level--;\n            xp += 100;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(50);\n        player.addXp(60);\n        player.levelUp();\n\n        System.out.println(\n            "Level: " + player.getLevel() + " | XP: " + player.getXp()\n        );\n    }\n}',
    solution:
      'class Player {\n    private int xp;\n    private int level = 1;\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public void levelUp() {\n        if (xp >= 100) {\n            level++;\n            xp -= 100;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.addXp(50);\n        player.addXp(60);\n        player.levelUp();\n\n        System.out.println(\n            "Level: " + player.getLevel() + " | XP: " + player.getXp()\n        );\n    }\n}',
    tests: tests("Level: 2 | XP: 10"),
  },
  {
    slug: "xp-level-system-build",
    title: "🏆 XP & Level System",
    description:
      "Validated command, eligibility query, repeated coordinated transitions aur derived rank ko independently compose karo.",
    problem:
      "Final system me Player rules own karega, lekin caller ko behaviours correctly compose karke large XP reward process karna hoga.",
    why: "Small focused behaviours reusable contracts banate hain: reward add karo, eligibility poochho, eligible ho to level-up action perform karo.",
    model:
      "addXp(250)\n   ↓\nXP 250\n   ↓\nwhile canLevelUp()\n   ↓ levelUp()\nL2 / XP150\n   ↓ levelUp()\nL3 / XP50\n   ↓\ngetRank() → Bronze",
    syntax:
      "player.addXp(250);\nwhile (player.canLevelUp()) {\n    player.levelUp();\n}",
    remember:
      "`addXp` reward own karta hai; `canLevelUp` eligibility answer karta hai; `levelUp` transition own karta hai. Caller behaviours compose karta hai.",
    example: "Level 1 / XP 0 + 250 → two levelUp actions → Level 3 / XP 50",
    trace:
      "invalid -20 rejected → +250 accepted → true/L2-150 → true/L3-50 → false → Bronze",
    mistake:
      "Saara logic ek giant `addXp` method me daal dena ya Main me fields calculate karna.",
    fix: "Focused object behaviours ko loop ke through compose karo; direct field mutation mat karo.",
    predict: [
      "Level 1, XP 250 se repeated valid level-ups ke baad level?",
      "3",
    ],
    predict2: ["Remaining XP?", "50"],
    prompt:
      "Encapsulated Player system build karo with `addXp`, `canLevelUp`, `levelUp`, getters aur derived `getRank`. `addXp(-20)` reject karo, phir 250 XP add karo. Main me `while (player.canLevelUp())` se repeated level-ups perform karo. Exact output:\n=== XP SYSTEM ===\nPlayer: Aman\nLevel: 3\nXP: 50\nRank: Bronze",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n\n    Player(String name) {\n        // Initialize a new player at Level 1 with 0 XP.\n    }\n\n    // Implement focused object behaviours:\n    // addXp, canLevelUp, levelUp, getters, getRank\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n\n        // Reject invalid XP, add 250 valid XP,\n        // then compose query + command in a loop.\n\n        // Print the required report.\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n\n    Player(String name) {\n        this.name = name;\n        this.xp = 0;\n        this.level = 1;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public boolean canLevelUp() {\n        return xp >= 100;\n    }\n\n    public void levelUp() {\n        if (canLevelUp()) {\n            level++;\n            xp -= 100;\n        }\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public String getRank() {\n        if (level >= 10) {\n            return "Gold";\n        }\n        if (level >= 5) {\n            return "Silver";\n        }\n        return "Bronze";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n\n        player.addXp(-20);\n        player.addXp(250);\n\n        while (player.canLevelUp()) {\n            player.levelUp();\n        }\n\n        System.out.println("=== XP SYSTEM ===");\n        System.out.println("Player: " + player.getName());\n        System.out.println("Level: " + player.getLevel());\n        System.out.println("XP: " + player.getXp());\n        System.out.println("Rank: " + player.getRank());\n    }\n}',
    tests: tests(
      "=== XP SYSTEM ===\nPlayer: Aman\nLevel: 3\nXP: 50\nRank: Bronze",
    ),
    minutes: 36,
  },
];

export const objectBehaviourModule = specModule(
  {
    slug: "week-3-object-behaviour",
    title: "Week 3 — Object Behaviour",
    description:
      "Objects ko meaningful commands, state queries, guarded transitions aur derived answers own karna sikho—phir focused behaviours ko compose karke complete systems banao.",
    position: 21,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
