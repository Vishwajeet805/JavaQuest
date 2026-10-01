import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "comparable-comparator-natural-ordering",
    title: "Natural Ordering",
    description:
      "Object sorting ka first design decision samjho: type ka ek intrinsic/default order kab meaningful hota hai?",
    problem:
      "`Integer` aur `String` naturally sort ho jate hain, lekin custom `Quest` objects ke liye Java ko nahi pata ki default order ID, title ya XP se hona chahiye.",
    why:
      "Module 36 me sorting use hui aur Module 37 me generic contracts samjhe. Ab learner ko objects ke ordering rules design karne hain, sirf `sort()` call nahi.",
    model:
      "objects + ordering rule → sortable sequence\n\nNatural order = type ka default/intrinsic order\nQuest? → first decide what 'default' should mean",
    syntax:
      "Collections.sort(list);\n// Works when elements have a natural ordering contract.",
    remember:
      "Natural ordering ek design choice hai. Har possible field ko natural order banana sensible nahi hota.",
    example:
      'List<Integer> values = new ArrayList<>(List.of(30, 10, 20));\nCollections.sort(values);\nSystem.out.println(values);',
    trace:
      "[30,10,20] → Integer natural ascending order → [10,20,30]",
    mistake:
      "Custom class ko sort karte waqt assume karna ki Java automatically suitable field choose karega.",
    fix:
      "Pehle ordering contract define karo: type ka natural order kya hai, ya requirement actually custom order maang rahi hai?",
    predict: ["Integer ka usual natural order ascending hai ya descending?", "ascending"],
    predict2: ["Custom object ka natural order automatically uske first field se decide hota hai? yes/no", "no"],
    prompt:
      "Mutable Integer list `120, 50, 80, 30` ko natural ordering se sort karo. Exact output:\nSorted: [30, 50, 80, 120]\nLowest: 30",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = new ArrayList<>(List.of(120, 50, 80, 30));\n        // Sort using the elements\\' natural ordering.\n\n        System.out.println("Sorted: " + rewards);\n        System.out.println("Lowest: " + rewards.get(0));\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> rewards = new ArrayList<>(List.of(120, 50, 80, 30));\n        Collections.sort(rewards);\n\n        System.out.println("Sorted: " + rewards);\n        System.out.println("Lowest: " + rewards.get(0));\n    }\n}',
    tests: tests("Sorted: [30, 50, 80, 120]\nLowest: 30"),
  },
  {
    slug: "comparable-comparator-comparable-t",
    title: "`Comparable<T>`",
    description:
      "Natural ordering ko class ke type contract me encode karo using generic `Comparable<T>`.",
    problem:
      "`List<Quest>` ko natural order se sort karne ke liye Quest ko Java ko batana hoga ki another Quest ke relative uska order kya hai.",
    why:
      "Ye Week 4 interfaces + Module 37 generics ka direct composition hai: class generic interface implement karke ordering capability expose karti hai.",
    model:
      "Quest implements Comparable<Quest>\n          ↓\nQuest promises: compareTo(Quest other)\n          ↓\nCollections.sort(List<Quest>) can use that contract",
    syntax:
      "class Quest implements Comparable<Quest> {\n    @Override\n    public int compareTo(Quest other) {\n        return Integer.compare(this.id, other.id);\n    }\n}",
    remember:
      "`Comparable<Quest>` means Quest objects know how to compare themselves with another Quest for natural ordering.",
    example:
      "class Rank implements Comparable<Rank> {\n    int level;\n    public int compareTo(Rank other) {\n        return Integer.compare(level, other.level);\n    }\n}",
    trace:
      "Quest objects → sort requests comparisons → compareTo returns relative ordering signal → list arranged by natural rule",
    mistake:
      "`implements Comparable` raw type use karna or wrong generic target choose karna.",
    fix:
      "Self-comparison contract ko parameterize karo: `Comparable<Quest>`.",
    predict: ["`Quest implements Comparable<Quest>` me comparison method ka parameter type?", "Quest"],
    predict2: ["Comparable ek interface hai? yes/no", "yes"],
    prompt:
      "`Quest implements Comparable<Quest>` complete karo. Natural order `id` ascending ho. IDs 330/Cave, 101/Forest, 205/Castle sort karke exact output lao:\n101 Forest\n205 Castle\n330 Cave",
    starter:
      'import java.util.*;\n\nclass Quest implements Comparable<Quest> {\n    private final int id;\n    private final String title;\n\n    Quest(int id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    @Override\n    public int compareTo(Quest other) {\n        // Natural order: id ascending.\n        return 0;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>(List.of(\n            new Quest(330, "Cave"),\n            new Quest(101, "Forest"),\n            new Quest(205, "Castle")\n        ));\n        Collections.sort(quests);\n        for (Quest q : quests) {\n            System.out.println(q.getId() + " " + q.getTitle());\n        }\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest implements Comparable<Quest> {\n    private final int id;\n    private final String title;\n\n    Quest(int id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    @Override\n    public int compareTo(Quest other) {\n        return Integer.compare(this.id, other.id);\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>(List.of(\n            new Quest(330, "Cave"),\n            new Quest(101, "Forest"),\n            new Quest(205, "Castle")\n        ));\n        Collections.sort(quests);\n        for (Quest q : quests) {\n            System.out.println(q.getId() + " " + q.getTitle());\n        }\n    }\n}',
    tests: tests("101 Forest\n205 Castle\n330 Cave"),
  },
  {
    slug: "comparable-comparator-compareto",
    title: "`compareTo`: Negative, Zero, Positive",
    description:
      "`compareTo` ko exact difference value nahi, sign-based ordering contract ki tarah trace karo.",
    problem:
      "Beginners often think comparison must return exactly -1, 0 or 1. Java sorting only relative sign semantics require karti hai.",
    why:
      "Ordering bugs mostly comparison contract misunderstanding se aate hain. Learner ko pairwise reasoning clear hona chahiye before custom comparators.",
    model:
      "a.compareTo(b)\n< 0 → a before b\n= 0 → same ordering position/equivalent for ordering\n> 0 → a after b",
    syntax:
      "return Integer.compare(this.xp, other.xp);",
    remember:
      "Sign matters. Direct subtraction `this.xp - other.xp` overflow kar sakta hai; `Integer.compare` safer and intent-clear hai.",
    example:
      "Integer.compare(50, 120)  // negative\nInteger.compare(120, 120) // zero\nInteger.compare(150, 120) // positive",
    trace:
      "compare 50 vs120 → negative → 50 before120; compare150 vs120 → positive → 150 after120",
    mistake:
      "`return this.value - other.value;` ko universally safe comparison implementation samajhna.",
    fix:
      "`Integer.compare`, `String.compareTo`, `Double.compare` jaise appropriate compare methods use karo.",
    predict: ["Ascending comparison me `Integer.compare(3, 9)` ka sign?", "negative"],
    predict2: ["`compareTo` ko exactly -1/0/1 hi return karna required hai? yes/no", "no"],
    prompt:
      "Program me `Integer.compare` se three comparison signs normalize karke print karo (`Integer.signum` use kar sakte ho): 50 vs120, 120 vs120, 150 vs120. Exact output:\n50 vs 120: -1\n120 vs 120: 0\n150 vs 120: 1",
    starter:
      'public class Main {\n    public static void main(String[] args) {\n        // Use Integer.compare and print the three comparison results.\n    }\n}',
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("50 vs 120: " + Integer.signum(Integer.compare(50, 120)));\n        System.out.println("120 vs 120: " + Integer.signum(Integer.compare(120, 120)));\n        System.out.println("150 vs 120: " + Integer.signum(Integer.compare(150, 120)));\n    }\n}',
    tests: tests("50 vs 120: -1\n120 vs 120: 0\n150 vs 120: 1"),
  },
  {
    slug: "comparable-comparator-comparator-basics",
    title: "Comparator Basics",
    description:
      "Natural order ko class se change kiye bina external/custom ordering rule define karo.",
    problem:
      "Quest ka natural order ID ho sakta hai, but leaderboard screen ko XP descending chahiye. Type ka default contract replace karna unnecessary hai.",
    why:
      "Comparator strategy ko object se separate karta hai. Same objects ko context-specific ways me order karna possible hota hai.",
    model:
      "Quest objects\n ├─ Comparable → natural ID order\n └─ Comparator → external XP/title/etc order",
    syntax:
      "Comparator<Quest> byXp = (a, b) -> Integer.compare(a.getXp(), b.getXp());",
    remember:
      "Comparable class ke andar natural order; Comparator class ke bahar alternate/custom order.",
    example:
      "Comparator<Integer> desc = (a, b) -> Integer.compare(b, a);",
    trace:
      "comparator receives pair → returns sign → sort uses repeated comparisons → final custom order",
    mistake:
      "Custom descending order ke liye natural `compareTo` ko baar-baar change karna.",
    fix:
      "Context-specific order ko separate `Comparator<T>` me rakho.",
    predict: ["External custom ordering ke liye interface?", "Comparator"],
    predict2: ["Comparator use karne ke liye domain class ka Comparable hona mandatory hai? yes/no", "no"],
    prompt:
      "Quest objects ko XP ascending Comparator se sort karo. Data Forest/120, Castle/50, Cave/80. Exact output:\nCastle 50\nCave 80\nForest 120",
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    Quest(String title, int xp) { this.title = title; this.xp = xp; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>(List.of(\n            new Quest("Forest", 120),\n            new Quest("Castle", 50),\n            new Quest("Cave", 80)\n        ));\n\n        // Create Comparator<Quest> by XP ascending and sort.\n        for (Quest q : quests) {\n            System.out.println(q.getTitle() + " " + q.getXp());\n        }\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    Quest(String title, int xp) { this.title = title; this.xp = xp; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>(List.of(\n            new Quest("Forest", 120),\n            new Quest("Castle", 50),\n            new Quest("Cave", 80)\n        ));\n\n        Comparator<Quest> byXp = (a, b) -> Integer.compare(a.getXp(), b.getXp());\n        quests.sort(byXp);\n        for (Quest q : quests) {\n            System.out.println(q.getTitle() + " " + q.getXp());\n        }\n    }\n}',
    tests: tests("Castle 50\nCave 80\nForest 120"),
  },
  {
    slug: "comparable-comparator-sort-with-comparator",
    title: "Sort with Comparator",
    description:
      "Comparator ko sorting operation me inject karo aur distinguish karo: data same, ordering policy replaceable.",
    problem:
      "A single List ko different screens par different order chahiye. Sorting rule ko data model me hardcode karne se flexibility kam hoti hai.",
    why:
      "Strategy-style thinking introduce hoti hai: sorting algorithm same hai, comparison behavior caller supply karta hai.",
    model:
      "same List<Quest>\n   + byTitle comparator → title order\n   + byXp comparator    → XP order\n\nsort mechanism unchanged; policy changes",
    syntax:
      "quests.sort(comparator);\n// or Collections.sort(quests, comparator);",
    remember:
      "`List.sort(comparator)` list ko in place reorder karta hai. Original order preserve karna ho to mutable copy sort karo.",
    example:
      'List<String> names = new ArrayList<>(List.of("Cave", "Forest", "Castle"));\nnames.sort(Comparator.naturalOrder());',
    trace:
      "list state before → comparator-driven pair decisions → same objects reordered → list state after",
    mistake:
      "Same original list ko multiple sort reports ke liye mutate karke previous ordering accidentally lose karna.",
    fix:
      "Independent views chahiye to `new ArrayList<>(source)` copies sort karo.",
    predict: ["`list.sort(comparator)` supplied list ko mutate karta hai? yes/no", "yes"],
    predict2: ["Original ordering preserve karne ke liye copy sort kar sakte ho? yes/no", "yes"],
    prompt:
      "Source titles `Forest, Castle, Cave` ko unchanged rakho. Copy ko reverse alphabetical Comparator se sort karo. Exact output:\nSource: [Forest, Castle, Cave]\nSorted: [Forest, Cave, Castle]",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> source = List.of("Forest", "Castle", "Cave");\n        List<String> sorted = new ArrayList<>(source);\n\n        // Sort only the copy in reverse alphabetical order.\n\n        System.out.println("Source: " + source);\n        System.out.println("Sorted: " + sorted);\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> source = List.of("Forest", "Castle", "Cave");\n        List<String> sorted = new ArrayList<>(source);\n\n        sorted.sort(Comparator.reverseOrder());\n\n        System.out.println("Source: " + source);\n        System.out.println("Sorted: " + sorted);\n    }\n}',
    tests: tests("Source: [Forest, Castle, Cave]\nSorted: [Forest, Cave, Castle]"),
  },
  {
    slug: "comparable-comparator-multiple-sort-orders",
    title: "Multiple Sort Orders",
    description:
      "Same domain objects ke liye reusable comparators compose karo: title, XP, ascending/descending.",
    problem:
      "Quest browser ko title ascending chahiye while leaderboard ko XP descending. Ek natural order dono requirements express nahi kar sakta.",
    why:
      "Learner ab ordering ko first-class policy ki tarah design karta hai, not one-off lambda pasted at every call site.",
    model:
      "Quest\n ├─ byTitle → alphabetical\n └─ byXpDesc → highest XP first\n\nsame objects, different policies",
    syntax:
      "Comparator<Quest> byTitle = Comparator.comparing(Quest::getTitle);\nComparator<Quest> byXpDesc = Comparator.comparingInt(Quest::getXp).reversed();",
    remember:
      "Comparator factories intent readable bana sakti hain. Reusable named comparators requirement ko code me document karte hain.",
    example:
      "Comparator<Quest> byXp = Comparator.comparingInt(Quest::getXp);\nComparator<Quest> highFirst = byXp.reversed();",
    trace:
      "copy A + byTitle → alphabetical view; copy B + byXpDesc → leaderboard view; source can remain unchanged",
    mistake:
      "Descending ke liye unsafe subtraction `(a,b) -> b.getXp()-a.getXp()` use karna.",
    fix:
      "`Comparator.comparingInt(...).reversed()` ya `Integer.compare` use karo.",
    predict: ["Existing Comparator ka reverse order banane ka method?", "reversed"],
    predict2: ["Same type ke multiple Comparator objects ho sakte hain? yes/no", "yes"],
    prompt:
      "Quests Forest/80, Castle/120, Cave/80 ko two independent copies me sort karo: title ascending and XP descending. XP ties ko title ascending se break karo. Exact output:\nBy title: [Castle, Cave, Forest]\nBy XP: [Castle, Cave, Forest]",
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    Quest(String title, int xp) { this.title = title; this.xp = xp; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    public String toString() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> source = List.of(\n            new Quest("Forest", 80),\n            new Quest("Castle", 120),\n            new Quest("Cave", 80)\n        );\n\n        List<Quest> byTitle = new ArrayList<>(source);\n        List<Quest> byXp = new ArrayList<>(source);\n\n        // Build reusable comparators.\n        // XP: descending, then title ascending.\n\n        System.out.println("By title: " + byTitle);\n        System.out.println("By XP: " + byXp);\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    Quest(String title, int xp) { this.title = title; this.xp = xp; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    public String toString() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> source = List.of(\n            new Quest("Forest", 80),\n            new Quest("Castle", 120),\n            new Quest("Cave", 80)\n        );\n\n        List<Quest> byTitle = new ArrayList<>(source);\n        List<Quest> byXp = new ArrayList<>(source);\n\n        Comparator<Quest> titleOrder = Comparator.comparing(Quest::getTitle);\n        Comparator<Quest> xpOrder = Comparator.comparingInt(Quest::getXp)\n            .reversed()\n            .thenComparing(Quest::getTitle);\n\n        byTitle.sort(titleOrder);\n        byXp.sort(xpOrder);\n\n        System.out.println("By title: " + byTitle);\n        System.out.println("By XP: " + byXp);\n    }\n}',
    tests: tests("By title: [Castle, Cave, Forest]\nBy XP: [Castle, Cave, Forest]"),
  },
  {
    slug: "comparable-comparator-stable-comparison-thinking",
    title: "Stable Comparison Thinking",
    description:
      "Equal primary keys ke case me decide karo: original relative order preserve karna hai ya explicit tie-breaker domain requirement hai?",
    problem:
      "XP-only comparator do quests ko comparison-equal maan sakta hai. Output deterministic business order maangta ho to primary comparison alone incomplete ho sakta hai.",
    why:
      "Real sorting design 'kis field se sort?' se aage jaata hai. Learner ko ties, stable sorting aur deterministic tie-break rules reason karne hain.",
    model:
      "primary: XP descending\nA 100, B 100 → tie\n\nOption 1: stable sort → prior relative order preserved\nOption 2: thenComparing(title) → explicit deterministic secondary rule",
    syntax:
      "Comparator<Quest> order = Comparator\n    .comparingInt(Quest::getXp)\n    .reversed()\n    .thenComparing(Quest::getTitle);",
    remember:
      "Tie ka meaning requirement se decide hota hai. Stable sort existing relative order preserve kar sakta hai; explicit secondary comparator business rule encode karta hai.",
    example:
      "100 Forest, 100 Cave\nXP-only stable sort may preserve Forest before Cave from input.\nXP then title explicitly produces Cave before Forest.",
    trace:
      "compare primary → nonzero? use it → zero? evaluate secondary comparator → final ordering signal",
    mistake:
      "Tie behavior ko accidental implementation detail par chhod dena jab output/business rule deterministic secondary order demand karta hai.",
    fix:
      "`thenComparing` se tie-breaker explicitly encode karo when requirement has one.",
    predict: ["Comparator chaining me secondary rule add karne ka method?", "thenComparing"],
    predict2: ["Primary values equal hone par secondary rule useful ho sakta hai? yes/no", "yes"],
    prompt:
      "Players Aman/100, Riya/150, Kabir/100 ko score descending, then name ascending sort karo. Exact output:\nRiya 150\nAman 100\nKabir 100",
    starter:
      'import java.util.*;\n\nclass Player {\n    private final String name;\n    private final int score;\n    Player(String name, int score) { this.name = name; this.score = score; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Player> players = new ArrayList<>(List.of(\n            new Player("Aman", 100),\n            new Player("Riya", 150),\n            new Player("Kabir", 100)\n        ));\n\n        // Sort score descending, then name ascending.\n        for (Player p : players) {\n            System.out.println(p.getName() + " " + p.getScore());\n        }\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Player {\n    private final String name;\n    private final int score;\n    Player(String name, int score) { this.name = name; this.score = score; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Player> players = new ArrayList<>(List.of(\n            new Player("Aman", 100),\n            new Player("Riya", 150),\n            new Player("Kabir", 100)\n        ));\n\n        Comparator<Player> leaderboard = Comparator\n            .comparingInt(Player::getScore)\n            .reversed()\n            .thenComparing(Player::getName);\n        players.sort(leaderboard);\n\n        for (Player p : players) {\n            System.out.println(p.getName() + " " + p.getScore());\n        }\n    }\n}',
    tests: tests("Riya 150\nAman 100\nKabir 100"),
  },
  {
    slug: "comparable-comparator-sorting-recap",
    title: "🏆 Quest Ranking Board",
    description:
      "Comparable natural order, multiple Comparators, tie-breakers aur copy-based sorting ko ek independent ranking system me combine karo.",
    problem:
      "Quest system ko canonical ID order ke saath user-facing XP leaderboard aur title browser bhi chahiye—without changing source collection between reports.",
    why:
      "Module proof sorting syntax nahi; learner ko decide karna hai kaunsa order intrinsic hai, kaunsa contextual hai, aur ties ko deterministic kaise banana hai.",
    model:
      "Quest implements Comparable<Quest> → ID ascending\n\nsource List<Quest>\n ├─ copy + natural order → canonical\n ├─ copy + XP desc/title asc → leaderboard\n └─ copy + title asc → browser",
    syntax:
      "Collections.sort(naturalCopy);\nleaderboard.sort(byXpThenTitle);\nbrowser.sort(byTitle);",
    remember:
      "Natural order ko stable domain meaning do. Alternate views Comparators se express karo; independent views ke liye copies sort karo.",
    example:
      "IDs define canonical storage/report order; XP defines leaderboard; title defines browsing order.",
    trace:
      "create source → make three mutable copies → apply three policies → read first elements/report → source remains unchanged",
    mistake:
      "Natural order ko screen-specific requirement banana, unsafe subtraction use karna, ya same list repeatedly mutate karke views mix karna.",
    fix:
      "Ordering policies name karo, safe comparison helpers use karo, tie-breaker specify karo, copies independently sort karo.",
    predict: ["Natural ordering interface?", "Comparable"],
    predict2: ["Context-specific alternate ordering interface?", "Comparator"],
    prompt:
      "Quest Ranking Board complete karo. Quest natural order = id ascending. Data: (330,Cave,80), (101,Forest,80), (205,Castle,120), (404,Arena,120). Three independent sorted copies banao: natural ID ascending; leaderboard XP descending then title ascending; browser title ascending. Exact output:\nNatural: [101-Forest, 205-Castle, 330-Cave, 404-Arena]\nLeaderboard: [404-Arena, 205-Castle, 330-Cave, 101-Forest]\nBrowser: [404-Arena, 205-Castle, 330-Cave, 101-Forest]\nSource first: 330-Cave",
    starter:
      'import java.util.*;\n\nclass Quest implements Comparable<Quest> {\n    private final int id;\n    private final String title;\n    private final int xp;\n\n    Quest(int id, String title, int xp) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n\n    @Override\n    public int compareTo(Quest other) {\n        // Natural order: id ascending.\n        return 0;\n    }\n\n    @Override\n    public String toString() {\n        return id + "-" + title;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> source = List.of(\n            new Quest(330, "Cave", 80),\n            new Quest(101, "Forest", 80),\n            new Quest(205, "Castle", 120),\n            new Quest(404, "Arena", 120)\n        );\n\n        // Create three mutable copies.\n        // Sort natural, leaderboard (XP desc then title asc), and browser (title asc).\n        // Keep source unchanged and print the exact report.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest implements Comparable<Quest> {\n    private final int id;\n    private final String title;\n    private final int xp;\n\n    Quest(int id, String title, int xp) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n\n    @Override\n    public int compareTo(Quest other) {\n        return Integer.compare(this.id, other.id);\n    }\n\n    @Override\n    public String toString() {\n        return id + "-" + title;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> source = List.of(\n            new Quest(330, "Cave", 80),\n            new Quest(101, "Forest", 80),\n            new Quest(205, "Castle", 120),\n            new Quest(404, "Arena", 120)\n        );\n\n        List<Quest> natural = new ArrayList<>(source);\n        List<Quest> leaderboard = new ArrayList<>(source);\n        List<Quest> browser = new ArrayList<>(source);\n\n        Collections.sort(natural);\n        leaderboard.sort(\n            Comparator.comparingInt(Quest::getXp)\n                .reversed()\n                .thenComparing(Quest::getTitle)\n        );\n        browser.sort(Comparator.comparing(Quest::getTitle));\n\n        System.out.println("Natural: " + natural);\n        System.out.println("Leaderboard: " + leaderboard);\n        System.out.println("Browser: " + browser);\n        System.out.println("Source first: " + source.get(0));\n    }\n}',
    tests: tests(
      "Natural: [101-Forest, 205-Castle, 330-Cave, 404-Arena]\nLeaderboard: [404-Arena, 205-Castle, 330-Cave, 101-Forest]\nBrowser: [404-Arena, 205-Castle, 330-Cave, 101-Forest]\nSource first: 330-Cave",
    ),
    minutes: 35,
  },
];

export const comparableComparatorModule = specModule(
  {
    slug: "comparable-comparator",
    title: "Module 38 — Comparable & Comparator",
    description:
      "Objects ke natural aur contextual ordering contracts design karo—safe comparisons, reusable policies aur deterministic tie-breakers ke saath.",
    position: 38,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
