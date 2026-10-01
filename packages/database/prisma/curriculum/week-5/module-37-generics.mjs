import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "generics-why-generics",
    title: "Why Generics?",
    description:
      "Reusable code aur compile-time type safety ko ek saath reason karo: type ko hardcode ya `Object` me erase karne ke bajaye parameter banao.",
    problem:
      "StringBox aur IntegerBox jaise nearly identical classes duplicate logic create karte hain. `Object` use karne par casts aur wrong-type mistakes runtime tak slip kar sakti hain.",
    why: "Modules 33–35 me `List<String>`, `Set<Integer>` aur `Map<Integer, Quest>` already use hue. Ab learner samjhega angle brackets actually reusable type contracts kaise create karte hain.",
    model:
      "without generic:\nStringBox → String\nIntegerBox → Integer\n\nwith generic:\nBox<T>\n  use-site Box<String>  → T = String\n  use-site Box<Integer> → T = Integer",
    syntax: "class Box<T> {\n    private T value;\n}",
    remember:
      "`T` koi magic runtime value nahi; generic declaration ka type parameter hai. Use-site par concrete type compile-time contract set karta hai.",
    example:
      "class Box<T> {\n    T value;\n}\n\nBox<String> text = new Box<>();\nBox<Integer> number = new Box<>();",
    trace:
      "Box<String> → T treated as String for that parameterization → String value accepted → incompatible type rejected by compiler",
    mistake:
      "`Object` ko generics ka equivalent samajhna aur every read par cast karna.",
    fix: "Jab same behavior multiple types par type-safe hona chahiye, generic type parameter use karo.",
    predict: [
      "`Box<String>` me `T` kis type ko represent karta hai?",
      "String",
    ],
    predict2: [
      "Generics wrong element types ko compile time par catch karne me help karte hain? yes/no",
      "yes",
    ],
    prompt:
      "Generic `Box<T>` banao with constructor and `get`. Ek `Box<String>` me `Java` aur `Box<Integer>` me `37` store karke exact output lao:\nText: Java\nNumber: 37",
    starter:
      "class Box<T> {\n    // Store one value of type T.\n    // Add a constructor and get() method.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Box<String> and Box<Integer>.\n        // Print their values.\n    }\n}",
    solution:
      'class Box<T> {\n    private final T value;\n\n    Box(T value) {\n        this.value = value;\n    }\n\n    T get() {\n        return value;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Box<String> text = new Box<>("Java");\n        Box<Integer> number = new Box<>(37);\n\n        System.out.println("Text: " + text.get());\n        System.out.println("Number: " + number.get());\n    }\n}',
    tests: tests("Text: Java\nNumber: 37"),
  },
  {
    slug: "generics-generic-class",
    title: "Build a Generic Class",
    description:
      "Type parameter ko fields, parameters aur return types me consistently propagate karke reusable class contract design karo.",
    problem:
      "Sirf `class Box<T>` likhna enough nahi. Class ke operations ko bhi same `T` contract respect karna hota hai.",
    why: "Generic class design learner ko abstraction responsibility deta hai: implementation ek concrete type assume nahi karegi, caller parameterization choose karega.",
    model:
      "Holder<T>\n ├─ field: T value\n ├─ set(T value)\n └─ T get()\n\none type parameter flows through whole API",
    syntax:
      "class Holder<T> {\n    private T value;\n    void set(T value) { this.value = value; }\n    T get() { return value; }\n}",
    remember:
      "Class-level `T` instance API me reuse hota hai. `Holder<String>` ke methods automatically String-oriented contract ban jate hain.",
    example:
      'Holder<String> h = new Holder<>();\nh.set("Quest");\nString value = h.get();',
    trace:
      "Holder<String> created → T=String → set expects String → get returns String → cast unnecessary",
    mistake:
      "Generic field rakhna but setter ko `Object` aur getter ko cast-based banana.",
    fix: "Generic contract ko end-to-end preserve karo: input aur output dono me `T` use karo.",
    predict: [
      "`Holder<Integer>.get()` ka compile-time return type?",
      "Integer",
    ],
    predict2: [
      "`Holder<String>` me Integer pass to `set` compile hona chahiye? yes/no",
      "no",
    ],
    prompt:
      "`Slot<T>` implement karo with `set`, `get`, and `isEmpty`. String slot initially empty ho, then `Generics` store karo. Exact output:\nInitially empty: true\nValue: Generics\nFinally empty: false",
    starter:
      'class Slot<T> {\n    private T value;\n\n    void set(T value) {\n        // TODO\n    }\n\n    T get() {\n        // TODO\n        return null;\n    }\n\n    boolean isEmpty() {\n        // TODO\n        return false;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Slot<String> slot = new Slot<>();\n        System.out.println("Initially empty: " + slot.isEmpty());\n        slot.set("Generics");\n        System.out.println("Value: " + slot.get());\n        System.out.println("Finally empty: " + slot.isEmpty());\n    }\n}',
    solution:
      'class Slot<T> {\n    private T value;\n\n    void set(T value) {\n        this.value = value;\n    }\n\n    T get() {\n        return value;\n    }\n\n    boolean isEmpty() {\n        return value == null;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Slot<String> slot = new Slot<>();\n        System.out.println("Initially empty: " + slot.isEmpty());\n        slot.set("Generics");\n        System.out.println("Value: " + slot.get());\n        System.out.println("Finally empty: " + slot.isEmpty());\n    }\n}',
    tests: tests(
      "Initially empty: true\nValue: Generics\nFinally empty: false",
    ),
  },
  {
    slug: "generics-generic-constructor-use",
    title: "Generic Constructor Use",
    description:
      "Generic class constructor ko trace karo: constructor value receives the class type parameter selected for that object.",
    problem:
      "`new Box<>(...)` dekhkar lag sakta hai constructor itself separately generic hai. Common case me constructor class ke existing `T` ko simply use karta hai.",
    why: "Declaration-site aur use-site roles clear honge to diamond syntax aur constructor calls less magical lagenge.",
    model:
      "class Reward<T> {\n  Reward(T value) ...\n}\n\nReward<Integer> r = new Reward<>(100)\n       T = Integer ─────────────┘",
    syntax:
      "class Reward<T> {\n    Reward(T value) { ... }\n}\n\nReward<Integer> reward = new Reward<>(100);",
    remember:
      "Generic class ka constructor class-level `T` use kar sakta hai. Har constructor ko `<T>` separately declare karna required nahi.",
    example:
      "class PairBox<T> {\n    T first;\n    T second;\n    PairBox(T first, T second) {\n        this.first = first;\n        this.second = second;\n    }\n}",
    trace:
      "PairBox<String> → constructor parameters both String → two String arguments valid",
    mistake:
      "Constructor ke naam ke saath type arguments declare karne ki koshish because class generic hai.",
    fix: "Class-level type parameter already scope me hai; constructor parameter types me directly `T` use karo.",
    predict: [
      "`Box<Integer>` constructor ka `T value` effectively kis type ka hai?",
      "Integer",
    ],
    predict2: [
      "Generic class constructor class-level T use kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      '`Reward<T>` constructor se value initialize karo. `Reward<Integer>(120)` aur `Reward<String>("Legendary")` create karke exact output lao:\nXP: 120\nTier: Legendary',
    starter:
      "class Reward<T> {\n    private final T value;\n\n    Reward(T value) {\n        // TODO\n        this.value = null;\n    }\n\n    T getValue() {\n        return value;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Construct Integer and String rewards using <>.\n    }\n}",
    solution:
      'class Reward<T> {\n    private final T value;\n\n    Reward(T value) {\n        this.value = value;\n    }\n\n    T getValue() {\n        return value;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Reward<Integer> xp = new Reward<>(120);\n        Reward<String> tier = new Reward<>("Legendary");\n\n        System.out.println("XP: " + xp.getValue());\n        System.out.println("Tier: " + tier.getValue());\n    }\n}',
    tests: tests("XP: 120\nTier: Legendary"),
  },
  {
    slug: "generics-generic-methods",
    title: "Generic Methods",
    description:
      "Class ko generic banaye bina individual method ke liye independent type parameter declare aur use karo.",
    problem:
      "Kabhi reusable behavior type-dependent hota hai but object/class ko generic state store karne ki need nahi hoti.",
    why: "Generic methods abstraction ko smaller scope me apply karte hain. Learner ko class-level `T` aur method-level `<T>` declarations distinguish karni hain.",
    model:
      "static <T> T first(T a, T b)\n       ↑ declaration\n           ↑ return type\n                 ↑ parameters",
    syntax:
      "static <T> T chooseFirst(T first, T second) {\n    return first;\n}",
    remember:
      "Method-level type parameter return type se pehle declare hota hai: `<T> T method(...)`.",
    example:
      "static <T> void printTwice(T value) {\n    System.out.println(value);\n    System.out.println(value);\n}",
    trace:
      'printTwice("Java") → compiler infers T=String; printTwice(37) → T=Integer',
    mistake:
      "`static T echo(T value)` likhna without declaring method-level `T` in a non-generic class.",
    fix: "Independent generic method ke liye return type se pehle `<T>` declare karo.",
    predict: [
      "Generic static method me type parameter declaration `T` se pehle kis syntax me aata hai?",
      "<T>",
    ],
    predict2: [
      "Non-generic class generic method contain kar sakti hai? yes/no",
      "yes",
    ],
    prompt:
      "`pickFirst` generic static method complete karo jo same inferred type ke two values me first return kare. Exact output:\nName: Forest\nXP: 120",
    starter:
      'public class Main {\n    static <T> T pickFirst(T first, T second) {\n        // TODO\n        return null;\n    }\n\n    public static void main(String[] args) {\n        String name = pickFirst("Forest", "Castle");\n        int xp = pickFirst(120, 80);\n\n        System.out.println("Name: " + name);\n        System.out.println("XP: " + xp);\n    }\n}',
    solution:
      'public class Main {\n    static <T> T pickFirst(T first, T second) {\n        return first;\n    }\n\n    public static void main(String[] args) {\n        String name = pickFirst("Forest", "Castle");\n        int xp = pickFirst(120, 80);\n\n        System.out.println("Name: " + name);\n        System.out.println("XP: " + xp);\n    }\n}',
    tests: tests("Name: Forest\nXP: 120"),
  },
  {
    slug: "generics-type-inference",
    title: "Type Inference and the Diamond `<>`",
    description:
      "Compiler inference ko trace karo: left-side/context se generic arguments infer ho sakte hain, but contract disappear nahi hota.",
    problem:
      "`new ArrayList<>()` me right side empty angle brackets dekhkar beginner assume kar sakta hai ki collection untyped hai.",
    why: "Modern Java generic code concise hai because compiler context infer karta hai. Learner ko concise syntax ke peeche exact type contract dekhna chahiye.",
    model:
      "List<String> names = new ArrayList<>();\n     ↑ context              ↑ compiler infers String\n\n<> ≠ raw type",
    syntax:
      "Box<String> box = new Box<>();\nList<Integer> values = new ArrayList<>();",
    remember:
      "Diamond `<>` type argument omit nahi karta; compiler available context se infer karta hai. Raw type me angle brackets hi absent hote hain.",
    example:
      'Map<Integer, String> names = new HashMap<>();\nnames.put(1, "Forest");',
    trace:
      "left type Map<Integer,String> → constructor inference chooses matching HashMap<Integer,String> → put contract preserved",
    mistake:
      "`new ArrayList()` raw type aur `new ArrayList<>()` diamond syntax ko same samajhna.",
    fix: "Parameterized reference + diamond prefer karo; raw types avoid karo.",
    predict: [
      "`List<String> x = new ArrayList<>();` me inferred element type?",
      "String",
    ],
    predict2: [
      "Diamond syntax compile-time type safety retain karta hai? yes/no",
      "yes",
    ],
    prompt:
      "Diamond syntax use karke `Map<Integer,String>` banao. 101→Forest, 205→Castle store karo. Exact output:\n101: Forest\n205: Castle",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Declare Map<Integer, String> and instantiate HashMap with <>.\n        // Add two entries and print them.\n    }\n}",
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, String> quests = new HashMap<>();\n        quests.put(101, "Forest");\n        quests.put(205, "Castle");\n\n        System.out.println("101: " + quests.get(101));\n        System.out.println("205: " + quests.get(205));\n    }\n}',
    tests: tests("101: Forest\n205: Castle"),
  },
  {
    slug: "generics-multiple-type-parameters-intro",
    title: "Multiple Type Parameters",
    description:
      "Ek abstraction me different roles ko different type parameters do, jaise key/value ya left/right.",
    problem:
      "Single `T` force karega ki pair ke dono values same type hon. Real associations often heterogeneous hoti hain: Integer id + String title.",
    why: "Multiple type parameters Map ke `<K,V>` design ko demystify karte hain aur learner ko generic API roles intentionally name karna sikhate hain.",
    model:
      "Pair<A,B>\n ├─ A first\n └─ B second\n\nPair<Integer,String>\nA=Integer, B=String",
    syntax:
      "class Pair<A, B> {\n    private A first;\n    private B second;\n}",
    remember:
      "Har type parameter ek independent type role represent kar sakta hai. Conventional names `T`, `K`, `V`, `E` common hain, mandatory nahi.",
    example: 'Pair<Integer, String> quest = new Pair<>(101, "Forest");',
    trace:
      "Pair<Integer,String> → A=Integer and B=String → constructor/getters preserve respective types",
    mistake:
      "Do semantically different roles ko same `T` se constrain kar dena when types need not match.",
    fix: "Independent type roles ke liye independent parameters declare karo, e.g. `<K,V>`.",
    predict: [
      "`Map<K,V>` me K generally kis role ko represent karta hai?",
      "key",
    ],
    predict2: [
      "`Pair<String,Integer>` ke two generic types different ho sakte hain? yes/no",
      "yes",
    ],
    prompt:
      '`Pair<A,B>` class complete karo with constructor and getters. `Pair<Integer,String>(101,"Forest")` se exact output lao:\nID: 101\nTitle: Forest',
    starter:
      "class Pair<A, B> {\n    private final A first;\n    private final B second;\n\n    Pair(A first, B second) {\n        // TODO\n        this.first = null;\n        this.second = null;\n    }\n\n    A getFirst() { return null; }\n    B getSecond() { return null; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Pair<Integer, String> for quest 101 / Forest.\n    }\n}",
    solution:
      'class Pair<A, B> {\n    private final A first;\n    private final B second;\n\n    Pair(A first, B second) {\n        this.first = first;\n        this.second = second;\n    }\n\n    A getFirst() { return first; }\n    B getSecond() { return second; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Pair<Integer, String> quest = new Pair<>(101, "Forest");\n        System.out.println("ID: " + quest.getFirst());\n        System.out.println("Title: " + quest.getSecond());\n    }\n}',
    tests: tests("ID: 101\nTitle: Forest"),
  },
  {
    slug: "generics-generic-collections-connection",
    title: "Generic Collections Connection",
    description:
      "List, Set aur Map ko generics ke real-world APIs ke roop me reconnect karo aur type-safe composition reason karo.",
    problem:
      "Earlier modules me collection syntax use ho chuka hai, but ab learner ko explain karna hai ki `List<Quest>` aur `Map<Integer,Quest>` compile-time guarantees kaise create karte hain.",
    why: "Generics isolated feature nahi hai; Java Collections Framework ka type safety model isi par built hai. Ye backward connection previous modules ko deeper banata hai.",
    model:
      "List<E>          → one element role\nSet<E>           → one unique element role\nMap<K,V>         → key + value roles\n\nList<Quest>      → E=Quest\nMap<Integer,Quest> → K=Integer, V=Quest",
    syntax:
      "List<Quest> quests = new ArrayList<>();\nSet<String> tags = new HashSet<>();\nMap<Integer, Quest> byId = new HashMap<>();",
    remember:
      "Parameterized collections compiler ko allowed element/key/value types batati hain; reads bhi precise types return karte hain, casts avoid hote hain.",
    example:
      'List<String> names = new ArrayList<>();\nnames.add("Forest");\nString first = names.get(0);',
    trace:
      "List<String> → add accepts String → get returns String → no Object cast",
    mistake:
      "Raw `List`/`Map` use karke mixed values allow karna and later casts par depend karna.",
    fix: "Collection declarations ko parameterize karo with domain-relevant types.",
    predict: ["`Set<Quest>` me element type parameter?", "Quest"],
    predict2: [
      "`Map<Integer,Quest>.get(101)` compile-time return type Quest hai? yes/no",
      "yes",
    ],
    prompt:
      "`Quest` objects ko `List<Quest>` me store karo aur `Map<Integer,Quest>` index build karo. IDs 101 Forest and 205 Castle. Map lookup se exact output lao:\nList size: 2\nLookup 205: Castle",
    starter:
      "import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n\n    Quest(int id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>();\n        // Add two Quest objects.\n\n        Map<Integer, Quest> byId = new HashMap<>();\n        // Build the map from the typed List.\n\n        // Print requested report.\n    }\n}",
    solution:
      'import java.util.*;\n\nclass Quest {\n    private final int id;\n    private final String title;\n\n    Quest(int id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    int getId() { return id; }\n    String getTitle() { return title; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Quest> quests = new ArrayList<>();\n        quests.add(new Quest(101, "Forest"));\n        quests.add(new Quest(205, "Castle"));\n\n        Map<Integer, Quest> byId = new HashMap<>();\n        for (Quest quest : quests) {\n            byId.put(quest.getId(), quest);\n        }\n\n        System.out.println("List size: " + quests.size());\n        System.out.println("Lookup 205: " + byId.get(205).getTitle());\n    }\n}',
    tests: tests("List size: 2\nLookup 205: Castle"),
  },
  {
    slug: "generics-generics-recap",
    title: "🏆 Generic Quest Cache",
    description:
      "Generic class, multiple type parameters, generic method, inference aur typed collections ko ek reusable mini-system me combine karo.",
    problem:
      "Quest-specific storage hardcode karne ke bajaye reusable key→value cache abstraction build karni hai, then usse Quest domain ke saath type-safely use karna hai.",
    why: "Module proof angle-bracket syntax recall nahi; learner ko generic abstraction design karni hai jise caller concrete domain types ke saath specialize kare.",
    model:
      "Cache<K,V>\n   owns Map<K,V>\n   put(K,V)\n   get(K) → V\n   size()\n\nstatic <T> T choose(T preferred, T fallback)\n\nuse-site: Cache<Integer,Quest>",
    syntax:
      "class Cache<K, V> {\n    private final Map<K, V> data = new HashMap<>();\n    void put(K key, V value) { data.put(key, value); }\n    V get(K key) { return data.get(key); }\n}",
    remember:
      "Strong generic abstraction type roles preserve karti hai without knowing concrete domain types. Caller parameterization decides actual contract.",
    example:
      'Cache<Integer, Quest> quests = new Cache<>();\nquests.put(101, new Quest("Forest", 50));',
    trace:
      "instantiate Cache<Integer,Quest> → K=Integer,V=Quest → put enforces pair types → get(Integer) returns Quest → generic helper preserves selected type",
    mistake:
      "Cache internals ko `Object` based banana, raw Map use karna, ya retrieval par casts require karna.",
    fix: "Type parameters ko fields/method signatures/internal collections tak propagate karo. Compiler ko contract enforce karne do.",
    predict: [
      "`Cache<String,Integer>` me `get(String)` ka return type?",
      "Integer",
    ],
    predict2: [
      "Well-parameterized generic cache ke normal reads me manual cast required hona chahiye? yes/no",
      "no",
    ],
    prompt:
      'Generic Quest Cache complete karo. `Cache<K,V>` internally `Map<K,V>` use kare with `put`, `get`, `containsKey`, `size`. Generic static method `<T> T choose(T preferred, T fallback)` return preferred unless it is null. Cache<Integer,Quest> me 101 Forest/50 and 205 Castle/120 store karo. Missing 999 lookup ko fallback Quest("Unknown",0) ke saath choose karo. Exact output:\nCached: 2\nHas 205: true\nQuest 205: Castle\nXP 205: 120\nMissing title: Unknown',
    starter:
      "import java.util.*;\n\nclass Cache<K, V> {\n    private final Map<K, V> data = new HashMap<>();\n\n    void put(K key, V value) {\n        // TODO\n    }\n\n    V get(K key) {\n        // TODO\n        return null;\n    }\n\n    boolean containsKey(K key) {\n        // TODO\n        return false;\n    }\n\n    int size() {\n        // TODO\n        return 0;\n    }\n}\n\nclass Quest {\n    private final String title;\n    private final int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    static <T> T choose(T preferred, T fallback) {\n        // Return preferred unless it is null.\n        return null;\n    }\n\n    public static void main(String[] args) {\n        // Build Cache<Integer, Quest>, add quests 101 and 205,\n        // query 205, and use choose(...) for missing id 999.\n    }\n}",
    solution:
      'import java.util.*;\n\nclass Cache<K, V> {\n    private final Map<K, V> data = new HashMap<>();\n\n    void put(K key, V value) {\n        data.put(key, value);\n    }\n\n    V get(K key) {\n        return data.get(key);\n    }\n\n    boolean containsKey(K key) {\n        return data.containsKey(key);\n    }\n\n    int size() {\n        return data.size();\n    }\n}\n\nclass Quest {\n    private final String title;\n    private final int xp;\n\n    Quest(String title, int xp) {\n        this.title = title;\n        this.xp = xp;\n    }\n\n    String getTitle() { return title; }\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    static <T> T choose(T preferred, T fallback) {\n        return preferred != null ? preferred : fallback;\n    }\n\n    public static void main(String[] args) {\n        Cache<Integer, Quest> quests = new Cache<>();\n        quests.put(101, new Quest("Forest", 50));\n        quests.put(205, new Quest("Castle", 120));\n\n        Quest selected = quests.get(205);\n        Quest missing = choose(quests.get(999), new Quest("Unknown", 0));\n\n        System.out.println("Cached: " + quests.size());\n        System.out.println("Has 205: " + quests.containsKey(205));\n        System.out.println("Quest 205: " + selected.getTitle());\n        System.out.println("XP 205: " + selected.getXp());\n        System.out.println("Missing title: " + missing.getTitle());\n    }\n}',
    tests: tests(
      "Cached: 2\nHas 205: true\nQuest 205: Castle\nXP 205: 120\nMissing title: Unknown",
    ),
    minutes: 35,
  },
];

export const genericsModule = specModule(
  {
    slug: "generics",
    title: "Module 37 — Generics",
    description:
      "Type ko parameter bana kar reusable, compile-time-safe classes aur methods design karo—and Collections ke generic contracts ko deeply samjho.",
    position: 37,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
