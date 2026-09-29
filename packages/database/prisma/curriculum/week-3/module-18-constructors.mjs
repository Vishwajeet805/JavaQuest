import { buildRichModule } from "./rich-module-builder.mjs";

const output = (expectedOutput, input) => [
  { input, expectedOutput, isHidden: false },
];
const specs = [
  {
    slug: "constructor-initialization-problem",
    title: "The Initialization Problem",
    description:
      "Default Java state aur meaningful domain state ka difference trace karke constructor ki need discover karo.",
    problem:
      "Module 17 me object create hone ke baad fields manually set karni padti thi. Java default values de deta hai, lekin default state hamesha useful domain state nahi hoti.",
    why: "Agar Player create ho gaya lekin required data set karna bhool gaye, code technically chal sakta hai aur object phir bhi incomplete ho sakta hai. Constructor creation aur required initialization ko ek contract me laata hai.",
    model:
      "new Player()\n   ↓\nJava default state\nname = null\nlevel = 0\n   ↓\nmanual setup required\n   ↓\nforgotten field = incomplete object",
    syntax:
      'Player player = new Player();\nplayer.name = "Aman";\nSystem.out.println(player.name);\nSystem.out.println(player.level);',
    remember:
      "Default value valid Java value ho sakti hai; meaningful object state alag concern hai.",
    example:
      'class Player {\n    String name;\n    int level;\n}\n\nPlayer player = new Player();\nplayer.name = "Aman";',
    trace:
      "new Player() → name:null, level:0 → name set to Aman → level still 0",
    mistake:
      'Player player = new Player();\nplayer.name = "Aman";\n// level initialize karna bhool gaye',
    fix: "Problem 0 ki syntax nahi; problem ye hai ki object creation aur required initialization separate steps hain.",
    predict: [
      'Code trace karo: Player player = new Player(); player.name = "Aman"; phir name aur level print hote hain. Exact two-line output?',
      "Aman\n0",
    ],
    predict2: [
      "Fresh Player me String name set nahi kiya gaya. `System.out.println(player.name);` kya print karega?",
      "null",
    ],
    code: {
      slug: "inspect-default-object-state",
      title: "Inspect Default State",
      prompt:
        "Player object ki default field values exactly print karo:\nName: null\nLevel: 0",
      starterCode:
        "class Player {\n    String name;\n    int level;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        // Print the default field values\n    }\n}",
      solution:
        'class Player {\n    String name;\n    int level;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n\n        System.out.println("Name: " + player.name);\n        System.out.println("Level: " + player.level);\n    }\n}',
      tests: output("Name: null\nLevel: 0"),
    },
  },
  {
    slug: "first-constructor",
    title: "Your First Constructor",
    description:
      "Constructor declare karke object creation ke time name initialize karo.",
    problem:
      "Manual assignment ko constructor parameter ke through object creation ke andar move karte hain.",
    why: "Constructor `new` ke during run hota hai aur caller ke arguments ko initial object state me flow kara sakta hai.",
    model:
      '"Aman" argument\n      ↓\nplayerName parameter\n      ↓\nname field\n      ↓\nready Player object',
    syntax:
      "class Player {\n    String name;\n\n    Player(String playerName) {\n        name = playerName;\n    }\n}",
    remember:
      "Constructor ka naam class ke exactly same hota hai aur uska return type nahi hota.",
    example:
      'Player player = new Player("Aman");\nSystem.out.println(player.name);',
    trace: "argument Aman → parameter playerName → field name → output Aman",
    mistake: "void Player(String playerName) { ... }",
    fix: "`void` add karne par ye constructor nahi, ordinary method ban jata hai.",
    predict: [
      'Trace karo: Player aman = new Player("Aman"); Player riya = new Player("Riya"); System.out.println(riya.name); Exact output?',
      "Riya",
    ],
    predict2: [
      '`new Player("Nova")` me "Nova" kis parameter me receive hoga, agar declaration `Player(String playerName)` hai?',
      "playerName",
    ],
    code: {
      slug: "build-first-constructor",
      title: "Build a Named Player",
      prompt:
        "Constructor use karke Player ko Aman name do. Output exactly: Player: Aman",
      starterCode:
        'class Player {\n    String name;\n\n    // Add a constructor that receives the player\'s name\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Player with name "Aman" and print it\n    }\n}',
      solution:
        'class Player {\n    String name;\n\n    Player(String playerName) {\n        name = playerName;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n        System.out.println("Player: " + player.name);\n    }\n}',
      tests: output("Player: Aman"),
    },
  },
  {
    slug: "constructor-multiple-parameters",
    title: "Multiple Constructor Parameters",
    description:
      "Constructor signature ko creation contract ki tarah read karke multiple arguments ko correct fields me map karo.",
    problem:
      "Real objects ko aksar ek se zyada starting values chahiye hoti hain.",
    why: "Parameter count, order aur types caller ko batate hain ki valid object create karne ke liye kya provide karna hoga.",
    model:
      'Character(String, String, int)\n          ↓       ↓      ↓\n        name     role   level\n\nnew Character("Riya", "Mage", 5)\n              ↓       ↓      ↓\n             name    role   level',
    syntax:
      "Character(String characterName, String characterRole, int startingLevel) {\n    name = characterName;\n    role = characterRole;\n    level = startingLevel;\n}",
    remember:
      "Readable parameter names argument order ko samajhne me help karte hain.",
    example:
      'Character hero = new Character("Riya", "Mage", 4); // imagine constructor stores startingLevel + 1',
    trace: "Riya→name | Mage→role | 4→startingLevel → final level 5",
    mistake: 'new Character(5, "Mage", "Riya")',
    fix: "Values familiar hone ke baad bhi wrong order/types constructor contract ko break karte hain.",
    predict: [
      'Agar constructor `level = startingLevel + 1` karta hai, `new Character("Riya", "Mage", 4)` ke baad level?',
      "5",
    ],
    predict2: [
      '`new Character("Aman", "Knight", 3)` me second argument kis field ke liye flow karega?',
      "role",
    ],
    code: {
      slug: "build-multi-parameter-character",
      title: "Initialize a Character",
      prompt:
        "Constructor se Riya, Mage, level 5 create karke exact three-line profile print karo.",
      starterCode:
        "class Character {\n    String name;\n    String role;\n    int level;\n\n    // Add a constructor for all three fields\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Riya, Mage, level 5 and print the profile\n    }\n}",
      solution:
        'class Character {\n    String name;\n    String role;\n    int level;\n\n    Character(String characterName, String characterRole, int startingLevel) {\n        name = characterName;\n        role = characterRole;\n        level = startingLevel;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character character = new Character("Riya", "Mage", 5);\n\n        System.out.println("Name: " + character.name);\n        System.out.println("Role: " + character.role);\n        System.out.println("Level: " + character.level);\n    }\n}',
      tests: output("Name: Riya\nRole: Mage\nLevel: 5"),
    },
  },
  {
    slug: "constructor-vs-method",
    title: "Constructor vs Method",
    description:
      "Constructor aur ordinary method ko syntax, invocation aur lifecycle purpose ke basis par distinguish karo.",
    problem:
      "Constructor aur method dono braces ke andar code rakhte hain, isliye beginners unhe same samajh sakte hain. Difference unke lifecycle role me hai.",
    why: "Constructor initial object state establish karta hai aur `new` ke during run hota hai. Ordinary method ka apna naam/return type hota hai aur use explicitly call kiya jata hai.",
    model:
      'new Player("Aman")\n      ↓\nconstructor\n      ↓\nobject ready\n\nexplicit method call\n      ↓\nordinary method runs',
    syntax:
      "Player(String playerName) { ... }\n\nString getName() { return name; }",
    remember:
      "Constructor: class name + no return type. Method: own method name + return type.",
    example:
      'Player p = new Player("Aman"); // constructor\nString name = p.getName();       // ordinary method',
    trace:
      "new → constructor initializes object → getName explicitly runs later",
    mistake: "void Player(String playerName) { name=playerName; }",
    fix: "Return type add karne par declaration constructor nahi rehti; Java usse method maanta hai.",
    predict: [
      "In dono me constructor kaunsa hai? A) Player(String n) { ... } B) void Player(String n) { ... } — Exactly A ya B.",
      "A",
    ],
    predict2: [
      "`player.getName()` automatically new ke saath run hota hai ya explicitly called ordinary method hai? Exactly enter: method",
      "method",
    ],
    code: {
      slug: "separate-constructor-method",
      title: "Constructor and Method Together",
      prompt:
        "Constructor se name set karo aur `showProfile()` method se `Player: Aman` print karo.",
      starterCode:
        "class Player {\n    String name;\n\n    // Add the constructor\n\n    // Add showProfile()\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Aman and call showProfile()\n    }\n}",
      solution:
        'class Player {\n    String name;\n\n    Player(String playerName) {\n        name = playerName;\n    }\n\n    void showProfile() {\n        System.out.println("Player: " + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Aman");\n        player.showProfile();\n    }\n}',
      tests: output("Player: Aman"),
    },
    bug: {
      slug: "fix-void-constructor",
      title: "Bug Hunt: The Fake Constructor",
      prompt: "`void` bug fix karo. Expected: Riya",
      starterCode:
        'class Player {\n    String name;\n\n    void Player(String playerName) {\n        name = playerName;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Riya");\n        System.out.println(player.name);\n    }\n}',
      solution:
        'class Player {\n    String name;\n\n    Player(String playerName) {\n        name = playerName;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player("Riya");\n        System.out.println(player.name);\n    }\n}',
      tests: output("Riya"),
    },
  },
  {
    slug: "constructor-overloading-intro",
    title: "Constructor Overloading",
    description:
      "Different meaningful creation paths ke liye constructor signatures design aur trace karo.",
    problem:
      "Kabhi caller full starting data provide karega, aur kabhi class sensible starter state provide kar sakti hai.",
    why: "Constructor overloading ek class ko multiple valid creation contracts deta hai. Har overload ka meaningful purpose hona chahiye.",
    model: 'new Player() → Guest\nnew Player("Aman") → Aman',
    syntax:
      'Player() { name = "Guest"; }\nPlayer(String playerName) { name = playerName; }',
    remember:
      "Overloaded constructors ko parameter count/types se distinguish kiya jata hai.",
    example: 'Player guest=new Player();\nPlayer named=new Player("Aman");',
    trace: "zero args→Player() | one String→Player(String)",
    mistake: "Player(String a) { ... }\nPlayer(String b) { ... }",
    fix: "Sirf parameter name badalne se new signature nahi banta.",
    predict: [
      'Trace karo: Player guest=new Player(); Player named=new Player("Aman"); System.out.println(guest.name+" | "+named.name); Exact output?',
      "Guest | Aman",
    ],
    predict2: [
      "`Player(String firstName)` aur `Player(String displayName)` kya valid overload pair hai? Exactly yes/no.",
      "no",
    ],
    code: {
      slug: "overload-player-constructors",
      title: "Build Two Creation Paths",
      prompt:
        "Guest aur Aman players create karke separate lines me names print karo.",
      starterCode:
        "class Player {\n    String name;\n\n    // Add:\n    // 1) zero-argument constructor -> Guest\n    // 2) String constructor -> given name\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Guest and Aman using different constructors\n    }\n}",
      solution:
        'class Player {\n    String name;\n\n    Player() {\n        name = "Guest";\n    }\n\n    Player(String playerName) {\n        name = playerName;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player guest = new Player();\n        Player named = new Player("Aman");\n\n        System.out.println(guest.name);\n        System.out.println(named.name);\n    }\n}',
      tests: output("Guest\nAman"),
    },
  },
  {
    slug: "constructor-prediction-lab",
    title: "Constructor Trace Lab",
    description:
      "Constructor signatures, overload selection aur parameter flow ko mentally execute karke resulting state predict karo.",
    problem:
      "Constructor syntax dekh lena enough nahi hai. Har `new` call ko declaration se match karke exact resulting state trace karna hai.",
    why: "Real debugging me identify karna hota hai: kaunsa overload selected hua, arguments kis parameters me gaye, aur constructor body ne final fields kya banaye.",
    model:
      "new call\n   ↓\nmatch signature\n   ↓\nmap arguments → parameters\n   ↓\nexecute constructor body\n   ↓\nresulting object state",
    syntax:
      "Badge(String label) { points = 10; }\nBadge(String label, int startingPoints) { points = startingPoints; }",
    remember:
      "Prediction ka target keyword recall nahi—selected constructor aur resulting state trace karna hai.",
    example: 'Badge a=new Badge("Starter");\nBadge b=new Badge("Pro",50);',
    trace:
      "a → one-String overload → 10 points | b → String,int overload → 50 points",
    mistake: 'new Badge(50, "Pro")',
    fix: "Arguments ki values familiar ho sakti hain, lekin call tabhi valid hai jab signature ke count/order/types match karein.",
    predict: [
      'Badge(String) points=10 set karta hai; Badge(String,int) given points store karta hai. `new Badge("Pro", 50)` ke baad points?',
      "50",
    ],
    predict2: [
      'Available signatures `Badge(String)` aur `Badge(String,int)` hain. Kya `new Badge(50,"Pro")` match karta hai? yes/no',
      "no",
    ],
    code: {
      slug: "trace-constructed-players",
      title: "Trace Two Constructed Players",
      prompt: "Output exactly:\nAman: 4\nRiya: 5",
      starterCode:
        'class Player {\n    String name;\n    int level;\n\n    Player(String playerName, int startingLevel) {\n        name = playerName;\n        level = startingLevel;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 3);\n        Player riya = new Player("Riya", 5);\n\n        // Aman ko one level up karo.\n        // Phir dono players ka required output print karo.\n    }\n}',
      solution:
        'class Player {\n    String name;\n    int level;\n\n    Player(String playerName, int startingLevel) {\n        name = playerName;\n        level = startingLevel;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player aman = new Player("Aman", 3);\n        Player riya = new Player("Riya", 5);\n\n        aman.level++;\n\n        System.out.println(aman.name + ": " + aman.level);\n        System.out.println(riya.name + ": " + riya.level);\n    }\n}',
      tests: output("Aman: 4\nRiya: 5"),
    },
  },
  {
    slug: "constructor-bug-hunt",
    title: "Constructor Bug Hunt",
    description:
      "Wrong name, return type, argument count aur argument type bugs systematically fix karo.",
    problem:
      "Constructor errors usually declaration aur call ke contract mismatch se aate hain.",
    why: "Signature ko call ke argument count, order aur type ke against compare karna reliable debugging method hai.",
    model: "declaration signature ↔ new call arguments",
    syntax:
      'Character(String name, int level) { ... }\nnew Character("Aman", 3);',
    remember: "Error ke random symptoms nahi—constructor contract trace karo.",
    example: 'Character c = new Character("Mage", 2);',
    trace: "2 parameters expected → String,int received → valid",
    mistake: 'new Character(2, "Mage")',
    fix: "Arguments ko signature order me do.",
    predict: [
      "Constructor 2 parameters leta hai aur call 1 argument deta hai. Contract match? yes/no",
      "no",
    ],
    predict2: [
      "`Character(String,int)` ke liye first argument type?",
      "String",
    ],
    code: {
      slug: "repair-character-constructor",
      title: "Repair the Character",
      prompt:
        "All constructor bugs fix karke exactly `Aman | Knight | 3` print karo.",
      starterCode:
        'class Character {\n    String name;\n    String role;\n    int level;\n\n    void Character(String characterName, String characterRole, int startingLevel) {\n        name = characterName;\n        role = characterRole;\n        level = startingLevel;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character character = new Character("Aman", "Knight", 3);\n\n        System.out.println(\n            character.name + " | " + character.role + " | " + character.level\n        );\n    }\n}',
      solution:
        'class Character {\n    String name;\n    String role;\n    int level;\n\n    Character(String characterName, String characterRole, int startingLevel) {\n        name = characterName;\n        role = characterRole;\n        level = startingLevel;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character character = new Character("Aman", "Knight", 3);\n\n        System.out.println(\n            character.name + " | " + character.role + " | " + character.level\n        );\n    }\n}',
      tests: output("Aman | Knight | 3"),
    },
  },
  {
    slug: "character-creator-build",
    title: "🏆 Build a Character Creator",
    description:
      "Requirements se meaningful overloaded constructor contracts design karke complete characters independently create karo.",
    problem:
      "Final build me sirf shown constructor copy nahi karna. JavaQuets ko full character aur starter character ke do valid creation paths chahiye.",
    why: "Module competency tab prove hoti hai jab tum decide kar sako ki object ko creation ke time kya data chahiye aur kaunse overloads meaningful hain.",
    model:
      "requirements → fields → full creation contract + starter creation contract → ready objects → report",
    syntax:
      'Character(String name,String role,int level) { ... }\nCharacter(String name) { role="Adventurer"; level=1; }',
    remember:
      "Final build me `this`, `private`, inheritance ya advanced OOP required nahi. Focus constructor contracts par hai.",
    example:
      'Character knight=new Character("Arjun","Knight",4);\nCharacter starter=new Character("Kabir");',
    trace:
      "Arjun/Knight/4 → full constructor | Kabir → starter constructor → Adventurer/1",
    mistake: "Starter object create karke fields manually set karna.",
    fix: "Starter state ko object creation contract me encode karo.",
    predict: [
      'Starter constructor role Adventurer aur level 1 set karta hai. `new Character("Kabir")` ka level?',
      "1",
    ],
    predict2: [
      "Full `(String,String,int)` aur starter `(String)` constructors valid overloads hain? yes/no",
      "yes",
    ],
    code: {
      slug: "character-creator-final",
      title: "🏆 Character Creator — Independent Build",
      prompt:
        "Character class me name, role, level fields banao. Do creation paths support karo: (1) full character with name/role/level, (2) starter character with only name; starter role Adventurer aur level 1 ho. Arjun/Knight/4 aur Riya/Mage/5 full constructor se banao; Kabir starter constructor se. Object creation ke baad fields manually initialize mat karo. Exact output:\nArjun - Knight - Level 4\nRiya - Mage - Level 5\nKabir - Adventurer - Level 1",
      starterCode:
        "class Character {\n    String name;\n    String role;\n    int level;\n\n    // Design both constructor contracts yourself.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Full character: Arjun, Knight, level 4\n        // Full character: Riya, Mage, level 5\n        // Starter character: Kabir\n\n        // Print all three profiles in the required format.\n    }\n}",
      solution:
        'class Character {\n    String name;\n    String role;\n    int level;\n\n    Character(String characterName, String characterRole, int startingLevel) {\n        name = characterName;\n        role = characterRole;\n        level = startingLevel;\n    }\n\n    Character(String characterName) {\n        name = characterName;\n        role = "Adventurer";\n        level = 1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character arjun = new Character("Arjun", "Knight", 4);\n        Character riya = new Character("Riya", "Mage", 5);\n        Character kabir = new Character("Kabir");\n\n        System.out.println(\n            arjun.name + " - " + arjun.role + " - Level " + arjun.level\n        );\n        System.out.println(\n            riya.name + " - " + riya.role + " - Level " + riya.level\n        );\n        System.out.println(\n            kabir.name + " - " + kabir.role + " - Level " + kabir.level\n        );\n    }\n}',
      tests: output(
        "Arjun - Knight - Level 4\nRiya - Mage - Level 5\nKabir - Adventurer - Level 1",
      ),
    },
    minutes: 32,
  },
];

export const constructorsModule = buildRichModule(
  {
    slug: "week-3-constructors",
    title: "Week 3 — Constructors",
    description:
      "Object creation ko meaningful initial state ke saath bind karna, constructor contracts trace/debug karna aur multiple valid creation paths design karna seekho.",
    position: 18,
  },
  specs,
);
