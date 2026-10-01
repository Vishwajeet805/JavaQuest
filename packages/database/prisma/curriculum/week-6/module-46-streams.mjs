import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "streams-stream-mental-model",
    title: "Stream Mental Model",
    description:
      "Stream ko collection replacement nahi, source data par declarative processing pipeline ki tarah model karo.",
    problem:
      "Loop me traversal, condition, transformation aur result-building sab ek jagah mix ho sakte hain. Stream pipeline in responsibilities ko named stages me express karti hai.",
    why:
      "Module 45 me behaviour lambdas ke through values bana. Streams un behaviours ko data-processing pipeline me compose karte hain.",
    model:
      "source collection\n      ↓ stream()\nfilter(predicate)\n      ↓\nmap(function)\n      ↓\nterminal operation\n      ↓\nresult\n\nStream stores data nahi; source ko process karta hai.",
    syntax:
      "list.stream()\n    .filter(x -> x >= 100)\n    .map(x -> x * 2)\n    .toList();",
    remember:
      "Stream pipeline source collection ko automatically mutate nahi karti. Intermediate operations pipeline describe karti hain; terminal operation processing trigger karta hai.",
    example:
      "List.of(30, 120, 80, 150).stream()\n    .filter(x -> x >= 100)\n    .toList();",
    trace:
      "[30,120,80,150] → filter >=100 → [120,150] → toList → result",
    mistake:
      "Stream ko reusable container ya source collection ka modified version assume karna.",
    fix:
      "Source, pipeline aur terminal result ko three separate roles ki tarah trace karo.",
    predict: ["Matching elements retain karne wala operation?", "filter"],
    predict2: ["Stream pipeline source List ko automatically modify karti hai? yes/no", "no"],
    prompt:
      "Values `[30,120,80,150]` se stream pipeline use karke XP >=100 select karo. Source aur result dono print karo. Exact output:\nSource: [30, 120, 80, 150]\nHigh: [120, 150]",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> source = List.of(30, 120, 80, 150);\n        // Build a stream result without changing source.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> source = List.of(30, 120, 80, 150);\n        List<Integer> high = source.stream()\n            .filter(x -> x >= 100)\n            .toList();\n        System.out.println("Source: " + source);\n        System.out.println("High: " + high);\n    }\n}',
    tests: tests("Source: [30, 120, 80, 150]\nHigh: [120, 150]"),
  },
  {
    slug: "streams-create-stream",
    title: "Create Stream",
    description:
      "Collection source se stream view create karo aur stream lifecycle ko source lifecycle se distinguish karo.",
    problem:
      "Learner ko clear hona chahiye ki `list.stream()` List ko Stream me permanently convert nahi karta; ek processing pipeline source se start hoti hai.",
    why:
      "Correct source mental model later one-use stream behavior aur terminal operations ko easier banata hai.",
    model:
      "List<T> source\n   │\n   └── stream() → Stream<T> pipeline\n\nsource still exists independently",
    syntax:
      "Stream<String> stream = names.stream();",
    remember:
      "Stream generally single-use pipeline hai. Terminal operation ke baad same Stream instance ko reuse nahi karna chahiye; fresh processing ke liye source se new stream banao.",
    example:
      "long count = List.of(\"Java\", \"OOP\").stream().count();",
    trace:
      "List exists → stream() creates pipeline → terminal count consumes pipeline → List remains available",
    mistake:
      "Ek Stream variable par terminal operation ke baad second terminal operation run karna.",
    fix:
      "Reusable data source collection rakho; each independent pipeline ke liye fresh `stream()` call karo.",
    predict: ["Collection se sequential stream start karne ka common method?", "stream"],
    predict2: ["Consumed Stream instance ko freely reuse karna safe hai? yes/no", "no"],
    prompt:
      "Names `[Java, OOP, Streams]` source se two independent fresh streams use karo: count and first item. Exact output:\nCount: 3\nFirst: Java",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> names = List.of("Java", "OOP", "Streams");\n        // Use separate stream() calls for count and first element.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> names = List.of("Java", "OOP", "Streams");\n        long count = names.stream().count();\n        String first = names.stream().findFirst().orElse("None");\n        System.out.println("Count: " + count);\n        System.out.println("First: " + first);\n    }\n}',
    tests: tests("Count: 3\nFirst: Java"),
  },
  {
    slug: "streams-filter",
    title: "`filter`",
    description:
      "`Predicate<T>` ko stream selection stage me apply karo aur filtering ko source-order-preserving selection ki tarah trace karo.",
    problem:
      "Quest list me sirf completed/high-XP items chahiye. Manual loop possible hai, but stream me selection rule directly `filter` stage ban sakta hai.",
    why:
      "Module 45 ka Predicate ab real pipeline operator ka input banta hai—behaviour passing ka payoff visible hota hai.",
    model:
      "Stream<T>\n   ↓ filter(Predicate<T>)\nStream<T>\n\nsame element type; fewer/equal elements",
    syntax:
      ".filter(q -> q.isCompleted())",
    remember:
      "`filter` element ko transform nahi karta; predicate true ho to same element pass hota hai, false ho to drop.",
    example:
      "values.stream().filter(x -> x % 2 == 0)",
    trace:
      "30→predicate true→keep; 55→false→drop; 80→true→keep",
    mistake:
      "`filter` se value change/convert expect karna.",
    fix:
      "Selection = filter; transformation = map.",
    predict: ["`filter` ko kis built-in functional shape ki need hoti hai?", "Predicate"],
    predict2: ["Filter retained element ka type normally same rakhta hai? yes/no", "yes"],
    prompt:
      "XP values `[30,55,80,120,150]` me even and >=80 values filter karo. Exact output:\n[80, 120, 150]",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> xp = List.of(30, 55, 80, 120, 150);\n        // Filter values that are even and at least 80.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> xp = List.of(30, 55, 80, 120, 150);\n        List<Integer> result = xp.stream()\n            .filter(x -> x % 2 == 0 && x >= 80)\n            .toList();\n        System.out.println(result);\n    }\n}',
    tests: tests("[80, 120, 150]"),
  },
  {
    slug: "streams-map",
    title: "`map`",
    description:
      "`Function<T,R>` se each stream element transform karo, including element type changes.",
    problem:
      "Quest objects ko report labels me convert karna hai. Selection ke baad manually second loop banana unnecessary ho sakta hai.",
    why:
      "Module 45 ka `Function<T,R>` stream transformation stage ban jata hai. Pipeline ab select + transform compose kar sakti hai.",
    model:
      "Stream<T>\n   ↓ map(Function<T,R>)\nStream<R>\n\nQuest → String\nInteger → Integer\nString → Integer",
    syntax:
      ".map(q -> q.getTitle() + \"=\" + q.getXp())",
    remember:
      "`map` one input element ko one output element me transform karta hai; output type input type se different ho sakta hai.",
    example:
      "List.of(\"Java\", \"Streams\").stream()\n    .map(String::length)\n    .toList();",
    trace:
      "Java → length → 4; Streams → length → 7",
    mistake:
      "`map` ko Map collection (`java.util.Map`) ke saath confuse karna.",
    fix:
      "Stream `map` = transformation operation; `Map<K,V>` = key/value collection.",
    predict: ["Stream element transform karne wala operation?", "map"],
    predict2: ["`map` output element type change kar sakta hai? yes/no", "yes"],
    prompt:
      "Words `[java, oop, streams]` ko uppercase labels with length me transform karo: `JAVA=4` style. Exact output:\n[JAVA=4, OOP=3, STREAMS=7]",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> words = List.of("java", "oop", "streams");\n        // Transform each word to UPPERCASE=length.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> words = List.of("java", "oop", "streams");\n        List<String> labels = words.stream()\n            .map(word -> word.toUpperCase() + "=" + word.length())\n            .toList();\n        System.out.println(labels);\n    }\n}',
    tests: tests("[JAVA=4, OOP=3, STREAMS=7]"),
  },
  {
    slug: "streams-terminal-operations",
    title: "Terminal Operations",
    description:
      "Intermediate pipeline description aur terminal execution/result ko distinguish karo; lazy evaluation ko observable behaviour se trace karo.",
    problem:
      "`filter`/`map` line likhne se processing kab actually hoti hai? Without terminal operation, intermediate stages generally execution trigger nahi karti.",
    why:
      "Streams ko loops ki hidden syntax samajhne ke bajaye execution model understand karna essential hai.",
    model:
      "source\n ↓\nfilter ─┐\nmap    ─┼─ intermediate: pipeline description, lazy\n       ↓\ncount / toList / forEach / findFirst\n       terminal: consumes stream, triggers processing",
    syntax:
      "long count = values.stream()\n    .filter(x -> x > 0)\n    .count();",
    remember:
      "Intermediate operations usually lazy hain. Terminal operation stream consume karta hai and processing trigger karta hai.",
    example:
      "stream.filter(...).map(...).count();",
    trace:
      "pipeline assembled → no terminal yet → terminal requested → source elements flow through stages as needed → terminal result produced",
    mistake:
      "Intermediate call ko immediate full collection transformation assume karna.",
    fix:
      "Pipeline construction aur pipeline execution ko separate phases ki tarah reason karo.",
    predict: ["`count()` intermediate ya terminal?", "terminal"],
    predict2: ["Intermediate operations generally lazy hoti hain? yes/no", "yes"],
    prompt:
      "Pipeline side effect se laziness demonstrate karo: stream map stage `Seen X` print kare, then `findFirst()` terminal call karo. Source `[10,20,30]`. Exact output:\nBefore terminal\nSeen 10\nFirst: 20",
    starter:
      'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Stream<Integer> pipeline = List.of(10, 20, 30).stream()\n            .map(x -> {\n                // Print Seen x, then double x.\n                return x;\n            });\n\n        System.out.println("Before terminal");\n        // Trigger only what findFirst needs.\n    }\n}',
    solution:
      'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Stream<Integer> pipeline = List.of(10, 20, 30).stream()\n            .map(x -> {\n                System.out.println("Seen " + x);\n                return x * 2;\n            });\n\n        System.out.println("Before terminal");\n        int first = pipeline.findFirst().orElse(-1);\n        System.out.println("First: " + first);\n    }\n}',
    tests: tests("Before terminal\nSeen 10\nFirst: 20"),
  },
  {
    slug: "streams-tolist-and-foreach",
    title: "`toList` and `forEach`",
    description:
      "Result materialization (`toList`) aur side-effect consumption (`forEach`) ko different terminal intents ki tarah choose karo.",
    problem:
      "Kab result future processing ke liye List chahiye, aur kab sirf each element par action perform karna hai? Same terminal operation har use case fit nahi karta.",
    why:
      "Terminal choice pipeline ka outcome contract define karta hai. Learner ko result vs side-effect distinction clear chahiye.",
    model:
      "stream → toList()  → List result\nstream → forEach(...) → side effects, no collected result",
    syntax:
      "List<String> names = stream.toList();\nstream.forEach(System.out::println);",
    remember:
      "`toList()` materialized List result deta hai. `forEach` each element consume karta hai; reporting/printing jaisi side effects ke liye useful hai.",
    example:
      "List<Integer> doubled = values.stream().map(x -> x * 2).toList();",
    trace:
      "pipeline A → toList → reusable result List; fresh pipeline B → forEach → action per element",
    mistake:
      "Same consumed stream par `toList()` ke baad `forEach()` call karna.",
    fix:
      "Independent terminal operations ke liye fresh stream banao, ya materialized List par normal iteration karo.",
    predict: ["Stream ko List result me materialize karne ka terminal?", "toList"],
    predict2: ["`forEach` primarily side-effect consumption ke liye use ho sakta hai? yes/no", "yes"],
    prompt:
      "Words `[java, stream]` ko uppercase List me collect karo, print list, then collected List ke `forEach` se `Item: ...` print karo. Exact output:\n[JAVA, STREAM]\nItem: JAVA\nItem: STREAM",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> words = List.of("java", "stream");\n        // Materialize uppercase result, then consume the List.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> words = List.of("java", "stream");\n        List<String> upper = words.stream()\n            .map(String::toUpperCase)\n            .toList();\n        System.out.println(upper);\n        upper.forEach(item -> System.out.println("Item: " + item));\n    }\n}',
    tests: tests("[JAVA, STREAM]\nItem: JAVA\nItem: STREAM"),
  },
  {
    slug: "streams-reduce-count-intro",
    title: "Reduce/Count Intro",
    description:
      "Stream ko single summary value me collapse karne ke do patterns compare karo: counting aur associative reduction.",
    problem:
      "Filtered elements kitne hain aur total XP kitna hai—dono summary questions hain, but terminal operations different intent express karte hain.",
    why:
      "Streams sirf Lists produce nahi karte. Analytics-style pipelines often scalar result produce karte hain.",
    model:
      "stream → count() → long quantity\n\nstream → reduce(identity, accumulator) → one combined value\n\n[50,80,120] → reduce sum → 250",
    syntax:
      "long count = values.stream().filter(...).count();\nint total = values.stream().reduce(0, (sum, x) -> sum + x);",
    remember:
      "`count` cardinality summarize karta hai. `reduce` elements ko repeatedly combine karke one result banata hai; accumulator operation ko carefully choose karo.",
    example:
      "int total = List.of(50, 80, 120).stream()\n    .reduce(0, Integer::sum);",
    trace:
      "identity0 → +50=50 → +80=130 → +120=250",
    mistake:
      "Every summary ko `toList()` first karke then second pass se calculate karna.",
    fix:
      "Question ka result shape identify karo: count, reduction, search, collection, etc.",
    predict: ["Elements ki quantity return karne wala terminal?", "count"],
    predict2: ["`reduce` many elements ko one result me combine kar sakta hai? yes/no", "yes"],
    prompt:
      "XP `[50,80,120,150]` me >=100 count aur all XP sum stream terminals se calculate karo. Exact output:\nHigh count: 2\nTotal XP: 400",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> xp = List.of(50, 80, 120, 150);\n        // Use count and reduce on fresh streams.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> xp = List.of(50, 80, 120, 150);\n        long highCount = xp.stream()\n            .filter(x -> x >= 100)\n            .count();\n        int total = xp.stream()\n            .reduce(0, Integer::sum);\n        System.out.println("High count: " + highCount);\n        System.out.println("Total XP: " + total);\n    }\n}',
    tests: tests("High count: 2\nTotal XP: 400"),
  },
  {
    slug: "streams-streams-recap",
    title: "🏆 Quest Analytics Pipeline",
    description:
      "Collections, lambdas, Comparator aur stream stages ko combine karke declarative analytics pipeline design karo without mutating source data.",
    problem:
      "Quest dashboard ko completed high-value quests ka ordered report, total XP aur count chahiye. Manual loops duplicate traversal/state management kar sakte hain.",
    why:
      "Module proof chained syntax nahi. Learner ko source → selection → transformation/order → terminal result ka pipeline intentionally design karna hai.",
    model:
      "List<Quest> source\n   ↓ stream\nfilter completed && xp>=80\n   ↓ sorted XP desc/title asc\nmap title=xp\n   ↓ toList\nreport\n\nseparate fresh stream → filter → map XP → reduce total\nseparate fresh stream → filter → count",
    syntax:
      "quests.stream()\n    .filter(q -> ...)\n    .sorted(comparator)\n    .map(q -> ...)\n    .toList();",
    remember:
      "Stream pipeline readable tab hoti hai jab each stage ka one clear job ho. Source unchanged rakho, consumed streams reuse mat karo, deterministic reports ke liye explicit ordering do.",
    example:
      "filter selects → sorted orders → map shapes output → terminal materializes/summarizes",
    trace:
      "5 source quests → 3 qualify → sort by XP/title → labels produced; fresh qualifying pipeline computes total/count",
    mistake:
      "One stream ko multiple terminals ke liye reuse karna, hidden source mutation expect karna, ya unordered source ko deterministic report assume karna.",
    fix:
      "Source collection reusable rakho; each independent result ke liye fresh pipeline; explicit Comparator when order matters.",
    predict: ["Stream ordering operation?", "sorted"],
    predict2: ["Independent total and report results ke liye source se fresh streams banana safe approach hai? yes/no", "yes"],
    prompt:
      'Quest Analytics Pipeline complete karo. Quests: Forest/80/done, Castle/150/pending, Cave/120/done, Arena/150/done, River/60/done. Completed quests with XP>=80 qualify. Report XP descending then title ascending, labels `title=xp`. Separate fresh pipelines se qualifying count aur total XP calculate karo. Source size unchanged prove karo. Exact output:\nReport: [Arena=150, Cave=120, Forest=80]\nQualified: 3\nTotal XP: 350\nSource size: 5',
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    private final boolean completed;\n\n    Quest(String title, int xp, boolean completed) {\n        this.title = title;\n        this.xp = xp;\n        this.completed = completed;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    boolean isCompleted() { return completed; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest("Forest", 80, true),\n            new Quest("Castle", 150, false),\n            new Quest("Cave", 120, true),\n            new Quest("Arena", 150, true),\n            new Quest("River", 60, true)\n        );\n\n        // Build report, count and total with independent stream pipelines.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    private final boolean completed;\n\n    Quest(String title, int xp, boolean completed) {\n        this.title = title;\n        this.xp = xp;\n        this.completed = completed;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    boolean isCompleted() { return completed; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest("Forest", 80, true),\n            new Quest("Castle", 150, false),\n            new Quest("Cave", 120, true),\n            new Quest("Arena", 150, true),\n            new Quest("River", 60, true)\n        );\n\n        List<String> report = quests.stream()\n            .filter(q -> q.isCompleted() && q.getXp() >= 80)\n            .sorted(\n                Comparator.comparingInt(Quest::getXp)\n                    .reversed()\n                    .thenComparing(Quest::getTitle)\n            )\n            .map(q -> q.getTitle() + "=" + q.getXp())\n            .toList();\n\n        long qualified = quests.stream()\n            .filter(q -> q.isCompleted() && q.getXp() >= 80)\n            .count();\n\n        int totalXp = quests.stream()\n            .filter(q -> q.isCompleted() && q.getXp() >= 80)\n            .map(Quest::getXp)\n            .reduce(0, Integer::sum);\n\n        System.out.println("Report: " + report);\n        System.out.println("Qualified: " + qualified);\n        System.out.println("Total XP: " + totalXp);\n        System.out.println("Source size: " + quests.size());\n    }\n}',
    tests: tests(
      "Report: [Arena=150, Cave=120, Forest=80]\nQualified: 3\nTotal XP: 350\nSource size: 5",
    ),
    minutes: 40,
  },
];

export const streamsModule = specModule(
  {
    slug: "streams",
    title: "Module 46 — Streams",
    description:
      "Collections ko declarative, lambda-driven pipelines me select, transform, order, materialize aur summarize karo—source state ko mutate kiye bina.",
    position: 46,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
