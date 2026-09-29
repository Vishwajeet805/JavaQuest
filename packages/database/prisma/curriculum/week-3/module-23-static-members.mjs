import { specModule, tests } from "./spec-module-builder.mjs";

const rows = [
  {
    slug: "instance-members-recap",
    title: "Who Owns This State?",
    description:
      "Module 22 ke object model ko ownership lens se recap karo: kaunsi state har Player ki apni honi chahiye?",
    problem:
      "`name`, `xp` aur `level` jaise values har object ke liye different ho sakte hain. Static samajhne se pehle individual ownership clear honi chahiye.",
    why: "Instance vs static ka decision syntax se nahi, ownership se start hota hai.",
    model:
      "Aman object\nname=Aman\nxp=40\n\nRiya object\nname=Riya\nxp=90\n\nEach object owns its own instance state.",
    syntax: "class Player {\n    private String name;\n    private int xp;\n}",
    remember:
      "Question poochho: value kis specific object ke liye different ho sakti hai? Agar answer 'each object' hai, instance member natural choice hai.",
    example: "aman.addXp(50) changes Aman, not Riya.",
    trace: "Aman XP 40 → Aman.addXp(10) → Aman 50 | Riya stays 90",
    mistake: "Har commonly used field ko shared/static bana dena.",
    fix: "Convenience nahi, ownership identify karo.",
    predict: [
      "`name` normally one specific Player ka hai ya whole Player class ka? Enter: instance/class",
      "instance",
    ],
    predict2: [
      "Aman ka XP update Riya ka XP automatically change karega? yes/no",
      "no",
    ],
    prompt:
      "Independent instance state verify karo. Aman ko +20 XP do; Riya unchanged rahe. Exact output:\nAman XP: 60\nRiya XP: 90",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 40);\n        Player riya = new Player("Riya", 90);\n\n        // Update only Aman\'s instance state.\n\n        System.out.println("Aman XP: " + aman.getXp());\n        System.out.println("Riya XP: " + riya.getXp());\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 40);\n        Player riya = new Player("Riya", 90);\n\n        aman.addXp(20);\n\n        System.out.println("Aman XP: " + aman.getXp());\n        System.out.println("Riya XP: " + riya.getXp());\n    }\n}',
    tests: tests("Aman XP: 60\nRiya XP: 90"),
  },
  {
    slug: "shared-data-problem",
    title: "The Shared-Data Problem",
    description:
      "Per-object counter ki design failure observe karke class-wide fact ki need discover karo.",
    problem:
      "Agar har Player apna `playerCount` field rakhe, teen objects system-wide total 3 ko naturally represent nahi karte.",
    why: "Kuch facts individual object ke nahi, poori class ke collection of created objects se related hote hain.",
    model:
      "Aman → own count 1\nRiya → own count 1\nKabir → own count 1\n\nWanted system fact:\nPlayer total → 3",
    syntax: "// Problematic ownership\nprivate int playerCount = 1;",
    remember:
      "Static syntax se pehle ownership problem identify karo: one value per object chahiye ya one value for the class?",
    example: "Three Player objects, but each instance counter says 1.",
    trace:
      "create Aman → Aman count 1 | create Riya → Riya count 1 | no single shared total exists",
    mistake: "Shared total ko duplicate instance fields me store karna.",
    fix: "Class-wide fact ko class-level ownership dene ki need recognize karo.",
    predict: [
      "3 Players aur each object ka own `count=1`: kisi single instance count me total 3 milega? yes/no",
      "no",
    ],
    predict2: [
      "Total created Players kis ownership ko suggest karta hai? Enter: instance/class",
      "class",
    ],
    prompt:
      "Broken per-object design ko run karke problem expose karo. Exact output:\nAman count: 1\nRiya count: 1\nSystem total available: no",
    starter:
      'class Player {\n    private String name;\n    private int playerCount = 1;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public int getPlayerCount() {\n        return playerCount;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman");\n        Player riya = new Player("Riya");\n\n        // Print each independent counter and expose the design problem.\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int playerCount = 1;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public int getPlayerCount() {\n        return playerCount;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman");\n        Player riya = new Player("Riya");\n\n        System.out.println("Aman count: " + aman.getPlayerCount());\n        System.out.println("Riya count: " + riya.getPlayerCount());\n        System.out.println("System total available: no");\n    }\n}',
    tests: tests("Aman count: 1\nRiya count: 1\nSystem total available: no"),
  },
  {
    slug: "static-fields",
    title: "Class-Level State with static",
    description:
      "`static` field se one shared class-level value model karo while instance fields independent rahen.",
    problem:
      "Player total ko one shared source of truth chahiye jo every new Player creation ke saath update ho.",
    why: "`static` field class se belong karta hai, isliye all Player objects same counter share karte hain.",
    model:
      "Aman object        Riya object\nname=Aman           name=Riya\n     \\               /\n      Player.count = 2\n\ninstance: one per object\nstatic: one shared class value",
    syntax:
      "private static int count = 0;\n\nPlayer(String name) {\n    this.name = name;\n    count++;\n}",
    remember:
      "`static` type nahi badalta; ownership/cardinality badalta hai—one shared member at class level.",
    example: 'new Player("Aman") → count 1\nnew Player("Riya") → count 2',
    trace: "class count 0 → Aman constructed → 1 → Riya constructed → 2",
    mistake: "Constructor me `count = 1` karna, jisse total reset hota rahe.",
    fix: "Shared counter initialize once and increment on each creation.",
    predict: ["2 Player objects construct hone ke baad shared count?", "2"],
    predict2: [
      "`static int count` ke copies per Player object kitne? Enter: one/many",
      "one",
    ],
    prompt:
      "Shared static counter implement karo. Exact output: `Total players: 3`.",
    starter:
      'class Player {\n    private String name;\n    // Add one class-level counter shared by all Player objects.\n\n    Player(String name) {\n        this.name = name;\n        // Update the shared total.\n    }\n\n    public static int getCount() {\n        // Return the shared total.\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Player("Aman");\n        new Player("Riya");\n        new Player("Kabir");\n\n        System.out.println("Total players: " + Player.getCount());\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private static int count = 0;\n\n    Player(String name) {\n        this.name = name;\n        count++;\n    }\n\n    public static int getCount() {\n        return count;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Player("Aman");\n        new Player("Riya");\n        new Player("Kabir");\n\n        System.out.println("Total players: " + Player.getCount());\n    }\n}',
    tests: tests("Total players: 3"),
  },
  {
    slug: "static-methods",
    title: "Class-Level Queries",
    description:
      "Aise behaviour ko static method banao jiska answer kisi specific receiver object par depend nahi karta.",
    problem:
      "Total Player count poochhne ke liye `aman.getCount()` misleading hai—answer Aman-specific nahi hai.",
    why: "Class-level query ko `Player.getCount()` call karna ownership ko code me visible banata hai.",
    model:
      "instance query:\naman.getXp() → which Player? Aman\n\nclass query:\nPlayer.getCount() → all Player objects ka shared total",
    syntax: "public static int getCount() {\n    return count;\n}",
    remember:
      "Static method tab natural hai jab operation ko specific receiver object's instance state ki zarurat na ho.",
    example: "Player.getCount()",
    trace: "construct two Players → shared count 2 → class-level query reads 2",
    mistake:
      "Class-wide query ko arbitrary object reference se call karke ownership obscure karna.",
    fix: "Static member ko class name se access karo.",
    predict: [
      "Shared count query ka clearer call? Enter exactly: Player.getCount()",
      "Player.getCount()",
    ],
    predict2: [
      "`getCount()` ko one specific Player ka `name` chahiye? yes/no",
      "no",
    ],
    prompt:
      "Class-level `getCount()` complete karo aur class name se call karo. Exact output: `Players online: 2`.",
    starter:
      'class Player {\n    private String name;\n    private static int count;\n\n    Player(String name) {\n        this.name = name;\n        count++;\n    }\n\n    public static int getCount() {\n        // Return class-level state.\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Player("Aman");\n        new Player("Riya");\n\n        System.out.println("Players online: " + Player.getCount());\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private static int count;\n\n    Player(String name) {\n        this.name = name;\n        count++;\n    }\n\n    public static int getCount() {\n        return count;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Player("Aman");\n        new Player("Riya");\n\n        System.out.println("Players online: " + Player.getCount());\n    }\n}',
    tests: tests("Players online: 2"),
  },
  {
    slug: "instance-vs-static-calls",
    title: "Instance vs Static Decisions",
    description:
      "Member syntax memorize karne ke bajay ownership question se instance vs static choose karo.",
    problem:
      "Mixed classes me learner ko decide karna hota hai: call object reference se hoga ya class name se?",
    why: "Decision rule simple hai: operation one specific Player par depend karta hai ya class-wide state par?",
    model:
      "getName() → WHICH player? → instance\naddXp() → WHICH player? → instance\ngetCount() → all Players → static",
    syntax: "aman.getName();\naman.addXp(20);\nPlayer.getCount();",
    remember:
      "Instance call needs a receiver object; static call class-level ownership express kar sakta hai.",
    example: "aman.getXp() vs Player.getCount()",
    trace:
      "Aman receiver → read Aman name → mutate Aman XP | Player class → read shared count",
    mistake: "Method name dekhkar static guess karna.",
    fix: "Ask: 'Is answer/action tied to one specific object?'",
    predict: ["`addXp(50)` instance ya static?", "instance"],
    predict2: ["`getCount()` instance ya static?", "static"],
    prompt:
      "Correct instance/static calls fill karo. Exact output:\nAman XP: 70\nTotal players: 2",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n    private static int count;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n        count++;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public static int getCount() {\n        return count;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 50);\n        Player riya = new Player("Riya", 80);\n\n        // Call the instance behaviour on Aman.\n        // Print Aman\'s XP through the object.\n        // Print total players through the class.\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n    private static int count;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n        count++;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public static int getCount() {\n        return count;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 50);\n        Player riya = new Player("Riya", 80);\n\n        aman.addXp(20);\n        System.out.println("Aman XP: " + aman.getXp());\n        System.out.println("Total players: " + Player.getCount());\n    }\n}',
    tests: tests("Aman XP: 70\nTotal players: 2"),
  },
  {
    slug: "why-main-is-static",
    title: "Why main Is static",
    description:
      "Week 1 se use ho rahe `public static void main` ko ab class-level entry-point mental model se connect karo.",
    problem:
      "Program start hone se pehle JVM ke paas automatically `Main` object hona required nahi hota.",
    why: "Static `main` ko class ke through invoke kiya ja sakta hai without first creating a `Main` receiver object.",
    model:
      "program starts\n    ↓\nMain class available\n    ↓\nstatic main(...)\n    ↓\nprogram can create objects as needed",
    syntax: "public static void main(String[] args) {\n    // entry point\n}",
    remember:
      "Yahan focus JVM internals nahi; key idea hai: `main` ko call karne ke liye a pre-existing Main object receiver required nahi.",
    example: 'Inside main: Player aman = new Player("Aman");',
    trace:
      "entry point runs → creates Player object → instance method can then use that receiver",
    mistake:
      "Sochna ki static main ke andar objects create/use nahi kar sakte.",
    fix: "Static context explicit object references bana sakta hai aur unke instance methods call kar sakta hai.",
    predict: [
      "`main` run hone se pehle `new Main()` explicitly required hai? yes/no",
      "no",
    ],
    predict2: [
      "Static main ke andar `new Player(...)` allowed hai? yes/no",
      "yes",
    ],
    prompt:
      "Static `main` ke andar Player object create karke instance method call karo. Exact output: `Welcome, Aman`.",
    starter:
      'class Player {\n    private String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public void welcome() {\n        System.out.println("Welcome, " + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // No Main object is needed here.\n        // Create a Player receiver and call its instance behaviour.\n    }\n}',
    solution:
      'class Player {\n    private String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public void welcome() {\n        System.out.println("Welcome, " + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n        player.welcome();\n    }\n}',
    tests: tests("Welcome, Aman"),
  },
  {
    slug: "static-context-bug-hunt",
    title: "Static Context Bug Hunt",
    description:
      "Static method me implicit receiver absent hone ka bug diagnose karo aur explicit object reference se repair karo.",
    problem:
      "Instance field `name` ko static method directly read nahi kar sakta because static call ke paas automatically `this` receiver nahi hota.",
    why: "`name` ka value poochhne ke liye pehle decide karna padega: kis Player ka name?",
    model:
      "instance method:\nthis → Player object → this.name\n\nstatic method:\nno automatic receiver\n      ↓\nwhich Player's name?\n      ↓\npass/reference a Player explicitly",
    syntax:
      "public static void showName(Player player) {\n    System.out.println(player.getName());\n}",
    remember:
      "Static context instance object use kar sakta hai—but explicit reference chahiye.",
    example: "Player.showName(aman);",
    trace:
      "static showName receives aman reference → player.getName() has explicit receiver → Aman",
    mistake: "`static void showName() { System.out.println(name); }`",
    fix: "Either behaviour ko instance method banao, ya required object reference explicitly pass karo. Is exercise me explicit-reference repair use karo.",
    predict: [
      "Static method me automatic `this` receiver available hai? yes/no",
      "no",
    ],
    predict2: [
      "Explicit `Player player` parameter se instance data access possible hai? yes/no",
      "yes",
    ],
    prompt:
      "Static-context bug repair karo by passing a Player reference explicitly. Exact output: `Player: Aman`.",
    starter:
      'class Player {\n    private String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public static void showName() {\n        // BUG: which Player object\'s name should this use?\n        System.out.println("Player: " + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman");\n\n        // Repair showName and this call.\n        Player.showName();\n    }\n}',
    solution:
      'class Player {\n    private String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public static void showName(Player player) {\n        System.out.println("Player: " + player.getName());\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman");\n\n        Player.showName(aman);\n    }\n}',
    tests: tests("Player: Aman"),
  },
  {
    slug: "game-statistics-build",
    title: "🏆 Game Statistics",
    description:
      "Instance ownership, class-level count aur Module 22 best-object algorithm ko independently integrate karo.",
    problem:
      "Game roster me individual state aur class-wide statistics dono coexist karte hain. Correct design ownership boundaries ko visible rakhta hai.",
    why: "`name/xp/level` each Player ke hain; `playerCount` whole Player class ka fact hai. Collection algorithm best Player reference select karta hai.",
    model:
      "Aman object   Riya object   Kabir object\nname/xp/level  name/xp/level  name/xp/level\n      \\            |            /\n          Player.count = 3\n\nroster scan → best Player reference",
    syntax:
      "private static int playerCount;\n\npublic static int getPlayerCount() {\n    return playerCount;\n}",
    remember:
      "Static ko 'global shortcut' mat banao. Har member ke liye ownership justify karo.",
    example:
      "3 constructed Players → Player.getPlayerCount() == 3; each XP remains independent.",
    trace:
      "construct roster → shared count reaches 3 → reward Kabir only → scan highest XP reference → report class statistic + winner",
    mistake:
      "XP ko static banana, ya player count ko each object me duplicate karna.",
    fix: "Individual state instance fields; class-wide total static field; collection analysis references par.",
    predict: ["`xp` normally instance ya static?", "instance"],
    predict2: [
      "Total constructed Players counter instance ya static?",
      "static",
    ],
    prompt:
      "Game Statistics independently build karo. Player me private instance `name`, `xp`, `level`; static `playerCount`; constructor; getters; validated `addXp`; static `getPlayerCount` banao. Roster: Aman(80,2), Riya(140,4), Kabir(110,3). Kabir ko +50 XP do, then highest-XP Player reference find karo. Exact output:\n=== GAME STATS ===\nPlayers: 3\nAman | XP 80 | Level 2\nRiya | XP 140 | Level 4\nKabir | XP 160 | Level 3\nTop XP: Kabir | 160",
    starter:
      "class Player {\n    // Decide ownership:\n    // - name, xp, level belong to each Player\n    // - playerCount belongs to the Player class\n\n    // Add constructor, getters, addXp, and class-level count query.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // 1) Build the three-player roster.\n        // 2) Reward Kabir with +50 XP.\n        // 3) Find the Player reference with highest XP.\n        // 4) Print class-wide count, all profiles, and top-XP report.\n    }\n}",
    solution:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n    private static int playerCount;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n        playerCount++;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public static int getPlayerCount() {\n        return playerCount;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] roster = {\n            new Player("Aman", 80, 2),\n            new Player("Riya", 140, 4),\n            new Player("Kabir", 110, 3)\n        };\n\n        for (Player player : roster) {\n            if (player.getName().equals("Kabir")) {\n                player.addXp(50);\n                break;\n            }\n        }\n\n        Player best = roster[0];\n        for (Player player : roster) {\n            if (player.getXp() > best.getXp()) {\n                best = player;\n            }\n        }\n\n        System.out.println("=== GAME STATS ===");\n        System.out.println("Players: " + Player.getPlayerCount());\n\n        for (Player player : roster) {\n            System.out.println(\n                player.getName()\n                    + " | XP " + player.getXp()\n                    + " | Level " + player.getLevel()\n            );\n        }\n\n        System.out.println(\n            "Top XP: " + best.getName() + " | " + best.getXp()\n        );\n    }\n}',
    tests: tests(
      "=== GAME STATS ===\nPlayers: 3\nAman | XP 80 | Level 2\nRiya | XP 140 | Level 4\nKabir | XP 160 | Level 3\nTop XP: Kabir | 160",
    ),
    minutes: 38,
  },
];

export const staticMembersModule = specModule(
  {
    slug: "week-3-static-members",
    title: "Week 3 — static Members",
    description:
      "Instance aur class-level ownership distinguish karo, static fields/methods ko reason karo, static context debug karo aur shared statistics ko object collections ke saath integrate karo.",
    position: 23,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
