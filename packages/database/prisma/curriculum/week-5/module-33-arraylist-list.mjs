import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "arraylist-list-why-list",
    title: "Why List?",
    description:
      "Fixed-size arrays ke baad decide karo ki changing collection ke liye dynamic ordered List kab better model hai.",
    problem:
      "Party roster ka size pehle se fixed nahi hai: members join aur leave kar sakte hain. Array me capacity manually manage karna collection problem ko storage bookkeeping me badal deta hai.",
    why: "Week 5 ka first shift syntax se zyada data-structure choice hai: jab ordered data ka size runtime par change ho, List intent ko directly model karti hai.",
    model:
      "array → ordered + fixed length\nList  → ordered + dynamic size\n\nneed: add/remove over time → List candidate",
    syntax:
      "import java.util.List;\nimport java.util.ArrayList;\n\nList<String> members = new ArrayList<>();",
    remember:
      "Array obsolete nahi hua. Fixed-size data ke liye array useful hai; changing ordered collection ke liye List often clearer choice hai.",
    example:
      'String[] fixed = new String[2];\n\nList<String> party = new ArrayList<>();\nparty.add("Aman");\nparty.add("Riya");\nparty.add("Kabir");',
    trace:
      "empty list size 0 → add Aman size 1 → add Riya size 2 → add Kabir size 3",
    mistake:
      "String[] members = new String[100]; // guessed capacity for a collection that naturally grows",
    fix: "Requirement ko dekho: size genuinely fixed hai ya membership runtime par change hoti hai? Structure us decision ke baad choose karo.",
    predict: [
      "Runtime par grow/shrink hone wali ordered collection ke liye array ya List?",
      "List",
    ],
    predict2: ["New empty ArrayList ka initial logical size?", "0"],
    prompt:
      "Dynamic quest party model karo. List me Aman, Riya, Kabir add karke exact output lao:\nMembers: 3\nFirst: Aman\nLast: Kabir",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create a List<String> backed by ArrayList.\n        // Add Aman, Riya and Kabir.\n\n        // Print size, first member and last member.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> members = new ArrayList<>();\n        members.add("Aman");\n        members.add("Riya");\n        members.add("Kabir");\n\n        System.out.println("Members: " + members.size());\n        System.out.println("First: " + members.get(0));\n        System.out.println("Last: " + members.get(members.size() - 1));\n    }\n}',
    tests: tests("Members: 3\nFirst: Aman\nLast: Kabir"),
  },
  {
    slug: "arraylist-list-create-arraylist",
    title: "Create ArrayList Through List",
    description:
      "Interface type aur implementation object ko separate karke `List<T>` reference + `new ArrayList<>()` mental model build karo.",
    problem:
      "Learner ko `List<String> names = new ArrayList<>();` me do names dikhte hain aur dono ko same role samajhne ka risk hota hai.",
    why: "Week 4 interfaces ka payoff yahan concrete hota hai: variable capability contract `List` expose karta hai, while `ArrayList` actual implementation object create karta hai.",
    model:
      "List<String> names ──reference──► ArrayList object\n     contract/type                  implementation\n\n<String> = elements must be String",
    syntax:
      "List<String> names = new ArrayList<>();\nList<Integer> scores = new ArrayList<>();",
    remember:
      "Left side batata hai caller kis contract par depend karta hai; right side actual implementation choose karti hai.",
    example:
      'List<String> quests = new ArrayList<>();\nquests.add("Forest");\nquests.add("Castle");\nSystem.out.println(quests);',
    trace:
      "declare List<String> reference → construct ArrayList<String> object → add String values → List API through reference",
    mistake:
      "List<String> names = new List<>(); // List is an interface, directly instantiate nahi hoti",
    fix: "Interface reference ko concrete implementation object chahiye, e.g. `new ArrayList<>()`.",
    predict: ["`List` contract hai ya concrete implementation?", "contract"],
    predict2: ["`List<String>` me Integer add kar sakte ho? yes/no", "no"],
    prompt:
      "Week 4 interface thinking reuse karo: `List<Integer>` reference ko `ArrayList` object do, 120 aur 80 add karo, then exact output `Total XP: 200` lao.",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Declare a List<Integer> backed by ArrayList.\n        // Add 120 and 80.\n\n        // Print their total using get(...).\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = new ArrayList<>();\n        rewards.add(120);\n        rewards.add(80);\n\n        System.out.println("Total XP: " + (rewards.get(0) + rewards.get(1)));\n    }\n}',
    tests: tests("Total XP: 200"),
  },
  {
    slug: "arraylist-list-add-and-get",
    title: "Add, Insert, and Get",
    description:
      "Append vs indexed insertion ko trace karo aur zero-based access ko changing List state ke saath reason karo.",
    problem:
      "`add(value)` aur `add(index, value)` dono collection grow karte hain, but insertion existing elements ko shift karti hai. Old index assumptions stale ho sakte hain.",
    why: "Dynamic collection use karte waqt sirf API names yaad karna enough nahi; mutation ke baad exact order mentally execute karna zaroori hai.",
    model:
      "[Aman, Kabir]\nadd(1, Riya)\n      ↓ shift right\n[Aman, Riya, Kabir]\n  0      1      2",
    syntax:
      "list.add(value);\nlist.add(index, value);\nT value = list.get(index);",
    remember:
      "Insertion requested index par value rakhti hai aur us index se existing elements right shift hote hain.",
    example:
      'List<String> queue = new ArrayList<>();\nqueue.add("Aman");\nqueue.add("Kabir");\nqueue.add(1, "Riya");\nSystem.out.println(queue.get(2));',
    trace:
      "[] → [Aman] → [Aman, Kabir] → insert Riya at 1 → [Aman, Riya, Kabir] → get(2) = Kabir",
    mistake: "Insert ke baad purane indexes ko unchanged assume karna.",
    fix: "Har structural mutation ke baad list order redraw karo before predicting `get(index)`.",
    predict: ["`[A, C]` par `add(1, B)` ke baad order?", "[A, B, C]"],
    predict2: ["Insertion ke baad original C ka index?", "2"],
    prompt:
      "Quest queue `[Aman, Kabir]` banao, Riya ko index 1 par insert karo, then exact output lao:\n0: Aman\n1: Riya\n2: Kabir",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> queue = new ArrayList<>();\n        queue.add("Aman");\n        queue.add("Kabir");\n\n        // Insert Riya between them.\n\n        // Print each element using get(index).\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> queue = new ArrayList<>();\n        queue.add("Aman");\n        queue.add("Kabir");\n        queue.add(1, "Riya");\n\n        System.out.println("0: " + queue.get(0));\n        System.out.println("1: " + queue.get(1));\n        System.out.println("2: " + queue.get(2));\n    }\n}',
    tests: tests("0: Aman\n1: Riya\n2: Kabir"),
  },
  {
    slug: "arraylist-list-set-and-remove",
    title: "Replace vs Remove",
    description:
      "`set` aur `remove` ke different state transitions trace karo: replacement size preserve karta hai, removal size/order change karta hai.",
    problem:
      "Learners often `set(index, value)` ko remove+add jaisa treat karte hain, ya `remove(index)` ke baad shifted indexes miss kar dete hain.",
    why: "Mutation semantics clear honi chahiye because later collection algorithms correctness current size aur order par depend karegi.",
    model:
      "set:    [A, B, C] → set(1, X)    → [A, X, C] size 3\nremove: [A, X, C] → remove(0)    → [X, C]    size 2",
    syntax:
      "list.set(index, newValue);\nlist.remove(index);\nlist.remove(value);",
    remember:
      "`set` replaces; `remove` deletes. Deletion ke baad later elements left shift hote hain.",
    example:
      'List<String> tasks = new ArrayList<>(List.of("draft", "test", "ship"));\ntasks.set(0, "design");\ntasks.remove(1);\nSystem.out.println(tasks);',
    trace:
      "[draft, test, ship] → set 0 design → [design, test, ship] → remove index 1 → [design, ship]",
    mistake:
      "remove ke baad next element ko old index se access karna without retracing shifted positions.",
    fix: "Mutation ko state transition ki tarah trace karo: content + order + size tino update karo.",
    predict: [
      "`set` successful hone par list size change hota hai? yes/no",
      "no",
    ],
    predict2: ["`[A,B,C]` par `remove(0)` ke baad B ka index?", "0"],
    prompt:
      "Inventory list `[Potion, Elixir, Shield]` ko update karo: Elixir ko Mega Potion se replace karo, Shield remove karo. Exact output:\n[Potion, Mega Potion]\nSize: 2",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> inventory = new ArrayList<>();\n        inventory.add("Potion");\n        inventory.add("Elixir");\n        inventory.add("Shield");\n\n        // Replace Elixir and remove Shield.\n\n        System.out.println(inventory);\n        System.out.println("Size: " + inventory.size());\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> inventory = new ArrayList<>();\n        inventory.add("Potion");\n        inventory.add("Elixir");\n        inventory.add("Shield");\n\n        inventory.set(1, "Mega Potion");\n        inventory.remove(2);\n\n        System.out.println(inventory);\n        System.out.println("Size: " + inventory.size());\n    }\n}',
    tests: tests("[Potion, Mega Potion]\nSize: 2"),
    bug: {
      slug: "arraylist-list-set-and-remove-shift-bug",
      title: "Debug: Removal Shift",
      prompt:
        "Bug fix karo. Goal Riya aur Kabir dono remove karke sirf `[Aman]` leave karna hai. Index shift ko correctly handle karo.",
      starterCode:
        'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> names = new ArrayList<>(List.of("Aman", "Riya", "Kabir"));\n        names.remove(1);\n        names.remove(2); // BUG\n        System.out.println(names);\n    }\n}',
      solution:
        'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> names = new ArrayList<>(List.of("Aman", "Riya", "Kabir"));\n        names.remove(1);\n        names.remove(1);\n        System.out.println(names);\n    }\n}',
      tests: tests("[Aman]"),
    },
  },
  {
    slug: "arraylist-list-size-and-contains",
    title: "Ask the Collection",
    description:
      "Hardcoded assumptions hata kar `size`, `isEmpty`, aur `contains` se current collection state query karo.",
    problem:
      "Dynamic list ka size runtime par change hota hai, isliye `get(2)` ya manually tracked count stale/unsafe ho sakta hai.",
    why: "Collection ko source of truth banana robust programs ki habit hai: current size/membership list se pucho, parallel guesses maintain mat karo.",
    model:
      "List state\n ├─ size()     → kitne elements?\n ├─ isEmpty()  → zero elements?\n └─ contains(x)→ value present?",
    syntax:
      "int count = list.size();\nboolean empty = list.isEmpty();\nboolean found = list.contains(value);",
    remember:
      "Dynamic state ko query karo; hardcoded last index ya separate manual count avoid karo unless requirement genuinely needs it.",
    example:
      'List<String> tags = new ArrayList<>(List.of("java", "oop"));\nSystem.out.println(tags.size());\nSystem.out.println(tags.contains("java"));',
    trace:
      "[java, oop] → size 2 → contains java true → remove java → size 1 → contains java false",
    mistake:
      "Dynamic list ke last element ke liye hardcoded `get(2)` use karna.",
    fix: "Non-empty list ka last index `list.size() - 1` hota hai; empty state relevant ho to pehle guard karo.",
    predict: ["Empty list par `size()` kya return karta hai?", "0"],
    predict2: [
      "`contains` membership check karta hai ya index return karta hai?",
      "membership",
    ],
    prompt:
      "Feature flags list se current state derive karo. `dark-mode`, `autosave` add karke exact output lao:\nCount: 2\nAutosave: true\nLast: autosave",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> features = new ArrayList<>();\n        features.add("dark-mode");\n        features.add("autosave");\n\n        // Query the list instead of hardcoding answers.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> features = new ArrayList<>();\n        features.add("dark-mode");\n        features.add("autosave");\n\n        System.out.println("Count: " + features.size());\n        System.out.println("Autosave: " + features.contains("autosave"));\n        System.out.println("Last: " + features.get(features.size() - 1));\n    }\n}',
    tests: tests("Count: 2\nAutosave: true\nLast: autosave"),
  },
  {
    slug: "arraylist-list-loop-through-list",
    title: "Traverse a Changing List",
    description:
      "Enhanced for aur index-based traversal ko purpose ke hisaab se choose karke List data process karo.",
    problem:
      "List me multiple values store karna useful tab banta hai jab program unhe systematically process kar sake; manual `get(0)`, `get(1)` scale nahi karta.",
    why: "Arrays se known traversal mental model ko List par transfer karke learner collection algorithms ki foundation banata hai.",
    model:
      "List values → visit each → update accumulator/output\n\nvalue needed → enhanced for\nindex needed → for + get(i)",
    syntax:
      "for (String item : items) { ... }\n\nfor (int i = 0; i < items.size(); i++) {\n    String item = items.get(i);\n}",
    remember:
      "Loop style requirement se choose karo. Sirf value chahiye to enhanced for often simpler; position chahiye to index loop useful.",
    example:
      "List<Integer> xp = new ArrayList<>(List.of(40, 60, 100));\nint total = 0;\nfor (int value : xp) {\n    total += value;\n}",
    trace: "total 0 → +40 = 40 → +60 = 100 → +100 = 200",
    mistake:
      "Loop bound me fixed number use karna: `i < 3` even though list can grow/shrink.",
    fix: "Traversal bound ko current `size()` se derive karo.",
    predict: [
      "List size runtime par change ho sakta hai; index loop ka safe upper bound?",
      "list.size()",
    ],
    predict2: [
      "Values ka sum chahiye, index nahi. Suitable loop?",
      "enhanced for",
    ],
    prompt:
      "XP list `40, 60, 100, 50` traverse karke total aur 50+ rewards count independently calculate karo. Exact output:\nTotal XP: 250\nBig rewards: 3",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = new ArrayList<>(List.of(40, 60, 100, 50));\n        int total = 0;\n        int bigRewards = 0;\n\n        // Traverse the list and update both results.\n\n        System.out.println("Total XP: " + total);\n        System.out.println("Big rewards: " + bigRewards);\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = new ArrayList<>(List.of(40, 60, 100, 50));\n        int total = 0;\n        int bigRewards = 0;\n\n        for (int reward : rewards) {\n            total += reward;\n            if (reward >= 50) {\n                bigRewards++;\n            }\n        }\n\n        System.out.println("Total XP: " + total);\n        System.out.println("Big rewards: " + bigRewards);\n    }\n}',
    tests: tests("Total XP: 250\nBig rewards: 3"),
  },
  {
    slug: "arraylist-list-list-of-objects",
    title: "List of Objects",
    description:
      "Week 3–4 OOP ko collections se connect karo: multiple domain objects ko List me store karke common object API through process karo.",
    problem:
      "Ab tak objects individually ya fixed array me manage hue. Real applications me roster/inventory/orders jaise groups runtime par grow karte hain.",
    why: "Collections ka real payoff primitive/string storage nahi; changing groups of meaningful objects ko model aur process karna hai.",
    model:
      "List<Quest>\n ├─ Quest(title=Forest, xp=50)\n ├─ Quest(title=Castle, xp=80)\n └─ Quest(title=Dragon, xp=120)\n\nList owns references → objects own their state/behaviour",
    syntax:
      'List<Quest> quests = new ArrayList<>();\nquests.add(new Quest("Forest", 50));',
    remember:
      "List objects ko merge nahi karti; wo object references ka ordered collection rakhti hai. Har object apni encapsulated state retain karta hai.",
    example:
      "for (Quest quest : quests) {\n    System.out.println(quest.getTitle());\n}",
    trace:
      "create Quest A → add reference → create Quest B → add reference → loop reference by reference → call object API",
    mistake:
      "Object fields ko parallel Lists me split karna: titles alag, xp alag, then indexes synchronize karna.",
    fix: "Related state ko object me rakho; collection me whole domain objects store karo.",
    predict: ["`List<Quest>` ke elements ka type?", "Quest"],
    predict2: [
      "List me Quest add karne se object ki fields separate lists me copy hoti hain? yes/no",
      "no",
    ],
    prompt:
      "`Quest` objects ki dynamic list banao. Har quest ka XP sum karo aur highest-XP quest title track karo. Exact output:\nTotal XP: 250\nTop quest: Dragon",
    starter:
      'import java.util.*;\n\nclass Quest {\n    private String title;\n    private int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>();\n        // Add Forest 50, Castle 80, Dragon 120.\n\n        int total = 0;\n        Quest top = null;\n\n        // Traverse and compute total + top quest.\n\n        System.out.println("Total XP: " + total);\n        System.out.println("Top quest: " + top.getTitle());\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private String title;\n    private int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>();\n        quests.add(new Quest("Forest", 50));\n        quests.add(new Quest("Castle", 80));\n        quests.add(new Quest("Dragon", 120));\n\n        int total = 0;\n        Quest top = null;\n\n        for (Quest quest : quests) {\n            total += quest.getXp();\n            if (top == null || quest.getXp() > top.getXp()) {\n                top = quest;\n            }\n        }\n\n        System.out.println("Total XP: " + total);\n        System.out.println("Top quest: " + top.getTitle());\n    }\n}',
    tests: tests("Total XP: 250\nTop quest: Dragon"),
  },
  {
    slug: "arraylist-list-list-recap",
    title: "🏆 Dynamic Quest Board",
    description:
      "Requirements se List choose karke add/update/remove/search/traverse operations independently combine karo.",
    problem:
      "Quest board runtime par change hota hai: quests add hote hain, cancelled quest remove hota hai, reward update hota hai, aur final report current collection se derive honi chahiye.",
    why: "Module proof API recall nahi; learner ko dynamic ordered collection ko stateful program me independently manipulate aur report karna hai.",
    model:
      "requirements\n  ↓ choose List<Quest>\nadd → update → remove → query → traverse\n  ↓\ncurrent state se final report",
    syntax:
      "List<Quest> board = new ArrayList<>();\n// mutate through List API\n// process through loop + object methods",
    remember:
      "Collection state ko source of truth rakho. Har operation ke baad current order/size reason karo; stale indexes aur manual counts se bachho.",
    example:
      "Start: Forest 50, Castle 80, Dragon 120\nUpdate Castle → 100\nRemove Forest\nAdd Arena 70\nFinal: Castle 100, Dragon 120, Arena 70",
    trace:
      "[] → add 3 → update object at index 1 → remove index 0 (shift) → add Arena → traverse current 3 objects → total 290",
    mistake:
      "Mutation ke baad old index mapping use karna ya report ke liye hardcoded count/total print karna.",
    fix: "Operations sequentially apply karo, then final values actual list traversal se derive karo.",
    predict: ["Forest remove hone ke baad original Castle ka new index?", "0"],
    predict2: [
      "Final total hardcode karna chahiye ya list traverse karke derive?",
      "list traverse karke derive",
    ],
    prompt:
      "Dynamic Quest Board complete karo. Start Forest(50), Castle(80), Dragon(120). Castle reward 100 karo, Forest remove karo, Arena(70) add karo. Final board traverse karke exact output lao:\nQuests: 3\nCastle -> 100\nDragon -> 120\nArena -> 70\nTotal XP: 290\nHas Dragon: true",
    starter:
      "import java.util.*;\n\nclass Quest {\n    private String title;\n    private int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    void setXp(int xp) { this.xp = xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> board = new ArrayList<>();\n\n        // 1. Add Forest(50), Castle(80), Dragon(120).\n        // 2. Change Castle XP to 100.\n        // 3. Remove Forest.\n        // 4. Add Arena(70).\n        // 5. Derive every line of the report from current list state.\n    }\n}",
    solution:
      'import java.util.*;\n\nclass Quest {\n    private String title;\n    private int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    void setXp(int xp) { this.xp = xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> board = new ArrayList<>();\n        board.add(new Quest("Forest", 50));\n        board.add(new Quest("Castle", 80));\n        board.add(new Quest("Dragon", 120));\n\n        board.get(1).setXp(100);\n        board.remove(0);\n        board.add(new Quest("Arena", 70));\n\n        int total = 0;\n        boolean hasDragon = false;\n\n        System.out.println("Quests: " + board.size());\n        for (Quest quest : board) {\n            System.out.println(quest.getTitle() + " -> " + quest.getXp());\n            total += quest.getXp();\n            if (quest.getTitle().equals("Dragon")) {\n                hasDragon = true;\n            }\n        }\n        System.out.println("Total XP: " + total);\n        System.out.println("Has Dragon: " + hasDragon);\n    }\n}',
    tests: tests(
      "Quests: 3\nCastle -> 100\nDragon -> 120\nArena -> 70\nTotal XP: 290\nHas Dragon: true",
    ),
    minutes: 30,
  },
];

export const arrayListListModule = specModule(
  {
    slug: "arraylist-list",
    title: "Module 33 — ArrayList & List",
    description:
      "Fixed arrays se dynamic ordered collections tak move karo: List contract choose, mutate, traverse aur objects ke saath apply karo.",
    position: 33,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
