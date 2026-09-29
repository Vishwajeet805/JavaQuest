import { specModule, tests } from "./spec-module-builder.mjs";

const rows = [
  {
    slug: "encapsulation-invalid-state",
    title: "The Invalid State Problem",
    description:
      "Direct external writes se object ki valid state kaise break hoti hai, observe karo.",
    problem:
      "Module 19 me humne object state ko correctly target kiya. Lekin agar outside code kisi bhi field ko kisi bhi value se replace kar sakta hai, object apne rules protect nahi kar sakta.",
    why: "Encapsulation ki need tab clear hoti hai jab valid object ko external code invalid bana sake.",
    model:
      "valid Player\n   ↓ external direct write\nxp = -500\n   ↓\ninvalid Player state",
    syntax: "player.xp = -500; // Java allow kar sakta hai, domain rule nahi",
    remember:
      "Syntactically assignable value zaroori nahi ki domain ke liye valid ho.",
    example: "Player player = new Player();\nplayer.xp = -500;",
    trace: "xp 0 → outside write -500 → object invalid",
    mistake: "Invalid state ko sirf print/display time par detect karna.",
    fix: "Object state tak write access ko control karna hoga.",
    predict: ["Negative XP valid Player state hai? yes/no", "no"],
    predict2: [
      "Direct external field write object ko apne rules enforce karne deta hai? yes/no",
      "no",
    ],
    prompt:
      "Problem ko intentionally reproduce karo: direct write se XP -500 set karke exact `Invalid XP: -500` print karo.",
    starter:
      "class Player {\n    int xp;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        // Outside code se invalid XP assign karke problem observe karo.\n    }\n}",
    solution:
      'class Player {\n    int xp;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        player.xp = -500;\n        System.out.println("Invalid XP: " + player.xp);\n    }\n}',
    tests: tests("Invalid XP: -500"),
  },
  {
    slug: "encapsulation-private-fields",
    title: "Create a Private Boundary",
    description:
      "`private` se object state aur outside code ke beech direct-access boundary establish karo.",
    problem:
      "Invalid external writes stop karne ke liye fields ko class ke bahar directly inaccessible banana hoga.",
    why: "`private` field ko same class ka code directly use kar sakta hai, lekin caller direct read/write nahi kar sakta.",
    model:
      "outside code\n   ✕ direct access\n[ private state ]\n   ✓ class code",
    syntax: "class Player {\n    private int xp;\n}",
    remember:
      "`private` data ko magic se hide nahi karta; direct access boundary define karta hai.",
    example: "private String name;\nprivate int xp;\nprivate int level;",
    trace:
      "Main tries player.xp → access blocked → class-controlled API needed",
    mistake: "Field private karke phir Main me `player.xp` read karna.",
    fix: "Legitimate access ke liye class ko intentional public method expose karna hoga.",
    predict: [
      "Private field ko Main se directly access kar sakte hain? yes/no",
      "no",
    ],
    predict2: [
      "`private` direct access ko kis boundary tak limit karta hai? Exactly enter: class",
      "class",
    ],
    prompt:
      "XP ko private rakho. Direct field access ke bina class ke `showXp()` method se exact `XP: 100` print karo.",
    starter:
      "class Player {\n    private int xp;\n\n    Player(int xp) {\n        this.xp = xp;\n    }\n\n    void showXp() {\n        // Class ke andar private xp read karke print karo.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player(100);\n        player.showXp();\n    }\n}",
    solution:
      'class Player {\n    private int xp;\n\n    Player(int xp) {\n        this.xp = xp;\n    }\n\n    void showXp() {\n        System.out.println("XP: " + xp);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player(100);\n        player.showXp();\n    }\n}',
    tests: tests("XP: 100"),
  },
  {
    slug: "encapsulation-getters",
    title: "Controlled Read",
    description:
      "Private state me se sirf required values ko getter ke through read access do.",
    problem:
      "Private boundary direct access stop karti hai, lekin caller ko profile display ke liye kuch values legitimately read karni hain.",
    why: "Getter class ko decide karne deta hai ki kaunsa state public API ke through readable hoga.",
    model: "caller\n  ↓ getName()/getLevel()\nclass API\n  ↓\nprivate state",
    syntax: "public int getLevel() {\n    return level;\n}",
    remember:
      "Private field hone ka matlab har field ke liye getter compulsory nahi hai. Expose only what caller needs.",
    example: "System.out.println(player.getName());",
    trace: "caller → getName → class reads private name → value returned",
    mistake: "`getLevel()` me galti se `xp` return karna.",
    fix: "Method contract aur returned field ko align karo.",
    predict: [
      "`getLevel()` ka return type field `level` int ho to kya hoga?",
      "int",
    ],
    predict2: ["Getter normally object state modify karta hai? yes/no", "no"],
    prompt:
      "Sirf required getters complete karke exact `Aman | Level 2` print karo. XP getter mat add karo.",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    public String getName() {\n        // Return the correct field.\n        return null;\n    }\n\n    public int getLevel() {\n        // Return the correct field.\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100, 2);\n\n        System.out.println(\n            player.getName() + " | Level " + player.getLevel()\n        );\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100, 2);\n\n        System.out.println(\n            player.getName() + " | Level " + player.getLevel()\n        );\n    }\n}',
    tests: tests("Aman | Level 2"),
  },
  {
    slug: "encapsulation-setters",
    title: "Selective Write Access",
    description:
      "Har field ko writable banane ke bajay requirement ke basis par selected state ke liye controlled write path choose karo.",
    problem:
      "Display name legitimately change ho sakta hai, lekin XP jaise fields ko arbitrary replacement allow karna zaroori nahi.",
    why: "Encapsulation ka goal getters/setters ka pair banana nahi; minimum safe public API design karna hai.",
    model: "name → setName ✓\nxp   → setXp ✕\nlevel→ decision depends on rule",
    syntax: "public void setName(String name) {\n    this.name = name;\n}",
    remember:
      "Private field ≠ automatic setter. Public API requirement se decide hoti hai.",
    example: 'player.setName("Arjun");',
    trace: "caller requests Arjun → setName gate → private name updated",
    mistake: "Har private field ke liye blindly setter generate karna.",
    fix: "Pehle poochho: caller ko ye exact arbitrary write permission chahiye bhi ya nahi?",
    predict: ["Har private field ke liye setter mandatory hai? yes/no", "no"],
    predict2: [
      "Name update ke controlled method ka naam yahan kya hai?",
      "setName",
    ],
    prompt:
      "Sirf name ko externally writable banao. `setName` implement karo; XP setter mat add karo. Exact output: `Arjun`.",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public void setName(String name) {\n        // Only name should be externally replaceable.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100);\n\n        player.setName("Arjun");\n        System.out.println(player.getName());\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n\n    Player(String name, int xp) {\n        this.name = name;\n        this.xp = xp;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public void setName(String name) {\n        this.name = name;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100);\n\n        player.setName("Arjun");\n        System.out.println(player.getName());\n    }\n}',
    tests: tests("Arjun"),
  },
  {
    slug: "encapsulation-validation",
    title: "Validation Gate",
    description:
      "Controlled write method ko object invariant enforce karne wali validation boundary banao.",
    problem:
      "Setter hone se write controlled route se aati hai, lekin route ko invalid values reject bhi karni chahiye.",
    why: "Rule class ke andar central hone par har caller same valid-state contract follow karta hai.",
    model:
      "requested level\n      ↓\nlevel > 0 ?\n  ↙       ↘\nyes       no\nupdate   preserve old state",
    syntax:
      "public void setLevel(int level) {\n    if (level > 0) {\n        this.level = level;\n    }\n}",
    remember:
      "Invalid request ke baad last valid state preserve rehni chahiye.",
    example: "level 2 → setLevel(4) → 4 → setLevel(-2) → still 4",
    trace: "1 → valid 4 accepted → invalid -2 rejected → final 4",
    mistake: "`if (level <= 0) this.level = level;`",
    fix: "Condition ko valid-state rule ke roop me likho, invalid-state assignment ke roop me nahi.",
    predict: ["Level 4 par `setLevel(-2)` ke baad level kya rahega?", "4"],
    predict2: ["Valid level condition `level > ?`", "0"],
    prompt:
      "Validation gate implement karo. Valid 4 accept karo, invalid -2 reject karo. Exact output:\n4\n4",
    starter:
      "class Player {\n    private int level;\n\n    Player(int level) {\n        this.level = level;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public void setLevel(int level) {\n        // Only positive levels may enter the object.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player(1);\n\n        player.setLevel(4);\n        System.out.println(player.getLevel());\n\n        player.setLevel(-2);\n        System.out.println(player.getLevel());\n    }\n}",
    solution:
      "class Player {\n    private int level;\n\n    Player(int level) {\n        this.level = level;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public void setLevel(int level) {\n        if (level > 0) {\n            this.level = level;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player(1);\n\n        player.setLevel(4);\n        System.out.println(player.getLevel());\n\n        player.setLevel(-2);\n        System.out.println(player.getLevel());\n    }\n}",
    tests: tests("4\n4"),
  },
  {
    slug: "encapsulation-read-only-state",
    title: "Design Read-Only State",
    description:
      "Getter without setter use karke state ko observable but not arbitrarily replaceable design karo.",
    problem:
      "Caller ko XP display karna hai, lekin `setXp(999999)` jaisa arbitrary replacement domain rule ko bypass karega.",
    why: "Public API me setter ka absent hona bhi design decision hai. Class future me XP changes ko meaningful behaviour ke through own kar sakti hai.",
    model:
      "getXp() ✓ read\nsetXp(...) ✕ arbitrary replace\n\nfuture Module 21:\nmeaningful behaviour → controlled state transition",
    syntax:
      "public int getXp() {\n    return xp;\n}\n// intentionally no setXp",
    remember: "Read access aur write access separate permissions hain.",
    example: "System.out.println(player.getXp());",
    trace:
      "caller reads XP 100 → cannot directly write private xp → object retains write control",
    mistake: "Convenience ke liye `setXp(int xp)` expose kar dena.",
    fix: "API ko actual requirement tak minimum rakho.",
    predict: ["Read-only XP ke liye getter useful hai? yes/no", "yes"],
    predict2: ["Arbitrary `setXp` expose karna zaroori hai? yes/no", "no"],
    prompt:
      "XP ko readable but not arbitrarily writable rakho. Only `getXp()` add karke exact `XP: 100` print karo.",
    starter:
      'class Player {\n    private int xp;\n\n    Player(int xp) {\n        this.xp = xp;\n    }\n\n    // Add only the read API required by Main.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player(100);\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    solution:
      'class Player {\n    private int xp;\n\n    Player(int xp) {\n        this.xp = xp;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player(100);\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    tests: tests("XP: 100"),
  },
  {
    slug: "encapsulation-bug-hunt",
    title: "Encapsulation Bug Hunt",
    description:
      "Leaky API, wrong getter mapping, shadowing aur inverted validation ko ek saath diagnose karo.",
    problem:
      "Encapsulation bugs sirf compile errors nahi hote. Wrong getter ya inverted validation syntactically valid hoke object contract break kar sakte hain.",
    why: "Safe class audit me access boundary, read mapping, write mapping aur validation ko separately verify karna hota hai.",
    model:
      "AUDIT\n1 private boundary?\n2 getter → correct field?\n3 setter → correct field?\n4 validation → accepts only valid state?",
    syntax:
      "public int getLevel() {\n    return level;\n}\n\npublic void setLevel(int level) {\n    if (level > 0) {\n        this.level = level;\n    }\n}",
    remember:
      "Compile success ke baad bhi public API contract ko semantic level par test karo.",
    example: "valid level 2 → setLevel(3) → 3 → setLevel(-5) → remains 3",
    trace:
      "correct getters → valid 3 accepted → invalid -5 rejected → trustworthy report",
    mistake:
      "getXp returns level; setName uses name=name; invalid level accepted.",
    fix: "Har method ko uske public contract ke against independently audit karo.",
    predict: [
      "Wrong getter correct type return kare to code compile kar sakta hai? yes/no",
      "yes",
    ],
    predict2: ["Inverted validation syntax bug hai ya logic bug?", "logic bug"],
    prompt:
      "Saare semantic bugs fix karo. Valid level 3 accept aur invalid -5 reject hona chahiye. Exact output: `Arjun | Level 3 | XP 100`.",
    starter:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return level; // bug\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public void setName(String name) {\n        name = name; // bug\n    }\n\n    public void setLevel(int level) {\n        if (level <= 0) { // bug\n            this.level = level;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100, 2);\n\n        player.setName("Arjun");\n        player.setLevel(3);\n        player.setLevel(-5);\n\n        System.out.println(\n            player.getName()\n                + " | Level " + player.getLevel()\n                + " | XP " + player.getXp()\n        );\n    }\n}',
    solution:
      'class Player {\n    private String name;\n    private int xp;\n    private int level;\n\n    Player(String name, int xp, int level) {\n        this.name = name;\n        this.xp = xp;\n        this.level = level;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public void setName(String name) {\n        this.name = name;\n    }\n\n    public void setLevel(int level) {\n        if (level > 0) {\n            this.level = level;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman", 100, 2);\n\n        player.setName("Arjun");\n        player.setLevel(3);\n        player.setLevel(-5);\n\n        System.out.println(\n            player.getName()\n                + " | Level " + player.getLevel()\n                + " | XP " + player.getXp()\n        );\n    }\n}',
    tests: tests("Arjun | Level 3 | XP 100"),
  },
  {
    slug: "secure-player-account-build",
    title: "🏆 Secure Player Account",
    description:
      "Requirements se minimum safe public API design karke valid account state independently protect karo.",
    problem:
      "Account ko blank username, negative XP, non-positive level aur arbitrary XP replacement se protect karna hai—without blindly exposing setters.",
    why: "Encapsulation ka final result boilerplate getters/setters nahi; aisa object contract hai jisme invalid state enter karna difficult ho.",
    model:
      "constructor input\n   ↓ validate starting state\nprivate fields\n   ↓\ngetters for required reads\n   ↓\nvalidated selected writes\n   ↓\ntrustworthy account",
    syntax:
      "private fields\n+ validated constructor\n+ required getters\n+ validated setUsername/setLevel\n+ no setXp",
    remember:
      "Module 20 ka focus access + validity hai. XP earn karne jaise domain behaviour Module 21 me aayenge.",
    example: "blank username → Guest\nnegative XP → 0\ninvalid level → 1",
    trace:
      "blank/-50/0 → Guest/0/1 → username Aman → level 3 → invalid -4 rejected → final Aman/0/3",
    mistake:
      "Constructor me invalid starting values accept karna ya arbitrary `setXp()` expose karna.",
    fix: "Starting state aur later updates dono same validity rules respect karein; API minimum rakho.",
    predict: [
      "Blank username ka safe fallback is challenge me kya hai?",
      "Guest",
    ],
    predict2: ["Negative starting XP ka safe fallback kya hai?", "0"],
    prompt:
      "Secure Player Account build karo. `username`, `xp`, `level` private hon. Constructor rules: blank username → `Guest`, negative XP → 0, non-positive level → 1. Required getters banao. `setUsername` blank values reject kare; `setLevel` non-positive values reject kare. `setXp` mat banao. Start with blank username, XP -50, level 0; then username `Aman`, level 3, then invalid level -4 try karo. Exact output:\n=== SECURE ACCOUNT ===\nUser: Aman\nLevel: 3\nXP: 0",
    starter:
      'class Player {\n    // Design private state and the minimum safe public API.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // 1) Start with invalid values: "", -50, 0.\n        // 2) Update username to Aman and level to 3.\n        // 3) Try invalid level -4.\n        // 4) Print the required secure account report.\n    }\n}',
    solution:
      'class Player {\n    private String username;\n    private int xp;\n    private int level;\n\n    Player(String username, int xp, int level) {\n        if (username != null && !username.isBlank()) {\n            this.username = username;\n        } else {\n            this.username = "Guest";\n        }\n\n        if (xp >= 0) {\n            this.xp = xp;\n        } else {\n            this.xp = 0;\n        }\n\n        if (level > 0) {\n            this.level = level;\n        } else {\n            this.level = 1;\n        }\n    }\n\n    public String getUsername() {\n        return username;\n    }\n\n    public int getXp() {\n        return xp;\n    }\n\n    public int getLevel() {\n        return level;\n    }\n\n    public void setUsername(String username) {\n        if (username != null && !username.isBlank()) {\n            this.username = username;\n        }\n    }\n\n    public void setLevel(int level) {\n        if (level > 0) {\n            this.level = level;\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("", -50, 0);\n\n        player.setUsername("Aman");\n        player.setLevel(3);\n        player.setLevel(-4);\n\n        System.out.println("=== SECURE ACCOUNT ===");\n        System.out.println("User: " + player.getUsername());\n        System.out.println("Level: " + player.getLevel());\n        System.out.println("XP: " + player.getXp());\n    }\n}',
    tests: tests("=== SECURE ACCOUNT ===\nUser: Aman\nLevel: 3\nXP: 0"),
    minutes: 34,
  },
];

export const encapsulationModule = specModule(
  {
    slug: "week-3-encapsulation",
    title: "Week 3 — Encapsulation",
    description:
      "Private boundaries, selective access aur validation se minimum safe public API design karke object state ko valid aur trustworthy rakho.",
    position: 20,
  },
  rows,
);
