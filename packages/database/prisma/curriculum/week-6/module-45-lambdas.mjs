import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "lambdas-why-lambdas",
    title: "Why Lambdas",
    description:
      "Behaviour ko data ki tarah pass karne ki need samjho aur verbose one-method implementations ko concise lambda expressions se replace karo.",
    problem:
      "Agar sorting/filtering jaise operation ko caller-specific rule chahiye, har rule ke liye separate class banana unnecessary ceremony create kar sakta hai.",
    why:
      "Week 4 interfaces ne behaviour contracts diye. Lambdas next responsibility unlock karti hain: compatible behaviour ko inline value ki tarah provide karna.",
    model:
      "functional interface contract\n        +\n      lambda body\n        ↓\nbehaviour value\n\nPredicate<Integer> even = n -> n % 2 == 0;",
    syntax:
      "Predicate<Integer> even = n -> n % 2 == 0;",
    remember:
      "Lambda standalone method declaration nahi hai. Usse target functional-interface type/context chahiye.",
    example:
      "Predicate<Integer> highXp = xp -> xp >= 100;\nSystem.out.println(highXp.test(120));",
    trace:
      "lambda assigned to Predicate<Integer> → `test(120)` invokes lambda body → 120 >= 100 → true",
    mistake:
      "Lambda ko bina target type ke independent named method samajhna.",
    fix:
      "Pehle behaviour contract identify karo, then compatible lambda provide karo.",
    predict: ["Lambda arrow operator?", "->"],
    predict2: ["Lambda ko compatible target type/context chahiye? yes/no", "yes"],
    prompt:
      "Two behaviours banao: `twice` integer double kare aur `even` even check kare. Exact output:\n8\ntrue",
    starter:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Function<Integer,Integer> twice and Predicate<Integer> even.\n    }\n}',
    solution:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Function<Integer, Integer> twice = x -> x * 2;\n        Predicate<Integer> even = x -> x % 2 == 0;\n        System.out.println(twice.apply(4));\n        System.out.println(even.test(8));\n    }\n}',
    tests: tests("8\ntrue"),
  },
  {
    slug: "lambdas-functional-interface",
    title: "Functional Interface",
    description:
      "Single abstract method contract ko lambda target ke roop me model karo and interface method signature se lambda shape derive karo.",
    problem:
      "Lambda body ka parameter count aur return expectation arbitrary nahi. Target interface ka abstract method contract decide karta hai.",
    why:
      "Ye interfaces se direct bridge hai: lambda interface ko remove nahi karti; interface contract ka concise implementation provide karti hai.",
    model:
      "@FunctionalInterface\ninterface Scorer {\n    int score(int xp);\n}\n\nScorer bonus = xp -> xp + 20;\n\n`score(int)` determines one parameter + int result.",
    syntax:
      "@FunctionalInterface\ninterface Scorer {\n    int score(int xp);\n}",
    remember:
      "Functional interface me exactly one abstract method hota hai. `@FunctionalInterface` compiler ko intent verify karne deta hai.",
    example:
      "Scorer bonus = xp -> xp + 20;\nSystem.out.println(bonus.score(100));",
    trace:
      "target type Scorer → abstract method score(int):int → lambda needs one compatible input and int-compatible result",
    mistake:
      "Two abstract methods wale interface ko lambda target banana.",
    fix:
      "SAM—single abstract method—contract identify karo; annotation se design intent guard karo.",
    predict: ["Functional interface me abstract methods kitne?", "one"],
    predict2: ["`@FunctionalInterface` compiler verification me help karta hai? yes/no", "yes"],
    prompt:
      "`XpRule` functional interface banao with `int apply(int xp)`. Lambda 25 bonus add kare. Exact output:\nBase: 100\nBoosted: 125",
    starter:
      '@FunctionalInterface\ninterface XpRule {\n    // Declare one abstract method.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create a lambda that adds 25 XP.\n    }\n}',
    solution:
      '@FunctionalInterface\ninterface XpRule {\n    int apply(int xp);\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        XpRule bonus = xp -> xp + 25;\n        int base = 100;\n        System.out.println("Base: " + base);\n        System.out.println("Boosted: " + bonus.apply(base));\n    }\n}',
    tests: tests("Base: 100\nBoosted: 125"),
  },
  {
    slug: "lambdas-lambda-syntax",
    title: "Lambda Syntax",
    description:
      "Parameter list, arrow aur expression/block body ko target method signature se read karo instead of memorizing isolated syntax variants.",
    problem:
      "Parentheses, braces aur `return` kab optional hain? Rules ko examples se memorize karne ke bajaye lambda shape reason karna hai.",
    why:
      "Concise syntax useful tab hai jab learner clearly samjhe compiler kya infer kar raha hai.",
    model:
      "no params:        () -> 42\none param:        x -> x * 2\nmultiple params: (a, b) -> a + b\nblock body:      x -> { int y=x*2; return y; }",
    syntax:
      "x -> x * 2\n(a, b) -> a + b\nx -> { return x * 2; }",
    remember:
      "Single expression value-returning lambda implicit result de sakti hai. Block body me value return required ho to explicit `return` use karo.",
    example:
      "BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;",
    trace:
      "target expects two Integer inputs + Integer result → `(a,b)` parameters → expression evaluated → result returned",
    mistake:
      "Block lambda me required `return` omit karna ya parameter count target interface se mismatch karna.",
    fix:
      "Target abstract method signature first read karo; lambda syntax us contract ko satisfy kare.",
    predict: ["Lambda ke parameter/body separator?", "->"],
    predict2: ["Expression lambda me simple returned expression ke liye explicit `return` always required hai? yes/no", "no"],
    prompt:
      "`BinaryOperator<Integer>` se greater number choose karo and `Supplier<String>` se `Ready` return karo. Exact output:\nMax: 9\nStatus: Ready",
    starter:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create max and status lambdas.\n    }\n}',
    solution:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;\n        Supplier<String> status = () -> "Ready";\n        System.out.println("Max: " + max.apply(4, 9));\n        System.out.println("Status: " + status.get());\n    }\n}',
    tests: tests("Max: 9\nStatus: Ready"),
  },
  {
    slug: "lambdas-parameters-and-return",
    title: "Parameters and Return",
    description:
      "Input/output shape ko functional interface ke generic type parameters se connect karo and transformations ko type-safe behaviour values me express karo.",
    problem:
      "String se integer length produce karna aur integer se label produce karna different function shapes hain. Generic parameters input/output contract encode karte hain.",
    why:
      "Module 37 generics yahan functional APIs me return hoti hain: `Function<T,R>` ka T input aur R result type hai.",
    model:
      "Function<T,R>\n T → lambda → R\n\nFunction<String,Integer>\nString → length → Integer",
    syntax:
      "Function<String, Integer> length = text -> text.length();",
    remember:
      "`Function<T,R>` me first generic type input, second result hai. Lambda parameter/result compatible hone chahiye.",
    example:
      'Function<Integer, String> rank = xp -> xp >= 100 ? "Elite" : "Rookie";',
    trace:
      "`rank.apply(120)` → parameter xp=120 → condition true → String result Elite",
    mistake:
      "`Function<String,Integer>` me String return karna because generic roles reverse samajhna.",
    fix:
      "Contract ko arrow mental model se read karo: `T -> R`.",
    predict: ["`Function<String,Integer>` ka input type?", "String"],
    predict2: ["Uska result type Integer hai? yes/no", "yes"],
    prompt:
      "`Function<String,Integer>` length aur `Function<Integer,String>` rank banao. `JavaQuest`, 120 and 80 use karke exact output:\nLength: 9\n120: Elite\n80: Rookie",
    starter:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build both Function lambdas.\n    }\n}',
    solution:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Function<String, Integer> length = text -> text.length();\n        Function<Integer, String> rank = xp -> xp >= 100 ? "Elite" : "Rookie";\n        System.out.println("Length: " + length.apply("JavaQuest"));\n        System.out.println("120: " + rank.apply(120));\n        System.out.println("80: " + rank.apply(80));\n    }\n}',
    tests: tests("Length: 9\n120: Elite\n80: Rookie"),
  },
  {
    slug: "lambdas-block-lambdas",
    title: "Block Lambdas",
    description:
      "Multi-step behaviour ko block lambda me express karo and local intermediate state ko final returned result se separate trace karo.",
    problem:
      "Single expression enough nahi jab behaviour ko validation, intermediate calculation ya multiple statements chahiye.",
    why:
      "Lambda concise hone ka matlab one-liner hona nahi. Complex behaviour ko readable block me rakhna better hai than unreadable nested expression.",
    model:
      "input\n ↓\n{\n  step 1\n  step 2\n  return result;\n}",
    syntax:
      "Function<Integer, Integer> reward = xp -> {\n    int bonus = xp >= 100 ? 20 : 5;\n    return xp + bonus;\n};",
    remember:
      "Block lambda braces use karti hai; value-returning target ke liye every relevant path compatible value return kare.",
    example:
      "Function<Integer,Integer> clamp = x -> {\n    if (x < 0) return 0;\n    if (x > 100) return 100;\n    return x;\n};",
    trace:
      "xp120 → enter block → bonus20 → return140; xp50 → bonus5 → return55",
    mistake:
      "Complex rule ko giant ternary chain me compress karke readability lose karna.",
    fix:
      "Multiple logical steps ho to block lambda use karo and meaningful local names rakho.",
    predict: ["Block lambda braces use karti hai? yes/no", "yes"],
    predict2: ["Value-returning block lambda me explicit return needed ho sakta hai? yes/no", "yes"],
    prompt:
      "Block `Function<Integer,Integer>` reward banao: XP >=100 par +20, otherwise +5. Exact output:\n140\n55",
    starter:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create a block lambda named reward.\n    }\n}',
    solution:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Function<Integer, Integer> reward = xp -> {\n            int bonus = xp >= 100 ? 20 : 5;\n            return xp + bonus;\n        };\n        System.out.println(reward.apply(120));\n        System.out.println(reward.apply(50));\n    }\n}',
    tests: tests("140\n55"),
  },
  {
    slug: "lambdas-built-in-functional-interfaces",
    title: "Built-in Functional Interfaces",
    description:
      "`Predicate`, `Function`, `Consumer` aur `Supplier` ko behaviour shape ke according choose karo instead of inventing custom interfaces for common contracts.",
    problem:
      "Every small behaviour ke liye new interface create karna noisy hai. Java common input/output shapes ke reusable standard interfaces provide karta hai.",
    why:
      "Standard functional interfaces later collection/stream APIs ki vocabulary hain. Learner ko name memorize nahi, behaviour shape classify karna hai.",
    model:
      "Predicate<T> : T → boolean\nFunction<T,R>: T → R\nConsumer<T>  : T → no result\nSupplier<T>  : no input → T",
    syntax:
      "Predicate<Integer> passed = score -> score >= 60;\nConsumer<String> print = text -> System.out.println(text);",
    remember:
      "Interface choose by behaviour shape: question? Predicate. transform? Function. consume side effect? Consumer. produce? Supplier.",
    example:
      "Supplier<String> nextQuest = () -> \"Exceptions\";",
    trace:
      "need boolean from Student → Predicate; need title from Student → Function; need print Student → Consumer",
    mistake:
      "`Function<T,Boolean>` everywhere use karna when Predicate communicates intent better.",
    fix:
      "Input/output semantics ko standard functional-interface vocabulary se match karo.",
    predict: ["`T -> boolean` built-in interface?", "Predicate"],
    predict2: ["No-input value producer interface Supplier hai? yes/no", "yes"],
    prompt:
      "Predicate highXp, Function label, Consumer announce, Supplier defaultQuest banao. Exact output:\nHigh: true\nLabel: XP=120\nQuest: Lambdas\nAnnounce: Ready",
    starter:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create all four standard functional-interface behaviours.\n    }\n}',
    solution:
      'import java.util.function.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Predicate<Integer> highXp = xp -> xp >= 100;\n        Function<Integer, String> label = xp -> "XP=" + xp;\n        Consumer<String> announce = text -> System.out.println("Announce: " + text);\n        Supplier<String> defaultQuest = () -> "Lambdas";\n\n        System.out.println("High: " + highXp.test(120));\n        System.out.println("Label: " + label.apply(120));\n        System.out.println("Quest: " + defaultQuest.get());\n        announce.accept("Ready");\n    }\n}',
    tests: tests("High: true\nLabel: XP=120\nQuest: Lambdas\nAnnounce: Ready"),
  },
  {
    slug: "lambdas-passing-behaviour",
    title: "Passing Behaviour",
    description:
      "Lambda ko method argument ke roop me pass karke algorithm aur variable rule ko separate karo.",
    problem:
      "List filtering algorithm same hai, but kabhi high-XP values chahiye, kabhi even values. Condition hardcode karoge to algorithm duplicate hoga.",
    why:
      "Yahi lambdas ka major design payoff hai: data aur algorithm stable reh sakte hain while caller behaviour inject karta hai.",
    model:
      "filter(values, rule)\n       ↑\nPredicate<Integer>\n\nalgorithm owns traversal\ncaller owns selection rule",
    syntax:
      "static List<Integer> filter(\n    List<Integer> values,\n    Predicate<Integer> keep\n) { ... }",
    remember:
      "Behaviour pass karne se method ko caller-specific condition hardcode nahi karni padti. Functional interface becomes strategy contract.",
    example:
      "filter(values, x -> x >= 100);\nfilter(values, x -> x % 2 == 0);",
    trace:
      "filter traverses each value → calls `keep.test(value)` → lambda decides true/false → algorithm collects true values",
    mistake:
      "Method me `if (x >= 100)` hardcode karke second filter requirement ke liye method duplicate karna.",
    fix:
      "Stable traversal ko method me rakho; changing decision rule ko Predicate parameter banao.",
    predict: ["Boolean selection behaviour pass karne ke liye suitable interface?", "Predicate"],
    predict2: ["Same filter algorithm different lambdas ke saath reuse ho sakta hai? yes/no", "yes"],
    prompt:
      "Generic-style integer `filter` method banao taking `Predicate<Integer>`. Values `[30,80,120,150]` par >=100 and even rules use karo. Exact output:\nHigh: [120, 150]\nEven: [30, 80, 120, 150]",
    starter:
      'import java.util.*;\nimport java.util.function.*;\n\npublic class Main {\n    static List<Integer> filter(List<Integer> values, Predicate<Integer> keep) {\n        // Traverse and collect values for which keep.test(value) is true.\n        return null;\n    }\n\n    public static void main(String[] args) {\n        List<Integer> values = List.of(30, 80, 120, 150);\n        // Pass two different lambdas to the same algorithm.\n    }\n}',
    solution:
      'import java.util.*;\nimport java.util.function.*;\n\npublic class Main {\n    static List<Integer> filter(List<Integer> values, Predicate<Integer> keep) {\n        List<Integer> result = new ArrayList<>();\n        for (int value : values) {\n            if (keep.test(value)) result.add(value);\n        }\n        return result;\n    }\n\n    public static void main(String[] args) {\n        List<Integer> values = List.of(30, 80, 120, 150);\n        System.out.println("High: " + filter(values, x -> x >= 100));\n        System.out.println("Even: " + filter(values, x -> x % 2 == 0));\n    }\n}',
    tests: tests("High: [120, 150]\nEven: [30, 80, 120, 150]"),
  },
  {
    slug: "lambdas-lambda-recap",
    title: "🏆 Behaviour-Driven Quest Board",
    description:
      "Functional interfaces, lambdas, generics, collections aur Comparator ko combine karke reusable behaviour-driven query/report engine build karo.",
    problem:
      "Quest board ko different selection and presentation rules support karne hain without separate hardcoded methods for every report.",
    why:
      "Module proof concise syntax nahi. Learner ko behaviour abstraction design karni hai: reusable algorithm receives predicates/functions/comparators supplied by caller.",
    model:
      "List<Quest>\n   ↓ select(Predicate<Quest>)\nfiltered quests\n   ↓ sort(Comparator<Quest>)\nordered quests\n   ↓ map(Function<Quest,String>)\nreport labels\n\nAlgorithm stays reusable; behaviour changes.",
    syntax:
      "static <T> List<T> select(List<T> items, Predicate<T> keep) { ... }\nstatic <T,R> List<R> map(List<T> items, Function<T,R> mapper) { ... }",
    remember:
      "Lambda value tab powerful hoti hai jab stable algorithm aur variable behaviour cleanly separate hon. Generic functional contracts reuse ko domain types tak extend karte hain.",
    example:
      "select(quests, q -> q.getXp() >= 100)\nmap(result, q -> q.getTitle() + \"=\" + q.getXp())",
    trace:
      "quest list → predicate filters incomplete/high-XP → comparator orders XP desc/name asc → function converts objects to labels",
    mistake:
      "Har report ke liye duplicate loop, filter condition aur formatting method likhna.",
    fix:
      "Traversal patterns reusable helpers me extract karo; changing decisions/transformations functional parameters se inject karo.",
    predict: ["Selection rule ke liye?", "Predicate"],
    predict2: ["Object ko report String me transform karne ke liye `Function<Quest,String>` suitable hai? yes/no", "yes"],
    prompt:
      'Behaviour-Driven Quest Board complete karo. Quests: Forest/80/done, Castle/150/pending, Cave/120/done, Arena/150/done, River/60/pending. Generic `select(List<T>, Predicate<T>)` and `map(List<T>, Function<T,R>)` helpers banao. Caller lambda se completed quests with XP>=100 select kare, then Comparator lambda/API se XP descending and title ascending sort kare, then Function lambda se `title=xp` labels banao. Also a `Consumer<String>` se each label `Quest: ...` print karo. Exact output:\nSelected: 2\nLabels: [Arena=150, Cave=120]\nQuest: Arena=150\nQuest: Cave=120',
    starter:
      'import java.util.*;\nimport java.util.function.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    private final boolean completed;\n\n    Quest(String title, int xp, boolean completed) {\n        this.title = title;\n        this.xp = xp;\n        this.completed = completed;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    boolean isCompleted() { return completed; }\n}\n\npublic class Main {\n    static <T> List<T> select(List<T> items, Predicate<T> keep) {\n        // Return matching items.\n        return null;\n    }\n\n    static <T, R> List<R> map(List<T> items, Function<T, R> mapper) {\n        // Transform every item.\n        return null;\n    }\n\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>(List.of(\n            new Quest("Forest", 80, true),\n            new Quest("Castle", 150, false),\n            new Quest("Cave", 120, true),\n            new Quest("Arena", 150, true),\n            new Quest("River", 60, false)\n        ));\n\n        // Select completed quests with XP >= 100.\n        // Sort XP descending, then title ascending.\n        // Map to title=xp labels and announce each with Consumer<String>.\n    }\n}',
    solution:
      'import java.util.*;\nimport java.util.function.*;\n\nclass Quest {\n    private final String title;\n    private final int xp;\n    private final boolean completed;\n\n    Quest(String title, int xp, boolean completed) {\n        this.title = title;\n        this.xp = xp;\n        this.completed = completed;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n    boolean isCompleted() { return completed; }\n}\n\npublic class Main {\n    static <T> List<T> select(List<T> items, Predicate<T> keep) {\n        List<T> result = new ArrayList<>();\n        for (T item : items) {\n            if (keep.test(item)) result.add(item);\n        }\n        return result;\n    }\n\n    static <T, R> List<R> map(List<T> items, Function<T, R> mapper) {\n        List<R> result = new ArrayList<>();\n        for (T item : items) {\n            result.add(mapper.apply(item));\n        }\n        return result;\n    }\n\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>(List.of(\n            new Quest("Forest", 80, true),\n            new Quest("Castle", 150, false),\n            new Quest("Cave", 120, true),\n            new Quest("Arena", 150, true),\n            new Quest("River", 60, false)\n        ));\n\n        List<Quest> selected = select(\n            quests,\n            q -> q.isCompleted() && q.getXp() >= 100\n        );\n        selected.sort(\n            Comparator.comparingInt(Quest::getXp)\n                .reversed()\n                .thenComparing(Quest::getTitle)\n        );\n\n        List<String> labels = map(\n            selected,\n            q -> q.getTitle() + "=" + q.getXp()\n        );\n        Consumer<String> announce = label -> System.out.println("Quest: " + label);\n\n        System.out.println("Selected: " + selected.size());\n        System.out.println("Labels: " + labels);\n        for (String label : labels) announce.accept(label);\n    }\n}',
    tests: tests(
      "Selected: 2\nLabels: [Arena=150, Cave=120]\nQuest: Arena=150\nQuest: Cave=120",
    ),
    minutes: 40,
  },
];

export const lambdasModule = specModule(
  {
    slug: "lambdas",
    title: "Module 45 — Lambdas",
    description:
      "Functional-interface contracts ke through behaviour ko type-safe values ki tarah represent, pass aur reuse karo.",
    position: 45,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
