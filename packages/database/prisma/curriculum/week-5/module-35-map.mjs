import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "map-map-mental-model",
    title: "Map Mental Model",
    description:
      "List/Set ke baad key-based lookup introduce karo: jab value ko position nahi, meaningful key se find karna ho, Map natural model hai.",
    problem:
      "Player score ya quest-by-id ko List me dhoondhne ke liye traversal lag sakta hai. Requirement agar 'is key ki value do' hai, data ko key → value association ke roop me model karna clearer hai.",
    why: "Module 33 ne sequence aur Module 34 ne uniqueness model ki. Ab learner collection ko lookup requirement ke basis par choose karta hai: Map unique keys ko values se associate karta hai.",
    model:
      'key        → value\n"Aman"     → 90\n"Riya"     → 95\n\nMap<K,V>\nK = lookup identity\nV = associated data',
    syntax:
      "import java.util.Map;\nimport java.util.HashMap;\n\nMap<String, Integer> scores = new HashMap<>();",
    remember:
      "Map positional collection nahi hai. Value ko key se retrieve/update kiya jata hai; key ka meaning domain requirement se aata hai.",
    example:
      'Map<String, Integer> scores = new HashMap<>();\nscores.put("Aman", 90);\nscores.put("Riya", 95);\nSystem.out.println(scores.get("Riya"));',
    trace:
      "empty → put Aman→90 → put Riya→95 → get(Riya) follows key association → 95",
    mistake: "Map ko List samajhkar `get(0)` ko 'first entry' expect karna.",
    fix: "Pehle lookup question bolo: 'kis key ki value?' Agar meaningful key nahi hai aur position matter karti hai, List reconsider karo.",
    predict: ["Player name se score lookup karna ho to List ya Map?", "Map"],
    predict2: [
      "`Map<String,Integer>` me String key type hai ya value type?",
      "key",
    ],
    prompt:
      "Quest rewards ko quest code se map karo: `forest`→50, `castle`→120. Collection state se exact output lao:\nCastle XP: 120\nEntries: 2",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create a Map<String, Integer> backed by HashMap.\n        // Store forest -> 50 and castle -> 120.\n\n        // Print castle reward and entry count.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> rewards = new HashMap<>();\n        rewards.put("forest", 50);\n        rewards.put("castle", 120);\n\n        System.out.println("Castle XP: " + rewards.get("castle"));\n        System.out.println("Entries: " + rewards.size());\n    }\n}',
    tests: tests("Castle XP: 120\nEntries: 2"),
  },
  {
    slug: "map-put-and-get",
    title: "`put` and `get`: Build and Query Associations",
    description:
      "`put` se associations create/update karo aur `get` se key-based retrieval trace karo.",
    problem:
      "Map syntax simple dikhta hai, lekin learner ko distinguish karna hai ki `put(key,value)` state mutate karta hai while `get(key)` association query karta hai.",
    why: "Key-value model useful tab banta hai jab learner exact state transitions reason kar sake rather than Map ko magic lookup box samjhe.",
    model:
      "put(K,V) → association store/update\nget(K)   → current associated value\n\n{A→10} --put(B,20)--> {A→10, B→20}",
    syntax: 'map.put("Aman", 90);\nint score = map.get("Aman");',
    remember:
      "`put` key aur value dono leta hai. `get` sirf key leta hai aur current associated value return karta hai.",
    example:
      'Map<String, Integer> hp = new HashMap<>();\nhp.put("mage", 70);\nhp.put("knight", 120);\nSystem.out.println(hp.get("mage"));',
    trace: "{} → mage→70 → knight→120 → get(mage) = 70; state unchanged",
    mistake: "`get` me value pass karke corresponding key expect karna.",
    fix: "Map direction intentional rakho. Jo cheez lookup input hai woh key honi chahiye.",
    predict: ['`put("q1", 50)` ke baad `get("q1")`?', "50"],
    predict2: ["`get` normally Map state mutate karta hai? yes/no", "no"],
    prompt:
      "Inventory counts map banao: potion→3, key→1, gem→5. `get` use karke exact output lao:\nPotions: 3\nGems: 5\nKinds: 3",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> inventory = new HashMap<>();\n        // Add potion, key and gem counts.\n\n        // Query potion/gem and print map size.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> inventory = new HashMap<>();\n        inventory.put("potion", 3);\n        inventory.put("key", 1);\n        inventory.put("gem", 5);\n\n        System.out.println("Potions: " + inventory.get("potion"));\n        System.out.println("Gems: " + inventory.get("gem"));\n        System.out.println("Kinds: " + inventory.size());\n    }\n}',
    tests: tests("Potions: 3\nGems: 5\nKinds: 3"),
  },
  {
    slug: "map-unique-keys",
    title: "Unique Keys and Replacement",
    description:
      "Repeated key insertion ko trace karo: Map duplicate key entry add nahi karta; current value replace hoti hai.",
    problem:
      "Three `put` calls ka matlab three entries nahi hota. Same key dobara use karne par association update hoti hai.",
    why: "Module 34 ke Set uniqueness ko Map keys se connect karna important hai: keys unique hain, values duplicate ho sakti hain.",
    model:
      'Aman→90\n   ↓ put("Aman", 110)\nAman→110\n\nsame key → replace value\nsame value under different keys → allowed',
    syntax: 'scores.put("Aman", 90);\nscores.put("Aman", 110);',
    remember:
      "Map me keys unique hoti hain. Same key ka new `put` old associated value ko replace karta hai; size necessarily nahi badhta.",
    example:
      'Map<String, Integer> scores = new HashMap<>();\nscores.put("Aman", 90);\nscores.put("Riya", 90);\nscores.put("Aman", 120);',
    trace:
      "{} → Aman→90 size1 → Riya→90 size2 → Aman→120 replaces old Aman value, size still2",
    mistake: "Same key ke second `put` ko second duplicate entry samajhna.",
    fix: "Map state ko key slots ki tarah trace karo: ek logical key ke paas ek current value.",
    predict: ['`A→1`, then `A→2`: final `get("A")`?', "2"],
    predict2: ["Different keys same value hold kar sakte hain? yes/no", "yes"],
    prompt:
      "Quest status updates process karo: q1→OPEN, q2→OPEN, q1→DONE. Exact output current Map se derive karo:\nq1: DONE\nq2: OPEN\nTracked: 2",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, String> status = new HashMap<>();\n        // Apply q1 OPEN, q2 OPEN, then q1 DONE.\n\n        // Print current values and size.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, String> status = new HashMap<>();\n        status.put("q1", "OPEN");\n        status.put("q2", "OPEN");\n        status.put("q1", "DONE");\n\n        System.out.println("q1: " + status.get("q1"));\n        System.out.println("q2: " + status.get("q2"));\n        System.out.println("Tracked: " + status.size());\n    }\n}',
    tests: tests("q1: DONE\nq2: OPEN\nTracked: 2"),
  },
  {
    slug: "map-containskey",
    title: "`containsKey`: Separate Presence from Value",
    description:
      "Key existence ko explicit query karo instead of blindly treating `get` result as presence proof.",
    problem:
      "`get(missingKey)` null de sakta hai, aur Maps null values bhi permit kar sakte hain depending on implementation. Presence question ke liye dedicated API clearer hai.",
    why: "Robust lookup code me 'key present hai?' aur 'associated value kya hai?' alag questions hain. Learner ko API intent match karna chahiye.",
    model:
      "containsKey(K) → association exists?\nget(K)         → associated value\n\npresence question ≠ value question",
    syntax:
      'if (scores.containsKey("Aman")) {\n    System.out.println(scores.get("Aman"));\n}',
    remember:
      "Presence test ke liye `containsKey` use karo. `get` retrieval operation hai.",
    example:
      'Map<String, Integer> rewards = new HashMap<>();\nrewards.put("forest", 50);\nSystem.out.println(rewards.containsKey("forest"));\nSystem.out.println(rewards.containsKey("desert"));',
    trace:
      "forest present → true; desert absent → false; queries Map state change nahi karti",
    mistake:
      "`map.get(key) != null` ko har Map presence check ka universal substitute banana.",
    fix: "Intent explicit rakho: key existence chahiye to `containsKey`; value chahiye to `get`.",
    predict: ["Missing key par `containsKey`?", "false"],
    predict2: ["`containsKey` Map ko modify karta hai? yes/no", "no"],
    prompt:
      "Unlock map me `forest`→true aur `castle`→false store karo. `containsKey` aur `get` ko meaningful roles me use karke exact output lao:\nKnows forest: true\nForest unlocked: true\nKnows desert: false",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Boolean> unlocks = new HashMap<>();\n        unlocks.put("forest", true);\n        unlocks.put("castle", false);\n\n        // Use containsKey for presence and get for stored state.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Boolean> unlocks = new HashMap<>();\n        unlocks.put("forest", true);\n        unlocks.put("castle", false);\n\n        System.out.println("Knows forest: " + unlocks.containsKey("forest"));\n        System.out.println("Forest unlocked: " + unlocks.get("forest"));\n        System.out.println("Knows desert: " + unlocks.containsKey("desert"));\n    }\n}',
    tests: tests(
      "Knows forest: true\nForest unlocked: true\nKnows desert: false",
    ),
  },
  {
    slug: "map-default-values",
    title: "Missing Keys and Default Values",
    description:
      "Missing-key handling ko deliberate banao with `getOrDefault`, especially counting/aggregation patterns me.",
    problem:
      "Counter map update karte waqt first occurrence ke liye value absent hoti hai. Har key ke liye separate initialization branch repetitive ho sakta hai.",
    why: "`getOrDefault` Map ko real data-processing tool banata hai: missing association ke liye fallback value use karke concise accumulation possible hota hai.",
    model:
      "current = map.getOrDefault(key, 0)\nnext = current + 1\nput(key, next)\n\nmissing key behaves as chosen fallback for this expression",
    syntax:
      "int count = counts.getOrDefault(word, 0);\ncounts.put(word, count + 1);",
    remember:
      "`getOrDefault` missing key par fallback return karta hai; by itself fallback ko Map me insert nahi karta.",
    example:
      'Map<String, Integer> counts = new HashMap<>();\nint old = counts.getOrDefault("java", 0);\ncounts.put("java", old + 1);',
    trace:
      "java absent → getOrDefault = 0 → put java→1 → next occurrence gets1 → put java→2",
    mistake:
      "`getOrDefault(key, 0)` call karke assume karna ki key automatically Map me add ho gayi.",
    fix: "Fallback retrieval aur mutation separate operations hain. State change ke liye `put` still needed.",
    predict: ['Empty Map me `getOrDefault("x", 5)`?', "5"],
    predict2: ["Sirf `getOrDefault` call se Map size badhta hai? yes/no", "no"],
    prompt:
      "Tags `java, oop, java, collections, java, oop` ki frequency Map se count karo using `getOrDefault`. Exact output:\njava: 3\noop: 2\ncollections: 1\nKinds: 3",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[] tags = {"java", "oop", "java", "collections", "java", "oop"};\n        Map<String, Integer> counts = new HashMap<>();\n\n        // Build frequency counts using getOrDefault.\n\n        System.out.println("java: " + counts.get("java"));\n        System.out.println("oop: " + counts.get("oop"));\n        System.out.println("collections: " + counts.get("collections"));\n        System.out.println("Kinds: " + counts.size());\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[] tags = {"java", "oop", "java", "collections", "java", "oop"};\n        Map<String, Integer> counts = new HashMap<>();\n\n        for (String tag : tags) {\n            counts.put(tag, counts.getOrDefault(tag, 0) + 1);\n        }\n\n        System.out.println("java: " + counts.get("java"));\n        System.out.println("oop: " + counts.get("oop"));\n        System.out.println("collections: " + counts.get("collections"));\n        System.out.println("Kinds: " + counts.size());\n    }\n}',
    tests: tests("java: 3\noop: 2\ncollections: 1\nKinds: 3"),
  },
  {
    slug: "map-iterating-entries",
    title: "Iterating Entries",
    description:
      "Jab key aur value dono chahiye, `entrySet()` traverse karke pair ko ek association ki tarah process karo.",
    problem:
      "Sirf keys loop karke har iteration me `get(key)` karna possible hai, but entry traversal directly key-value pair expose karta hai.",
    why: "Map processing me learner ko decide karna hai: keys chahiye, values chahiye, ya complete entries. `entrySet` association-centric traversal sikhata hai.",
    model:
      "Map.Entry<K,V>\n      ├─ getKey()\n      └─ getValue()\n\nentrySet() → all current associations",
    syntax:
      "for (Map.Entry<String, Integer> entry : scores.entrySet()) {\n    String name = entry.getKey();\n    int score = entry.getValue();\n}",
    remember:
      "`entrySet()` tab strong fit hai jab loop body ko key aur value dono ki zarurat ho.",
    example:
      'Map<String, Integer> rewards = new HashMap<>();\nrewards.put("forest", 50);\nfor (Map.Entry<String, Integer> e : rewards.entrySet()) {\n    System.out.println(e.getKey() + ":" + e.getValue());\n}',
    trace:
      "each association becomes one Entry view → read key/value → perform order-independent processing",
    mistake:
      "HashMap entry iteration ki exact order ko output contract banana.",
    fix: "HashMap order unspecified treat karo. Aggregate/filter/count jaise order-independent results derive karo unless ordered implementation intentionally chosen ho.",
    predict: ["Key aur value dono directly dene wala view?", "entrySet"],
    predict2: [
      "HashMap entry iteration exact insertion order guarantee karta hai? yes/no",
      "no",
    ],
    prompt:
      "Rewards map `forest`→50, `castle`→120, `cave`→80 traverse karo using `entrySet`. Total XP aur rewards >=80 count karo. Exact output:\nEntries: 3\nTotal XP: 250\nHigh rewards: 2",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> rewards = new HashMap<>();\n        rewards.put("forest", 50);\n        rewards.put("castle", 120);\n        rewards.put("cave", 80);\n\n        int total = 0;\n        int high = 0;\n        // Traverse entrySet. Do not depend on HashMap order.\n\n        System.out.println("Entries: " + rewards.size());\n        System.out.println("Total XP: " + total);\n        System.out.println("High rewards: " + high);\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> rewards = new HashMap<>();\n        rewards.put("forest", 50);\n        rewards.put("castle", 120);\n        rewards.put("cave", 80);\n\n        int total = 0;\n        int high = 0;\n        for (Map.Entry<String, Integer> entry : rewards.entrySet()) {\n            total += entry.getValue();\n            if (entry.getValue() >= 80) {\n                high++;\n            }\n        }\n\n        System.out.println("Entries: " + rewards.size());\n        System.out.println("Total XP: " + total);\n        System.out.println("High rewards: " + high);\n    }\n}',
    tests: tests("Entries: 3\nTotal XP: 250\nHigh rewards: 2"),
  },
  {
    slug: "map-map-of-objects",
    title: "Map of Objects: Index Your Domain",
    description:
      "OOP ko Map se connect karo: stable domain key se full object retrieve karke behavior/state access karo.",
    problem:
      "Multiple Quest objects List me store karna useful hai, but specific quest ID se repeated search karna cumbersome ho sakta hai.",
    why: "Week 3/4 ke domain objects ab collections ke andar real architecture role lete hain. Map ek lightweight index ban sakta hai: id → object.",
    model:
      'quest id → Quest object\n\n101 → Quest("Forest", 50)\n205 → Quest("Castle", 120)\n\nlookup id → object → behavior/state',
    syntax:
      'Map<Integer, Quest> quests = new HashMap<>();\nquests.put(101, new Quest("Forest", 50));\nQuest quest = quests.get(101);',
    remember:
      "Map value primitive/String tak limited nahi. Value full domain object ho sakta hai; key ko stable lookup identity choose karo.",
    example:
      'class Quest {\n    String title;\n    Quest(String title) { this.title = title; }\n}\n\nMap<Integer, Quest> quests = new HashMap<>();\nquests.put(7, new Quest("Forest"));',
    trace:
      "construct Quest → associate id7→object → get(7) returns same stored object reference → access object behavior/state",
    mistake:
      "Mutable/non-unique property ko casually key choose karna, then lookup semantics unstable ho jana.",
    fix: "Key ko domain identity/lookup requirement ke according choose karo, e.g. immutable quest ID.",
    predict: ["`Map<Integer, Quest>` me Quest key hai ya value?", "value"],
    predict2: [
      "Map se retrieved object par methods call kar sakte ho? yes/no",
      "yes",
    ],
    prompt:
      "Quest class with `title` and `xp` banao. Map me id 101→Forest/50 and 205→Castle/120 store karo. id 205 lookup karke exact output lao:\nQuest: Castle\nXP: 120\nTracked: 2",
    starter:
      "import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Quest> quests = new HashMap<>();\n        // Store IDs 101 and 205 with Quest objects.\n        // Retrieve id 205 and print its state plus map size.\n    }\n}",
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Quest> quests = new HashMap<>();\n        quests.put(101, new Quest("Forest", 50));\n        quests.put(205, new Quest("Castle", 120));\n\n        Quest selected = quests.get(205);\n        System.out.println("Quest: " + selected.getTitle());\n        System.out.println("XP: " + selected.getXp());\n        System.out.println("Tracked: " + quests.size());\n    }\n}',
    tests: tests("Quest: Castle\nXP: 120\nTracked: 2"),
  },
  {
    slug: "map-map-recap",
    title: "🏆 Quest Registry & Attempt Analytics",
    description:
      "Key choice, replacement, presence, default counting, object values aur entry traversal ko independent Map challenge me combine karo.",
    problem:
      "Quest registry ko ID se lookup karna hai aur attempt stream se per-quest counts maintain karne hain. Missing IDs ko safely ignore karna hai aur final stats current Maps se derive karne hain.",
    why: "Module proof syntax recall nahi hai. Learner ko do different Map responsibilities model karni hain: identity index (`id → Quest`) aur aggregation (`id → attempt count`).",
    model:
      "registry: id → Quest\nattempts: id → count\n\ninput attempt IDs\n   ↓ containsKey(registry)\nvalid → increment counts with getOrDefault\ninvalid → ignored\n   ↓\nderive total attempts + most-attempted count",
    syntax:
      "Map<Integer, Quest> registry = new HashMap<>();\nMap<Integer, Integer> attempts = new HashMap<>();\n\nif (registry.containsKey(id)) {\n    attempts.put(id, attempts.getOrDefault(id, 0) + 1);\n}",
    remember:
      "Ek Map ko har problem ke liye overload mat karo. Different associations ko separate Maps me model karna clarity badhata hai.",
    example:
      "Registry: 101→Forest, 205→Castle, 330→Cave\nAttempts: 101,205,101,999,330,101\n999 unknown → ignore\nCounts: 101→3,205→1,330→1",
    trace:
      "build registry → process each attempt → validate key → update count → traverse counts for aggregate → query registry for requested object",
    mistake:
      "Unknown ID par null dereference, counts ko hardcode karna, ya attempt order ko HashMap iteration order se infer karna.",
    fix: "Presence explicitly check karo, `getOrDefault` se aggregation karo, aur final answer current Map state se derive karo.",
    predict: ["Frequency counter me missing key ke liye useful default?", "0"],
    predict2: [
      "Unknown registry ID ko `get` karke immediately method call karna safe hai? yes/no",
      "no",
    ],
    prompt:
      "Quest Registry & Attempt Analytics complete karo. Registry: 101 Forest/50, 205 Castle/120, 330 Cave/80. Attempt IDs: 101,205,101,999,330,101. Unknown IDs ignore karo. `Map<Integer,Integer>` counts `getOrDefault` se build karo, then Maps se exact output derive karo:\nKnown quests: 3\nValid attempts: 5\nUnknown attempts: 1\nQuest 101: Forest\nQuest 101 attempts: 3\nMost attempts: 3",
    starter:
      "import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Quest> registry = new HashMap<>();\n        // Add the three quests.\n\n        int[] attemptIds = {101, 205, 101, 999, 330, 101};\n        Map<Integer, Integer> counts = new HashMap<>();\n        int unknown = 0;\n\n        // For each attempt:\n        // - validate id using registry\n        // - increment count with getOrDefault, or increment unknown\n\n        // Derive valid attempts and maximum count by traversing current counts.\n        // Lookup quest 101 and print the exact required report.\n    }\n}",
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Quest> registry = new HashMap<>();\n        registry.put(101, new Quest("Forest", 50));\n        registry.put(205, new Quest("Castle", 120));\n        registry.put(330, new Quest("Cave", 80));\n\n        int[] attemptIds = {101, 205, 101, 999, 330, 101};\n        Map<Integer, Integer> counts = new HashMap<>();\n        int unknown = 0;\n\n        for (int id : attemptIds) {\n            if (registry.containsKey(id)) {\n                counts.put(id, counts.getOrDefault(id, 0) + 1);\n            } else {\n                unknown++;\n            }\n        }\n\n        int valid = 0;\n        int most = 0;\n        for (Map.Entry<Integer, Integer> entry : counts.entrySet()) {\n            valid += entry.getValue();\n            if (entry.getValue() > most) {\n                most = entry.getValue();\n            }\n        }\n\n        Quest q101 = registry.get(101);\n        System.out.println("Known quests: " + registry.size());\n        System.out.println("Valid attempts: " + valid);\n        System.out.println("Unknown attempts: " + unknown);\n        System.out.println("Quest 101: " + q101.getTitle());\n        System.out.println("Quest 101 attempts: " + counts.getOrDefault(101, 0));\n        System.out.println("Most attempts: " + most);\n    }\n}',
    tests: tests(
      "Known quests: 3\nValid attempts: 5\nUnknown attempts: 1\nQuest 101: Forest\nQuest 101 attempts: 3\nMost attempts: 3",
    ),
    minutes: 32,
  },
];

export const mapModule = specModule(
  {
    slug: "map",
    title: "Module 35 — Map",
    description:
      "Key-value associations ko model, update, query aur aggregate karo—simple lookup se domain-object indexing tak.",
    position: 35,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
