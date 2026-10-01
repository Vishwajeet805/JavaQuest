import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "iteration-collection-algorithms-for-each-with-collections",
    title: "For-each with Collections",
    description:
      "Collection ko sequentially process karne ka default mental model banao: har element visit karo, relevant state update karo, answer derive karo.",
    problem:
      "Module 33–35 me collections store/query kiye. Ab real programs ko collection ke multiple elements par same rule apply karna hota hai.",
    why: "Iteration collection data ko computation me convert karti hai. Algorithm samajhne ke liye pehle traversal ko state-change process ki tarah dekhna zaroori hai.",
    model:
      "collection → visit element → update state → visit next → final answer\n\n[40, 70, 90]\n total=0 → 40 → 110 → 200",
    syntax: "for (int value : values) {\n    // process value\n}",
    remember:
      "For-each tab strong default hai jab har element process karna ho aur index khud problem ka part na ho.",
    example:
      "List<Integer> xp = List.of(40, 70, 90);\nint total = 0;\nfor (int value : xp) {\n    total += value;\n}",
    trace: "total 0 → read40 → 40 → read70 → 110 → read90 → 200",
    mistake:
      "Loop ke andar accumulator ko reset kar dena ya traversal order ko unnecessary business rule banana.",
    fix: "Algorithm state loop se pehle initialize karo; loop me sirf current element ke basis par update karo.",
    predict: ["`[2,4,6]` par for-each sum ka final result?", "12"],
    predict2: [
      "For-each use karne ke liye index variable mandatory hai? yes/no",
      "no",
    ],
    prompt:
      "XP values 40, 70, 90, 50 ko for-each se traverse karo. Exact output collection se derive karo:\nQuests: 4\nTotal XP: 250",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> xp = List.of(40, 70, 90, 50);\n        int total = 0;\n\n        // Traverse with for-each and accumulate XP.\n\n        System.out.println("Quests: " + xp.size());\n        System.out.println("Total XP: " + total);\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> xp = List.of(40, 70, 90, 50);\n        int total = 0;\n\n        for (int value : xp) {\n            total += value;\n        }\n\n        System.out.println("Quests: " + xp.size());\n        System.out.println("Total XP: " + total);\n    }\n}',
    tests: tests("Quests: 4\nTotal XP: 250"),
  },
  {
    slug: "iteration-collection-algorithms-index-loop-with-list",
    title: "Index Loop with List",
    description:
      "Index ko tab use karo jab position algorithm ka meaningful input ho—sirf isliye nahi ki List indexes support karti hai.",
    problem:
      "For-each element deta hai, lekin kabhi position bhi chahiye: numbered output, neighboring values, ya position-based rule.",
    why: "Learner ko traversal construct requirement ke according choose karna hai. Index loop extra control deta hai, saath me off-by-one risk bhi.",
    model:
      "i:       0       1       2\nList: [Forest, Castle, Cave]\n       get(i)\n\nvalid i: 0 ... size()-1",
    syntax:
      "for (int i = 0; i < quests.size(); i++) {\n    String quest = quests.get(i);\n}",
    remember:
      "`i < list.size()` standard bound hai. Last valid index `size() - 1` hota hai.",
    example:
      'List<String> quests = List.of("Forest", "Castle");\nfor (int i = 0; i < quests.size(); i++) {\n    System.out.println((i + 1) + ": " + quests.get(i));\n}',
    trace:
      "i0 → Forest → i1 → Castle → i2 fails condition because size2 → stop",
    mistake:
      "`i <= list.size()` likhkar final iteration me invalid index access karna.",
    fix: "Indexes ko 0 through `size()-1` trace karo; display numbering alag ho sakti hai (`i+1`).",
    predict: ["3-element List ka last valid index?", "2"],
    predict2: [
      "Loop condition `i <= list.size()` safe standard bound hai? yes/no",
      "no",
    ],
    prompt:
      "Quests `Forest, Castle, Cave` ko index loop se inspect karo. Even zero-based index wale quests ka XP 50, odd index ka 100 maan kar total derive karo. Exact output:\nFirst: Forest\nLast: Cave\nTotal XP: 200",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> quests = List.of("Forest", "Castle", "Cave");\n        int totalXp = 0;\n\n        // Use an index loop.\n        // Even index => 50 XP, odd index => 100 XP.\n\n        System.out.println("First: " + quests.get(0));\n        System.out.println("Last: " + quests.get(quests.size() - 1));\n        System.out.println("Total XP: " + totalXp);\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> quests = List.of("Forest", "Castle", "Cave");\n        int totalXp = 0;\n\n        for (int i = 0; i < quests.size(); i++) {\n            if (i % 2 == 0) {\n                totalXp += 50;\n            } else {\n                totalXp += 100;\n            }\n        }\n\n        System.out.println("First: " + quests.get(0));\n        System.out.println("Last: " + quests.get(quests.size() - 1));\n        System.out.println("Total XP: " + totalXp);\n    }\n}',
    tests: tests("First: Forest\nLast: Cave\nTotal XP: 200"),
  },
  {
    slug: "iteration-collection-algorithms-search",
    title: "Search: Find a Matching Element",
    description:
      "Linear search ko explicit algorithm state ke saath trace karo: scan until match, record result, optionally stop.",
    problem:
      "`contains` simple membership answer de sakta hai, but real search me condition object field par ho sakti hai aur matching object khud chahiye.",
    why: "Search ek transferable algorithm hai. List of objects par predicate-based search learner ko collection APIs se independent reasoning deta hai.",
    model:
      "items → check condition → no → next\n                    ↓ yes\n                 found result → stop if only first needed",
    syntax:
      "Quest found = null;\nfor (Quest quest : quests) {\n    if (quest.getId() == targetId) {\n        found = quest;\n        break;\n    }\n}",
    remember:
      "Search state usually 'not found yet' se start hota hai. `break` tab useful hai jab first match sufficient ho.",
    example:
      "for (int x : values) {\n    if (x > 100) {\n        found = x;\n        break;\n    }\n}",
    trace:
      "50 fails → 80 fails → 120 matches → record120 → break; later values inspect nahi hote",
    mistake:
      "Match milne ke baad bhi result ko later iterations me accidentally overwrite karna.",
    fix: "Search contract decide karo: first match, last match, ya all matches? First match ho to record + break.",
    predict: ["`[30,90,120,150]` me first value >100?", "120"],
    predict2: [
      "First-match search me match ke baad `break` useful hai? yes/no",
      "yes",
    ],
    prompt:
      "Quest objects me IDs 101/205/330 aur titles Forest/Castle/Cave hain. List ko manually search karke id 205 ka object find karo. `Map` use mat karo. Exact output:\nFound: Castle\nXP: 120",
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n\n    Quest(int id, String title, int xp) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 50),\n            new Quest(205, "Castle", 120),\n            new Quest(330, "Cave", 80)\n        );\n\n        Quest found = null;\n        // Search for id 205 and stop once found.\n\n        System.out.println("Found: " + found.getTitle());\n        System.out.println("XP: " + found.getXp());\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n\n    Quest(int id, String title, int xp) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 50),\n            new Quest(205, "Castle", 120),\n            new Quest(330, "Cave", 80)\n        );\n\n        Quest found = null;\n        for (Quest quest : quests) {\n            if (quest.getId() == 205) {\n                found = quest;\n                break;\n            }\n        }\n\n        System.out.println("Found: " + found.getTitle());\n        System.out.println("XP: " + found.getXp());\n    }\n}',
    tests: tests("Found: Castle\nXP: 120"),
  },
  {
    slug: "iteration-collection-algorithms-count-matches",
    title: "Count Matches",
    description:
      "Predicate + counter pattern se answer derive karo: har matching element exactly once count karo.",
    problem:
      "Collection size total elements batata hai, lekin 'kitne elements condition satisfy karte hain?' ke liye algorithmic state chahiye.",
    why: "Counting search ka natural extension hai: stop at first match ke bajaye full traversal aur accumulator update.",
    model:
      "count = 0\nfor each element:\n  condition true  → count++\n  condition false → unchanged\n\nfinal count = number of matches",
    syntax:
      "int count = 0;\nfor (int value : values) {\n    if (value >= 80) count++;\n}",
    remember:
      "Counter loop se pehle initialize hota hai aur sirf matching condition par increment hota hai.",
    example:
      "List<Integer> scores = List.of(40, 90, 80, 60);\nint passed = 0;\nfor (int score : scores) if (score >= 80) passed++;",
    trace: "40 no count0 → 90 yes1 → 80 yes2 → 60 no2",
    mistake:
      "Counter ko every iteration increment karna aur condition ke andar kuch aur karna.",
    fix: "Natural language ko code me map karo: 'count values that satisfy P' → `if (P) count++`.",
    predict: ["`[2,7,8,3,10]` me even values count?", "3"],
    predict2: [
      "Count-matches algorithm normally full collection traverse karta hai? yes/no",
      "yes",
    ],
    prompt:
      "XP values 50, 120, 80, 30, 150 me `>= 80` high rewards aur `< 80` low rewards count karo. Exact output:\nHigh: 3\nLow: 2\nTotal: 5",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = List.of(50, 120, 80, 30, 150);\n        int high = 0;\n        int low = 0;\n\n        // Count both categories in one traversal.\n\n        System.out.println("High: " + high);\n        System.out.println("Low: " + low);\n        System.out.println("Total: " + rewards.size());\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = List.of(50, 120, 80, 30, 150);\n        int high = 0;\n        int low = 0;\n\n        for (int reward : rewards) {\n            if (reward >= 80) {\n                high++;\n            } else {\n                low++;\n            }\n        }\n\n        System.out.println("High: " + high);\n        System.out.println("Low: " + low);\n        System.out.println("Total: " + rewards.size());\n    }\n}',
    tests: tests("High: 3\nLow: 2\nTotal: 5"),
  },
  {
    slug: "iteration-collection-algorithms-min-and-max",
    title: "Min and Max",
    description:
      "Best-so-far state maintain karke min/max derive karo, including correct initialization and empty-collection assumption.",
    problem:
      "Maximum ko blindly `0` se initialize karna negative datasets me wrong ho sakta hai. Algorithm ko data contract ke saath reason karna chahiye.",
    why: "Min/max comparison algorithms learner ko initialization invariant sikhate hain: current best must represent processed data.",
    model:
      "non-empty list\nmax = first element\nfor each remaining/current element:\n  if element > max → replace max\n\nInvariant: max = largest value seen so far",
    syntax:
      "int max = values.get(0);\nint min = values.get(0);\nfor (int value : values) {\n    if (value > max) max = value;\n    if (value < min) min = value;\n}",
    remember:
      "First-element initialization non-empty collection assume karta hai. Empty case ko requirement ke according separately handle karo.",
    example:
      "List<Integer> v = List.of(-8, -3, -12);\nint max = v.get(0);\nfor (int x : v) if (x > max) max = x;",
    trace: "max -8 → see -8 stays → see -3 update → see -12 stays → final -3",
    mistake:
      "Max ko 0 initialize karke negative-only input par 0 return karna although 0 collection me hai hi nahi.",
    fix: "Non-empty contract ho to first element se initialize karo; otherwise empty input policy explicitly define karo.",
    predict: ["`[-8,-3,-12]` ka max?", "-3"],
    predict2: [
      "Non-empty list me first element min/max initialization ke liye valid hai? yes/no",
      "yes",
    ],
    prompt:
      "Rewards 50, 120, 80, 30, 150 se manual loop me min aur max derive karo; `Collections.min/max` use mat karo. Exact output:\nMin: 30\nMax: 150\nRange: 120",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = List.of(50, 120, 80, 30, 150);\n        int min = rewards.get(0);\n        int max = rewards.get(0);\n\n        // Update min and max by traversing the collection.\n\n        System.out.println("Min: " + min);\n        System.out.println("Max: " + max);\n        System.out.println("Range: " + (max - min));\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = List.of(50, 120, 80, 30, 150);\n        int min = rewards.get(0);\n        int max = rewards.get(0);\n\n        for (int reward : rewards) {\n            if (reward < min) min = reward;\n            if (reward > max) max = reward;\n        }\n\n        System.out.println("Min: " + min);\n        System.out.println("Max: " + max);\n        System.out.println("Range: " + (max - min));\n    }\n}',
    tests: tests("Min: 30\nMax: 150\nRange: 120"),
  },
  {
    slug: "iteration-collection-algorithms-sort-with-collections",
    title: "Sort with `Collections.sort`",
    description:
      "Ordering ko explicit transformation samjho: mutable List sort hoti hai, aur algorithm ke baad positions ka meaning change hota hai.",
    problem:
      "Sorting ke baad same elements rehte hain but order mutate hota hai. Immutable `List.of(...)` ko directly sort karna runtime failure de sakta hai.",
    why: "Library algorithms use karte waqt learner ko sirf syntax nahi, mutability/preconditions aur before-vs-after state samajhna chahiye.",
    model:
      "[120, 50, 80]\n   Collections.sort\n        ↓\n[50, 80, 120]\n\nsame values, changed order",
    syntax:
      "List<Integer> values = new ArrayList<>(List.of(120, 50, 80));\nCollections.sort(values);",
    remember:
      "`Collections.sort(list)` list ko in place mutate karta hai. Sort karne ke liye mutable List do.",
    example:
      "List<Integer> rewards = new ArrayList<>(List.of(120, 50, 80));\nCollections.sort(rewards);\nSystem.out.println(rewards);",
    trace: "[120,50,80] → sort ascending → [50,80,120] → get(0)=50, last=120",
    mistake:
      "`Collections.sort(List.of(...))` karke immutable list mutate karne ki koshish.",
    fix: "Mutable copy banao: `new ArrayList<>(List.of(...))`, then sort.",
    predict: ["Ascending sort ke baad `[7,2,5]`?", "[2, 5, 7]"],
    predict2: [
      "`Collections.sort` supplied List ka order mutate karta hai? yes/no",
      "yes",
    ],
    prompt:
      "Rewards 120, 50, 80, 150, 30 ko mutable List me sort karo. Exact output:\nSorted: [30, 50, 80, 120, 150]\nLowest: 30\nHighest: 150",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = new ArrayList<>(List.of(120, 50, 80, 150, 30));\n\n        // Sort ascending with Collections.sort.\n\n        System.out.println("Sorted: " + rewards);\n        System.out.println("Lowest: " + rewards.get(0));\n        System.out.println("Highest: " + rewards.get(rewards.size() - 1));\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = new ArrayList<>(List.of(120, 50, 80, 150, 30));\n\n        Collections.sort(rewards);\n\n        System.out.println("Sorted: " + rewards);\n        System.out.println("Lowest: " + rewards.get(0));\n        System.out.println("Highest: " + rewards.get(rewards.size() - 1));\n    }\n}',
    tests: tests("Sorted: [30, 50, 80, 120, 150]\nLowest: 30\nHighest: 150"),
  },
  {
    slug: "iteration-collection-algorithms-aggregate-values",
    title: "Aggregate Values",
    description:
      "Multiple pieces of state ek traversal me maintain karke collection ko summary me reduce karo: sum, count aur derived average.",
    problem:
      "Real reports ek hi metric nahi maangte. Total, qualifying count aur average jaise results same data se derive hote hain.",
    why: "Aggregation learner ko algorithm composition sikhata hai: one traversal can update multiple independent state variables correctly.",
    model:
      "elements\n  ↓ loop\nsum += value\ncount++\nhigh += condition ? 1 : 0\n  ↓\naverage = sum / count",
    syntax:
      "int total = 0;\nint high = 0;\nfor (int value : values) {\n    total += value;\n    if (value >= 80) high++;\n}",
    remember:
      "Derived values ko possible ho to final state se calculate karo. Integer division behavior ko intentional rakho.",
    example:
      "List<Integer> v = List.of(50, 100, 150);\nint total = 0;\nfor (int x : v) total += x;\nint average = total / v.size();",
    trace: "sum 0→50→150→300; size3; integer average 300/3=100",
    mistake:
      "Average ko loop ke andar repeatedly compute/update karke logic unnecessarily complex banana.",
    fix: "Raw aggregate state first collect karo; derived result loop ke baad calculate karo.",
    predict: ["50,100,150 ka integer average?", "100"],
    predict2: [
      "Total ko loop ke baad collection state se derive karna generally clearer hai? yes/no",
      "yes",
    ],
    prompt:
      "Rewards 50, 120, 80, 30, 150 ko ek traversal me aggregate karo. Exact output:\nTotal: 430\nAverage: 86\nAt least 100: 2",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = List.of(50, 120, 80, 30, 150);\n        int total = 0;\n        int atLeast100 = 0;\n\n        // One traversal: update total and qualifying count.\n        // Compute average after traversal.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = List.of(50, 120, 80, 30, 150);\n        int total = 0;\n        int atLeast100 = 0;\n\n        for (int reward : rewards) {\n            total += reward;\n            if (reward >= 100) {\n                atLeast100++;\n            }\n        }\n\n        int average = total / rewards.size();\n        System.out.println("Total: " + total);\n        System.out.println("Average: " + average);\n        System.out.println("At least 100: " + atLeast100);\n    }\n}',
    tests: tests("Total: 430\nAverage: 86\nAt least 100: 2"),
  },
  {
    slug: "iteration-collection-algorithms-algorithms-recap",
    title: "🏆 Quest Analytics Engine",
    description:
      "Traversal choice, search, counting, min/max, aggregation aur sorting ko ek independent collection-analysis challenge me combine karo.",
    problem:
      "Quest objects ki collection se dashboard report banana hai: target quest search, completion count, total/average XP, min/max aur sorted reward snapshot.",
    why: "Module proof individual loop patterns repeat karna nahi; learner ko ek larger requirement ko multiple small algorithms me decompose karke correct state manage karna hai.",
    model:
      "List<Quest>\n   ├─ search target id\n   ├─ count completed\n   ├─ aggregate XP\n   ├─ track min/max\n   └─ collect rewards → sort\n             ↓\n         analytics report",
    syntax:
      "for (Quest quest : quests) {\n    // update independent algorithm state\n}\nCollections.sort(rewards);",
    remember:
      "Algorithm choose karne se pehle output questions identify karo. Har answer ke liye minimal state define karo, then traversal me state maintain karo.",
    example:
      "Quest list → one traversal for totals/count/min/max/search → mutable reward copy → sort → report",
    trace:
      "initialize from valid first data → visit each Quest → update relevant state → sort copied rewards → derive final report",
    mistake:
      "Results hardcode karna, min/max ko unsafe sentinel se initialize karna, ya immutable list ko sort karna.",
    fix: "Collection ko source of truth rakho. Search/count/aggregate state explicitly derive karo; sorting ke liye mutable list use karo.",
    predict: [
      "First-match search aur aggregate stats ek hi traversal me coexist kar sakte hain? yes/no",
      "yes",
    ],
    predict2: [
      "Sorted snapshot ke liye original immutable data ko mutate karna mandatory hai? yes/no",
      "no",
    ],
    prompt:
      "Quest Analytics Engine complete karo. Data: (101,Forest,50,true), (205,Castle,120,false), (330,Cave,80,true), (404,Tower,150,true), (505,River,30,false). Collection se id 330 search karo; completed count, total XP, integer average, min/max derive karo; rewards ki mutable copy sort karo. Exact output:\nFound 330: Cave\nCompleted: 3\nTotal XP: 430\nAverage XP: 86\nMin XP: 30\nMax XP: 150\nSorted XP: [30, 50, 80, 120, 150]",
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n    private final boolean completed;\n\n    Quest(int id, String title, int xp, boolean completed) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n        this.completed = completed;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    boolean isCompleted() { return completed; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 50, true),\n            new Quest(205, "Castle", 120, false),\n            new Quest(330, "Cave", 80, true),\n            new Quest(404, "Tower", 150, true),\n            new Quest(505, "River", 30, false)\n        );\n\n        Quest found = null;\n        int completed = 0;\n        int total = 0;\n        int min = quests.get(0).getXp();\n        int max = quests.get(0).getXp();\n        List<Integer> rewards = new ArrayList<>();\n\n        // Traverse quests and derive all requested state.\n        // Then sort rewards and print the report.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n    private final boolean completed;\n\n    Quest(int id, String title, int xp, boolean completed) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n        this.completed = completed;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    boolean isCompleted() { return completed; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 50, true),\n            new Quest(205, "Castle", 120, false),\n            new Quest(330, "Cave", 80, true),\n            new Quest(404, "Tower", 150, true),\n            new Quest(505, "River", 30, false)\n        );\n\n        Quest found = null;\n        int completed = 0;\n        int total = 0;\n        int min = quests.get(0).getXp();\n        int max = quests.get(0).getXp();\n        List<Integer> rewards = new ArrayList<>();\n\n        for (Quest quest : quests) {\n            if (found == null && quest.getId() == 330) {\n                found = quest;\n            }\n            if (quest.isCompleted()) {\n                completed++;\n            }\n            int xp = quest.getXp();\n            total += xp;\n            if (xp < min) min = xp;\n            if (xp > max) max = xp;\n            rewards.add(xp);\n        }\n\n        Collections.sort(rewards);\n        int average = total / quests.size();\n\n        System.out.println("Found 330: " + found.getTitle());\n        System.out.println("Completed: " + completed);\n        System.out.println("Total XP: " + total);\n        System.out.println("Average XP: " + average);\n        System.out.println("Min XP: " + min);\n        System.out.println("Max XP: " + max);\n        System.out.println("Sorted XP: " + rewards);\n    }\n}',
    tests: tests(
      "Found 330: Cave\nCompleted: 3\nTotal XP: 430\nAverage XP: 86\nMin XP: 30\nMax XP: 150\nSorted XP: [30, 50, 80, 120, 150]",
    ),
    minutes: 35,
  },
];

export const iterationAlgorithmsModule = specModule(
  {
    slug: "iteration-collection-algorithms",
    title: "Module 36 — Iteration & Collection Algorithms",
    description:
      "Collections ko sirf store mat karo—traversal, search, count, min/max, sorting aur aggregation se useful answers derive karo.",
    position: 36,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
