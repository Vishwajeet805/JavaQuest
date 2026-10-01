import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "collections-problem-solving-choose-the-right-collection",
    title: "Choose the Right Collection",
    description:
      "Problem statement ko data-structure requirements me translate karo: order/index, uniqueness, ya key-based lookup.",
    problem:
      "Har collection problem ko `ArrayList` se start karna code ko unnecessarily complex bana sakta hai. Structure choice algorithm ka part hai.",
    why: "Modules 33–38 ne individual collection tools diye. Ab responsibility syntax se problem modeling par shift hoti hai: requirement dekhkar collection choose karna.",
    model:
      "Need ordered sequence / index? → List\nNeed unique membership?       → Set\nNeed key → value lookup?       → Map\n\nOne problem can combine multiple structures.",
    syntax: "List<T> ordered;\nSet<T> unique;\nMap<K, V> lookup;",
    remember:
      "Collection implementation se pehle access pattern identify karo. Correct structure often algorithm ko simpler banata hai.",
    example:
      'List<String> attempts = List.of("java", "oop", "java");\nSet<String> unique = new HashSet<>(attempts);\nMap<String, Integer> counts = new HashMap<>();',
    trace:
      "attempt history needs duplicates/order → List; distinct tags → Set; per-tag count → Map",
    mistake:
      "Familiarity ki wajah se har requirement ke liye default `ArrayList` choose karna.",
    fix: "Question ko operations me rewrite karo: preserve order? reject duplicates? lookup by key? Then structure select karo.",
    predict: [
      "Username membership uniqueness ke liye List/Set/Map me strongest direct fit?",
      "Set",
    ],
    predict2: [
      "Player ID se Player object lookup ke liye Map useful hai? yes/no",
      "yes",
    ],
    prompt:
      "Given attempts `java, oop, java, collections`, List ko source history rakho, Set se unique topics derive karo, aur Map se frequency count banao. Exact output:\nAttempts: 4\nUnique: 3\njava count: 2",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> attempts = List.of("java", "oop", "java", "collections");\n        // Derive unique topics with Set.\n        // Derive frequencies with Map.\n\n        // Print the requested report.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> attempts = List.of("java", "oop", "java", "collections");\n        Set<String> unique = new HashSet<>(attempts);\n        Map<String, Integer> counts = new HashMap<>();\n        for (String topic : attempts) {\n            counts.put(topic, counts.getOrDefault(topic, 0) + 1);\n        }\n\n        System.out.println("Attempts: " + attempts.size());\n        System.out.println("Unique: " + unique.size());\n        System.out.println("java count: " + counts.get("java"));\n    }\n}',
    tests: tests("Attempts: 4\nUnique: 3\njava count: 2"),
  },
  {
    slug: "collections-problem-solving-remove-duplicates",
    title: "Remove Duplicates Without Losing Required Order",
    description:
      "Deduplication ko requirement-sensitive banao: uniqueness enough hai ya first-seen order bhi preserve karna hai?",
    problem:
      "`HashSet` duplicates remove kar deta hai, but output ko original first-occurrence order chahiye ho to unordered Set alone requirement express nahi karta.",
    why: "Real problem solving me 'remove duplicates' incomplete specification hai. Learner ko hidden requirement—ordering—notice karna hai.",
    model:
      "input: [java, oop, java, map, oop]\nfirst-seen unique order required\n          ↓\nLinkedHashSet\n          ↓\n[java, oop, map]",
    syntax:
      "Set<String> unique = new LinkedHashSet<>(items);\nList<String> result = new ArrayList<>(unique);",
    remember:
      "`Set` uniqueness guarantee deta hai; implementation choice ordering behavior affect kar sakti hai. Requirement ke according implementation choose karo.",
    example:
      'List<String> input = List.of("A", "B", "A", "C");\nSet<String> unique = new LinkedHashSet<>(input);',
    trace:
      "A add → B add → duplicate A ignored → C add → iteration remains first-seen A,B,C",
    mistake:
      "`new HashSet<>(list)` use karke exact first-seen output order assume karna.",
    fix: "Order required ho to suitable ordered Set implementation choose karo, e.g. `LinkedHashSet`.",
    predict: [
      "First-seen order + uniqueness ke liye useful Set implementation?",
      "LinkedHashSet",
    ],
    predict2: [
      "Plain HashSet insertion order guarantee karta hai? yes/no",
      "no",
    ],
    prompt:
      "Tags `java, oop, java, map, oop, set` se duplicates remove karo while first-seen order preserve ho. Exact output:\nUnique: [java, oop, map, set]\nRemoved: 2",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> tags = List.of("java", "oop", "java", "map", "oop", "set");\n        // Preserve first-seen order while removing duplicates.\n\n        // Print unique values and number removed.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> tags = List.of("java", "oop", "java", "map", "oop", "set");\n        Set<String> unique = new LinkedHashSet<>(tags);\n\n        System.out.println("Unique: " + unique);\n        System.out.println("Removed: " + (tags.size() - unique.size()));\n    }\n}',
    tests: tests("Unique: [java, oop, map, set]\nRemoved: 2"),
  },
  {
    slug: "collections-problem-solving-frequency-counting",
    title: "Frequency Counting",
    description:
      "Repeated input ko frequency table me transform karo aur counts se downstream answers derive karo.",
    problem:
      "Raw event list batati hai kya hua, but analytics questions—most common, repeated count, per-value frequency—Map representation demand kar sakte hain.",
    why: "Module 35 ka `getOrDefault` ab isolated API nahi; ye standard counting pattern ka building block banega.",
    model:
      "events → Map<value,count>\n\njava, oop, java, map, java\n        ↓\njava→3, oop→1, map→1",
    syntax: "counts.put(item, counts.getOrDefault(item, 0) + 1);",
    remember:
      "Frequency Map raw history ko summary representation me converts karta hai. Key = distinct value; value = occurrences.",
    example:
      "for (String word : words) {\n    freq.put(word, freq.getOrDefault(word, 0) + 1);\n}",
    trace: "java absent→1 → oop absent→1 → java current1→2 → java current2→3",
    mistake:
      "Counter variable ek hi rakhna when separate count per distinct value required hai.",
    fix: "Per-key state ko Map me store karo; each event only its own key count update kare.",
    predict: [
      "Frequency Map me value usually kya represent karti hai?",
      "count",
    ],
    predict2: [
      "`getOrDefault(key,0)+1` first occurrence ko 1 bana sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Attempts `101,205,101,330,101,205` ki frequency count karo. Counts Map traverse karke highest frequency derive karo. Exact output:\n101: 3\n205: 2\n330: 1\nHighest frequency: 3",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> attempts = List.of(101, 205, 101, 330, 101, 205);\n        Map<Integer, Integer> counts = new HashMap<>();\n\n        // Build counts, then derive highest frequency from the Map.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> attempts = List.of(101, 205, 101, 330, 101, 205);\n        Map<Integer, Integer> counts = new HashMap<>();\n\n        for (int id : attempts) {\n            counts.put(id, counts.getOrDefault(id, 0) + 1);\n        }\n\n        int highest = 0;\n        for (int count : counts.values()) {\n            if (count > highest) highest = count;\n        }\n\n        System.out.println("101: " + counts.get(101));\n        System.out.println("205: " + counts.get(205));\n        System.out.println("330: " + counts.get(330));\n        System.out.println("Highest frequency: " + highest);\n    }\n}',
    tests: tests("101: 3\n205: 2\n330: 1\nHighest frequency: 3"),
  },
  {
    slug: "collections-problem-solving-lookup-tables",
    title: "Lookup Tables",
    description:
      "Repeated linear search ko meaningful key-based index me replace karo when the problem repeatedly asks for objects by stable identity.",
    problem:
      "Quest List me id lookup repeatedly karna har query par traversal demand karta hai. Stable unique ID available ho to Map index intent clearer banata hai.",
    why: "Collection choice algorithmic cost aur code shape dono affect karta hai. Learner ko List source data aur Map lookup index ke distinct roles samajhne hain.",
    model:
      "List<Quest> source\n      ↓ build index once\nMap<Integer, Quest>\n      ↓\nget(id) for repeated lookups",
    syntax:
      "Map<Integer, Quest> byId = new HashMap<>();\nfor (Quest q : quests) byId.put(q.getId(), q);",
    remember:
      "Lookup table tab useful hai jab key stable/unique ho aur key-based queries repeated hon. Har List ko Map me convert karna automatically better nahi.",
    example:
      "for (Quest q : quests) {\n    byId.put(q.getId(), q);\n}\nQuest selected = byId.get(205);",
    trace:
      "source objects → one pass builds id associations → later query205 directly asks Map",
    mistake:
      "Non-unique field ko Map key bana kar earlier object silently replace kar dena.",
    fix: "Lookup key ki uniqueness/domain identity verify karo before indexing.",
    predict: [
      "Stable unique quest ID se repeated lookup ke liye useful structure?",
      "Map",
    ],
    predict2: [
      "Duplicate Map key put karne par previous value replace ho sakti hai? yes/no",
      "yes",
    ],
    prompt:
      "Quest List se ID lookup table build karo: 101 Forest/50, 205 Castle/120, 330 Cave/80. Queries 205 and 330 ko Map se resolve karo. Exact output:\n205: Castle 120\n330: Cave 80\nIndexed: 3",
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n    Quest(int id, String title, int xp) { this.id = id; this.title = title; this.xp = xp; }\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 50),\n            new Quest(205, "Castle", 120),\n            new Quest(330, "Cave", 80)\n        );\n\n        // Build Map<Integer, Quest> lookup table and answer both queries.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n    Quest(int id, String title, int xp) { this.id = id; this.title = title; this.xp = xp; }\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 50),\n            new Quest(205, "Castle", 120),\n            new Quest(330, "Cave", 80)\n        );\n\n        Map<Integer, Quest> byId = new HashMap<>();\n        for (Quest quest : quests) {\n            byId.put(quest.getId(), quest);\n        }\n\n        Quest q205 = byId.get(205);\n        Quest q330 = byId.get(330);\n        System.out.println("205: " + q205.getTitle() + " " + q205.getXp());\n        System.out.println("330: " + q330.getTitle() + " " + q330.getXp());\n        System.out.println("Indexed: " + byId.size());\n    }\n}',
    tests: tests("205: Castle 120\n330: Cave 80\nIndexed: 3"),
  },
  {
    slug: "collections-problem-solving-group-data-manually",
    title: "Group Data Manually",
    description:
      "One-to-many relationship model karo with `Map<K, List<V>>`: key ke under multiple related values collect karo.",
    problem:
      "Simple Map ek key ko one current value deta hai. Category ke andar many quests store karne ho to value itself collection ho sakti hai.",
    why: "Grouping collections composition ka major step hai. Learner ab nested generic structure ko real problem shape se derive karta hai.",
    model:
      "category → many quests\n\ncombat → [Arena, Dragon]\nexplore → [Forest, Cave]\n\nMap<String, List<String>>",
    syntax:
      "groups.putIfAbsent(category, new ArrayList<>());\ngroups.get(category).add(item);",
    remember:
      "One key → many values ko often `Map<K,List<V>>` model karta hai. First encounter par bucket initialize karna padta hai.",
    example:
      'groups.putIfAbsent("combat", new ArrayList<>());\ngroups.get("combat").add("Arena");',
    trace:
      "combat missing → create [] → add Arena → combat=[Arena] → next combat reuses bucket → add Dragon",
    mistake:
      "`map.put(category, item)` repeatedly karke previous item overwrite karna when requirement grouping hai.",
    fix: "Map value ko collection banao, bucket initialize/retrieve karo, then item append karo.",
    predict: [
      "One category ke under many String values ke liye useful type?",
      "Map<String, List<String>>",
    ],
    predict2: [
      "Grouping me same key ke second item ko first overwrite karna chahiye? yes/no",
      "no",
    ],
    prompt:
      "Pairs combat:Arena, explore:Forest, combat:Dragon, explore:Cave, social:Guild ko manually group karo using `Map<String,List<String>>`. Exact output:\ncombat: [Arena, Dragon]\nexplore: [Forest, Cave]\nsocial count: 1",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[][] data = {\n            {"combat", "Arena"},\n            {"explore", "Forest"},\n            {"combat", "Dragon"},\n            {"explore", "Cave"},\n            {"social", "Guild"}\n        };\n\n        Map<String, List<String>> groups = new LinkedHashMap<>();\n        // Group every item under its category.\n\n        // Print requested values.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[][] data = {\n            {"combat", "Arena"},\n            {"explore", "Forest"},\n            {"combat", "Dragon"},\n            {"explore", "Cave"},\n            {"social", "Guild"}\n        };\n\n        Map<String, List<String>> groups = new LinkedHashMap<>();\n        for (String[] row : data) {\n            String category = row[0];\n            String quest = row[1];\n            groups.putIfAbsent(category, new ArrayList<>());\n            groups.get(category).add(quest);\n        }\n\n        System.out.println("combat: " + groups.get("combat"));\n        System.out.println("explore: " + groups.get("explore"));\n        System.out.println("social count: " + groups.get("social").size());\n    }\n}',
    tests: tests(
      "combat: [Arena, Dragon]\nexplore: [Forest, Cave]\nsocial count: 1",
    ),
  },
  {
    slug: "collections-problem-solving-merge-collection-results",
    title: "Merge Collection Results",
    description:
      "Multiple partial collection results ko one coherent result me combine karo without losing required semantics.",
    problem:
      "Do servers/levels se completed quest IDs aaye hain. Final report ko unique IDs chahiye, aur overlap ko duplicate completion nahi count karna.",
    why: "Real programs data ek source se nahi aata. Merge operation me learner ko decide karna hai whether duplicates preserve, remove, count, ya aggregate hon.",
    model:
      "source A: [101,205,330]\nsource B: [205,404,101]\n         ↓ union semantics\nunique merged: {101,205,330,404}",
    syntax:
      "Set<Integer> merged = new HashSet<>(first);\nmerged.addAll(second);",
    remember:
      "Merge semantics requirement-driven hain. `List.addAll` duplicates preserve karta hai; `Set.addAll` union-like uniqueness deta hai.",
    example: "Set<Integer> all = new HashSet<>(a);\nall.addAll(b);",
    trace:
      "A seeds set → B values added → existing keys unchanged → new values increase size",
    mistake: "Lists concatenate karke result ko unique assume karna.",
    fix: "Final invariant identify karo. Unique merged membership chahiye to Set appropriate hai.",
    predict: ["Unique union ke liye `Set.addAll` useful hai? yes/no", "yes"],
    predict2: [
      "`List.addAll` automatically duplicates remove karta hai? yes/no",
      "no",
    ],
    prompt:
      "Completed IDs A=[101,205,330], B=[205,404,101], C=[505,330] merge karo. Unique count aur overlap attempts derive karo. Exact output:\nRaw completions: 8\nUnique completions: 5\nDuplicate completions: 3",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> a = List.of(101, 205, 330);\n        List<Integer> b = List.of(205, 404, 101);\n        List<Integer> c = List.of(505, 330);\n\n        // Merge with unique membership semantics.\n        // Derive raw and duplicate counts from source/result sizes.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> a = List.of(101, 205, 330);\n        List<Integer> b = List.of(205, 404, 101);\n        List<Integer> c = List.of(505, 330);\n\n        Set<Integer> merged = new HashSet<>(a);\n        merged.addAll(b);\n        merged.addAll(c);\n\n        int raw = a.size() + b.size() + c.size();\n        int duplicates = raw - merged.size();\n        System.out.println("Raw completions: " + raw);\n        System.out.println("Unique completions: " + merged.size());\n        System.out.println("Duplicate completions: " + duplicates);\n    }\n}',
    tests: tests(
      "Raw completions: 8\nUnique completions: 5\nDuplicate completions: 3",
    ),
  },
  {
    slug: "collections-problem-solving-debug-collection-logic",
    title: "Debug Collection Logic",
    description:
      "Collection bugs ko syntax errors nahi, broken invariants ke roop me diagnose karo: wrong structure, wrong key, accidental replacement, unsafe mutation.",
    problem:
      "Code compile ho sakta hai but result wrong ho because Map key non-unique hai, HashSet order assumed hai, ya loop ke during collection structurally modify ho rahi hai.",
    why: "Problem solving ka mature step implementation se zyada diagnosis hai. Learner ko expected invariant aur actual state trace compare karna chahiye.",
    model:
      "requirement invariant\n      ↓\ntrace collection state after each operation\n      ↓\nfirst point where invariant breaks = bug location",
    syntax:
      "// Ask after each mutation:\n// What should collection contain now?\n// What does this operation actually guarantee?",
    remember:
      "Debugging me collection type/API ko blame karne se pehle requirement invariant aur state transitions trace karo.",
    example:
      'Map<String, Integer> byName = new HashMap<>();\nbyName.put("Alex", 101);\nbyName.put("Alex", 205);\n// If names are not unique, first ID is lost.',
    trace:
      "Alex→101 → same key Alex→205 replaces value → size stays1 → invariant 'store both players' breaks at second put",
    mistake:
      "Wrong output dekhkar random API calls add/remove karna without tracing first incorrect state.",
    fix: "Minimal input choose karo, expected state likho, operation-by-operation actual state trace karo, then data model fix karo.",
    predict: [
      "Duplicate Map key put hone par common effect?",
      "value replacement",
    ],
    predict2: [
      "Compile hone wala collection code logically wrong ho sakta hai? yes/no",
      "yes",
    ],
    bug: {
      slug: "collections-problem-solving-debug-collection-logic-bug",
      title: "Debug: Players Disappear",
      prompt:
        "Buggy program names ko key bana raha hai, so same-name players overwrite ho rahe hain. Requirement: all players stable unique ID se stored/lookup hon. Fix program so exact output ho:\nPlayers: 3\nID 205: Alex\nTotal XP: 240",
      starterCode:
        'import java.util.*;\n\nclass Player {\n    final int id;\n    final String name;\n    final int xp;\n    Player(int id, String name, int xp) {\n        this.id = id;\n        this.name = name;\n        this.xp = xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Player> players = List.of(\n            new Player(101, "Alex", 50),\n            new Player(205, "Alex", 80),\n            new Player(330, "Riya", 110)\n        );\n\n        Map<String, Player> byName = new HashMap<>();\n        for (Player p : players) {\n            byName.put(p.name, p);\n        }\n\n        int total = 0;\n        for (Player p : byName.values()) total += p.xp;\n\n        System.out.println("Players: " + byName.size());\n        System.out.println("ID 205: " + byName.get("Alex").name);\n        System.out.println("Total XP: " + total);\n    }\n}',
      solution:
        'import java.util.*;\n\nclass Player {\n    final int id;\n    final String name;\n    final int xp;\n    Player(int id, String name, int xp) {\n        this.id = id;\n        this.name = name;\n        this.xp = xp;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Player> players = List.of(\n            new Player(101, "Alex", 50),\n            new Player(205, "Alex", 80),\n            new Player(330, "Riya", 110)\n        );\n\n        Map<Integer, Player> byId = new HashMap<>();\n        for (Player p : players) {\n            byId.put(p.id, p);\n        }\n\n        int total = 0;\n        for (Player p : byId.values()) total += p.xp;\n\n        System.out.println("Players: " + byId.size());\n        System.out.println("ID 205: " + byId.get(205).name);\n        System.out.println("Total XP: " + total);\n    }\n}',
      tests: tests("Players: 3\nID 205: Alex\nTotal XP: 240"),
    },
    prompt:
      "Names `Alex, Alex, Riya` unique player identity nahi hain; IDs `101,205,330` unique hain. Correct key choice identify karke Map build karo and exact output derive karo:\nStored players: 3\nHas 205: true",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] ids = {101, 205, 330};\n        String[] names = {"Alex", "Alex", "Riya"};\n        Map<Integer, String> players = new HashMap<>();\n\n        // Use the stable unique identity as key.\n\n        System.out.println("Stored players: " + players.size());\n        System.out.println("Has 205: " + players.containsKey(205));\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] ids = {101, 205, 330};\n        String[] names = {"Alex", "Alex", "Riya"};\n        Map<Integer, String> players = new HashMap<>();\n\n        for (int i = 0; i < ids.length; i++) {\n            players.put(ids[i], names[i]);\n        }\n\n        System.out.println("Stored players: " + players.size());\n        System.out.println("Has 205: " + players.containsKey(205));\n    }\n}',
    tests: tests("Stored players: 3\nHas 205: true"),
  },
  {
    slug: "collections-problem-solving-problem-solving-recap",
    title: "🏆 Guild Activity Processor",
    description:
      "List, Set, Map, grouping, lookup, frequency counting, merging aur sorting ko requirement-driven mini-system me independently combine karo.",
    problem:
      "Guild event stream se unique players, per-player attempts, category grouping, quest lookup aur leaderboard derive karna hai. Ek collection sab responsibilities cleanly solve nahi karti.",
    why: "Week 5 ke collection arc ka near-capstone proof hai: learner ko structures syntax se nahi, problem shape se choose aur compose karne hain.",
    model:
      "event List preserves history\n     ├─ Set<Integer> active player IDs\n     ├─ Map<Integer,Integer> attempts by player\n     ├─ Map<String,List<Integer>> quest IDs by category\n     └─ Map<Integer,Quest> quest lookup\n                     ↓\n             derived leaderboard/report",
    syntax:
      "Set<Integer> active = new HashSet<>();\nMap<Integer,Integer> attempts = new HashMap<>();\nMap<String,List<Integer>> groups = new HashMap<>();\nMap<Integer,Quest> quests = new HashMap<>();",
    remember:
      "Complex collection problems ko one giant loop trick se solve mat karo. Data responsibilities identify karo, suitable structures assign karo, then derived results build karo.",
    example:
      "History stays List; uniqueness becomes Set; keyed state becomes Map; one-to-many becomes Map<K,List<V>>.",
    trace:
      "build quest lookup → process each event → update active Set + frequency Map → group quests → derive totals → sort leaderboard copy",
    mistake:
      "One structure me incompatible responsibilities force karna, accidental HashMap order depend karna, ya duplicate semantics ignore karna.",
    fix: "Each output requirement ko invariant me translate karo. Structure choose karo, state transitions trace karo, deterministic output ke liye explicit Comparator use karo.",
    predict: ["One-to-many grouping ka common shape?", "Map<K, List<V>>"],
    predict2: [
      "Complex problem me List, Set aur Map together use karna valid design ho sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Guild Activity Processor complete karo. Quests: 101 Forest/explore/50, 205 Castle/combat/120, 330 Cave/explore/80. Events are playerId→questId: (1,101),(2,205),(1,330),(1,101),(3,205),(2,330). Derive: unique active players; attempts per player; category→unique attempted quest IDs; total valid event XP; and leaderboard sorted attempts descending then player ID ascending. Exact output:\nActive players: 3\nPlayer 1 attempts: 3\nExplore unique quests: 2\nCombat unique quests: 1\nTotal event XP: 500\nLeaderboard: [1=3, 2=2, 3=1]",
    starter:
      'import java.util.*;\n\nclass Quest {\n    final int id;\n    final String title;\n    final String category;\n    final int xp;\n\n    Quest(int id, String title, String category, int xp) {\n        this.id = id;\n        this.title = title;\n        this.category = category;\n        this.xp = xp;\n    }\n}\n\nclass Event {\n    final int playerId;\n    final int questId;\n    Event(int playerId, int questId) {\n        this.playerId = playerId;\n        this.questId = questId;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> questList = List.of(\n            new Quest(101, "Forest", "explore", 50),\n            new Quest(205, "Castle", "combat", 120),\n            new Quest(330, "Cave", "explore", 80)\n        );\n        List<Event> events = List.of(\n            new Event(1, 101), new Event(2, 205),\n            new Event(1, 330), new Event(1, 101),\n            new Event(3, 205), new Event(2, 330)\n        );\n\n        // Build quest lookup.\n        // Process events into active players, attempt frequencies,\n        // category -> unique quest IDs, and total event XP.\n        // Build deterministic leaderboard strings sorted by attempts desc, then player ID asc.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    final int id;\n    final String title;\n    final String category;\n    final int xp;\n\n    Quest(int id, String title, String category, int xp) {\n        this.id = id;\n        this.title = title;\n        this.category = category;\n        this.xp = xp;\n    }\n}\n\nclass Event {\n    final int playerId;\n    final int questId;\n    Event(int playerId, int questId) {\n        this.playerId = playerId;\n        this.questId = questId;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> questList = List.of(\n            new Quest(101, "Forest", "explore", 50),\n            new Quest(205, "Castle", "combat", 120),\n            new Quest(330, "Cave", "explore", 80)\n        );\n        List<Event> events = List.of(\n            new Event(1, 101), new Event(2, 205),\n            new Event(1, 330), new Event(1, 101),\n            new Event(3, 205), new Event(2, 330)\n        );\n\n        Map<Integer, Quest> quests = new HashMap<>();\n        for (Quest quest : questList) {\n            quests.put(quest.id, quest);\n        }\n\n        Set<Integer> activePlayers = new HashSet<>();\n        Map<Integer, Integer> attempts = new HashMap<>();\n        Map<String, Set<Integer>> categoryQuests = new HashMap<>();\n        int totalXp = 0;\n\n        for (Event event : events) {\n            Quest quest = quests.get(event.questId);\n            if (quest == null) continue;\n\n            activePlayers.add(event.playerId);\n            attempts.put(event.playerId, attempts.getOrDefault(event.playerId, 0) + 1);\n            categoryQuests.putIfAbsent(quest.category, new HashSet<>());\n            categoryQuests.get(quest.category).add(quest.id);\n            totalXp += quest.xp;\n        }\n\n        List<Map.Entry<Integer, Integer>> leaderboard = new ArrayList<>(attempts.entrySet());\n        leaderboard.sort(\n            Map.Entry.<Integer, Integer>comparingByValue()\n                .reversed()\n                .thenComparing(Map.Entry.comparingByKey())\n        );\n\n        List<String> leaderboardText = new ArrayList<>();\n        for (Map.Entry<Integer, Integer> entry : leaderboard) {\n            leaderboardText.add(entry.getKey() + "=" + entry.getValue());\n        }\n\n        System.out.println("Active players: " + activePlayers.size());\n        System.out.println("Player 1 attempts: " + attempts.getOrDefault(1, 0));\n        System.out.println("Explore unique quests: " + categoryQuests.get("explore").size());\n        System.out.println("Combat unique quests: " + categoryQuests.get("combat").size());\n        System.out.println("Total event XP: " + totalXp);\n        System.out.println("Leaderboard: " + leaderboardText);\n    }\n}',
    tests: tests(
      "Active players: 3\nPlayer 1 attempts: 3\nExplore unique quests: 2\nCombat unique quests: 1\nTotal event XP: 500\nLeaderboard: [1=3, 2=2, 3=1]",
    ),
    minutes: 40,
  },
];

export const collectionsProblemSolvingModule = specModule(
  {
    slug: "collections-problem-solving",
    title: "Module 39 — Collections Problem Solving",
    description:
      "List, Set aur Map ko isolated APIs ki tarah nahi, problem-shape-driven tools ki tarah choose, compose, debug aur apply karo.",
    position: 39,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
