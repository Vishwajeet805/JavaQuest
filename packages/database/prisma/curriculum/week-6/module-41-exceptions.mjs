import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "exceptions-exception-mental-model",
    title: "Exception Mental Model",
    description:
      "Exception ko random crash nahi, normal control flow se alag failure signal ki tarah trace karo.",
    problem:
      "Program compile ho sakta hai but runtime par operation complete na ho—jaise invalid number parse ya zero se division. Learner ko failure point aur control transfer samajhna hai.",
    why:
      "Week 5 me valid collection state build ki. Week 6 starts with a new responsibility: jab operation fail ho sakta hai, program failure ko explicitly represent aur handle kaise kare?",
    model:
      "normal flow:\nstatement A → statement B → statement C\n\nexception flow:\nstatement A → risky B throws\n                  ↓\n             matching handler\n                  ↓\n             controlled continuation",
    syntax:
      "throw new IllegalArgumentException(\"message\");\n// or an API may throw an exception for you",
    remember:
      "Exception ek object-based failure signal hai. Throw hone ke baad current normal path immediately continue nahi karta; Java matching handler search karta hai.",
    example:
      'int value = Integer.parseInt("42");   // succeeds\nint bad = Integer.parseInt("forty"); // throws NumberFormatException',
    trace:
      'parse "forty" starts → parser cannot produce int → NumberFormatException thrown → remaining statements in that path skipped until handler',
    mistake:
      "Har runtime failure ko compiler error samajhna, ya exception ke baad same try block ki next line execute hogi assume karna.",
    fix:
      "Compile-time vs runtime distinguish karo, then exact throw point se control flow trace karo.",
    predict: ["`Integer.parseInt(\"abc\")` commonly kaunsi exception throw karta hai?", "NumberFormatException"],
    predict2: ["Exception throw hone ke baad same path ki next statement automatically execute hoti hai? yes/no", "no"],
    prompt:
      'Program me `"25"` parse karo, phir `"oops"` parse attempt ko catch karke exact output lao:\nFirst: 25\nInvalid number\nFinished',
    starter:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("First: " + Integer.parseInt("25"));\n        // Try parsing "oops". Handle its runtime failure.\n        System.out.println("Finished");\n    }\n}',
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("First: " + Integer.parseInt("25"));\n        try {\n            Integer.parseInt("oops");\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid number");\n        }\n        System.out.println("Finished");\n    }\n}',
    tests: tests("First: 25\nInvalid number\nFinished"),
  },
  {
    slug: "exceptions-try-and-catch",
    title: "`try` and `catch`",
    description:
      "Risky operation ko narrow `try` boundary me rakho aur matching `catch` me meaningful recovery behavior define karo.",
    problem:
      "Untrusted input parse fail kare to poora workflow terminate karna unnecessary ho sakta hai. Program safe fallback ya clear response de sakta hai.",
    why:
      "`try/catch` syntax ka goal exception hide karna nahi; known failure mode ko controlled outcome me convert karna hai.",
    model:
      "try {\n  risky operation\n  success-only work\n} catch (SpecificException e) {\n  recovery / message / fallback\n}\ncontinuation",
    syntax:
      "try {\n    int age = Integer.parseInt(text);\n} catch (NumberFormatException e) {\n    System.out.println(\"Invalid age\");\n}",
    remember:
      "`try` ko unnecessarily giant mat banao. Jitna code relevant failure throw kar sakta hai, boundary utni focused rakhna reasoning easier banata hai.",
    example:
      'try {\n    int xp = Integer.parseInt("120");\n    System.out.println(xp);\n} catch (NumberFormatException e) {\n    System.out.println("Bad XP");\n}',
    trace:
      "enter try → risky call succeeds? continue success path; throws matching type? jump to catch → after catch continue",
    mistake:
      "`catch (Exception e) {}` empty rakhkar failure swallow kar dena.",
    fix:
      "Specific expected exception catch karo and useful response/fallback do.",
    predict: ["Risky code generally kis block me rakha jata hai?", "try"],
    predict2: ["Matching catch successful try ke baad execute hota hai? yes/no", "no"],
    prompt:
      'Method `parseXp(String text)` banao. Valid integer return kare; invalid number par `0` fallback return kare. Inputs `"120"` and `"oops"` se exact output:\nXP1: 120\nXP2: 0',
    starter:
      'public class Main {\n    static int parseXp(String text) {\n        // Use try/catch and return 0 for invalid numeric text.\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("XP1: " + parseXp("120"));\n        System.out.println("XP2: " + parseXp("oops"));\n    }\n}',
    solution:
      'public class Main {\n    static int parseXp(String text) {\n        try {\n            return Integer.parseInt(text);\n        } catch (NumberFormatException e) {\n            return 0;\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println("XP1: " + parseXp("120"));\n        System.out.println("XP2: " + parseXp("oops"));\n    }\n}',
    tests: tests("XP1: 120\nXP2: 0"),
  },
  {
    slug: "exceptions-specific-exception-types",
    title: "Specific Exception Types",
    description:
      "Failure category identify karo aur broad catch-all ke bajaye expected exception type ke according response choose karo.",
    problem:
      "Invalid number aur invalid list index different bugs/failures hain. Dono ko same generic message dena diagnosis aur recovery ko weak banata hai.",
    why:
      "Exception type failure semantics communicate karta hai. Specific handling learner ko APIs ke contracts aur failure modes read karna sikhata hai.",
    model:
      "NumberFormatException      → text cannot become number\nIndexOutOfBoundsException    → invalid index\nIllegalArgumentException     → caller supplied invalid argument\n\nType carries meaning.",
    syntax:
      "catch (NumberFormatException e) { ... }\ncatch (IndexOutOfBoundsException e) { ... }",
    remember:
      "Specific type tab catch karo jab us failure ke liye meaningful response pata ho. Broad `Exception` ko default habit mat banao.",
    example:
      'try {\n    Integer.parseInt("x");\n} catch (NumberFormatException e) {\n    System.out.println("Not a number");\n}',
    trace:
      "operation fails → exception object has concrete type → matching catch selection depends on type compatibility",
    mistake:
      "Every failure ko `catch (Exception e)` se indistinguishable banana.",
    fix:
      "Expected failure modes list karo and handlers ko unke semantics ke around design karo.",
    predict: ["Invalid integer text ke liye common exception?", "NumberFormatException"],
    predict2: ["Exception type failure ka meaning communicate kar sakta hai? yes/no", "yes"],
    prompt:
      'Two independent risky operations handle karo: `"abc"` parse aur List `[10,20]` ka index 5 access. Exact output:\nBad number\nBad index\nDone',
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Handle invalid parse specifically.\n        // Handle invalid list index specifically.\n        System.out.println("Done");\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            Integer.parseInt("abc");\n        } catch (NumberFormatException e) {\n            System.out.println("Bad number");\n        }\n\n        try {\n            List<Integer> values = List.of(10, 20);\n            System.out.println(values.get(5));\n        } catch (IndexOutOfBoundsException e) {\n            System.out.println("Bad index");\n        }\n\n        System.out.println("Done");\n    }\n}',
    tests: tests("Bad number\nBad index\nDone"),
  },
  {
    slug: "exceptions-multiple-catch-blocks",
    title: "Multiple `catch` Blocks",
    description:
      "Ek risky workflow ke distinct failure modes ko ordered, specific handlers me map karo.",
    problem:
      "User text pehle index parse karta hai, phir List access. Input numeric na ho sakta hai, ya numeric but out of range ho sakta hai—responses different hone chahiye.",
    why:
      "Multiple catches learner ko control-flow classification karwate hain: same try region, different exception type, different recovery.",
    model:
      "try\n ├─ NumberFormatException      → \"Not a number\"\n └─ IndexOutOfBoundsException  → \"Index unavailable\"\n\nfirst compatible catch handles the exception",
    syntax:
      "try { ... }\ncatch (NumberFormatException e) { ... }\ncatch (IndexOutOfBoundsException e) { ... }",
    remember:
      "Catch ordering type hierarchy respect karti hai: broader handler ko specific handler se pehle rakhoge to later specific catch unreachable ho sakta hai.",
    example:
      'try {\n    int i = Integer.parseInt(input);\n    System.out.println(values.get(i));\n} catch (NumberFormatException e) {\n    ...\n} catch (IndexOutOfBoundsException e) {\n    ...\n}',
    trace:
      '"x" → parse throws → number catch; "5" → parse succeeds → get(5) throws → index catch; "1" → no catch',
    mistake:
      "Broad catch first rakhkar specific handlers ko unreachable ya useless bana dena.",
    fix:
      "Specific handlers first; broad fallback only when genuinely needed.",
    predict: ["Multiple catches me kaunsa handler run karta hai?", "matching catch"],
    predict2: ["Specific catch ko broader superclass catch se pehle rakhna generally correct hai? yes/no", "yes"],
    prompt:
      'Method `read(List<String>, String)` banao. `"x"` → `Not a number`, `"5"` → `Bad index`, `"1"` → element. List `[Forest, Castle]`. Exact output:\nNot a number\nBad index\nCastle',
    starter:
      'import java.util.*;\n\npublic class Main {\n    static void read(List<String> values, String input) {\n        // Parse input and read the index using multiple specific catches.\n    }\n\n    public static void main(String[] args) {\n        List<String> values = List.of("Forest", "Castle");\n        read(values, "x");\n        read(values, "5");\n        read(values, "1");\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    static void read(List<String> values, String input) {\n        try {\n            int index = Integer.parseInt(input);\n            System.out.println(values.get(index));\n        } catch (NumberFormatException e) {\n            System.out.println("Not a number");\n        } catch (IndexOutOfBoundsException e) {\n            System.out.println("Bad index");\n        }\n    }\n\n    public static void main(String[] args) {\n        List<String> values = List.of("Forest", "Castle");\n        read(values, "x");\n        read(values, "5");\n        read(values, "1");\n    }\n}',
    tests: tests("Not a number\nBad index\nCastle"),
  },
  {
    slug: "exceptions-finally",
    title: "`finally`",
    description:
      "`finally` ko success/failure-independent cleanup/finalization path ki tarah trace karo—without treating it as universal resource-management solution.",
    problem:
      "Kuch action risky operation succeed ho ya fail, dono cases me run hona chahiye: e.g. attempt counter/log marker or manually managed cleanup.",
    why:
      "`finally` control-flow understanding deepen karta hai. Later resource handling me learner better judge kar sakega ki unconditional finalization kab needed hai.",
    model:
      "try success ─────┐\n                 ├→ finally → continue\ncatch handled ───┘",
    syntax:
      "try { ... }\ncatch (RuntimeException e) { ... }\nfinally {\n    System.out.println(\"Attempt finished\");\n}",
    remember:
      "`finally` normally both successful and exceptional paths ke baad runs. But real closeable resources ke liye modern Java often try-with-resources prefer karta hai; wo later topic hai.",
    example:
      'try {\n    System.out.println("Work");\n} finally {\n    System.out.println("Cleanup");\n}',
    trace:
      "enter try → success or matching catch path → finally executes → method continues/returns as applicable",
    mistake:
      "`finally` ko only-error block samajhna.",
    fix:
      "Catch = handling a matching failure; finally = path-independent finalization.",
    predict: ["Success aur handled failure dono ke baad commonly run hone wala block?", "finally"],
    predict2: ["`finally` sirf exception aane par run hota hai? yes/no", "no"],
    prompt:
      'Method `attempt(String text)` parse kare. Success par value print, invalid par `Invalid`, aur har call me finally se `Attempt finished`. Calls `"7"` and `"x"`. Exact output:\nValue: 7\nAttempt finished\nInvalid\nAttempt finished',
    starter:
      'public class Main {\n    static void attempt(String text) {\n        // try parse, catch invalid number, finally print Attempt finished.\n    }\n\n    public static void main(String[] args) {\n        attempt("7");\n        attempt("x");\n    }\n}',
    solution:
      'public class Main {\n    static void attempt(String text) {\n        try {\n            int value = Integer.parseInt(text);\n            System.out.println("Value: " + value);\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid");\n        } finally {\n            System.out.println("Attempt finished");\n        }\n    }\n\n    public static void main(String[] args) {\n        attempt("7");\n        attempt("x");\n    }\n}',
    tests: tests("Value: 7\nAttempt finished\nInvalid\nAttempt finished"),
  },
  {
    slug: "exceptions-throwing-exceptions-intro",
    title: "Throwing Exceptions Intro",
    description:
      "API consumer se exception catch karne ke baad API designer ki responsibility lo: invalid arguments ko intentionally reject karo.",
    problem:
      "Method `awardXp(-50)` silently accept kare to object state invalid ho sakti hai. Caller contract violation ko explicit signal chahiye.",
    why:
      "Exceptions sirf library failures handle karne ke liye nahi. Domain/API invariants protect karne ke liye code intentionally exception throw kar sakta hai.",
    model:
      "caller → method validates input\n             ├─ valid   → normal result\n             └─ invalid → throw IllegalArgumentException\n\nNo invalid mutation.",
    syntax:
      "if (amount < 0) {\n    throw new IllegalArgumentException(\"XP cannot be negative\");\n}",
    remember:
      "`throw` exception object ko signal karta hai. Validation ideally invalid state mutate hone se pehle hoti hai.",
    example:
      'static void setLevel(int level) {\n    if (level < 1) throw new IllegalArgumentException("level");\n}',
    trace:
      "award(-20) → validate → invalid → throw → remaining method body skipped → caller may catch",
    mistake:
      "Invalid value pe state first update karna, then exception throw karna.",
    fix:
      "Preconditions validate first; only valid input ke baad mutation.",
    predict: ["Invalid method argument signal karne ke liye common runtime exception?", "IllegalArgumentException"],
    predict2: ["`throw` ke baad same method path ki next statement execute hoti hai? yes/no", "no"],
    prompt:
      "`Player.awardXp(int amount)` banao. Negative amount par `IllegalArgumentException`; otherwise XP add. Start 100, award 50, then -20 catch karo. Exact output:\nXP: 150\nRejected: XP cannot be negative\nFinal XP: 150",
    starter:
      'class Player {\n    private int xp = 100;\n\n    void awardXp(int amount) {\n        // Validate before mutation.\n    }\n\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n        player.awardXp(50);\n        System.out.println("XP: " + player.getXp());\n\n        // Try invalid award and print exception message.\n        System.out.println("Final XP: " + player.getXp());\n    }\n}',
    solution:
      'class Player {\n    private int xp = 100;\n\n    void awardXp(int amount) {\n        if (amount < 0) {\n            throw new IllegalArgumentException("XP cannot be negative");\n        }\n        xp += amount;\n    }\n\n    int getXp() { return xp; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player player = new Player();\n        player.awardXp(50);\n        System.out.println("XP: " + player.getXp());\n\n        try {\n            player.awardXp(-20);\n        } catch (IllegalArgumentException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n        System.out.println("Final XP: " + player.getXp());\n    }\n}',
    tests: tests("XP: 150\nRejected: XP cannot be negative\nFinal XP: 150"),
  },
  {
    slug: "exceptions-propagation-basics",
    title: "Propagation Basics",
    description:
      "Exception ko call stack ke through trace karo aur decide karo kis layer ke paas meaningful handling context hai.",
    problem:
      "Har helper method exception catch kare to errors prematurely swallow ho sakte hain. Kabhi helper ke paas recovery context nahi hota, caller ke paas hota hai.",
    why:
      "Propagation learner ko `catch everywhere` habit se bahar nikalta hai. Handling location responsibility aur context se decide honi chahiye.",
    model:
      "main()\n  ↓ calls\nloadXp()\n  ↓ calls\nparseXp() → throws NumberFormatException\n  ↑ no catch\nloadXp() ↑ no catch\nmain() catches and decides response",
    syntax:
      "static int parseXp(String text) {\n    return Integer.parseInt(text); // may propagate\n}",
    remember:
      "Unchecked exception ko har method me catch karna required nahi. Agar current layer meaningful recovery nahi kar sakti, propagation clearer ho sakta hai.",
    example:
      'static int parse(String text) {\n    return Integer.parseInt(text);\n}\n// caller decides whether/how to catch',
    trace:
      "deep method throws → current frame has no matching catch → unwinds to caller → repeats until matching catch or uncaught termination",
    mistake:
      "Every helper me empty catch + fake default return, jisse original failure hidden ho jata hai.",
    fix:
      "Exception wahan handle karo jahan meaningful decision possible ho; otherwise allow it to propagate.",
    predict: ["No matching catch in current method ho to exception generally kahan jata hai?", "caller"],
    predict2: ["Har unchecked exception ko same method me catch karna mandatory hai? yes/no", "no"],
    prompt:
      '`parseXp` simply `Integer.parseInt` call kare; `loadXp` parseXp call kare without catch; `main` `"oops"` failure catch kare. Exact output:\nLoading...\nCould not load XP\nProgram continues',
    starter:
      'public class Main {\n    static int parseXp(String text) {\n        // Let parse failure propagate.\n        return 0;\n    }\n\n    static int loadXp(String text) {\n        // Call parseXp without catching here.\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Loading...");\n        // Catch at the layer that can choose the user-facing response.\n        System.out.println("Program continues");\n    }\n}',
    solution:
      'public class Main {\n    static int parseXp(String text) {\n        return Integer.parseInt(text);\n    }\n\n    static int loadXp(String text) {\n        return parseXp(text);\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Loading...");\n        try {\n            loadXp("oops");\n        } catch (NumberFormatException e) {\n            System.out.println("Could not load XP");\n        }\n        System.out.println("Program continues");\n    }\n}',
    tests: tests("Loading...\nCould not load XP\nProgram continues"),
  },
  {
    slug: "exceptions-exceptions-recap",
    title: "🏆 Safe Quest Enrollment",
    description:
      "Week 5 collection state ko exception boundaries ke saath combine karo: validation, intentional throwing, propagation, specific handling aur state preservation.",
    problem:
      "Quest enrollment service ko malformed student ID, unknown student, unknown quest aur duplicate enrollment distinguish karna hai—without corrupting collection state.",
    why:
      "Module proof syntax recall nahi. Learner ko decide karna hai kaunsi failure validation exception banegi, kahan throw hogi, kahan handle hogi, aur failed operation state ko unchanged kaise rakhegi.",
    model:
      "UI/request layer parses text\n      ↓ NumberFormatException may happen\nservice enroll(studentId, questId)\n      ↓ validates registries\n      ├─ unknown student → IllegalArgumentException\n      ├─ unknown quest   → IllegalArgumentException\n      ├─ duplicate       → IllegalStateException\n      └─ valid           → mutate Set\ncaller catches known failures → message\nfinally → request finished",
    syntax:
      "if (!students.containsKey(id)) throw new IllegalArgumentException(...);\nif (!enrolled.add(questId)) throw new IllegalStateException(...);",
    remember:
      "Exception handling aur collection invariants ek saath design karo: validate before mutation; specific failures signal karo; caller ko meaningful handling do; failed requests state leak na karein.",
    example:
      "valid enrollment changes Set once; duplicate throws after Set.add returns false but state remains unchanged; unknown references are rejected before mutation.",
    trace:
      "parse request → service validation → possible throw propagates → caller catches specific type → finally logs completion → next request continues",
    mistake:
      "One giant `catch(Exception)` se every failure same banana, invalid state first mutate karna, ya duplicate silently ignore karna.",
    fix:
      "Failure categories define karo, narrow validation boundaries rakho, specific exception types/messages use karo, state invariants verify karo.",
    predict: ["Duplicate valid enrollment ko domain state failure ke roop me signal karne ke liye is challenge me kaunsi exception?", "IllegalStateException"],
    predict2: ["Unknown student ko enrollment Set me add karne se pehle validate karna chahiye? yes/no", "yes"],
    prompt:
      'Safe Quest Enrollment system complete karo. Students IDs {101,205}; quests {JAVA,OOP}; per-student enrolled quest Set maintain karo. `enroll(int,String)` unknown student/quest par `IllegalArgumentException`, duplicate par `IllegalStateException`, valid par mutate kare. Request helper student ID text parse kare and these failures print kare; finally every request par `Request finished` print kare. Requests: ("101","JAVA"), ("101","JAVA"), ("999","JAVA"), ("abc","OOP"), ("205","OOP"). Exact output:\nEnrolled 101 -> JAVA\nRequest finished\nDuplicate enrollment\nRequest finished\nUnknown student\nRequest finished\nInvalid student id\nRequest finished\nEnrolled 205 -> OOP\nRequest finished\n101 enrollments: 1\n205 enrollments: 1',
    starter:
      'import java.util.*;\n\nclass EnrollmentService {\n    private final Set<Integer> students = new HashSet<>(Set.of(101, 205));\n    private final Set<String> quests = new HashSet<>(Set.of("JAVA", "OOP"));\n    private final Map<Integer, Set<String>> enrollments = new HashMap<>();\n\n    EnrollmentService() {\n        for (int id : students) {\n            enrollments.put(id, new HashSet<>());\n        }\n    }\n\n    void enroll(int studentId, String questCode) {\n        // Validate unknown student and quest before mutation.\n        // Duplicate enrollment must throw IllegalStateException.\n    }\n\n    int enrollmentCount(int studentId) {\n        return enrollments.get(studentId).size();\n    }\n}\n\npublic class Main {\n    static void process(EnrollmentService service, String studentIdText, String questCode) {\n        // Parse student id, call service, catch specific failures,\n        // and always print Request finished in finally.\n    }\n\n    public static void main(String[] args) {\n        EnrollmentService service = new EnrollmentService();\n\n        process(service, "101", "JAVA");\n        process(service, "101", "JAVA");\n        process(service, "999", "JAVA");\n        process(service, "abc", "OOP");\n        process(service, "205", "OOP");\n\n        System.out.println("101 enrollments: " + service.enrollmentCount(101));\n        System.out.println("205 enrollments: " + service.enrollmentCount(205));\n    }\n}',
    solution:
      'import java.util.*;\n\nclass EnrollmentService {\n    private final Set<Integer> students = new HashSet<>(Set.of(101, 205));\n    private final Set<String> quests = new HashSet<>(Set.of("JAVA", "OOP"));\n    private final Map<Integer, Set<String>> enrollments = new HashMap<>();\n\n    EnrollmentService() {\n        for (int id : students) {\n            enrollments.put(id, new HashSet<>());\n        }\n    }\n\n    void enroll(int studentId, String questCode) {\n        if (!students.contains(studentId)) {\n            throw new IllegalArgumentException("Unknown student");\n        }\n        if (!quests.contains(questCode)) {\n            throw new IllegalArgumentException("Unknown quest");\n        }\n        if (!enrollments.get(studentId).add(questCode)) {\n            throw new IllegalStateException("Duplicate enrollment");\n        }\n    }\n\n    int enrollmentCount(int studentId) {\n        return enrollments.get(studentId).size();\n    }\n}\n\npublic class Main {\n    static void process(EnrollmentService service, String studentIdText, String questCode) {\n        try {\n            int studentId = Integer.parseInt(studentIdText);\n            service.enroll(studentId, questCode);\n            System.out.println("Enrolled " + studentId + " -> " + questCode);\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid student id");\n        } catch (IllegalArgumentException | IllegalStateException e) {\n            System.out.println(e.getMessage());\n        } finally {\n            System.out.println("Request finished");\n        }\n    }\n\n    public static void main(String[] args) {\n        EnrollmentService service = new EnrollmentService();\n\n        process(service, "101", "JAVA");\n        process(service, "101", "JAVA");\n        process(service, "999", "JAVA");\n        process(service, "abc", "OOP");\n        process(service, "205", "OOP");\n\n        System.out.println("101 enrollments: " + service.enrollmentCount(101));\n        System.out.println("205 enrollments: " + service.enrollmentCount(205));\n    }\n}',
    tests: tests(
      "Enrolled 101 -> JAVA\nRequest finished\nDuplicate enrollment\nRequest finished\nUnknown student\nRequest finished\nInvalid student id\nRequest finished\nEnrolled 205 -> OOP\nRequest finished\n101 enrollments: 1\n205 enrollments: 1",
    ),
    minutes: 40,
  },
];

export const exceptionsModule = specModule(
  {
    slug: "exceptions",
    title: "Module 41 — Exceptions",
    description:
      "Runtime failures ko trace, classify, intentionally signal aur meaningful boundaries par handle karo—without corrupting program state.",
    position: 41,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
