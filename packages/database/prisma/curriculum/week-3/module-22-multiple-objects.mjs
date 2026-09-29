import { specModule, tests } from "./spec-module-builder.mjs";

const rows = [
  {
    slug: "object-references-intro",
    title: "Object References",
    description:
      "Reference variable aur actual object ko separate concepts ke roop me model karo.",
    problem:
      "`Player p = new Player(...)` ek line me variable aur object dono dikhata hai, isliye beginner easily maan leta hai ki variable hi object hai.",
    why: "Multiple-object programs me humein track karna hota hai ki kaunsa reference kis object ko point kar raha hai.",
    model:
      "Player p\n   │ reference\n   ▼\n[ Player object ]\n\n`new` creates the object; `p` stores a reference to it.",
    syntax: 'Player p;\np = new Player("Aman", 2);',
    remember:
      "Reference variable object nahi hai; wo object tak pahunchne ka reference hold karta hai.",
    example: 'Player p = new Player("Aman", 2);',
    trace:
      "declare p → create Player object with `new` → store its reference in p → p.getName() reaches that object",
    mistake: "`Player p;` ko object creation samajhna.",
    fix: "Object creation identify karne ke liye `new Player(...)` dekho.",
    predict: [
      "`Player p;` alone naya Player object create karta hai? yes/no",
      "no",
    ],
    predict2: ["Object create karne wala keyword?", "new"],
    prompt:
      "Reference declare karo, phir separately Player object create karke uska reference assign karo. Exact output: `Aman | Level 2`.",
    starter:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // 1) Player reference variable p declare karo.\n        // 2) new Player("Aman", 2) ka reference p me store karo.\n\n        // Print through the reference.\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player p;\n        p = new Player("Aman", 2);\n\n        System.out.println(p.getName() + " | Level " + p.getLevel());\n    }\n}',
    tests: tests("Aman | Level 2"),
  },
  {
    slug: "two-references-same-object",
    title: "Two References, Same Object",
    description:
      "Aliasing trace karo: do variables ek hi object ko refer karein to behaviour dono references se visible hota hai.",
    problem:
      "`Player p2 = p1` second Player create nahi karta. Sirf existing object ka reference copy hota hai.",
    why: "Shared references samajhna targeted updates aur object arrays ke behaviour ko correctly predict karne ke liye essential hai.",
    model:
      "p1 ─┐\n    ├──> [ Player Aman | XP 0 ]\np2 ─┘\n\np2.addXp(100)\n        ↓\nsame object becomes XP 100",
    syntax: 'Player p1 = new Player("Aman");\nPlayer p2 = p1;',
    remember:
      "Reference assignment object copy nahi karta. Is example me sirf `new` ek object create karta hai.",
    example: "p2.addXp(100);\nSystem.out.println(p1.getXp());",
    trace:
      "new → one Player → p1 points to it → p2 gets same reference → p2 changes object → p1 reads same changed object",
    mistake: "`p2 = p1` ko independent Player clone samajhna.",
    fix: "Count `new` expressions and draw arrows from references to objects.",
    predict: [
      "Code me ek hi `new Player(...)` ho aur `p2 = p1`, total Player objects?",
      "1",
    ],
    predict2: [
      "p2 se same object ka XP 100 karne ke baad p1 se read kiya XP?",
      "100",
    ],
    prompt:
      "Shared-reference prediction verify karo. `p2` se 100 XP add karo aur `p1` se exact `XP via p1: 100` print karo.",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player p1 = new Player("Aman");\n        Player p2 = p1;\n\n        // Change the shared object through p2.\n        // Read the same object through p1.\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player p1 = new Player("Aman");\n        Player p2 = p1;\n\n        p2.addXp(100);\n        System.out.println("XP via p1: " + p1.getXp());\n    }\n}',
    tests: tests("XP via p1: 100"),
  },
  {
    slug: "arrays-of-objects",
    title: "Arrays of Object References",
    description:
      "Object array ke slots ko references ke containers ke roop me reason karo, including initial `null` slots.",
    problem:
      "`new Player[2]` do Player objects create nahi karta; wo do reference slots ka array create karta hai.",
    why: "Array creation aur element-object creation separate operations hain.",
    model:
      'Player[] players = new Player[2];\n\nplayers → [ null ][ null ]\n\nplayers[0] = new Player("Aman", 2)\nplayers → [ ref ][ null ]\n             │\n             ▼\n          [Aman L2]',
    syntax:
      'Player[] players = new Player[2];\nplayers[0] = new Player("Aman", 2);',
    remember:
      "Object-array slot initially `null` ho sakta hai jab tak usme actual object reference assign na ho.",
    example: 'players[1] = new Player("Riya", 5);',
    trace:
      "array created → 2 null slots → Aman object/reference into slot 0 → Riya object/reference into slot 1",
    mistake: "`new Player[2]` ko two Player constructors run hona samajhna.",
    fix: "Array `new` aur element `new Player(...)` ko separately count karo.",
    predict: [
      "`new Player[3]` ke immediately baad `players[0]` ka value?",
      "null",
    ],
    predict2: [
      "`new Player[3]` kitne actual Player objects create karta hai?",
      "0",
    ],
    prompt:
      "2-slot Player array create karo, phir dono slots me separately objects assign karo. Exact output:\nAman\nRiya",
    starter:
      "class Player {\n    private String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public String getName() {\n        return name;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create an array with two reference slots.\n        // Then populate each slot with a new Player.\n\n        // Print both names through their array references.\n    }\n}",
    solution:
      'class Player {\n    private String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    public String getName() {\n        return name;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] players = new Player[2];\n\n        players[0] = new Player("Aman");\n        players[1] = new Player("Riya");\n\n        System.out.println(players[0].getName());\n        System.out.println(players[1].getName());\n    }\n}',
    tests: tests("Aman\nRiya"),
  },
  {
    slug: "traverse-object-array",
    title: "Traverse Object Arrays",
    description:
      "Known enhanced-for pattern ko Player references par transfer karke collection ke har object ko process karo.",
    problem:
      "Array me multiple references store karna useful tab hota hai jab same operation har referenced object par perform kar sakein.",
    why: "Week 2 ka traversal pattern object collections par bhi same hai; loop variable ab primitive ke bajay `Player` reference hold karta hai.",
    model:
      "players array\n[ref][ref][ref]\n  ↓    ↓    ↓\nfor (Player p : players)\n       ↓\ncurrent reference → current object",
    syntax:
      "for (Player player : players) {\n    System.out.println(player.getName());\n}",
    remember:
      "Enhanced-for me `player` each iteration current array element ka reference hold karta hai.",
    example:
      "int[] → int value\nString[] → String text\nPlayer[] → Player player",
    trace:
      "slot 0 ref → Aman → print | slot 1 ref → Riya → print | slot 2 ref → Kabir → print",
    mistake: "Loop variable ko naya Player object samajhna.",
    fix: "Loop variable ko current array-slot reference ke roop me visualize karo.",
    predict: ["`Player[]` enhanced-for loop variable ka type?", "Player"],
    predict2: ["3 populated slots par loop body kitni baar run hogi?", "3"],
    prompt:
      "Enhanced-for se roster traverse karo. Exact output:\nAman | Level 2\nRiya | Level 5\nKabir | Level 3",
    starter:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] players = {\n            new Player("Aman", 2),\n            new Player("Riya", 5),\n            new Player("Kabir", 3)\n        };\n\n        // Traverse every Player reference and print its object state.\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] players = {\n            new Player("Aman", 2),\n            new Player("Riya", 5),\n            new Player("Kabir", 3)\n        };\n\n        for (Player player : players) {\n            System.out.println(\n                player.getName() + " | Level " + player.getLevel()\n            );\n        }\n    }\n}',
    tests: tests("Aman | Level 2\nRiya | Level 5\nKabir | Level 3"),
  },
  {
    slug: "search-object-array",
    title: "Search and Keep the Reference",
    description:
      "Object array search karke matching value ke bajay matching object reference retain karo.",
    problem:
      "Search ka goal sirf `found=true` nahi; later behaviour call karne ke liye actual matching Player reference useful hai.",
    why: "Reference retain karne se caller found object ko inspect ya meaningful behaviour request kar sakta hai.",
    model:
      "found = null\n   ↓ traverse\nname equals target?\n no → continue\nyes → found = player reference\n   ↓\nfound ──> matching Player object",
    syntax:
      "Player found = null;\nfor (Player player : players) {\n    if (player.getName().equals(target)) {\n        found = player;\n        break;\n    }\n}",
    remember:
      "`null` yahan meaningful state hai: abhi koi matching object reference nahi mila.",
    example: 'target = "Riya" → found points to roster\'s Riya object',
    trace:
      "Aman != Riya → continue → Riya == Riya → found receives Riya reference → break",
    mistake:
      "Sirf matching name String save karke actual Player reference lose kar dena.",
    fix: "Candidate/result variable ka type `Player` rakho.",
    predict: [
      "Search start par no result represent karne ke liye reference value?",
      "null",
    ],
    predict2: ["Riya milne par `found` kis type ka hoga?", "Player"],
    prompt:
      "`Riya` search karo aur matching Player reference retain karo. Exact output: `Found: Riya | Level 5`.",
    starter:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] players = {\n            new Player("Aman", 2),\n            new Player("Riya", 5),\n            new Player("Kabir", 3)\n        };\n\n        String target = "Riya";\n        Player found = null;\n\n        // Search and store the matching Player reference.\n\n        if (found != null) {\n            System.out.println(\n                "Found: " + found.getName() + " | Level " + found.getLevel()\n            );\n        }\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] players = {\n            new Player("Aman", 2),\n            new Player("Riya", 5),\n            new Player("Kabir", 3)\n        };\n\n        String target = "Riya";\n        Player found = null;\n\n        for (Player player : players) {\n            if (player.getName().equals(target)) {\n                found = player;\n                break;\n            }\n        }\n\n        if (found != null) {\n            System.out.println(\n                "Found: " + found.getName() + " | Level " + found.getLevel()\n            );\n        }\n    }\n}',
    tests: tests("Found: Riya | Level 5"),
  },
  {
    slug: "find-best-player",
    title: "Find the Best Player Reference",
    description:
      "Week 2 max-pattern ko objects par transfer karke best value ke saath best object reference retain karo.",
    problem:
      "Sirf highest level number milne se winner ki identity lose ho sakti hai. Humein poora Player candidate retain karna hai.",
    why: "Object-reference candidate se related state aur behaviour winner ke saath available rehte hain.",
    model:
      "best → Aman L2\ncompare Riya L5 → best → Riya\ncompare Kabir L3 → keep Riya\n\nfinal best ──> Riya object",
    syntax:
      "Player best = players[0];\nfor (Player player : players) {\n    if (player.getLevel() > best.getLevel()) {\n        best = player;\n    }\n}",
    remember:
      "Primitive max pattern ka candidate ab `int` ke bajay `Player` reference ho sakta hai.",
    example: "L2, L5, L3 → best reference ends at L5 Player",
    trace:
      "Aman candidate → Riya beats Aman → Kabir does not beat Riya → winner Riya",
    mistake:
      "Only `int bestLevel` store karna jab final answer ko Player identity bhi chahiye.",
    fix: "Best candidate ko full object reference ke roop me carry karo.",
    predict: ["Levels 2, 5, 3 me final best level?", "5"],
    predict2: ["Given roster me best Player name?", "Riya"],
    prompt:
      "Candidate-reference max algorithm complete karo. Exact output: `Best: Riya | Level 5`.",
    starter:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] players = {\n            new Player("Aman", 2),\n            new Player("Riya", 5),\n            new Player("Kabir", 3)\n        };\n\n        Player best = players[0];\n\n        // Compare Player candidates and update the best reference.\n\n        System.out.println(\n            "Best: " + best.getName() + " | Level " + best.getLevel()\n        );\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int level;\n\n    Player(String name, int level) {\n        this.name = name;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] players = {\n            new Player("Aman", 2),\n            new Player("Riya", 5),\n            new Player("Kabir", 3)\n        };\n\n        Player best = players[0];\n\n        for (Player player : players) {\n            if (player.getLevel() > best.getLevel()) {\n                best = player;\n            }\n        }\n\n        System.out.println(\n            "Best: " + best.getName() + " | Level " + best.getLevel()\n        );\n    }\n}',
    tests: tests("Best: Riya | Level 5"),
  },
  {
    slug: "update-object-in-roster",
    title: "Targeted Object Update",
    description:
      "Collection se matching reference find karke usi roster object par behaviour call karo.",
    problem:
      "Search aur behaviour connect hone par important question hai: found/loop reference par update karne se array me stored object ka kya hota hai?",
    why: "Array slot aur loop/found variable same object ko reference kar sakte hain; behaviour actual shared object state change karta hai.",
    model:
      "roster[2] ─┐\n           ├──> [ Kabir | XP 20 ]\nplayer ────┘\n\nplayer.addXp(80)\n        ↓\n[ Kabir | XP 100 ]\n\nroster[2] now reads XP 100",
    syntax: 'if (player.getName().equals("Kabir")) {\n    player.addXp(80);\n}',
    remember:
      "Reference par method call reference variable ko update nahi karta; referenced object's state change karta hai.",
    example:
      "Kabir XP 20 → matched loop reference → addXp(80) → roster later reads 100",
    trace:
      "traverse Aman → Riya → Kabir match → receiver is roster's Kabir object → XP 20→100",
    mistake:
      "Match milne par new temporary Player create karke usko update karna.",
    fix: "Roster se mila actual reference use karo.",
    predict: ["Kabir XP 20 par +80 ke baad roster se read kiya XP?", "100"],
    predict2: [
      "Loop variable aur matching array slot same object ko refer kar sakte hain? yes/no",
      "yes",
    ],
    prompt:
      "Roster me Kabir find karke behaviour se 80 XP add karo. Update ke baad array se exact `Kabir XP: 100` print karo.",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] roster = {\n            new Player("Aman", 50),\n            new Player("Riya", 70),\n            new Player("Kabir", 20)\n        };\n\n        // Find the roster\'s Kabir reference and add 80 XP.\n\n        System.out.println("Kabir XP: " + roster[2].getXp());\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] roster = {\n            new Player("Aman", 50),\n            new Player("Riya", 70),\n            new Player("Kabir", 20)\n        };\n\n        for (Player player : roster) {\n            if (player.getName().equals("Kabir")) {\n                player.addXp(80);\n                break;\n            }\n        }\n\n        System.out.println("Kabir XP: " + roster[2].getXp());\n    }\n}',
    tests: tests("Kabir XP: 100"),
  },
  {
    slug: "player-roster-build",
    title: "🏆 Player Roster",
    description:
      "References, arrays, traversal, search, targeted behaviour aur best-object algorithm ko independently integrate karo.",
    problem:
      "Final build me array collection manage karega aur each Player apni individual state/behaviour own karega.",
    why: "Ye Week 2 collection algorithms aur Week 3 OOP design ka integration point hai.",
    model:
      "Player[] roster\n ├─> Aman object\n ├─> Riya object\n └─> Kabir object\n\nMain: traverse/search/select\nPlayer: protect state + own addXp",
    syntax:
      "Player found = null;\nPlayer best = roster[0];\n\nfor (Player player : roster) {\n    // search / compare / call behaviour\n}",
    remember:
      "Array collection organize karta hai; Player individual state aur behaviour own karta hai.",
    example:
      "search Riya → retain roster reference → addXp(50) → find highest-level Player → report",
    trace:
      "create 3 objects → list roster → find Riya → reward same Riya object → scan best level → final report",
    mistake:
      "Main me private state recreate/calculate karna ya search result ke liye duplicate Player object banana.",
    fix: "Existing roster references aur Player public API compose karo.",
    predict: [
      "Roster search ke baad matching object ko update karne ke liye naya Player banana zaroori hai? yes/no",
      "no",
    ],
    predict2: ["Levels Aman 2, Riya 5, Kabir 3 me best name?", "Riya"],
    prompt:
      "Player Roster independently build karo. Player ke private `name`, `xp`, `level`; constructor; getters; validated `addXp` behaviour banao. Roster: Aman(40,2), Riya(70,5), Kabir(20,3). Pehle all profiles print karo. `Riya` search karke same roster object ko +50 XP do. Highest-level Player reference find karo. Exact output:\n=== ROSTER ===\nAman | XP 40 | Level 2\nRiya | XP 70 | Level 5\nKabir | XP 20 | Level 3\n=== UPDATED ===\nRiya | XP 120 | Level 5\nBest: Riya | Level 5",
    starter:
      "class Player {\n    // Design encapsulated state, constructor, getters, and addXp behaviour.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // 1) Build the three-player roster.\n        // 2) Print every profile.\n        // 3) Search Riya and reward the SAME roster object with +50 XP.\n        // 4) Find the highest-level Player reference.\n        // 5) Print the required updated/best report.\n    }\n}",
    solution:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public void addXp(int amount) {\n        if (amount > 0) {\n            xp += amount;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player[] roster = {\n            new Player("Aman", 40, 2),\n            new Player("Riya", 70, 5),\n            new Player("Kabir", 20, 3)\n        };\n\n        System.out.println("=== ROSTER ===");\n        for (Player player : roster) {\n            System.out.println(\n                player.getName()\n                    + " | XP " + player.getXp()\n                    + " | Level " + player.getLevel()\n            );\n        }\n\n        Player found = null;\n        for (Player player : roster) {\n            if (player.getName().equals("Riya")) {\n                found = player;\n                break;\n            }\n        }\n\n        if (found != null) {\n            found.addXp(50);\n        }\n\n        Player best = roster[0];\n        for (Player player : roster) {\n            if (player.getLevel() > best.getLevel()) {\n                best = player;\n            }\n        }\n\n        System.out.println("=== UPDATED ===");\n        if (found != null) {\n            System.out.println(\n                found.getName()\n                    + " | XP " + found.getXp()\n                    + " | Level " + found.getLevel()\n            );\n        }\n\n        System.out.println(\n            "Best: " + best.getName() + " | Level " + best.getLevel()\n        );\n    }\n}',
    tests: tests(
      "=== ROSTER ===\nAman | XP 40 | Level 2\nRiya | XP 70 | Level 5\nKabir | XP 20 | Level 3\n=== UPDATED ===\nRiya | XP 120 | Level 5\nBest: Riya | Level 5",
    ),
    minutes: 38,
  },
];

export const multipleObjectsModule = specModule(
  {
    slug: "week-3-multiple-objects",
    title: "Week 3 — Multiple Objects",
    description:
      "Object references ko trace karo, shared references samjho, Player arrays traverse/search karo aur collection algorithms ko encapsulated object behaviour ke saath integrate karo.",
    position: 22,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
