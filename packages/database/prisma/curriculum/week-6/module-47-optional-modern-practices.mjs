import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "optional-modern-practices-why-optional",
    title: "Why Optional",
    description:
      "Possible absence ko hidden `null` convention ke bajaye explicit return contract ke roop me model karo.",
    problem:
      "Search method `Quest` return karti hai, but match na mile to kya? `null` return ho sakta hai, lekin caller easily null-check bhool sakta hai.",
    why:
      "Module 46 me `findFirst()` ne Optional naturally introduce kiya. Ab learner samjhega ki Optional absence ko API contract me visible kaise banata hai.",
    model:
      "Optional<T>\n ├─ present → contains T\n └─ empty   → no T\n\nfindQuest(id): Optional<Quest>\nCaller must deal with possible absence explicitly.",
    syntax:
      'Optional<String> name = Optional.of("Aman");\nOptional<String> missing = Optional.empty();',
    remember:
      "Optional `null` ko magically eliminate nahi karta. Ye especially return values me possible absence ko explicit model banata hai.",
    example:
      'Optional<String> result = Optional.empty();\nSystem.out.println(result.orElse("Not found"));',
    trace:
      "search → no match → Optional.empty → caller chooses fallback/branch/transformation",
    mistake:
      "Optional ke andar `null` rakhne ki koshish ya har field/parameter ko automatically Optional bana dena.",
    fix:
      "Optional ko deliberate API boundary par use karo—commonly when a method may legitimately return no result.",
    predict: ["Value absent represent karne wala Optional factory?", "empty"],
    predict2: ["Optional especially return-value absence communicate karne ke liye useful ho sakta hai? yes/no", "yes"],
    prompt:
      "Method `findTitle(int id)` id 205 par `Castle`, otherwise empty Optional return kare. IDs 205 and 999 ko fallback ke saath print karo. Exact output:\n205: Castle\n999: Not found",
    starter:
      'import java.util.*;\n\npublic class Main {\n    static Optional<String> findTitle(int id) {\n        // 205 -> Castle, otherwise empty.\n        return null;\n    }\n\n    public static void main(String[] args) {\n        // Print both lookups using a safe fallback.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    static Optional<String> findTitle(int id) {\n        if (id == 205) return Optional.of("Castle");\n        return Optional.empty();\n    }\n\n    public static void main(String[] args) {\n        System.out.println("205: " + findTitle(205).orElse("Not found"));\n        System.out.println("999: " + findTitle(999).orElse("Not found"));\n    }\n}',
    tests: tests("205: Castle\n999: Not found"),
  },
  {
    slug: "optional-modern-practices-of-vs-ofnullable",
    title: "`of` vs `ofNullable`",
    description:
      "`Optional.of` aur `Optional.ofNullable` ko nullability contract ke according choose karo.",
    problem:
      "Existing API se nullable value mil sakti hai. `Optional.of(value)` blindly use karoge to null par `NullPointerException` aayega.",
    why:
      "Factory choice documentation hai: `of` says value must exist; `ofNullable` says incoming reference may be null.",
    model:
      "Optional.of(value)\n  value must be non-null\n\nOptional.ofNullable(value)\n  non-null → present\n  null     → empty",
    syntax:
      'Optional<String> a = Optional.of("Java");\nOptional<String> b = Optional.ofNullable(maybeNull);',
    remember:
      "`of(null)` invalid hai. Nullable source ko wrap karna ho to `ofNullable` use karo.",
    example:
      'String nickname = null;\nOptional<String> safe = Optional.ofNullable(nickname);',
    trace:
      "nullable input null → ofNullable → Optional.empty; non-null Java → Optional[Java]",
    mistake:
      "Unknown-nullability value ko `Optional.of(...)` me wrap karna.",
    fix:
      "Source contract inspect karo: guaranteed non-null → `of`; maybe-null → `ofNullable`.",
    predict: ["Nullable reference ke liye factory?", "ofNullable"],
    predict2: ["`Optional.of(null)` valid empty Optional banata hai? yes/no", "no"],
    prompt:
      'One guaranteed name `"Aman"` ko `of`, nullable nickname `null` ko `ofNullable` se wrap karo. Exact output:\nName present: true\nNickname present: false',
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String name = "Aman";\n        String nickname = null;\n        // Wrap each according to its contract.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String name = "Aman";\n        String nickname = null;\n        Optional<String> safeName = Optional.of(name);\n        Optional<String> safeNickname = Optional.ofNullable(nickname);\n        System.out.println("Name present: " + safeName.isPresent());\n        System.out.println("Nickname present: " + safeNickname.isPresent());\n    }\n}',
    tests: tests("Name present: true\nNickname present: false"),
  },
  {
    slug: "optional-modern-practices-empty",
    title: "`empty`",
    description:
      "No-result outcome ko sentinel values aur fake domain objects ke bajaye `Optional.empty()` se represent karo.",
    problem:
      "Missing quest ko id `-1`, empty String, ya special `Quest(\"NONE\")` se represent karna valid data aur absence ko mix karta hai.",
    why:
      "Explicit absence callers ko guessing se bachata hai and domain model ko fake values se clean rakhta hai.",
    model:
      "found? yes → Optional.of(value)\nfound? no  → Optional.empty()\n\nNo sentinel -1 / \"\" / fake object required.",
    syntax:
      "return Optional.empty();",
    remember:
      "`Optional.empty()` absence ka explicit value hai. Missing case ko valid-domain sentinel se overload mat karo.",
    example:
      "static Optional<Integer> findXp(boolean found) {\n    return found ? Optional.of(120) : Optional.empty();\n}",
    trace:
      "lookup misses → empty Optional → caller sees absence branch instead of ambiguous sentinel",
    mistake:
      "Missing integer ko 0 return karna even when 0 valid domain value ho sakta hai.",
    fix:
      "Absence aur valid values ko separate states banao.",
    predict: ["No contained value ke liye?", "Optional.empty"],
    predict2: ["Sentinel values ambiguity create kar sakte hain? yes/no", "yes"],
    prompt:
      "List `[101,205,330]` me first ID >300 find karne wala method Optional<Integer> return kare; second lookup >500 empty ho. Exact output:\nAbove 300: 330\nAbove 500 present: false",
    starter:
      'import java.util.*;\n\npublic class Main {\n    static Optional<Integer> firstAbove(List<Integer> ids, int limit) {\n        // Return first matching id or Optional.empty().\n        return null;\n    }\n\n    public static void main(String[] args) {\n        List<Integer> ids = List.of(101, 205, 330);\n        // Print both results.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    static Optional<Integer> firstAbove(List<Integer> ids, int limit) {\n        for (int id : ids) {\n            if (id > limit) return Optional.of(id);\n        }\n        return Optional.empty();\n    }\n\n    public static void main(String[] args) {\n        List<Integer> ids = List.of(101, 205, 330);\n        System.out.println("Above 300: " + firstAbove(ids, 300).orElse(-1));\n        System.out.println("Above 500 present: " + firstAbove(ids, 500).isPresent());\n    }\n}',
    tests: tests("Above 300: 330\nAbove 500 present: false"),
  },
  {
    slug: "optional-modern-practices-ispresent-and-ifpresent",
    title: "`isPresent` and `ifPresent`",
    description:
      "Presence inspection aur present-only action compare karo, while avoiding Optional code that merely recreates verbose null checks.",
    problem:
      "Sometimes caller needs explicit branch; sometimes only value present ho to action perform karna hai. Dono cases ka intent different hai.",
    why:
      "`ifPresent(Consumer)` Module 45 lambdas ko Optional context me reuse karta hai and unnecessary extraction reduce karta hai.",
    model:
      "isPresent() → boolean inspection\n\nifPresent(consumer)\npresent → run consumer\nempty   → do nothing",
    syntax:
      'result.ifPresent(value -> System.out.println(value));',
    remember:
      "`isPresent()` valid hai, but every Optional ko `if (isPresent()) get()` pattern me convert karna often abstraction ka benefit lose karta hai. Intent-specific APIs prefer karo.",
    example:
      'Optional.of("Castle").ifPresent(x -> System.out.println("Found: " + x));',
    trace:
      "present Castle → consumer invoked; empty → consumer skipped",
    mistake:
      "`if (opt.isPresent()) { opt.get(); }` ko default Optional style banana.",
    fix:
      "Present-only side effect ke liye `ifPresent`; fallback ke liye `orElse`; transformation ke liye `map` choose karo.",
    predict: ["Present value par Consumer run karne ka method?", "ifPresent"],
    predict2: ["Empty Optional par `ifPresent` consumer run hota hai? yes/no", "no"],
    prompt:
      "Present `Castle` aur empty Optional banao. `ifPresent` se only present value announce karo, then `isPresent` se empty state print karo. Exact output:\nFound: Castle\nMissing present: false",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Optional<String> found = Optional.of("Castle");\n        Optional<String> missing = Optional.empty();\n        // Use ifPresent and isPresent appropriately.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Optional<String> found = Optional.of("Castle");\n        Optional<String> missing = Optional.empty();\n        found.ifPresent(value -> System.out.println("Found: " + value));\n        System.out.println("Missing present: " + missing.isPresent());\n    }\n}',
    tests: tests("Found: Castle\nMissing present: false"),
  },
  {
    slug: "optional-modern-practices-orelse",
    title: "`orElse`",
    description:
      "Absent value ke liye fallback choose karo and eager fallback evaluation ko `orElseGet` se contrast karo.",
    problem:
      "Caller ko missing nickname par `Guest` chahiye. Simple fallback easy hai, but expensive fallback computation ko present value ke bawajood unnecessarily execute nahi karna chahiye.",
    why:
      "Modern API use sirf method name recall nahi; evaluation semantics bhi matter karti hain.",
    model:
      "optional.orElse(value)\n  fallback expression evaluated eagerly\n\noptional.orElseGet(supplier)\n  supplier needed only when empty",
    syntax:
      'String name = optional.orElse("Guest");\nString lazy = optional.orElseGet(() -> loadDefault());',
    remember:
      "Cheap constant fallback ke liye `orElse` clear hai. Expensive/side-effecting fallback ke liye `orElseGet` lazy evaluation avoid kar sakta hai.",
    example:
      'Optional<String> name = Optional.empty();\nSystem.out.println(name.orElse("Guest"));',
    trace:
      "present Aman + orElse fallback expression → expression can still evaluate; orElseGet supplier skipped when present",
    mistake:
      "Expensive database/file fallback ko `orElse(expensiveCall())` me put karke assume karna it only runs when empty.",
    fix:
      "Fallback evaluation cost/side effects matter kare to `orElseGet` use karo.",
    predict: ["Simple fallback value method?", "orElse"],
    predict2: ["`orElseGet` fallback supplier lazy ho sakta hai? yes/no", "yes"],
    prompt:
      "Present Optional ke saath lazy fallback supplier use karo so fallback message print na ho; empty Optional par supplier run ho. Exact output:\nPresent: Aman\nLoading fallback\nMissing: Guest",
    starter:
      'import java.util.*;\n\npublic class Main {\n    static String fallback() {\n        System.out.println("Loading fallback");\n        return "Guest";\n    }\n\n    public static void main(String[] args) {\n        Optional<String> present = Optional.of("Aman");\n        Optional<String> missing = Optional.empty();\n        // Use lazy fallback for both.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    static String fallback() {\n        System.out.println("Loading fallback");\n        return "Guest";\n    }\n\n    public static void main(String[] args) {\n        Optional<String> present = Optional.of("Aman");\n        Optional<String> missing = Optional.empty();\n        System.out.println("Present: " + present.orElseGet(Main::fallback));\n        System.out.println("Missing: " + missing.orElseGet(Main::fallback));\n    }\n}',
    tests: tests("Present: Aman\nLoading fallback\nMissing: Guest"),
  },
  {
    slug: "optional-modern-practices-map-on-optional",
    title: "`map` on Optional",
    description:
      "Present value ko safely transform karo without manual extraction; absence ko transformation chain ke through preserve hone do.",
    problem:
      "Optional<Quest> se title chahiye. Manual presence check + get + conversion boilerplate create karta hai.",
    why:
      "Stream `map` aur Optional `map` same broad transformation idea share karte hain: context ke andar value transform hoti hai.",
    model:
      "Optional<T>\n   ↓ map(Function<T,R>)\nOptional<R>\n\npresent T → transform → present R\nempty     → transform skipped → empty",
    syntax:
      'Optional<String> title = quest.map(Quest::getTitle);',
    remember:
      "Optional `map` present value par Function apply karta hai; empty case automatically empty rehta hai.",
    example:
      'Optional<Integer> n = Optional.of(5);\nSystem.out.println(n.map(x -> x * 2).orElse(0));',
    trace:
      "Optional[5] → map x*2 → Optional[10]; empty → map skipped → empty → fallback",
    mistake:
      "`optional.get()` first karke transform karna and empty failure risk introduce karna.",
    fix:
      "Transformation ko Optional context me rakho: `map(...).orElse(...)`.",
    predict: ["Optional contained value transform karne ka method?", "map"],
    predict2: ["Empty Optional par mapper execute hota hai? yes/no", "no"],
    prompt:
      "Optional Quest ko `map` se uppercase title me transform karo; empty quest fallback `UNKNOWN`. Exact output:\nFound: CASTLE\nMissing: UNKNOWN",
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    Quest(String title) { this.title = title; }\n    String getTitle() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Optional<Quest> found = Optional.of(new Quest("Castle"));\n        Optional<Quest> missing = Optional.empty();\n        // Map both to uppercase title and provide fallback.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final String title;\n    Quest(String title) { this.title = title; }\n    String getTitle() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Optional<Quest> found = Optional.of(new Quest("Castle"));\n        Optional<Quest> missing = Optional.empty();\n        System.out.println("Found: " + found.map(q -> q.getTitle().toUpperCase()).orElse("UNKNOWN"));\n        System.out.println("Missing: " + missing.map(q -> q.getTitle().toUpperCase()).orElse("UNKNOWN"));\n    }\n}',
    tests: tests("Found: CASTLE\nMissing: UNKNOWN"),
  },
  {
    slug: "optional-modern-practices-readable-modern-java-habits",
    title: "Readable Modern Java Habits",
    description:
      "Modern Java features ko readability ke liye use karo, novelty ke liye nahi: clear names, small transformations, method references where natural, and no forced Optional/Stream chains.",
    problem:
      "Lambda, Stream aur Optional available hone ka matlab har loop, null check aur method ko clever chain me compress karna nahi.",
    why:
      "Learner ab enough modern APIs jaanta hai ki overuse new risk ban sakta hai. Maintainability ke liye intent-first choices practice karni hain.",
    model:
      "Prefer:\nclear domain names\nsmall focused pipeline\nnatural method reference\nexplicit fallback\n\nAvoid:\nclever nesting\nOptional.get()\nside effects inside map/filter\nstreams where a loop is clearer",
    syntax:
      "quest.map(Quest::getTitle)\n     .orElse(\"Unknown\");",
    remember:
      "Modern Java ka goal fewer characters nahi; clearer contracts and transformations hain. Readability beats feature density.",
    example:
      "A short loop can be better than a stream with hidden mutable side effects.",
    trace:
      "requirement → choose simplest abstraction that expresses intent → reader can predict behavior without decoding tricks",
    mistake:
      "Stream `map` me external mutable counter update karna, Optional `.get()` call karna, or long nested chains with vague variable names.",
    fix:
      "Side effects isolate karo, absence APIs use karo, pipelines small rakho, and intermediate named variables use karo when they clarify intent.",
    predict: ["Optional present value blindly extract karne ka discouraged common method?", "get"],
    predict2: ["Modern feature use karna readability se zyada important hai? yes/no", "no"],
    prompt:
      "Given quest titles with blanks, readable stream pipeline banao: trim, blank remove, uppercase, sorted. Exact output:\n[CAVE, FOREST, JAVA]",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> rawTitles = List.of("  java ", "", "Forest", "   ", "cave");\n        // Build a clear pipeline: trim -> remove blanks -> uppercase -> sort.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> cleanTitles = rawTitles().stream()\n            .map(String::trim)\n            .filter(title -> !title.isBlank())\n            .map(String::toUpperCase)\n            .sorted()\n            .toList();\n        System.out.println(cleanTitles);\n    }\n\n    static List<String> rawTitles() {\n        return List.of("  java ", "", "Forest", "   ", "cave");\n    }\n}',
    tests: tests("[CAVE, FOREST, JAVA]"),
  },
  {
    slug: "optional-modern-practices-optional-recap",
    title: "🏆 Safe Quest Lookup",
    description:
      "Streams + Optional + functional transformations ko combine karke missing-data-safe lookup API aur readable caller workflow design karo.",
    problem:
      "Quest registry search may miss. Caller ko unsafe null/get handling ke bina title, reward aur fallback report produce karna hai.",
    why:
      "Module proof Optional factories recall nahi. Learner ko absence contract design karna, Stream search se Optional receive karna, then safe transformations/fallbacks choose karna hai.",
    model:
      "List<Quest>\n  ↓ stream/filter/findFirst\nOptional<Quest>\n  ├─ map → title/reward label\n  ├─ ifPresent → present-only action\n  └─ orElse/orElseGet → fallback\n\nNo null sentinel. No unsafe get.",
    syntax:
      "static Optional<Quest> findById(List<Quest> quests, int id) {\n    return quests.stream()\n        .filter(q -> q.getId() == id)\n        .findFirst();\n}",
    remember:
      "Good Optional API makes absence visible at return boundary, then caller composes `map`, `ifPresent`, or fallback according to intent. Avoid returning null instead of Optional and avoid calling `get()` blindly.",
    example:
      "findById(quests, 205)\n    .map(q -> q.getTitle() + \"=\" + q.getXp())\n    .orElse(\"Not found\");",
    trace:
      "id205 → stream finds Quest → Optional present → map label → output; id999 → empty → mapper skipped → fallback",
    mistake:
      "Method declared Optional but returns null on miss, or caller immediately calls `.get()` and recreates failure risk.",
    fix:
      "Return `Optional.empty()` on legitimate absence and keep transformations inside Optional until a deliberate terminal decision.",
    predict: ["Stream search terminal that returns Optional?", "findFirst"],
    predict2: ["Method returning Optional should return null for missing value? yes/no", "no"],
    prompt:
      'Safe Quest Lookup complete karo. Quests: 101/Forest/80, 205/Castle/120, 330/Cave/150. `findById` stream + `findFirst` se Optional<Quest> return kare. ID 205 ko `map` se `Castle=120` label banao. ID 999 ko fallback `Not found`. ID 330 par `ifPresent` se `Bonus candidate: Cave` print karo. No `Optional.get()`. Exact output:\n205: Castle=120\n999: Not found\nBonus candidate: Cave',
    starter:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n\n    Quest(int id, String title, int xp) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    static Optional<Quest> findById(List<Quest> quests, int id) {\n        // Use stream/filter/findFirst.\n        return null;\n    }\n\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 80),\n            new Quest(205, "Castle", 120),\n            new Quest(330, "Cave", 150)\n        );\n\n        // Build safe outputs without Optional.get().\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n    private final int xp;\n\n    Quest(int id, String title, int xp) {\n        this.id = id;\n        this.title = title;\n        this.xp = xp;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    static Optional<Quest> findById(List<Quest> quests, int id) {\n        return quests.stream()\n            .filter(q -> q.getId() == id)\n            .findFirst();\n    }\n\n    public static void main(String[] args) {\n        List<Quest> quests = List.of(\n            new Quest(101, "Forest", 80),\n            new Quest(205, "Castle", 120),\n            new Quest(330, "Cave", 150)\n        );\n\n        String found = findById(quests, 205)\n            .map(q -> q.getTitle() + "=" + q.getXp())\n            .orElse("Not found");\n        String missing = findById(quests, 999)\n            .map(q -> q.getTitle() + "=" + q.getXp())\n            .orElse("Not found");\n\n        System.out.println("205: " + found);\n        System.out.println("999: " + missing);\n        findById(quests, 330)\n            .ifPresent(q -> System.out.println("Bonus candidate: " + q.getTitle()));\n    }\n}',
    tests: tests(
      "205: Castle=120\n999: Not found\nBonus candidate: Cave",
    ),
    minutes: 40,
  },
];

export const optionalModernPracticesModule = specModule(
  {
    slug: "optional-modern-practices",
    title: "Module 47 — Optional & Modern Java Practices",
    description:
      "Missing values ko explicit `Optional` contracts se model karo aur Streams/Lambdas ke saath readable, null-safe modern Java workflows build karo.",
    position: 47,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
