import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "week-6-persistent-expense-tracker-tracker-requirements",
    title: "Tracker Requirements",
    description:
      "Capstone ko feature list nahi, explicit data-flow aur failure-boundary architecture me convert karo.",
    problem:
      "Persistent tracker ko expenses validate, memory me manage, disk par save/load, reports generate aur missing IDs safely search karne hain. Sab kuch `main` me mix karna brittle design banayega.",
    why:
      "Week 6 ka final proof learner se APIs recall nahi, responsibility decomposition demand karta hai.",
    model:
      "Expense input\n  ↓ validate\nExpense objects\n  ↓ ExpenseTracker\nin-memory List\n  ├─ save(Path)\n  ├─ load(Path)\n  ├─ reports via streams\n  └─ findById → Optional<Expense>\n\nPersistence boundary can fail independently.",
    syntax:
      "ExpenseTracker tracker = new ExpenseTracker();\ntracker.add(...);\ntracker.save(path);\ntracker.load(path);",
    remember:
      "Capstone me responsibilities separate rakho: domain validation, collection state, persistence format, reporting, lookup aur cleanup.",
    example:
      "Invalid amount should fail before tracker state mutates; malformed persisted row should fail while loading.",
    trace:
      "request → validate → mutate memory → serialize → file → reload/parse → reconstruct objects → query/report",
    mistake:
      "One giant method jahan validation, parsing, file I/O, reports aur printing tightly coupled hon.",
    fix:
      "System ko boundaries me design karo; each method/class ka one clear job rakho.",
    predict: ["Missing expense search ka planned return contract?", "Optional"],
    predict2: ["Persistence aur domain validation separate responsibilities honi chahiye? yes/no", "yes"],
    prompt:
      "Requirements ko code-level contract me represent karo: `ExpenseTracker` me `size()` and `isEmpty()` implement karo using private List. Exact output:\nInitially empty: true\nSize: 0",
    starter:
      'import java.util.*;\n\nclass ExpenseTracker {\n    private final List<String> expenses = new ArrayList<>();\n\n    int size() {\n        // Return current number of expenses.\n        return -1;\n    }\n\n    boolean isEmpty() {\n        // Return whether tracker has no expenses.\n        return false;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ExpenseTracker tracker = new ExpenseTracker();\n        System.out.println("Initially empty: " + tracker.isEmpty());\n        System.out.println("Size: " + tracker.size());\n    }\n}',
    solution:
      'import java.util.*;\n\nclass ExpenseTracker {\n    private final List<String> expenses = new ArrayList<>();\n\n    int size() {\n        return expenses.size();\n    }\n\n    boolean isEmpty() {\n        return expenses.isEmpty();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ExpenseTracker tracker = new ExpenseTracker();\n        System.out.println("Initially empty: " + tracker.isEmpty());\n        System.out.println("Size: " + tracker.size());\n    }\n}',
    tests: tests("Initially empty: true\nSize: 0"),
  },
  {
    slug: "week-6-persistent-expense-tracker-expense-model-and-validation",
    title: "Expense Model and Validation",
    description:
      "Expense ko valid-by-construction domain object banao so invalid amount/category tracker state tak pahunch hi na sake.",
    problem:
      "Negative/zero amount ya blank category accept karoge to later reports and persistence invalid state carry karenge.",
    why:
      "Module 42 ka validation-before-mutation principle capstone ke core domain model me apply hota hai.",
    model:
      "raw values\n  ↓ constructor validation\nvalid Expense\n  ↓\ntracker state\n\ninvalid values → exception before object exists",
    syntax:
      "record Expense(int id, String category, int amount) {\n    Expense { ...validation... }\n}",
    remember:
      "Record compact constructor bhi invariants enforce kar sakta hai. Valid object creation ko domain boundary banao.",
    example:
      'if (amount <= 0) throw new InvalidExpenseException("Amount must be positive");',
    trace:
      "new Expense(1,\"Food\",120) → validations pass → object created; amount0 → throws → no invalid object",
    mistake:
      "Object create karke tracker.add ke baad validation karna.",
    fix:
      "Domain object construction par local invariants enforce karo.",
    predict: ["Amount validation object creation se pehle/andar honi chahiye ya report time?", "creation"],
    predict2: ["Blank category valid expense honi chahiye? yes/no", "no"],
    prompt:
      "Expense record validate karo: id >0, nonblank category, amount >0. Valid expense print karo; invalid amount catch karo. Exact output:\nExpense: Food=120\nRejected: Amount must be positive",
    starter:
      'class InvalidExpenseException extends RuntimeException {\n    InvalidExpenseException(String message) { super(message); }\n}\n\nrecord Expense(int id, String category, int amount) {\n    Expense {\n        // Validate all three fields.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create one valid and one invalid expense.\n    }\n}',
    solution:
      'class InvalidExpenseException extends RuntimeException {\n    InvalidExpenseException(String message) { super(message); }\n}\n\nrecord Expense(int id, String category, int amount) {\n    Expense {\n        if (id <= 0) throw new InvalidExpenseException("Id must be positive");\n        if (category == null || category.isBlank()) throw new InvalidExpenseException("Category is required");\n        if (amount <= 0) throw new InvalidExpenseException("Amount must be positive");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Expense valid = new Expense(1, "Food", 120);\n        System.out.println("Expense: " + valid.category() + "=" + valid.amount());\n        try {\n            new Expense(2, "Travel", 0);\n        } catch (InvalidExpenseException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n    }\n}',
    tests: tests("Expense: Food=120\nRejected: Amount must be positive"),
  },
  {
    slug: "week-6-persistent-expense-tracker-custom-expense-exception",
    title: "Custom Expense Exception",
    description:
      "Domain validation failure aur malformed persisted data ko distinct exception types se communicate karo.",
    problem:
      "User-created invalid expense aur corrupted file row same failure category nahi hain. One generic exception diagnosis ko weak banata hai.",
    why:
      "Module 42 ki failure taxonomy yahan practical system boundary par apply hoti hai.",
    model:
      "InvalidExpenseException\n  → caller supplied invalid domain values\n\nExpenseFormatException\n  → persisted row cannot become valid Expense",
    syntax:
      "class ExpenseFormatException extends Exception {\n    ExpenseFormatException(String message) { super(message); }\n}",
    remember:
      "Exception type WHAT failed batata hai; message WHICH input/row and WHY explain karta hai.",
    example:
      'throw new ExpenseFormatException("Malformed row: " + line);',
    trace:
      "file line parsed → wrong field count/number → format exception → load aborts deliberately",
    mistake:
      "Parsing error swallow karke silently bad row skip karna without contract.",
    fix:
      "Persistence corruption policy explicit rakho; this capstone rejects malformed data clearly.",
    predict: ["Malformed persisted row ke liye domain-specific exception?", "ExpenseFormatException"],
    predict2: ["Validation and persistence-format failures distinguish karna useful hai? yes/no", "yes"],
    prompt:
      "Parser `id,category,amount` row accept kare; malformed row par checked `ExpenseFormatException`. Exact output:\nParsed: Food\nRejected: Malformed row: bad-data",
    starter:
      'class ExpenseFormatException extends Exception {\n    ExpenseFormatException(String message) { super(message); }\n}\n\npublic class Main {\n    static String parseCategory(String line) throws ExpenseFormatException {\n        // Split into exactly three fields or throw.\n        return "";\n    }\n\n    public static void main(String[] args) {\n        // Test one valid and one malformed row.\n    }\n}',
    solution:
      'class ExpenseFormatException extends Exception {\n    ExpenseFormatException(String message) { super(message); }\n}\n\npublic class Main {\n    static String parseCategory(String line) throws ExpenseFormatException {\n        String[] parts = line.split(",", -1);\n        if (parts.length != 3) {\n            throw new ExpenseFormatException("Malformed row: " + line);\n        }\n        return parts[1];\n    }\n\n    public static void main(String[] args) {\n        try {\n            System.out.println("Parsed: " + parseCategory("1,Food,120"));\n            parseCategory("bad-data");\n        } catch (ExpenseFormatException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n    }\n}',
    tests: tests("Parsed: Food\nRejected: Malformed row: bad-data"),
  },
  {
    slug: "week-6-persistent-expense-tracker-save-with-files",
    title: "Save with Files",
    description:
      "In-memory expenses ko deterministic text representation me serialize karke Path/Files boundary par persist karo.",
    problem:
      "Objects directly text file me meaningful format ke bina persist nahi hote. Stable representation chahiye jo later load parse kar sake.",
    why:
      "Module 43 ka write workflow ab real domain state persistence me use hota hai.",
    model:
      "List<Expense>\n  ↓ serialize each\nid,category,amount\n  ↓ Files.write\nPath on disk",
    syntax:
      "List<String> lines = expenses.stream()\n    .map(e -> e.id()+\",\"+e.category()+\",\"+e.amount())\n    .toList();\nFiles.write(path, lines);",
    remember:
      "Save format aur load parser ek contract share karte hain. Deterministic simple format testing/debugging easier banata hai.",
    example:
      "1,Food,120\n2,Travel,80",
    trace:
      "Expense objects → Strings → Files.write → persisted lines → read-back same representation",
    mistake:
      "`toString()` ko accidental persistence format bana dena.",
    fix:
      "Explicit serializer define karo whose format load code intentionally understands.",
    predict: ["Objects ko persisted text me convert karne ka step?", "serialization"],
    predict2: ["Save/load ko same representation contract share karna chahiye? yes/no", "yes"],
    prompt:
      "Two expenses temp file me `id,category,amount` format me save karo and file text print karo. Exact output:\n1,Food,120\n2,Travel,80",
    starter:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\n\nrecord Expense(int id, String category, int amount) {}\n\npublic class Main {\n    static void save(Path path, List<Expense> expenses) throws IOException {\n        // Serialize and write all expenses.\n    }\n\n    public static void main(String[] args) throws IOException {\n        Path path = Files.createTempFile("expenses-", ".txt");\n        try {\n            List<Expense> expenses = List.of(\n                new Expense(1, "Food", 120),\n                new Expense(2, "Travel", 80)\n            );\n            save(path, expenses);\n            System.out.println(Files.readString(path).stripTrailing());\n        } finally {\n            Files.deleteIfExists(path);\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\n\nrecord Expense(int id, String category, int amount) {}\n\npublic class Main {\n    static void save(Path path, List<Expense> expenses) throws IOException {\n        List<String> lines = expenses.stream()\n            .map(e -> e.id() + "," + e.category() + "," + e.amount())\n            .toList();\n        Files.write(path, lines);\n    }\n\n    public static void main(String[] args) throws IOException {\n        Path path = Files.createTempFile("expenses-", ".txt");\n        try {\n            List<Expense> expenses = List.of(\n                new Expense(1, "Food", 120),\n                new Expense(2, "Travel", 80)\n            );\n            save(path, expenses);\n            System.out.println(Files.readString(path).stripTrailing());\n        } finally {\n            Files.deleteIfExists(path);\n        }\n    }\n}',
    tests: tests("1,Food,120\n2,Travel,80"),
  },
  {
    slug: "week-6-persistent-expense-tracker-load-with-resource-safety",
    title: "Load with Resource Safety",
    description:
      "BufferedReader + try-with-resources se persisted rows load karo, parsing validate karo, aur replacement state ko only successful full load ke baad commit karo.",
    problem:
      "Load ke beech malformed row aaye aur tracker list already half replace ho chuki ho to state corrupt/partial ho sakti hai.",
    why:
      "Module 44 resource safety ko state safety ke saath combine karna capstone-level responsibility hai.",
    model:
      "open reader\n ↓\nparse into temporary List\n ↓ all rows valid?\nyes → replace tracker state\nno  → throw; old state unchanged\n ↓\nautomatic reader close",
    syntax:
      "List<Expense> loaded = new ArrayList<>();\ntry (BufferedReader br = Files.newBufferedReader(path)) { ... }\nexpenses.clear();\nexpenses.addAll(loaded);",
    remember:
      "External data untrusted boundary hai. Parse into temporary state first; successful validation ke baad live state commit karo.",
    example:
      "Bad second row should not leave tracker with only first loaded expense.",
    trace:
      "reader opens → rows parsed temp → malformed? abort + close → live list untouched; success → commit temp",
    mistake:
      "Each parsed row directly live collection me add karna before whole file validity known.",
    fix:
      "Transactional thinking: validate/build temporary result, then commit.",
    predict: ["Reader automatically close karne ka construct?", "try-with-resources"],
    predict2: ["Failed load ko existing tracker state partially replace karna chahiye? yes/no", "no"],
    prompt:
      "File with `1,Food,120` and `2,Travel,80` load karo using BufferedReader try-with-resources. Exact output:\nLoaded: 2\nTotal: 200",
    starter:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\n\nrecord Expense(int id, String category, int amount) {}\n\npublic class Main {\n    static List<Expense> load(Path path) throws IOException {\n        List<Expense> result = new ArrayList<>();\n        // Use BufferedReader and parse every row.\n        return result;\n    }\n\n    public static void main(String[] args) throws IOException {\n        Path path = Files.createTempFile("expenses-", ".txt");\n        try {\n            Files.writeString(path, "1,Food,120\\n2,Travel,80");\n            List<Expense> expenses = load(path);\n            int total = expenses.stream().mapToInt(Expense::amount).sum();\n            System.out.println("Loaded: " + expenses.size());\n            System.out.println("Total: " + total);\n        } finally {\n            Files.deleteIfExists(path);\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\n\nrecord Expense(int id, String category, int amount) {}\n\npublic class Main {\n    static List<Expense> load(Path path) throws IOException {\n        List<Expense> result = new ArrayList<>();\n        try (BufferedReader reader = Files.newBufferedReader(path)) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                String[] parts = line.split(",", -1);\n                result.add(new Expense(\n                    Integer.parseInt(parts[0]),\n                    parts[1],\n                    Integer.parseInt(parts[2])\n                ));\n            }\n        }\n        return result;\n    }\n\n    public static void main(String[] args) throws IOException {\n        Path path = Files.createTempFile("expenses-", ".txt");\n        try {\n            Files.writeString(path, "1,Food,120\\n2,Travel,80");\n            List<Expense> expenses = load(path);\n            int total = expenses.stream().mapToInt(Expense::amount).sum();\n            System.out.println("Loaded: " + expenses.size());\n            System.out.println("Total: " + total);\n        } finally {\n            Files.deleteIfExists(path);\n        }\n    }\n}',
    tests: tests("Loaded: 2\nTotal: 200"),
  },
  {
    slug: "week-6-persistent-expense-tracker-lambda-based-actions",
    title: "Lambda-based Actions",
    description:
      "Tracker traversal ko stable rakho aur caller-defined action ko `Consumer<Expense>` ke through inject karo.",
    problem:
      "Print, audit aur export-preview jaise actions same traversal use kar sakte hain. Har action ke liye duplicate loop unnecessary hai.",
    why:
      "Module 45 ka passing-behaviour pattern capstone architecture me reusable extension point banta hai.",
    model:
      "tracker.forEachExpense(action)\n             ↑ Consumer<Expense>\n\ntracker owns traversal\ncaller owns action",
    syntax:
      "void forEachExpense(Consumer<Expense> action) {\n    expenses.forEach(action);\n}",
    remember:
      "Lambda-based action tab useful hai jab traversal stable ho aur per-item behaviour vary kare.",
    example:
      'tracker.forEachExpense(e -> System.out.println(e.category()));',
    trace:
      "tracker iterates → calls Consumer for each Expense → caller behaviour executes",
    mistake:
      "Consumer me tracker collection structurally mutate karke traversal fragile banana.",
    fix:
      "Action ko focused side effect do; state-changing operations ke liye explicit domain methods prefer karo.",
    predict: ["One input, no result action interface?", "Consumer"],
    predict2: ["Same traversal different Consumers ke saath reuse ho sakta hai? yes/no", "yes"],
    prompt:
      "Tracker `forEachExpense(Consumer<Expense>)` implement karo. Two expenses par labels print karo. Exact output:\nFood: 120\nTravel: 80",
    starter:
      'import java.util.*;\nimport java.util.function.*;\n\nrecord Expense(String category, int amount) {}\n\nclass ExpenseTracker {\n    private final List<Expense> expenses = List.of(\n        new Expense("Food", 120),\n        new Expense("Travel", 80)\n    );\n\n    void forEachExpense(Consumer<Expense> action) {\n        // Delegate each expense to action.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ExpenseTracker tracker = new ExpenseTracker();\n        // Pass a lambda that prints category: amount.\n    }\n}',
    solution:
      'import java.util.*;\nimport java.util.function.*;\n\nrecord Expense(String category, int amount) {}\n\nclass ExpenseTracker {\n    private final List<Expense> expenses = List.of(\n        new Expense("Food", 120),\n        new Expense("Travel", 80)\n    );\n\n    void forEachExpense(Consumer<Expense> action) {\n        expenses.forEach(action);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ExpenseTracker tracker = new ExpenseTracker();\n        tracker.forEachExpense(e -> System.out.println(e.category() + ": " + e.amount()));\n    }\n}',
    tests: tests("Food: 120\nTravel: 80"),
  },
  {
    slug: "week-6-persistent-expense-tracker-stream-reports",
    title: "Stream Reports",
    description:
      "Expense collections ko declarative reports me filter, group/summarize aur deterministically order karo.",
    problem:
      "Tracker ko total, category-specific totals aur high expenses report chahiye. Multiple ad-hoc mutable loops report logic duplicate kar sakte hain.",
    why:
      "Module 46 streams ka capstone application analytics layer hai—not source mutation.",
    model:
      "expenses.stream()\n  ├─ filter → high expenses\n  ├─ mapToInt/sum → totals\n  └─ sorted → deterministic report",
    syntax:
      "int total = expenses.stream()\n    .mapToInt(Expense::amount)\n    .sum();",
    remember:
      "Report pipelines source state ko mutate na karein. Ordering matters ho to explicit Comparator use karo.",
    example:
      "expenses.stream().filter(e -> e.amount() >= 100).sorted(...).toList()",
    trace:
      "source expenses → filter threshold → sort amount desc/category asc → map labels → report",
    mistake:
      "Report generate karne ke liye source List ko sort/mutate karna when only view needed.",
    fix:
      "Stream `sorted` se derived ordered result banao.",
    predict: ["Int values ka direct stream sum helper?", "sum"],
    predict2: ["Stream report source list ko unchanged rakh sakta hai? yes/no", "yes"],
    prompt:
      "Expenses Food120, Travel80, Books150, Food60. Total aur >=100 report amount descending banao. Exact output:\nTotal: 410\nHigh: [Books=150, Food=120]",
    starter:
      'import java.util.*;\n\nrecord Expense(String category, int amount) {}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Expense> expenses = List.of(\n            new Expense("Food", 120),\n            new Expense("Travel", 80),\n            new Expense("Books", 150),\n            new Expense("Food", 60)\n        );\n        // Calculate total and high-expense labels.\n    }\n}',
    solution:
      'import java.util.*;\n\nrecord Expense(String category, int amount) {}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Expense> expenses = List.of(\n            new Expense("Food", 120),\n            new Expense("Travel", 80),\n            new Expense("Books", 150),\n            new Expense("Food", 60)\n        );\n        int total = expenses.stream().mapToInt(Expense::amount).sum();\n        List<String> high = expenses.stream()\n            .filter(e -> e.amount() >= 100)\n            .sorted(Comparator.comparingInt(Expense::amount).reversed())\n            .map(e -> e.category() + "=" + e.amount())\n            .toList();\n        System.out.println("Total: " + total);\n        System.out.println("High: " + high);\n    }\n}',
    tests: tests("Total: 410\nHigh: [Books=150, Food=120]"),
  },
  {
    slug: "week-6-persistent-expense-tracker-optional-search",
    title: "Optional Search",
    description:
      "Expense ID lookup ko `Optional<Expense>` return contract banao and callers ko safe map/fallback composition do.",
    problem:
      "Search miss normal outcome hai; `null` ya fake Expense return karna caller contract ambiguous banata hai.",
    why:
      "Module 47 ka Optional capstone system ke lookup API ko explicit absence semantics deta hai.",
    model:
      "expenses.stream()\n  ↓ filter id\nfindFirst()\n  ↓\nOptional<Expense>\n  ├─ present → map/use\n  └─ empty → fallback",
    syntax:
      "Optional<Expense> findById(int id) {\n    return expenses.stream().filter(e -> e.id() == id).findFirst();\n}",
    remember:
      "Legitimate search miss = Optional.empty, not exception by default and not null.",
    example:
      'tracker.findById(2).map(Expense::category).orElse("Not found")',
    trace:
      "id2 → filter match → Optional present → map category; id99 → no match → empty → fallback",
    mistake:
      "Optional-returning method se null return karna ya caller immediately `.get()` karna.",
    fix:
      "Optional chain ko deliberate fallback/action tak preserve karo.",
    predict: ["Stream search returning Optional terminal?", "findFirst"],
    predict2: ["Missing ID ko Optional.empty represent kar sakta hai? yes/no", "yes"],
    prompt:
      "IDs 1 Food120 and 2 Travel80. `findById` Optional return kare. 2 and 99 lookup exact output:\n2: Travel=80\n99: Not found",
    starter:
      'import java.util.*;\n\nrecord Expense(int id, String category, int amount) {}\n\nclass ExpenseTracker {\n    private final List<Expense> expenses = List.of(\n        new Expense(1, "Food", 120),\n        new Expense(2, "Travel", 80)\n    );\n\n    Optional<Expense> findById(int id) {\n        // Stream search.\n        return null;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ExpenseTracker tracker = new ExpenseTracker();\n        // Safe map/fallback for IDs 2 and 99.\n    }\n}',
    solution:
      'import java.util.*;\n\nrecord Expense(int id, String category, int amount) {}\n\nclass ExpenseTracker {\n    private final List<Expense> expenses = List.of(\n        new Expense(1, "Food", 120),\n        new Expense(2, "Travel", 80)\n    );\n\n    Optional<Expense> findById(int id) {\n        return expenses.stream()\n            .filter(e -> e.id() == id)\n            .findFirst();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ExpenseTracker tracker = new ExpenseTracker();\n        System.out.println("2: " + tracker.findById(2)\n            .map(e -> e.category() + "=" + e.amount())\n            .orElse("Not found"));\n        System.out.println("99: " + tracker.findById(99)\n            .map(e -> e.category() + "=" + e.amount())\n            .orElse("Not found"));\n    }\n}',
    tests: tests("2: Travel=80\n99: Not found"),
  },
  {
    slug: "week-6-persistent-expense-tracker-final-persistent-tracker",
    title: "🏆 Final Persistent Expense Tracker",
    description:
      "Week 6 ke exceptions, validation, files, resource safety, lambdas, streams aur Optional ko independent file-backed application workflow me integrate karo.",
    problem:
      "Tracker ko valid expenses accept karne, duplicate IDs reject karne, deterministic file save/load, malformed persistence reject karne, stream reports produce karne aur Optional search support karna hai—without partial state corruption.",
    why:
      "Ye Week 6 independence proof hai. Learner ko individual APIs nahi, boundaries and invariants coordinate karne hain.",
    model:
      "Expense(valid-by-construction)\n       ↓ add\nExpenseTracker List\n ├─ duplicate validation\n ├─ save(Path) → text file\n ├─ load(Path) → temp parse → commit\n ├─ total/high report → streams\n ├─ forEachExpense → Consumer\n └─ findById → Optional\n\ntry-with-resources protects reader lifecycle\nfinally cleans temporary workspace",
    syntax:
      "tracker.save(file);\nExpenseTracker restored = new ExpenseTracker();\nrestored.load(file);\nrestored.findById(id).map(...).orElse(...);",
    remember:
      "Robust persistence flow: validate before mutation, serialize explicitly, treat file data as untrusted, parse into temporary state, commit only on full success, close resources deterministically, and make absence explicit.",
    example:
      "Save 3 expenses → load into fresh tracker → total/report/search match original logical state.",
    trace:
      "construct valid expenses → reject duplicate → save → fresh tracker → resource-safe load → validate rows → commit → stream analytics → Optional lookup → cleanup",
    mistake:
      "Trusting file rows, partial load mutation, swallowed exceptions, unsafe Optional.get, or resource/file cleanup only on success.",
    fix:
      "Use Week 6 boundaries together: domain exceptions + checked persistence errors + resource ownership + functional queries.",
    predict: ["Failed full-file validation ke baad live tracker state change honi chahiye? yes/no", "no"],
    predict2: ["This capstone persistence Files API use karti hai, JDBC nahi? yes/no", "yes"],
    prompt:
      'Persistent Expense Tracker complete karo. `Expense` validates id>0, nonblank category, amount>0 with `InvalidExpenseException`. Tracker duplicate IDs reject kare. `save` lines `id,category,amount` likhe. `load` BufferedReader try-with-resources se temp List parse kare and malformed/invalid persisted row par checked `ExpenseFormatException`; successful full parse ke baad hi live state replace kare. `findById` Optional return kare. `total` and `highExpenseLabels(min)` streams use kare; high report amount descending then category ascending. Main: temp workspace/file banao; add 1/Food/120, 2/Travel/80, 3/Books/150; duplicate id 2 reject karke message print karo; save; fresh tracker load; Consumer-based action se loaded categories collect/count nahi—sirf APIs prove karne ke liye first restored expense ko Optional map se show karo. Exact output:\nRejected: Expense id 2 already exists\nSaved: 3\nLoaded: 3\nTotal: 350\nHigh: [Books=150, Food=120]\nFind 2: Travel=80\nFind 99: Not found\nFile exists: true\nWorkspace deleted: true',
    starter:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\nimport java.util.function.*;\n\nclass InvalidExpenseException extends RuntimeException {\n    InvalidExpenseException(String message) { super(message); }\n}\n\nclass ExpenseFormatException extends Exception {\n    ExpenseFormatException(String message) { super(message); }\n}\n\nrecord Expense(int id, String category, int amount) {\n    Expense {\n        // Validate id, category and amount.\n    }\n}\n\nclass ExpenseTracker {\n    private final List<Expense> expenses = new ArrayList<>();\n\n    void add(Expense expense) {\n        // Reject duplicate id before mutation.\n    }\n\n    int size() { return expenses.size(); }\n\n    void save(Path path) throws IOException {\n        // Serialize deterministically and write.\n    }\n\n    void load(Path path) throws IOException, ExpenseFormatException {\n        // Parse using BufferedReader + temporary List.\n        // Commit only after the entire file is valid.\n    }\n\n    Optional<Expense> findById(int id) {\n        return Optional.empty();\n    }\n\n    int total() {\n        return 0;\n    }\n\n    List<String> highExpenseLabels(int min) {\n        return List.of();\n    }\n\n    void forEachExpense(Consumer<Expense> action) {\n        // Delegate each expense to action.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Path root = Files.createTempDirectory("javaquets-expenses-");\n        Path file = root.resolve("expenses.txt");\n\n        try {\n            // Build original tracker, reject duplicate, save, restore,\n            // report totals/high expenses and safe Optional lookups.\n        } finally {\n            Files.deleteIfExists(file);\n            Files.deleteIfExists(root);\n            System.out.println("Workspace deleted: " + !Files.exists(root));\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\nimport java.util.function.*;\n\nclass InvalidExpenseException extends RuntimeException {\n    InvalidExpenseException(String message) { super(message); }\n}\n\nclass ExpenseFormatException extends Exception {\n    ExpenseFormatException(String message) { super(message); }\n}\n\nrecord Expense(int id, String category, int amount) {\n    Expense {\n        if (id <= 0) throw new InvalidExpenseException("Id must be positive");\n        if (category == null || category.isBlank()) throw new InvalidExpenseException("Category is required");\n        if (amount <= 0) throw new InvalidExpenseException("Amount must be positive");\n    }\n}\n\nclass ExpenseTracker {\n    private final List<Expense> expenses = new ArrayList<>();\n\n    void add(Expense expense) {\n        if (findById(expense.id()).isPresent()) {\n            throw new InvalidExpenseException("Expense id " + expense.id() + " already exists");\n        }\n        expenses.add(expense);\n    }\n\n    int size() { return expenses.size(); }\n\n    void save(Path path) throws IOException {\n        List<String> lines = expenses.stream()\n            .map(e -> e.id() + "," + e.category() + "," + e.amount())\n            .toList();\n        Files.write(path, lines);\n    }\n\n    void load(Path path) throws IOException, ExpenseFormatException {\n        List<Expense> loaded = new ArrayList<>();\n        Set<Integer> ids = new HashSet<>();\n\n        try (BufferedReader reader = Files.newBufferedReader(path)) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                String[] parts = line.split(",", -1);\n                if (parts.length != 3) {\n                    throw new ExpenseFormatException("Malformed row: " + line);\n                }\n\n                final int id;\n                final int amount;\n                try {\n                    id = Integer.parseInt(parts[0]);\n                    amount = Integer.parseInt(parts[2]);\n                } catch (NumberFormatException e) {\n                    throw new ExpenseFormatException("Malformed row: " + line);\n                }\n\n                if (!ids.add(id)) {\n                    throw new ExpenseFormatException("Duplicate expense id in file: " + id);\n                }\n\n                try {\n                    loaded.add(new Expense(id, parts[1], amount));\n                } catch (InvalidExpenseException e) {\n                    throw new ExpenseFormatException("Invalid expense row: " + line);\n                }\n            }\n        }\n\n        expenses.clear();\n        expenses.addAll(loaded);\n    }\n\n    Optional<Expense> findById(int id) {\n        return expenses.stream()\n            .filter(e -> e.id() == id)\n            .findFirst();\n    }\n\n    int total() {\n        return expenses.stream()\n            .mapToInt(Expense::amount)\n            .sum();\n    }\n\n    List<String> highExpenseLabels(int min) {\n        return expenses.stream()\n            .filter(e -> e.amount() >= min)\n            .sorted(\n                Comparator.comparingInt(Expense::amount)\n                    .reversed()\n                    .thenComparing(Expense::category)\n            )\n            .map(e -> e.category() + "=" + e.amount())\n            .toList();\n    }\n\n    void forEachExpense(Consumer<Expense> action) {\n        expenses.forEach(action);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Path root = Files.createTempDirectory("javaquets-expenses-");\n        Path file = root.resolve("expenses.txt");\n\n        try {\n            ExpenseTracker tracker = new ExpenseTracker();\n            tracker.add(new Expense(1, "Food", 120));\n            tracker.add(new Expense(2, "Travel", 80));\n            tracker.add(new Expense(3, "Books", 150));\n\n            try {\n                tracker.add(new Expense(2, "Other", 40));\n            } catch (InvalidExpenseException e) {\n                System.out.println("Rejected: " + e.getMessage());\n            }\n\n            tracker.save(file);\n            System.out.println("Saved: " + tracker.size());\n\n            ExpenseTracker restored = new ExpenseTracker();\n            restored.load(file);\n            System.out.println("Loaded: " + restored.size());\n            System.out.println("Total: " + restored.total());\n            System.out.println("High: " + restored.highExpenseLabels(100));\n            System.out.println("Find 2: " + restored.findById(2)\n                .map(e -> e.category() + "=" + e.amount())\n                .orElse("Not found"));\n            System.out.println("Find 99: " + restored.findById(99)\n                .map(e -> e.category() + "=" + e.amount())\n                .orElse("Not found"));\n            System.out.println("File exists: " + Files.exists(file));\n        } finally {\n            Files.deleteIfExists(file);\n            Files.deleteIfExists(root);\n            System.out.println("Workspace deleted: " + !Files.exists(root));\n        }\n    }\n}',
    tests: tests(
      "Rejected: Expense id 2 already exists\nSaved: 3\nLoaded: 3\nTotal: 350\nHigh: [Books=150, Food=120]\nFind 2: Travel=80\nFind 99: Not found\nFile exists: true\nWorkspace deleted: true",
    ),
    minutes: 50,
  },
];

export const persistentExpenseTrackerModule = specModule(
  {
    slug: "week-6-persistent-expense-tracker",
    title: "Module 48 — 🏆 Persistent Expense Tracker",
    description:
      "Exceptions, validation, Files/Paths, resource safety, lambdas, streams aur Optional ko combine karke robust file-backed expense tracker build karo.",
    position: 48,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
