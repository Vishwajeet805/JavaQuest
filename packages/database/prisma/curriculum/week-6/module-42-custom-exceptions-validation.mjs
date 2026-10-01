import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "custom-exceptions-validation-why-custom-exceptions",
    title: "Why Custom Exceptions",
    description:
      "Generic failure types ke bajaye domain rule ko meaningful exception name me express karo.",
    problem:
      "`IllegalArgumentException` technically kaam kar sakti hai, but caller ko sirf generic invalid argument pata chalta hai. Course enrollment me `CourseFullException` much clearer domain signal ho sakta hai.",
    why:
      "Module 41 ne throwing/handling sikhaya. Ab learner failure vocabulary design karega: kaunsa broken business rule apni exception identity deserve karta hai?",
    model:
      "generic failure:\nIllegalArgumentException\n\nvs domain failure:\nInvalidScoreException\nCourseFullException\nDuplicateEnrollmentException\n\nException type = failure category in domain language",
    syntax:
      "class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) {\n        super(message);\n    }\n}",
    remember:
      "Custom exception tab useful hai jab failure ko distinct domain meaning dena caller ke handling/diagnosis ko clearer banata hai.",
    example:
      'if (score < 0 || score > 100) {\n    throw new InvalidScoreException("Score must be 0..100");\n}',
    trace:
      "invalid score → validation detects broken rule → custom exception created/thrown → caller sees meaningful type",
    mistake:
      "Har tiny failure ke liye unnecessary custom exception class banana.",
    fix:
      "Custom type tab banao jab failure category domain me meaningful aur separately handleable ho.",
    predict: ["Domain-specific failure ko naam dene ke liye kya create kar sakte hain?", "custom exception"],
    predict2: ["Custom exception ka benefit sirf custom message hota hai? yes/no", "no"],
    prompt:
      "`InvalidLevelException` custom checked exception use karke level 0 reject karo. Exact output:\nRejected: Level must be at least 1",
    starter:
      'class InvalidLevelException extends Exception {\n    // Add a constructor that forwards the message.\n}\n\npublic class Main {\n    static void validateLevel(int level) throws InvalidLevelException {\n        // Reject levels below 1.\n    }\n\n    public static void main(String[] args) {\n        try {\n            validateLevel(0);\n        } catch (InvalidLevelException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n    }\n}',
    solution:
      'class InvalidLevelException extends Exception {\n    InvalidLevelException(String message) {\n        super(message);\n    }\n}\n\npublic class Main {\n    static void validateLevel(int level) throws InvalidLevelException {\n        if (level < 1) {\n            throw new InvalidLevelException("Level must be at least 1");\n        }\n    }\n\n    public static void main(String[] args) {\n        try {\n            validateLevel(0);\n        } catch (InvalidLevelException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n    }\n}',
    tests: tests("Rejected: Level must be at least 1"),
  },
  {
    slug: "custom-exceptions-validation-create-exception-class",
    title: "Create an Exception Class",
    description:
      "Custom checked exception ka minimal correct class design karo aur superclass constructor ke through message preserve karo.",
    problem:
      "Exception class sirf naam nahi; caller ko useful diagnostic message bhi milna chahiye through normal exception API.",
    why:
      "Inheritance knowledge ko exception hierarchy ke real use me apply karna hai: custom type existing `Exception` behavior inherit karti hai.",
    model:
      "Exception\n   ↑\nInvalidScoreException\n\nconstructor(message)\n      ↓\nsuper(message)\n      ↓\ngetMessage() works",
    syntax:
      "class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) {\n        super(message);\n    }\n}",
    remember:
      "`super(message)` base Exception ko message initialize karne deta hai; caller later `getMessage()` use kar sakta hai.",
    example:
      'throw new InvalidScoreException("Score 120 is outside 0..100");',
    trace:
      "new custom exception(message) → constructor → super(message) → inherited message stored → catch → getMessage",
    mistake:
      "Constructor message receive karke `super(message)` na call karna, then useful message lose karna.",
    fix:
      "Minimal custom exception me meaningful constructor + superclass initialization rakho.",
    predict: ["Exception message retrieve karne ka inherited method?", "getMessage"],
    predict2: ["Custom exception inheritance use karti hai? yes/no", "yes"],
    prompt:
      "`InvalidScoreException extends Exception` implement karo. `new InvalidScoreException(\"Score 120 is invalid\")` throw/catch karke exact output:\nType: InvalidScoreException\nMessage: Score 120 is invalid",
    starter:
      'class InvalidScoreException extends Exception {\n    // Constructor here.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            // Throw the custom exception.\n        } catch (InvalidScoreException e) {\n            System.out.println("Type: " + e.getClass().getSimpleName());\n            System.out.println("Message: " + e.getMessage());\n        }\n    }\n}',
    solution:
      'class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) {\n        super(message);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            throw new InvalidScoreException("Score 120 is invalid");\n        } catch (InvalidScoreException e) {\n            System.out.println("Type: " + e.getClass().getSimpleName());\n            System.out.println("Message: " + e.getMessage());\n        }\n    }\n}',
    tests: tests("Type: InvalidScoreException\nMessage: Score 120 is invalid"),
  },
  {
    slug: "custom-exceptions-validation-throw-keyword",
    title: "`throw` Keyword",
    description:
      "`throw` aur `throws` ko separate responsibilities ke roop me reason karo: one signals now, the other declares possible propagation.",
    problem:
      "Beginners often `throw` and `throws` interchange kar dete hain. Ek actual exception object signal karta hai; doosra method contract me possibility declare karta hai.",
    why:
      "Checked custom exceptions ke saath dono keywords frequently same method me appear karte hain, so distinction precise hona chahiye.",
    model:
      "method signature: throws InvalidScoreException\n                         ↑ may propagate\n\nmethod body: throw new InvalidScoreException(...)\n             ↑ signal now",
    syntax:
      "static void validate(int score) throws InvalidScoreException {\n    if (score < 0) throw new InvalidScoreException(\"...\");\n}",
    remember:
      "`throw` statement ek exception object ke saath use hota hai. `throws` method signature me possible exception types declare karta hai.",
    example:
      'static void enter(int age) throws TooYoungException {\n    if (age < 18) throw new TooYoungException("Too young");\n}',
    trace:
      "call validate → condition invalid → `throw new ...` executes → method normal return nahi karta → exception caller ki taraf propagates",
    mistake:
      "`throws new InvalidScoreException(...)` ya `throw InvalidScoreException` jaisi syntax mix karna.",
    fix:
      "Remember: `throw` = action/object; `throws` = declaration/type(s).",
    predict: ["Actual exception object signal karne wala keyword?", "throw"],
    predict2: ["Method signature me possible checked exception declare karne wala keyword `throws` hai? yes/no", "yes"],
    prompt:
      "`validateScore` 0..100 accept kare. Invalid score par custom checked exception throw karo; main catch kare. Inputs 85 and 120. Exact output:\nAccepted: 85\nRejected: 120",
    starter:
      'class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) { super(message); }\n}\n\npublic class Main {\n    static void validateScore(int score) throws InvalidScoreException {\n        // Throw for values outside 0..100.\n    }\n\n    static void test(int score) {\n        // Call validateScore and print accepted/rejected.\n    }\n\n    public static void main(String[] args) {\n        test(85);\n        test(120);\n    }\n}',
    solution:
      'class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) { super(message); }\n}\n\npublic class Main {\n    static void validateScore(int score) throws InvalidScoreException {\n        if (score < 0 || score > 100) {\n            throw new InvalidScoreException("Invalid score");\n        }\n    }\n\n    static void test(int score) {\n        try {\n            validateScore(score);\n            System.out.println("Accepted: " + score);\n        } catch (InvalidScoreException e) {\n            System.out.println("Rejected: " + score);\n        }\n    }\n\n    public static void main(String[] args) {\n        test(85);\n        test(120);\n    }\n}',
    tests: tests("Accepted: 85\nRejected: 120"),
  },
  {
    slug: "custom-exceptions-validation-validation-method",
    title: "Validation Method",
    description:
      "Validation ko reusable method boundary me centralize karo so rule ek jagah defined ho aur invalid state mutation se pehle stop ho.",
    problem:
      "Same score rule registration, update aur import paths me duplicate ho to conditions drift kar sakti hain. Ek path 100 allow kare, another accidentally 99 tak.",
    why:
      "Validation method domain invariant ko reusable contract banata hai and mutation code ko cleaner rakhta hai.",
    model:
      "input\n  ↓\nvalidateScore(score)\n  ├─ valid → return normally → mutation allowed\n  └─ invalid → throw → mutation never starts",
    syntax:
      "static void validateScore(int score) throws InvalidScoreException {\n    if (score < 0 || score > 100) throw ...;\n}",
    remember:
      "Validation method ka success often simply 'returns normally' hota hai. Failure exception ke through exits.",
    example:
      "validateScore(newScore);\nstudent.setScore(newScore); // only reached if valid",
    trace:
      "old score80 → request120 → validate throws → setter line skipped → score remains80",
    mistake:
      "State update first, validation second.",
    fix:
      "Validate first, mutate second. Failed validation ko state unchanged chhodna chahiye.",
    predict: ["Validation fail hone par mutation se pehle kya hona chahiye?", "exception"],
    predict2: ["Reusable validation rule duplicate conditions reduce kar sakta hai? yes/no", "yes"],
    prompt:
      "Student score initially 80 hai. `setScore` validation method call kare before mutation. 95 accepted, 120 rejected. Exact output:\nScore: 95\nRejected: Score must be 0..100\nFinal score: 95",
    starter:
      'class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) { super(message); }\n}\n\nclass Student {\n    private int score = 80;\n\n    static void validateScore(int score) throws InvalidScoreException {\n        // Validate 0..100.\n    }\n\n    void setScore(int score) throws InvalidScoreException {\n        // Validate before mutation.\n    }\n\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student();\n        try {\n            student.setScore(95);\n            System.out.println("Score: " + student.getScore());\n            student.setScore(120);\n        } catch (InvalidScoreException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n        System.out.println("Final score: " + student.getScore());\n    }\n}',
    solution:
      'class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) { super(message); }\n}\n\nclass Student {\n    private int score = 80;\n\n    static void validateScore(int score) throws InvalidScoreException {\n        if (score < 0 || score > 100) {\n            throw new InvalidScoreException("Score must be 0..100");\n        }\n    }\n\n    void setScore(int score) throws InvalidScoreException {\n        validateScore(score);\n        this.score = score;\n    }\n\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student student = new Student();\n        try {\n            student.setScore(95);\n            System.out.println("Score: " + student.getScore());\n            student.setScore(120);\n        } catch (InvalidScoreException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n        System.out.println("Final score: " + student.getScore());\n    }\n}',
    tests: tests("Score: 95\nRejected: Score must be 0..100\nFinal score: 95"),
  },
  {
    slug: "custom-exceptions-validation-checked-vs-runtime-intro",
    title: "Checked vs Runtime Intro",
    description:
      "Checked custom exception aur runtime exception ke compiler contracts compare karo—without treating one category as universally better.",
    problem:
      "Why does one custom exception require `catch`/`throws` while `IllegalArgumentException` often does not? Difference compiler enforcement me hai.",
    why:
      "Learner ko exception hierarchy ka practical consequence samajhna hai before choosing custom exception base class.",
    model:
      "Exception\n ├─ checked custom exception → compiler requires handle/declare\n └─ RuntimeException\n      └─ unchecked custom exception → no catch/throws requirement\n\nChoice should follow API/domain design.",
    syntax:
      "class EnrollmentException extends Exception { ... }        // checked\nclass InvalidScoreException extends RuntimeException { ... } // unchecked",
    remember:
      "Checked = caller ko compile-time handle/declare obligation. RuntimeException = unchecked. Category choice failure semantics/API expectations se karo, convenience se nahi.",
    example:
      "A recoverable workflow-specific failure may be modeled checked; programmer/precondition violations are often modeled unchecked—but design context matters.",
    trace:
      "method declares checked exception → caller must catch or declare → unchecked exception can propagate without declaration",
    mistake:
      "Checked = good and runtime = bad, ya vice versa, as absolute rule.",
    fix:
      "Compiler obligation samjho; then API contract and expected recovery decide karo.",
    predict: ["`RuntimeException` descendants checked hote hain ya unchecked?", "unchecked"],
    predict2: ["Checked exception caller ko catch ya declare karne ki compile-time obligation de sakti hai? yes/no", "yes"],
    prompt:
      "Ek checked `CourseFullException extends Exception` aur unchecked `InvalidCreditsException extends RuntimeException` create karo. Program class hierarchy checks print kare. Exact output:\nCourseFull checked-style: true\nInvalidCredits runtime: true",
    starter:
      'class CourseFullException extends Exception {\n    CourseFullException(String message) { super(message); }\n}\n\nclass InvalidCreditsException extends RuntimeException {\n    InvalidCreditsException(String message) { super(message); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Use instanceof to demonstrate each hierarchy.\n    }\n}',
    solution:
      'class CourseFullException extends Exception {\n    CourseFullException(String message) { super(message); }\n}\n\nclass InvalidCreditsException extends RuntimeException {\n    InvalidCreditsException(String message) { super(message); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Exception checked = new CourseFullException("full");\n        RuntimeException runtime = new InvalidCreditsException("credits");\n\n        System.out.println("CourseFull checked-style: " + (checked instanceof CourseFullException));\n        System.out.println("InvalidCredits runtime: " + (runtime instanceof InvalidCreditsException));\n    }\n}',
    tests: tests("CourseFull checked-style: true\nInvalidCredits runtime: true"),
  },
  {
    slug: "custom-exceptions-validation-meaningful-messages",
    title: "Meaningful Messages",
    description:
      "Exception message ko actionable diagnostic context banao—rule, received value aur expected constraint clearly communicate karo.",
    problem:
      "`Invalid input` caller/developer ko almost nothing batata hai. `Score 120 is outside allowed range 0..100` immediately useful hai.",
    why:
      "Custom type failure category batati hai; message specific instance/context explain karta hai. Dono together strong diagnostics dete hain.",
    model:
      "type: InvalidScoreException → WHAT category failed\nmessage: Score 120 ...       → WHICH value / WHY it failed",
    syntax:
      'throw new InvalidScoreException(\n    "Score " + score + " is outside 0..100"\n);',
    remember:
      "Message concise but specific rakho. Relevant bad value + violated rule usually useful hote hain; secrets/sensitive data blindly include mat karo.",
    example:
      'throw new InvalidCreditsException("Credits -3 must be >= 0");',
    trace:
      "input120 → validation knows value/rule → constructs contextual message → handler can display/log meaningful diagnostic",
    mistake:
      'Every custom exception me same vague `"Invalid input"` message.',
    fix:
      "Message ko failure instance-specific banao while type category-specific rahe.",
    predict: ["Custom exception type category batati hai; message kya add karta hai?", "context"],
    predict2: ["Bad value aur expected rule message ko more useful bana sakte hain? yes/no", "yes"],
    prompt:
      "Score validator invalid values ke liye received score message me include kare. Inputs -5 and 120. Exact output:\nScore -5 is outside 0..100\nScore 120 is outside 0..100",
    starter:
      'class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) { super(message); }\n}\n\npublic class Main {\n    static void validate(int score) throws InvalidScoreException {\n        // Throw a contextual message for invalid score.\n    }\n\n    static void test(int score) {\n        try {\n            validate(score);\n        } catch (InvalidScoreException e) {\n            System.out.println(e.getMessage());\n        }\n    }\n\n    public static void main(String[] args) {\n        test(-5);\n        test(120);\n    }\n}',
    solution:
      'class InvalidScoreException extends Exception {\n    InvalidScoreException(String message) { super(message); }\n}\n\npublic class Main {\n    static void validate(int score) throws InvalidScoreException {\n        if (score < 0 || score > 100) {\n            throw new InvalidScoreException("Score " + score + " is outside 0..100");\n        }\n    }\n\n    static void test(int score) {\n        try {\n            validate(score);\n        } catch (InvalidScoreException e) {\n            System.out.println(e.getMessage());\n        }\n    }\n\n    public static void main(String[] args) {\n        test(-5);\n        test(120);\n    }\n}',
    tests: tests("Score -5 is outside 0..100\nScore 120 is outside 0..100"),
  },
  {
    slug: "custom-exceptions-validation-validation-boundaries",
    title: "Validation Boundaries",
    description:
      "Validation ko correct layer par place karo: object-local invariants object ke paas, cross-entity rules service boundary par, parsing input boundary par.",
    problem:
      "Har validation `main` me ho to domain objects unsafe ho jate hain. Har rule entity constructor me ho to cross-collection knowledge unnecessarily couple hota hai.",
    why:
      "Mature exception design asks not only WHAT to validate, but WHERE. Boundary choice maintainability aur state integrity directly affect karta hai.",
    model:
      "input boundary → parse/format validation\nStudent      → own score/name invariants\nEnrollmentService → student exists? course exists? capacity? duplicate?\n\nRule lives near the knowledge needed to enforce it.",
    syntax:
      "Student.setScore(...)        // local invariant\nEnrollmentService.enroll(...) // cross-entity invariant",
    remember:
      "Validation us layer par rakho jahan required knowledge naturally available ho. Duplicate checks ko random UI code me scatter mat karo.",
    example:
      "Student knows valid score range. EnrollmentService knows registries and course capacity.",
    trace:
      "request text parsed at edge → service validates relationship → entity validates its own state → only then mutation",
    mistake:
      "Same business rule multiple callers me duplicate karna, allowing one path to bypass it.",
    fix:
      "Invariant ownership decide karo and validation ko authoritative boundary me centralize karo.",
    predict: ["Cross-entity enrollment rule ka natural owner UI ya service layer?", "service layer"],
    predict2: ["Object-local invariant ko object ke methods/constructor me enforce karna useful ho sakta hai? yes/no", "yes"],
    prompt:
      "Course capacity 2 hai. `EnrollmentService.enroll` unknown student, unknown course aur full course validate kare. Students {101,205,330}, JAVA capacity2. Enroll 101,205 then 330. Exact output:\nEnrolled: 101\nEnrolled: 205\nRejected: Course JAVA is full\nJAVA size: 2",
    starter:
      'import java.util.*;\n\nclass EnrollmentException extends Exception {\n    EnrollmentException(String message) { super(message); }\n}\n\nclass EnrollmentService {\n    private final Set<Integer> students = new HashSet<>(Set.of(101, 205, 330));\n    private final Map<String, Integer> capacity = new HashMap<>();\n    private final Map<String, Set<Integer>> enrolled = new HashMap<>();\n\n    EnrollmentService() {\n        capacity.put("JAVA", 2);\n        enrolled.put("JAVA", new HashSet<>());\n    }\n\n    void enroll(int studentId, String code) throws EnrollmentException {\n        // Validate references, duplicate membership and capacity before mutation.\n    }\n\n    int size(String code) { return enrolled.get(code).size(); }\n}\n\npublic class Main {\n    static void attempt(EnrollmentService service, int id) {\n        try {\n            service.enroll(id, "JAVA");\n            System.out.println("Enrolled: " + id);\n        } catch (EnrollmentException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n    }\n\n    public static void main(String[] args) {\n        EnrollmentService service = new EnrollmentService();\n        attempt(service, 101);\n        attempt(service, 205);\n        attempt(service, 330);\n        System.out.println("JAVA size: " + service.size("JAVA"));\n    }\n}',
    solution:
      'import java.util.*;\n\nclass EnrollmentException extends Exception {\n    EnrollmentException(String message) { super(message); }\n}\n\nclass EnrollmentService {\n    private final Set<Integer> students = new HashSet<>(Set.of(101, 205, 330));\n    private final Map<String, Integer> capacity = new HashMap<>();\n    private final Map<String, Set<Integer>> enrolled = new HashMap<>();\n\n    EnrollmentService() {\n        capacity.put("JAVA", 2);\n        enrolled.put("JAVA", new HashSet<>());\n    }\n\n    void enroll(int studentId, String code) throws EnrollmentException {\n        if (!students.contains(studentId)) {\n            throw new EnrollmentException("Unknown student " + studentId);\n        }\n        if (!capacity.containsKey(code)) {\n            throw new EnrollmentException("Unknown course " + code);\n        }\n        Set<Integer> roster = enrolled.get(code);\n        if (roster.contains(studentId)) {\n            throw new EnrollmentException("Student already enrolled");\n        }\n        if (roster.size() >= capacity.get(code)) {\n            throw new EnrollmentException("Course " + code + " is full");\n        }\n        roster.add(studentId);\n    }\n\n    int size(String code) { return enrolled.get(code).size(); }\n}\n\npublic class Main {\n    static void attempt(EnrollmentService service, int id) {\n        try {\n            service.enroll(id, "JAVA");\n            System.out.println("Enrolled: " + id);\n        } catch (EnrollmentException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n    }\n\n    public static void main(String[] args) {\n        EnrollmentService service = new EnrollmentService();\n        attempt(service, 101);\n        attempt(service, 205);\n        attempt(service, 330);\n        System.out.println("JAVA size: " + service.size("JAVA"));\n    }\n}',
    tests: tests("Enrolled: 101\nEnrolled: 205\nRejected: Course JAVA is full\nJAVA size: 2"),
  },
  {
    slug: "custom-exceptions-validation-custom-exception-recap",
    title: "🏆 Course Registration Guard",
    description:
      "Custom exception hierarchy, checked contracts, validation ownership, contextual messages aur state-safe mutations ko one domain workflow me combine karo.",
    problem:
      "Course registration ko malformed/invalid credits, duplicate code aur capacity constraints distinguish karne hain. Failed operation registry ko partially mutate nahi kar sakta.",
    why:
      "Module proof custom class syntax nahi. Learner ko failure taxonomy design karni hai, validation boundaries choose karni hain, and caller-facing handling ko domain semantics se connect karna hai.",
    model:
      "Course constructor\n  └─ credits invariant → InvalidCreditsException (runtime)\n\nCourseCatalog.register(course)\n  ├─ duplicate code → DuplicateCourseException (checked)\n  ├─ catalog full   → CatalogFullException (checked)\n  └─ valid          → mutate Map\n\ncaller handles domain failures; failed registrations leave Map unchanged",
    syntax:
      "class DuplicateCourseException extends Exception { ... }\nclass CatalogFullException extends Exception { ... }\nclass InvalidCreditsException extends RuntimeException { ... }",
    remember:
      "Exception type = failure category; message = instance context; boundary = owner of rule; mutation = only after all relevant validation succeeds.",
    example:
      "new Course(\"JAVA\", -1) fails inside Course; registering duplicate JAVA fails inside CourseCatalog; neither corrupts catalog state.",
    trace:
      "construct course → local validation → register → catalog validation → mutate only on success → caller catches appropriate type → continue",
    mistake:
      "One generic exception for every rule, validation after mutation, or caller duplicating catalog invariants before every call.",
    fix:
      "Domain failures classify karo, authoritative boundary par enforce karo, contextual messages do, state transitions atomic-at-method-level rakho.",
    predict: ["Duplicate course code rule ka natural owner Course object ya CourseCatalog?", "CourseCatalog"],
    predict2: ["Invalid credits constructor me reject karke invalid Course object creation stop kar sakte hain? yes/no", "yes"],
    prompt:
      'Course Registration Guard complete karo. `Course` code/title/credits rakhe; credits 1..6 outside hone par unchecked `InvalidCreditsException`. `CourseCatalog` max 2 courses; duplicate code par checked `DuplicateCourseException`, full catalog par checked `CatalogFullException`. Attempts: JAVA/4 accepted, DB/3 accepted, JAVA/5 duplicate, WEB/4 full, BAD/0 invalid credits. Exact output:\nRegistered: JAVA\nRegistered: DB\nRejected: Course JAVA already exists\nRejected: Catalog capacity 2 reached\nRejected: Credits 0 must be 1..6\nCatalog size: 2\nHas JAVA: true\nHas WEB: false',
    starter:
      'import java.util.*;\n\nclass DuplicateCourseException extends Exception {\n    DuplicateCourseException(String message) { super(message); }\n}\n\nclass CatalogFullException extends Exception {\n    CatalogFullException(String message) { super(message); }\n}\n\nclass InvalidCreditsException extends RuntimeException {\n    InvalidCreditsException(String message) { super(message); }\n}\n\nclass Course {\n    private final String code;\n    private final String title;\n    private final int credits;\n\n    Course(String code, String title, int credits) {\n        // Validate credits 1..6 before assigning state.\n        this.code = code;\n        this.title = title;\n        this.credits = credits;\n    }\n\n    String getCode() { return code; }\n    String getTitle() { return title; }\n    int getCredits() { return credits; }\n}\n\nclass CourseCatalog {\n    private final int maxCourses;\n    private final Map<String, Course> courses = new HashMap<>();\n\n    CourseCatalog(int maxCourses) {\n        this.maxCourses = maxCourses;\n    }\n\n    void register(Course course)\n        throws DuplicateCourseException, CatalogFullException {\n        // Validate duplicate and capacity before mutation.\n    }\n\n    int size() { return courses.size(); }\n    boolean contains(String code) { return courses.containsKey(code); }\n}\n\npublic class Main {\n    static void attempt(CourseCatalog catalog, String code, String title, int credits) {\n        // Construct Course, register it, and catch the three domain failure types.\n    }\n\n    public static void main(String[] args) {\n        CourseCatalog catalog = new CourseCatalog(2);\n        attempt(catalog, "JAVA", "Java Foundations", 4);\n        attempt(catalog, "DB", "Databases", 3);\n        attempt(catalog, "JAVA", "Advanced Java", 5);\n        attempt(catalog, "WEB", "Web", 4);\n        attempt(catalog, "BAD", "Broken", 0);\n\n        System.out.println("Catalog size: " + catalog.size());\n        System.out.println("Has JAVA: " + catalog.contains("JAVA"));\n        System.out.println("Has WEB: " + catalog.contains("WEB"));\n    }\n}',
    solution:
      'import java.util.*;\n\nclass DuplicateCourseException extends Exception {\n    DuplicateCourseException(String message) { super(message); }\n}\n\nclass CatalogFullException extends Exception {\n    CatalogFullException(String message) { super(message); }\n}\n\nclass InvalidCreditsException extends RuntimeException {\n    InvalidCreditsException(String message) { super(message); }\n}\n\nclass Course {\n    private final String code;\n    private final String title;\n    private final int credits;\n\n    Course(String code, String title, int credits) {\n        if (credits < 1 || credits > 6) {\n            throw new InvalidCreditsException("Credits " + credits + " must be 1..6");\n        }\n        this.code = code;\n        this.title = title;\n        this.credits = credits;\n    }\n\n    String getCode() { return code; }\n    String getTitle() { return title; }\n    int getCredits() { return credits; }\n}\n\nclass CourseCatalog {\n    private final int maxCourses;\n    private final Map<String, Course> courses = new HashMap<>();\n\n    CourseCatalog(int maxCourses) {\n        this.maxCourses = maxCourses;\n    }\n\n    void register(Course course)\n        throws DuplicateCourseException, CatalogFullException {\n        if (courses.containsKey(course.getCode())) {\n            throw new DuplicateCourseException(\n                "Course " + course.getCode() + " already exists"\n            );\n        }\n        if (courses.size() >= maxCourses) {\n            throw new CatalogFullException(\n                "Catalog capacity " + maxCourses + " reached"\n            );\n        }\n        courses.put(course.getCode(), course);\n    }\n\n    int size() { return courses.size(); }\n    boolean contains(String code) { return courses.containsKey(code); }\n}\n\npublic class Main {\n    static void attempt(CourseCatalog catalog, String code, String title, int credits) {\n        try {\n            Course course = new Course(code, title, credits);\n            catalog.register(course);\n            System.out.println("Registered: " + code);\n        } catch (DuplicateCourseException | CatalogFullException | InvalidCreditsException e) {\n            System.out.println("Rejected: " + e.getMessage());\n        }\n    }\n\n    public static void main(String[] args) {\n        CourseCatalog catalog = new CourseCatalog(2);\n        attempt(catalog, "JAVA", "Java Foundations", 4);\n        attempt(catalog, "DB", "Databases", 3);\n        attempt(catalog, "JAVA", "Advanced Java", 5);\n        attempt(catalog, "WEB", "Web", 4);\n        attempt(catalog, "BAD", "Broken", 0);\n\n        System.out.println("Catalog size: " + catalog.size());\n        System.out.println("Has JAVA: " + catalog.contains("JAVA"));\n        System.out.println("Has WEB: " + catalog.contains("WEB"));\n    }\n}',
    tests: tests(
      "Registered: JAVA\nRegistered: DB\nRejected: Course JAVA already exists\nRejected: Catalog capacity 2 reached\nRejected: Credits 0 must be 1..6\nCatalog size: 2\nHas JAVA: true\nHas WEB: false",
    ),
    minutes: 40,
  },
];

export const customExceptionsValidationModule = specModule(
  {
    slug: "custom-exceptions-validation",
    title: "Module 42 — Custom Exceptions & Validation",
    description:
      "Domain rules ko meaningful custom exception types, deliberate validation boundaries aur state-safe failure contracts ke through express karo.",
    position: 42,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
