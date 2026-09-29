import { specModule, tests } from "./spec-module-builder.mjs";

const rows = [
  {
    slug: "this-naming-collision",
    title: "The Naming Collision",
    description:
      "Same-named field aur parameter ke beech shadowing ko observe karke semantic bug discover karo.",
    problem:
      "Module 18 me readable parameter names use kiye the. Ab agar field aur parameter dono `name` hon, `name = name` compile ho sakta hai lekin field update nahi hota.",
    why: "Java nearest matching local/parameter name ko choose karta hai. Isliye code syntactically valid hote hue bhi object ki state wrong reh sakti hai.",
    model:
      "Player(String name)\n        ↓\nparameter name hides field name\n\nname = name\n ↑      ↑\nparam  param\n\nfield remains null",
    syntax:
      "Player(String name) {\n    name = name; // parameter assigns to itself\n}",
    remember:
      "Compile hona correctness guarantee nahi hai. Shadowing ek semantic bug create kar sakti hai.",
    example:
      'Player player = new Player("Aman");\nSystem.out.println(player.name); // null',
    trace:
      "argument Aman → parameter name=Aman → name=name updates parameter only → field name stays null",
    mistake: "name = name;",
    fix: "Abhi bug ko observe karo. Next quest me current object's field explicitly target karenge.",
    predict: [
      "`name = name` ke baad Player field `name` ka value kya rahega?",
      "null",
    ],
    predict2: [
      "Field aur parameter ka same name hone se jo situation banti hai use kya kehte hain?",
      "shadowing",
    ],
    prompt:
      "Code ko fix mat karo. Shadowing bug observe karke exact output `null` produce karo.",
    starter:
      'class Player {\n    String name;\n\n    Player(String name) {\n        name = name;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n\n        // Bug ko observe karo; constructor ko abhi fix mat karo.\n        System.out.println(player.name);\n    }\n}',
    solution:
      'class Player {\n    String name;\n\n    Player(String name) {\n        name = name;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n        System.out.println(player.name);\n    }\n}',
    tests: tests("null"),
  },
  {
    slug: "meet-this-keyword",
    title: "Meet this",
    description:
      "`this` ko current object ke reference ke roop me use karke shadowed field ko correctly target karo.",
    problem:
      "`name = name` me field hidden hai. Humein Java ko explicitly batana hai ki left side current object's field hai.",
    why: "`this` us receiver/current object ko refer karta hai jis par constructor ya instance method currently execute ho raha hai.",
    model:
      'new Player("Aman")\n        ↓\nconstructor runs on new object\n        ↓\nthis = current Player object\n\nthis.name = name\n    ↑        ↑\n field    parameter',
    syntax: "Player(String name) {\n    this.name = name;\n}",
    remember: "`this` object hai; `this.name` us current object ka field hai.",
    example:
      'Player aman = new Player("Aman");\nPlayer riya = new Player("Riya");',
    trace:
      "Aman constructor → this=aman → aman.name=Aman | Riya constructor → this=riya → riya.name=Riya",
    mistake: "this = name;",
    fix: "Specific field target karne ke liye `this.name = name` likho.",
    predict: [
      "`this` kis object ko refer karta hai? Exactly enter: current object",
      "current object",
    ],
    predict2: [
      "`this.name = name` me left-side `this.name` field hai ya parameter?",
      "field",
    ],
    prompt:
      "Constructor assignment complete karo. Exact output: `Player: Aman`.",
    starter:
      'class Player {\n    String name;\n\n    Player(String name) {\n        // Current object\'s field ko incoming parameter se set karo.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n        System.out.println("Player: " + player.name);\n    }\n}',
    solution:
      'class Player {\n    String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n        System.out.println("Player: " + player.name);\n    }\n}',
    tests: tests("Player: Aman"),
  },
  {
    slug: "this-multiple-fields",
    title: "Field vs Parameter Mapping",
    description:
      "Multiple shadowed parameters ko correct object fields se map karo aur wrong mappings diagnose karo.",
    problem:
      "`this.field = parameter` pattern yaad karna enough nahi. Har assignment me correct field ko correct incoming value milni chahiye.",
    why: "Constructor ek mapping contract execute karta hai. Swapped assignments compile ho sakte hain aur phir bhi object state semantically wrong bana sakte hain.",
    model:
      "incoming values\nname   xp   level\n ↓      ↓      ↓\nFIELD ← PARAMETER\n ↓      ↓      ↓\nname   xp   level",
    syntax: "this.name = name;\nthis.xp = xp;\nthis.level = level;",
    remember:
      "Left side = current object's destination field. Right side = incoming source value.",
    example: 'Player player = new Player("Aman", 100, 2);',
    trace: "Aman→this.name | 100→this.xp | 2→this.level",
    mistake: "this.xp = level;\nthis.level = xp;",
    fix: "Har line ko `destination field ← source parameter` ke roop me read karo.",
    predict: ["`this.xp = level` me destination field ka naam kya hai?", "xp"],
    predict2: [
      '`new Player("Riya", 300, 4)` me correct mapping ke baad level kya hoga?',
      "4",
    ],
    prompt:
      "Wrong field mappings repair karo. Exact output: `Aman | XP 100 | Level 2`.",
    starter:
      'class Player {\n    String name;\n    int xp;\n    int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = level; // wrong mapping\n        this.level = xp; // wrong mapping\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100, 2);\n        System.out.println(\n            player.name + " | XP " + player.xp + " | Level " + player.level\n        );\n    }\n}',
    solution:
      'class Player {\n    String name;\n    int xp;\n    int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100, 2);\n        System.out.println(\n            player.name + " | XP " + player.xp + " | Level " + player.level\n        );\n    }\n}',
    tests: tests("Aman | XP 100 | Level 2"),
  },
  {
    slug: "this-inside-methods",
    title: "this Inside Methods",
    description:
      "Instance method ke receiver object ko `this` mental model se connect karo.",
    problem:
      "`this` sirf constructor helper nahi hai. Same method code alag receiver object par run hoke alag state target karta hai.",
    why: '`aman.rename("Arjun")` call ke andar `this` Aman object hai; `riya.rename("Nova")` ke andar `this` Riya object hai.',
    model:
      'aman.rename("Arjun")\n ↑\nreceiver\n ↓\ninside method: this = aman\n ↓\nthis.name = "Arjun"',
    syntax: "void rename(String name) {\n    this.name = name;\n}",
    remember:
      "Instance method call me dot ke left wala object receiver hai; method ke andar wahi current `this` banta hai.",
    example: 'Player aman = new Player("Aman");\naman.rename("Arjun");',
    trace:
      "receiver aman → this=aman → parameter name=Arjun → aman.name becomes Arjun",
    mistake: "void rename(String name) {\n    name = name;\n}",
    fix: "Receiver object's field ko `this.name` se target karo.",
    predict: [
      '`riya.rename("Nova")` ke method body ke andar `this` kaunse object ko refer karega? Exactly enter: riya',
      "riya",
    ],
    predict2: [
      '`aman.rename("Arjun")` ke baad Aman object\'s name kya hoga?',
      "Arjun",
    ],
    prompt:
      "`rename` method complete karo aur dono receiver objects ko independently rename karo. Exact output:\nArjun\nNova",
    starter:
      'class Player {\n    String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    void rename(String name) {\n        // Receiver object\'s name update karo.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman");\n        Player riya = new Player("Riya");\n\n        aman.rename("Arjun");\n        riya.rename("Nova");\n\n        System.out.println(aman.name);\n        System.out.println(riya.name);\n    }\n}',
    solution:
      'class Player {\n    String name;\n\n    Player(String name) {\n        this.name = name;\n    }\n\n    void rename(String name) {\n        this.name = name;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman");\n        Player riya = new Player("Riya");\n\n        aman.rename("Arjun");\n        riya.rename("Nova");\n\n        System.out.println(aman.name);\n        System.out.println(riya.name);\n    }\n}',
    tests: tests("Arjun\nNova"),
  },
  {
    slug: "track-independent-object-state",
    title: "Receiver Object Lab",
    description:
      "Interleaved method calls trace karke har call ka receiver aur affected object state identify karo.",
    problem:
      "Multiple objects aur multiple calls ke saath sirf method name dekhna enough nahi; har call me receiver identify karna zaroori hai.",
    why: "Same class ka same method code har receiver ki apni instance state par operate karta hai.",
    model:
      'aman.addXp(50)  → this=aman → only aman.xp changes\nriya.rename("Nova") → this=riya → only riya.name changes',
    syntax: 'aman.addXp(50);\nriya.rename("Nova");\naman.levelUp();',
    remember:
      "Har call se pehle poochho: dot ke left kaun hai? Wahi current object hai.",
    example: "aman.addXp(50);\nriya.addXp(100);",
    trace:
      "Aman 100/1 → 150/1 → levelUp → 150/2 | Riya 200/3 → rename Nova → Nova/200/3 → addXp 100 → Nova/300/3",
    mistake: "`aman.addXp(50)` ke baad Riya ka XP bhi change maan lena.",
    fix: "Object-wise state table banao aur sirf receiver ki affected field update karo.",
    predict: ["Aman XP 100 hai. `aman.addXp(50)` ke baad Aman XP?", "150"],
    predict2: [
      '`riya.rename("Nova")` ke baad Aman ka name change hoga? yes/no',
      "no",
    ],
    prompt:
      "Methods complete karo aur interleaved calls ke baad exact report produce karo:\nAman: XP 150 | Level 2\nNova: XP 300 | Level 3",
    starter:
      'class Player {\n    String name;\n    int xp;\n    int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    void rename(String name) {\n        // Update current receiver\'s name.\n    }\n\n    void addXp(int xp) {\n        // Add incoming XP to current receiver.\n    }\n\n    void levelUp() {\n        // Increase current receiver\'s level by 1.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 100, 1);\n        Player riya = new Player("Riya", 200, 3);\n\n        aman.addXp(50);\n        riya.rename("Nova");\n        aman.levelUp();\n        riya.addXp(100);\n\n        System.out.println(\n            aman.name + ": XP " + aman.xp + " | Level " + aman.level\n        );\n        System.out.println(\n            riya.name + ": XP " + riya.xp + " | Level " + riya.level\n        );\n    }\n}',
    solution:
      'class Player {\n    String name;\n    int xp;\n    int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    void rename(String name) {\n        this.name = name;\n    }\n\n    void addXp(int xp) {\n        this.xp = this.xp + xp;\n    }\n\n    void levelUp() {\n        this.level = this.level + 1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 100, 1);\n        Player riya = new Player("Riya", 200, 3);\n\n        aman.addXp(50);\n        riya.rename("Nova");\n        aman.levelUp();\n        riya.addXp(100);\n\n        System.out.println(\n            aman.name + ": XP " + aman.xp + " | Level " + aman.level\n        );\n        System.out.println(\n            riya.name + ": XP " + riya.xp + " | Level " + riya.level\n        );\n    }\n}',
    tests: tests("Aman: XP 150 | Level 2\nNova: XP 300 | Level 3"),
  },
  {
    slug: "this-shadowing-bug-hunt",
    title: "Shadowing Bug Hunt",
    description:
      "Parameter self-assignment, field self-assignment aur wrong field mapping ko systematically diagnose karo.",
    problem:
      "Shadowing bugs ek hi shape me nahi aate. Code compile ho sakta hai, lekin incoming value ignore ya wrong field me store ho sakti hai.",
    why: "Assignment ko `destination FIELD ← source PARAMETER` label dena semantic bugs ko visible banata hai.",
    model:
      "name = name       → PARAM ← PARAM\nthis.xp = this.xp → FIELD ← SAME FIELD\nthis.level = xp   → WRONG SOURCE\n\nTarget: FIELD ← CORRECT PARAMETER",
    syntax: "this.name = name;\nthis.xp = xp;\nthis.level = level;",
    remember:
      "Har assignment me dono sides ka role aur intended mapping verify karo.",
    example: "void setLevel(int level) {\n    this.level = level;\n}",
    trace: "incoming name=Aman, xp=250, level=3 → correct fields → Aman/250/3",
    mistake: "name = name;\nthis.xp = this.xp;\nthis.level = xp;",
    fix: "Left side current object's intended field; right side matching incoming parameter.",
    predict: [
      "`this.xp = this.xp` incoming `xp` parameter use karta hai? yes/no",
      "no",
    ],
    predict2: [
      "`this.level = xp` me wrong source parameter ka naam kya hai?",
      "xp",
    ],
    prompt:
      "Teen semantic assignment bugs repair karo. Exact output: `Aman | 250 | 3`.",
    starter:
      'class Player {\n    String name;\n    int xp;\n    int level;\n\n    Player(String name, int xp, int level) {\n        name = name;\n        this.xp = this.xp;\n        this.level = xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 250, 3);\n        System.out.println(\n            player.name + " | " + player.xp + " | " + player.level\n        );\n    }\n}',
    solution:
      'class Player {\n    String name;\n    int xp;\n    int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 250, 3);\n        System.out.println(\n            player.name + " | " + player.xp + " | " + player.level\n        );\n    }\n}',
    tests: tests("Aman | 250 | 3"),
  },
  {
    slug: "object-state-prediction-lab",
    title: "Object State Prediction Lab",
    description:
      "Two objects ki interleaved calls ko chronological state table se trace karke final state predict karo.",
    problem:
      "State evolution me order aur receiver dono matter karte hain. Final line dekhkar answer guess karna unreliable hai.",
    why: "Chronological object-state tracing later OOP debugging ke liye reusable mental tool hai.",
    model:
      "initial states\n   ↓\ncall 1: identify receiver + affected field\n   ↓\ncall 2: repeat\n   ↓\nfinal state per object",
    syntax:
      'aman.addXp(20);\nriya.rename("Nova");\naman.rename("Arjun");\nriya.addXp(50);',
    remember:
      "Har call ke baad sirf receiver ki affected field update karo; untouched fields carry forward hoti hain.",
    example:
      'Aman/50, Riya/80 → aman.addXp(20) → Riya unchanged → riya.rename("Nova")',
    trace: "Aman/50 → Aman/70 → Arjun/70 | Riya/80 → Nova/80 → Nova/130",
    mistake:
      "Calls ko object-wise reorder karke original chronological sequence lose kar dena.",
    fix: "Source order me call-by-call trace karo, phir final object states read karo.",
    predict: [
      'Aman/50 par `addXp(20)` aur phir `rename("Arjun")` ke baad final XP?',
      "70",
    ],
    predict2: [
      'Riya/80 par `rename("Nova")` aur `addXp(50)` ke baad final name?',
      "Nova",
    ],
    prompt:
      "Existing calls ko change mat karo. Unhe trace karke sirf final print section complete karo:\nArjun: 70\nNova: 130",
    starter:
      'class Player {\n    String name;\n    int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    void rename(String name) {\n        this.name = name;\n    }\n\n    void addXp(int xp) {\n        this.xp = this.xp + xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 50);\n        Player riya = new Player("Riya", 80);\n\n        aman.addXp(20);\n        riya.rename("Nova");\n        aman.rename("Arjun");\n        riya.addXp(50);\n\n        // Trace first, then print both final states.\n    }\n}',
    solution:
      'class Player {\n    String name;\n    int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    void rename(String name) {\n        this.name = name;\n    }\n\n    void addXp(int xp) {\n        this.xp = this.xp + xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 50);\n        Player riya = new Player("Riya", 80);\n\n        aman.addXp(20);\n        riya.rename("Nova");\n        aman.rename("Arjun");\n        riya.addXp(50);\n\n        System.out.println(aman.name + ": " + aman.xp);\n        System.out.println(riya.name + ": " + riya.xp);\n    }\n}',
    tests: tests("Arjun: 70\nNova: 130"),
  },
  {
    slug: "player-state-manager-build",
    title: "🏆 Player State Tracker",
    description:
      "Constructor, `this` aur receiver-based state changes ko independently combine karke multi-object program build karo.",
    problem:
      "Final build me starter skeleton se do independent Player objects create, update aur report karne hain—without external field-update shortcuts.",
    why: "Module competency tab prove hoti hai jab learner current object identify karke same method logic ko correct receiver state par apply kar sake.",
    model:
      "requirements\n   ↓\nconstructor initializes each object\n   ↓\nreceiver.method(...) selects current object\n   ↓\nthis.field updates that object's state\n   ↓\nfinal report",
    syntax:
      "void addXp(int xp) {\n    this.xp = this.xp + xp;\n}\n\nvoid levelUp() {\n    this.level = this.level + 1;\n}",
    remember:
      "Abhi fields public/default-access hain. `private` aur access protection Module 20 ka learning job hai.",
    example:
      'Player aman = new Player("Aman", 100, 1);\naman.addXp(50);\naman.levelUp();',
    trace:
      "Aman/100/1 → Aman/150/1 → Aman/150/2 | Riya/200/2 → Nova/200/2 → Nova/300/2",
    mistake:
      "`aman.xp = 150` jaise external assignment se required method calls bypass karna.",
    fix: "State changes ko required receiver methods ke through perform karo; method body me current object `this` se target karo.",
    predict: [
      "`aman.addXp(50)` call ke andar `this` kaunse object ko refer karega? Exactly enter: aman",
      "aman",
    ],
    predict2: [
      "Aman update hone par Riya ka instance state automatically change hota hai? yes/no",
      "no",
    ],
    prompt:
      "Player State Tracker independently build karo. Player me name, xp, level fields; constructor; rename(String name); addXp(int xp); levelUp() banao. Aman(100,1) ko +50 XP aur level up karo. Riya(200,2) ko Nova rename karke +100 XP do. External direct field updates mat use karo. Exact output:\n=== PLAYER STATES ===\nAman | XP 150 | Level 2\nNova | XP 300 | Level 2",
    starter:
      "class Player {\n    String name;\n    int xp;\n    int level;\n\n    // Constructor + rename + addXp + levelUp khud implement karo.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // 1) Aman(100, 1) aur Riya(200, 2) create karo.\n        // 2) Aman ko +50 XP aur one level up karo.\n        // 3) Riya ko Nova rename karke +100 XP do.\n        // 4) Required report print karo.\n    }\n}",
    solution:
      'class Player {\n    String name;\n    int xp;\n    int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    void rename(String name) {\n        this.name = name;\n    }\n\n    void addXp(int xp) {\n        this.xp = this.xp + xp;\n    }\n\n    void levelUp() {\n        this.level = this.level + 1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 100, 1);\n        Player riya = new Player("Riya", 200, 2);\n\n        aman.addXp(50);\n        aman.levelUp();\n\n        riya.rename("Nova");\n        riya.addXp(100);\n\n        System.out.println("=== PLAYER STATES ===");\n        System.out.println(\n            aman.name + " | XP " + aman.xp + " | Level " + aman.level\n        );\n        System.out.println(\n            riya.name + " | XP " + riya.xp + " | Level " + riya.level\n        );\n    }\n}',
    tests: tests(
      "=== PLAYER STATES ===\nAman | XP 150 | Level 2\nNova | XP 300 | Level 2",
    ),
    minutes: 32,
  },
];

export const thisObjectStateModule = specModule(
  {
    slug: "week-3-this-object-state",
    title: "Week 3 — this & Object State",
    description:
      "`this` ko current receiver object ke roop me reason karke shadowing resolve, field/parameter mapping debug aur multi-object state changes accurately trace karo.",
    position: 19,
  },
  rows,
);
