import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "week-5-student-course-capstone-system-requirements",
    title: "System Requirements → Data Model",
    description:
      "Capstone ko code se start mat karo. Requirements ko entities, identities, relationships aur collection invariants me translate karo.",
    problem:
      "Student/Course Manager ko students, unique course codes aur enrollments track karne hain. Wrong model choose hua to later search, duplicate prevention aur reports unnecessarily difficult ho jayenge.",
    why: "Week 5 ka final responsibility syntax recall nahi; ambiguous requirements ko suitable collection architecture me convert karna hai.",
    model:
      "Student registry:   id → Student                 Map<Integer,Student>\nCourse catalog:     code → Course                 Map<String,Course>\nEnrollment:         course code → unique student IDs Map<String,Set<Integer>>\n\nIdentity, lookup aur uniqueness alag responsibilities hain.",
    syntax:
      "Map<Integer, Student> students = new HashMap<>();\nMap<String, Course> courses = new HashMap<>();\nMap<String, Set<Integer>> enrollments = new HashMap<>();",
    remember:
      "Collection type implementation detail se pehle invariant decide karo: key unique? order required? duplicate membership allowed?",
    example:
      'Student id 101 must be unique.\nCourse code "JAVA" must be unique.\nStudent 101 can enroll in JAVA at most once.',
    trace:
      "requirements → identify stable keys → choose Map registries → enrollment is one-to-many + unique membership → Map<String,Set<Integer>>",
    mistake:
      "Names ko identity banana, enrollment ko `List<String>` me dump karna, ya same structure se every requirement solve karna.",
    fix: "Har responsibility ko explicit invariant do. Stable IDs/codes ko keys banao; unique relationship membership ko Set se represent karo.",
    predict: [
      "Student lookup by unique numeric id ke liye strongest direct fit?",
      "Map",
    ],
    predict2: [
      "Per-course duplicate enrollment prevent karne ke liye Set useful hai? yes/no",
      "yes",
    ],
    prompt:
      "Requirements se initial structures banao: students 101 Aman and 205 Riya; courses JAVA and DB; empty enrollment Sets. Exact output:\nStudents: 2\nCourses: 2\nJAVA enrolled: 0",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, String> students = new HashMap<>();\n        Map<String, String> courses = new HashMap<>();\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n\n        // Add two students, two courses, and empty enrollment sets.\n\n        System.out.println("Students: " + students.size());\n        System.out.println("Courses: " + courses.size());\n        System.out.println("JAVA enrolled: " + enrollments.get("JAVA").size());\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, String> students = new HashMap<>();\n        students.put(101, "Aman");\n        students.put(205, "Riya");\n\n        Map<String, String> courses = new HashMap<>();\n        courses.put("JAVA", "Java Foundations");\n        courses.put("DB", "Databases");\n\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n        enrollments.put("JAVA", new HashSet<>());\n        enrollments.put("DB", new HashSet<>());\n\n        System.out.println("Students: " + students.size());\n        System.out.println("Courses: " + courses.size());\n        System.out.println("JAVA enrolled: " + enrollments.get("JAVA").size());\n    }\n}',
    tests: tests("Students: 2\nCourses: 2\nJAVA enrolled: 0"),
  },
  {
    slug: "week-5-student-course-capstone-student-list",
    title: "Build the Student Registry",
    description:
      "Student objects ko stable ID se index karo and duplicate identity ko deliberate update/rejection decision ki tarah handle karo.",
    problem:
      "Roster List display ke liye useful ho sakti hai, but capstone ko repeated student-by-id lookup aur unique IDs chahiye.",
    why: "Module 35/39 ke lookup-table pattern ko domain model me apply karna hai. Data structure requirement ko simplify kare, not just hold objects.",
    model:
      "Map<Integer,Student>\n101 → Student(Aman, 82)\n205 → Student(Riya, 91)\n\ncontainsKey(id) answers identity presence.",
    syntax:
      "Map<Integer, Student> students = new HashMap<>();\nstudents.put(student.getId(), student);",
    remember:
      "Map key ko stable domain identity choose karo. Duplicate key ka `put` replacement behavior intentional hona chahiye.",
    example:
      'Student s = new Student(101, "Aman", 82);\nstudents.put(s.getId(), s);',
    trace:
      "add101 → registry size1 → add205 → size2 → get205 returns Riya object",
    mistake: "Student name ko unique key assume karna.",
    fix: "Stable unique student ID ko registry key banao.",
    predict: ["`Map<Integer,Student>` me lookup key?", "Integer"],
    predict2: [
      "Same ID ko `put` karne par existing value replace ho sakti hai? yes/no",
      "yes",
    ],
    prompt:
      "Student class + registry banao. Students: 101 Aman/82, 205 Riya/91, 330 Kabir/76. ID 205 lookup karke exact output lao:\nStudents: 3\n205: Riya\nScore: 91",
    starter:
      "import java.util.*;\n\nclass Student {\n    private final int id;\n    private final String name;\n    private final int score;\n\n    Student(int id, String name, int score) {\n        this.id = id;\n        this.name = name;\n        this.score = score;\n    }\n\n    int getId() { return id; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Student> students = new HashMap<>();\n        // Add the three students and lookup 205.\n    }\n}",
    solution:
      'import java.util.*;\n\nclass Student {\n    private final int id;\n    private final String name;\n    private final int score;\n\n    Student(int id, String name, int score) {\n        this.id = id;\n        this.name = name;\n        this.score = score;\n    }\n\n    int getId() { return id; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Student> students = new HashMap<>();\n        students.put(101, new Student(101, "Aman", 82));\n        students.put(205, new Student(205, "Riya", 91));\n        students.put(330, new Student(330, "Kabir", 76));\n\n        Student selected = students.get(205);\n        System.out.println("Students: " + students.size());\n        System.out.println("205: " + selected.getName());\n        System.out.println("Score: " + selected.getScore());\n    }\n}',
    tests: tests("Students: 3\n205: Riya\nScore: 91"),
  },
  {
    slug: "week-5-student-course-capstone-unique-course-codes",
    title: "Protect Unique Course Codes",
    description:
      "Course catalog ko unique code identity ke around model karo and duplicate code handling ko explicit validation rule banao.",
    problem:
      "Two courses same code use karein to Map silently previous Course replace kar sakta hai. Catalog requirement replacement nahi, duplicate rejection ho sakti hai.",
    why: "Collection guarantee aur business rule same cheez nahi. Map keys unique hain, but application ko decide karna hai duplicate put update hai ya invalid request.",
    model:
      "register(course):\nif code already exists → reject\nelse → put code→Course\n\nMap uniqueness + validation policy",
    syntax:
      "if (!courses.containsKey(code)) {\n    courses.put(code, course);\n}",
    remember:
      "Map duplicate key ko prevent nahi karta in the sense of throwing automatically—it associates one current value. Business-level duplicate rejection tum implement karte ho.",
    example:
      "register JAVA once → accepted\nregister JAVA again → rejected; original remains",
    trace:
      "catalog empty → JAVA absent → insert → JAVA present → second registration rejected → size stays1",
    mistake:
      "Duplicate code `put` karke assume karna operation fail ho jayega.",
    fix: "Registration semantics ke liye `containsKey` check ya suitable API contract use karo before mutation.",
    predict: [
      "Duplicate Map key `put` normally reject/throw karta hai ya replace?",
      "replace",
    ],
    predict2: [
      "Business duplicate validation explicitly add karni pad sakti hai? yes/no",
      "yes",
    ],
    prompt:
      "Codes JAVA, DB, JAVA, WEB register attempts process karo. Duplicate code reject karo. Exact output:\nAccepted: 3\nRejected: 1\nCourses: 3",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[] codes = {"JAVA", "DB", "JAVA", "WEB"};\n        Map<String, String> courses = new HashMap<>();\n        int accepted = 0;\n        int rejected = 0;\n\n        // Register only new codes.\n\n        System.out.println("Accepted: " + accepted);\n        System.out.println("Rejected: " + rejected);\n        System.out.println("Courses: " + courses.size());\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[] codes = {"JAVA", "DB", "JAVA", "WEB"};\n        Map<String, String> courses = new HashMap<>();\n        int accepted = 0;\n        int rejected = 0;\n\n        for (String code : codes) {\n            if (courses.containsKey(code)) {\n                rejected++;\n            } else {\n                courses.put(code, code);\n                accepted++;\n            }\n        }\n\n        System.out.println("Accepted: " + accepted);\n        System.out.println("Rejected: " + rejected);\n        System.out.println("Courses: " + courses.size());\n    }\n}',
    tests: tests("Accepted: 3\nRejected: 1\nCourses: 3"),
  },
  {
    slug: "week-5-student-course-capstone-enrollment-map",
    title: "Model Enrollments",
    description:
      "Many-to-many relationship ka one direction model karo: course code se unique enrolled student IDs.",
    problem:
      "Course me multiple students ho sakte hain aur student multiple courses join kar sakta hai. Same student-course pair duplicate nahi hona chahiye.",
    why: "Ye Week 5 collection composition ka core proof hai: Map one-to-many grouping deta hai; nested Set relationship uniqueness enforce karta hai.",
    model:
      "Map<String, Set<Integer>>\nJAVA → {101,205}\nDB   → {205,330}\n\nSet.add return → first enrollment vs duplicate attempt",
    syntax:
      "enrollments.putIfAbsent(code, new HashSet<>());\nboolean added = enrollments.get(code).add(studentId);",
    remember:
      "Nested collection ka type relationship semantics encode karta hai. `List` duplicate enrollment allow karta; `Set` at-most-once membership model karta hai.",
    example:
      'boolean first = enrollments.get("JAVA").add(101);\nboolean duplicate = enrollments.get("JAVA").add(101);',
    trace:
      "JAVA {} → add101 true → {101} → add205 true → {101,205} → add101 false",
    mistake: "Enrollment List me blindly add karke duplicate pair count karna.",
    fix: "Per-course membership ko Set banao and `add` return ko validation signal use karo.",
    predict: [
      "Same student-course pair second time add hone par Set.add return?",
      "false",
    ],
    predict2: [
      "`Map<String,Set<Integer>>` one course to many unique student IDs model kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Enroll attempts JAVA:101, JAVA:205, JAVA:101, DB:205 process karo. `Set.add` return se duplicate count derive karo. Exact output:\nJAVA students: 2\nDB students: 1\nDuplicate enrollments: 1",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n        enrollments.put("JAVA", new HashSet<>());\n        enrollments.put("DB", new HashSet<>());\n        int duplicates = 0;\n\n        // Process the four enrollment attempts using Set.add return values.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n        enrollments.put("JAVA", new HashSet<>());\n        enrollments.put("DB", new HashSet<>());\n        int duplicates = 0;\n\n        if (!enrollments.get("JAVA").add(101)) duplicates++;\n        if (!enrollments.get("JAVA").add(205)) duplicates++;\n        if (!enrollments.get("JAVA").add(101)) duplicates++;\n        if (!enrollments.get("DB").add(205)) duplicates++;\n\n        System.out.println("JAVA students: " + enrollments.get("JAVA").size());\n        System.out.println("DB students: " + enrollments.get("DB").size());\n        System.out.println("Duplicate enrollments: " + duplicates);\n    }\n}',
    tests: tests("JAVA students: 2\nDB students: 1\nDuplicate enrollments: 1"),
  },
  {
    slug: "week-5-student-course-capstone-search-student",
    title: "Search Across the Model",
    description:
      "Direct lookup aur derived search ko distinguish karo: ID lookup Map se, name search traversal se when name is not identity.",
    problem:
      "System ko ID se exact student aur name fragment se matching students dono chahiye. Same access strategy dono questions ke liye ideal nahi.",
    why: "Collection architecture tab useful hai jab learner query shape dekhkar correct path choose kare, not every search ko loop ya Map lookup force kare.",
    model:
      "exact ID query → students.get(id)\nname condition → iterate students.values()\n\nidentity lookup ≠ predicate search",
    syntax:
      "Student exact = students.get(id);\nfor (Student s : students.values()) {\n    if (s.getName().startsWith(prefix)) { ... }\n}",
    remember:
      "Map fast/direct key lookup deta hai only for chosen key. Non-key property queries still traversal require kar sakti hain.",
    example:
      "ID 205 → direct Map lookup\nname starts A → scan values and test predicate",
    trace:
      "query type identify → key query uses get → field condition scans values → collect/count matches",
    mistake:
      "Name ko second identity Map bana dena even when duplicate names allowed hain.",
    fix: "Non-unique search fields ko predicate search treat karo unless separate one-to-many index genuinely required ho.",
    predict: ["Student ID registry key ho to ID lookup method?", "get"],
    predict2: [
      "Duplicate names allowed hon to simple `Map<String,Student>` safe complete name index hai? yes/no",
      "no",
    ],
    prompt:
      "Students 101 Aman, 205 Aditi, 330 Kabir, 404 Amanpreet registry me hain. ID 330 direct lookup karo and names starting `A` count karo. Exact output:\n330: Kabir\nNames starting A: 3",
    starter:
      'import java.util.*;\n\nclass Student {\n    final int id;\n    final String name;\n    Student(int id, String name) { this.id = id; this.name = name; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Student> students = new HashMap<>();\n        students.put(101, new Student(101, "Aman"));\n        students.put(205, new Student(205, "Aditi"));\n        students.put(330, new Student(330, "Kabir"));\n        students.put(404, new Student(404, "Amanpreet"));\n\n        // Direct ID lookup + predicate-based name search.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Student {\n    final int id;\n    final String name;\n    Student(int id, String name) { this.id = id; this.name = name; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, Student> students = new HashMap<>();\n        students.put(101, new Student(101, "Aman"));\n        students.put(205, new Student(205, "Aditi"));\n        students.put(330, new Student(330, "Kabir"));\n        students.put(404, new Student(404, "Amanpreet"));\n\n        Student exact = students.get(330);\n        int matches = 0;\n        for (Student student : students.values()) {\n            if (student.name.startsWith("A")) matches++;\n        }\n\n        System.out.println("330: " + exact.name);\n        System.out.println("Names starting A: " + matches);\n    }\n}',
    tests: tests("330: Kabir\nNames starting A: 3"),
  },
  {
    slug: "week-5-student-course-capstone-sort-reports",
    title: "Build Deterministic Reports",
    description:
      "Internal HashMap/Set order ko UI/report order mat banao. Domain objects ki copies ko explicit Comparators se sort karo.",
    problem:
      "Registry lookup-friendly hai, but report ko score descending and ties by name ascending chahiye. Map iteration order business requirement nahi hai.",
    why: "Module 38 ka ordering design capstone architecture me integrate hota hai: storage structure aur presentation order separate responsibilities hain.",
    model:
      "students.values()\n      ↓ mutable copy\nList<Student>\n      ↓ Comparator: score desc, name asc\nstable deterministic report",
    syntax:
      "List<Student> report = new ArrayList<>(students.values());\nreport.sort(Comparator.comparingInt(Student::getScore)\n    .reversed()\n    .thenComparing(Student::getName));",
    remember:
      "Storage order aur report order ko separate rakho. Deterministic output ke liye explicit comparator/tie-breaker use karo.",
    example:
      "Riya 91, Aman 82, Kabir 82 → score desc then name asc → Riya, Aman, Kabir",
    trace:
      "copy values → compare scores → equal score? compare names → source Map unchanged",
    mistake: "HashMap iteration ko leaderboard order assume karna.",
    fix: "Values ki List copy banao and report-specific Comparator apply karo.",
    predict: ["Comparator tie-break chain method?", "thenComparing"],
    predict2: [
      "HashMap iteration order ko leaderboard contract banana safe hai? yes/no",
      "no",
    ],
    prompt:
      "Students Aman/82, Riya/91, Kabir/82, Aditi/91 ko score descending then name ascending sort karo. Exact output:\nAditi 91\nRiya 91\nAman 82\nKabir 82",
    starter:
      'import java.util.*;\n\nclass Student {\n    private final String name;\n    private final int score;\n    Student(String name, int score) { this.name = name; this.score = score; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Student> report = new ArrayList<>(List.of(\n            new Student("Aman", 82),\n            new Student("Riya", 91),\n            new Student("Kabir", 82),\n            new Student("Aditi", 91)\n        ));\n\n        // Sort score descending, then name ascending.\n        for (Student s : report) {\n            System.out.println(s.getName() + " " + s.getScore());\n        }\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Student {\n    private final String name;\n    private final int score;\n    Student(String name, int score) { this.name = name; this.score = score; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Student> report = new ArrayList<>(List.of(\n            new Student("Aman", 82),\n            new Student("Riya", 91),\n            new Student("Kabir", 82),\n            new Student("Aditi", 91)\n        ));\n\n        report.sort(\n            Comparator.comparingInt(Student::getScore)\n                .reversed()\n                .thenComparing(Student::getName)\n        );\n\n        for (Student s : report) {\n            System.out.println(s.getName() + " " + s.getScore());\n        }\n    }\n}',
    tests: tests("Aditi 91\nRiya 91\nAman 82\nKabir 82"),
  },
  {
    slug: "week-5-student-course-capstone-generic-helper",
    title: "Extract a Generic Helper",
    description:
      "Repeated collection lookup/fallback behavior ko small reusable generic abstraction me extract karo without erasing type safety.",
    problem:
      "Student aur Course registries dono key lookup + fallback style behavior need kar sakte hain. `Object` helper casts introduce karega.",
    why: "Module 37 generics ko capstone me purposeful reuse milta hai: abstraction tab extract karo jab behavior truly type-independent ho.",
    model:
      "static <K,V> V getOrFallback(Map<K,V> map, K key, V fallback)\n\nsame helper:\nMap<Integer,Student>\nMap<String,Course>",
    syntax:
      "static <K, V> V getOrFallback(Map<K, V> map, K key, V fallback) {\n    return map.getOrDefault(key, fallback);\n}",
    remember:
      "Generic helper ko concrete domain fields know nahi hone chahiye. Type-independent behavior abstract karo; domain behavior domain classes me rakho.",
    example:
      'Student s = getOrFallback(students, 999, unknownStudent);\nCourse c = getOrFallback(courses, "X", unknownCourse);',
    trace:
      "compiler infers K/V from Map and arguments → return remains precise domain type → no cast",
    mistake:
      "`Object get(Map map, Object key)` helper likhkar generics benefits lose karna.",
    fix: "Independent key/value roles ko `<K,V>` se preserve karo.",
    predict: ["Generic Map helper ke two natural type roles?", "K and V"],
    predict2: [
      "Well-typed generic helper manual casts avoid kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "`getOrFallback` generic helper implement karo. Integer→String map me existing 101 and missing 999 query karo. Exact output:\n101: Aman\n999: Unknown",
    starter:
      'import java.util.*;\n\npublic class Main {\n    static <K, V> V getOrFallback(Map<K, V> map, K key, V fallback) {\n        // TODO\n        return null;\n    }\n\n    public static void main(String[] args) {\n        Map<Integer, String> students = new HashMap<>();\n        students.put(101, "Aman");\n\n        System.out.println("101: " + getOrFallback(students, 101, "Unknown"));\n        System.out.println("999: " + getOrFallback(students, 999, "Unknown"));\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    static <K, V> V getOrFallback(Map<K, V> map, K key, V fallback) {\n        return map.getOrDefault(key, fallback);\n    }\n\n    public static void main(String[] args) {\n        Map<Integer, String> students = new HashMap<>();\n        students.put(101, "Aman");\n\n        System.out.println("101: " + getOrFallback(students, 101, "Unknown"));\n        System.out.println("999: " + getOrFallback(students, 999, "Unknown"));\n    }\n}',
    tests: tests("101: Aman\n999: Unknown"),
  },
  {
    slug: "week-5-student-course-capstone-validation-and-debugging",
    title: "Validation and Debugging",
    description:
      "Cross-collection invariants enforce aur debug karo: unknown student/course reject ho, duplicate enrollment state mutate na kare.",
    problem:
      "Nested collections syntactically correct ho sakti hain but invalid relationships contain kar sakti hain—e.g. nonexistent student 999 enrolled in JAVA.",
    why: "Capstone-level correctness individual collection se aage hai. Multiple structures ke beech consistency application logic maintain karti hai.",
    model:
      "enroll(studentId, courseCode):\n1. student exists?\n2. course exists?\n3. relationship already exists?\n4. only then mutate\n\nValidation before mutation.",
    syntax:
      "if (!students.containsKey(studentId)) return false;\nif (!courses.containsKey(courseCode)) return false;\nreturn enrollments.get(courseCode).add(studentId);",
    remember:
      "Invalid request ko partial state change nahi karna chahiye. Preconditions validate karo, then mutation perform karo.",
    example:
      'enroll(999,"JAVA") → student missing → false → enrollment unchanged',
    trace:
      "request → validate student → validate course → Set.add → result tells accepted/duplicate",
    mistake:
      "Enrollment Set me ID add karne ke baad student existence check karna.",
    fix: "Cross-collection preconditions mutation se pehle validate karo.",
    predict: [
      "Unknown student enrollment request state mutate karna chahiye? yes/no",
      "no",
    ],
    predict2: [
      "Duplicate valid enrollment ko Set.add result detect kar sakta hai? yes/no",
      "yes",
    ],
    bug: {
      slug: "week-5-student-course-capstone-validation-and-debugging-bug",
      title: "Debug: Invalid Enrollment Leaks Into State",
      prompt:
        "Buggy code unknown student ko Set me add kar deta hai because validation mutation ke baad hai. Fix order so exact output ho:\nAccepted: false\nJAVA students: 1",
      starterCode:
        'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, String> students = new HashMap<>();\n        students.put(101, "Aman");\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n        enrollments.put("JAVA", new HashSet<>(Set.of(101)));\n\n        int requestedId = 999;\n        boolean accepted = enrollments.get("JAVA").add(requestedId);\n        if (!students.containsKey(requestedId)) {\n            accepted = false;\n        }\n\n        System.out.println("Accepted: " + accepted);\n        System.out.println("JAVA students: " + enrollments.get("JAVA").size());\n    }\n}',
      solution:
        'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, String> students = new HashMap<>();\n        students.put(101, "Aman");\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n        enrollments.put("JAVA", new HashSet<>(Set.of(101)));\n\n        int requestedId = 999;\n        boolean accepted = false;\n        if (students.containsKey(requestedId)) {\n            accepted = enrollments.get("JAVA").add(requestedId);\n        }\n\n        System.out.println("Accepted: " + accepted);\n        System.out.println("JAVA students: " + enrollments.get("JAVA").size());\n    }\n}',
      tests: tests("Accepted: false\nJAVA students: 1"),
    },
    prompt:
      "Students {101}, courses {JAVA}, enrollment JAVA={101}. Requests: (999,JAVA), (101,DB), (101,JAVA). Count invalid references vs duplicate valid enrollment without mutating invalid state. Exact output:\nInvalid: 2\nDuplicates: 1\nJAVA students: 1",
    starter:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Set<Integer> students = new HashSet<>(Set.of(101));\n        Set<String> courses = new HashSet<>(Set.of("JAVA"));\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n        enrollments.put("JAVA", new HashSet<>(Set.of(101)));\n\n        int invalid = 0;\n        int duplicates = 0;\n        // Validate the three requests before mutation.\n    }\n}',
    solution:
      'import java.util.*;\n\npublic class Main {\n    static boolean valid(Set<Integer> students, Set<String> courses, int id, String code) {\n        return students.contains(id) && courses.contains(code);\n    }\n\n    public static void main(String[] args) {\n        Set<Integer> students = new HashSet<>(Set.of(101));\n        Set<String> courses = new HashSet<>(Set.of("JAVA"));\n        Map<String, Set<Integer>> enrollments = new HashMap<>();\n        enrollments.put("JAVA", new HashSet<>(Set.of(101)));\n\n        int invalid = 0;\n        int duplicates = 0;\n\n        int[] ids = {999, 101, 101};\n        String[] codes = {"JAVA", "DB", "JAVA"};\n        for (int i = 0; i < ids.length; i++) {\n            if (!valid(students, courses, ids[i], codes[i])) {\n                invalid++;\n                continue;\n            }\n            if (!enrollments.get(codes[i]).add(ids[i])) {\n                duplicates++;\n            }\n        }\n\n        System.out.println("Invalid: " + invalid);\n        System.out.println("Duplicates: " + duplicates);\n        System.out.println("JAVA students: " + enrollments.get("JAVA").size());\n    }\n}',
    tests: tests("Invalid: 2\nDuplicates: 1\nJAVA students: 1"),
  },
  {
    slug: "week-5-student-course-capstone-final-course-manager",
    title: "🏆 Final Student/Course Manager",
    description:
      "Week 5 ka independent capstone: domain objects, generic collections, nested relationships, validation, lookup, iteration aur comparator reports ko coherent system me integrate karo.",
    problem:
      "Ek mini course manager build karo jo students/courses register kare, valid unique enrollments accept kare, invalid/duplicate requests reject kare, course roster aur leaderboard derive kare.",
    why: "Ye Week 5 independence proof hai. Learner ko prescribed single API follow nahi karni; requirements ko structures, invariants, operations aur deterministic reports me translate karna hai.",
    model:
      "CourseManager\n ├─ Map<Integer,Student> students\n ├─ Map<String,Course> courses\n └─ Map<String,Set<Integer>> enrollments\n\nregister → validate → enroll → lookup → derive reports → sort copies",
    syntax:
      "boolean enroll(int studentId, String code) { ... }\nList<Student> roster(String code) { ... }\nList<Student> leaderboard() { ... }",
    remember:
      "Capstone success = correct data model + preserved invariants + derived results. Collections ko requirement-driven roles do; internal iteration order ko report contract mat banao.",
    example:
      "Valid unique enrollment mutates state once. Duplicate/unknown request leaves state unchanged. Reports are derived from current source-of-truth collections.",
    trace:
      "register entities → process enrollment requests → accepted/rejected counters → derive JAVA roster → derive leaderboard → sort explicitly → print report",
    mistake:
      "Names as identity, List-based duplicate enrollments, invalid partial mutations, raw types, hardcoded report results, HashMap/HashSet order dependence.",
    fix: "Stable IDs/codes use karo; typed Maps/Sets compose karo; validate before mutation; output state se derive karo; comparator tie-breakers explicit rakho.",
    predict: [
      "Capstone enrollment relationship ke liye chosen nested shape?",
      "Map<String, Set<Integer>>",
    ],
    predict2: [
      "Report order ko explicit comparator se derive karna chahiye? yes/no",
      "yes",
    ],
    prompt:
      "Final Student/Course Manager implement karo. Students: 101 Aman/82, 205 Riya/91, 330 Kabir/82, 404 Aditi/95. Courses: JAVA/Java Foundations, DB/Databases. Enrollment requests: (101,JAVA),(205,JAVA),(330,DB),(101,JAVA duplicate),(999,JAVA invalid),(404,JAVA),(205,DB),(330,JAVA). `enroll` false return kare for invalid or duplicate. JAVA roster name ascending ho. Global leaderboard score descending then name ascending ho. Exact output:\nStudents: 4\nCourses: 2\nAccepted enrollments: 6\nRejected enrollments: 2\nJAVA roster: [Aditi, Aman, Kabir, Riya]\nDB roster size: 2\nLeaderboard: [Aditi=95, Riya=91, Aman=82, Kabir=82]\nStudent 205: Riya",
    starter:
      'import java.util.*;\n\nclass Student {\n    private final int id;\n    private final String name;\n    private final int score;\n\n    Student(int id, String name, int score) {\n        this.id = id;\n        this.name = name;\n        this.score = score;\n    }\n\n    int getId() { return id; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\nclass Course {\n    private final String code;\n    private final String title;\n\n    Course(String code, String title) {\n        this.code = code;\n        this.title = title;\n    }\n\n    String getCode() { return code; }\n    String getTitle() { return title; }\n}\n\nclass CourseManager {\n    private final Map<Integer, Student> students = new HashMap<>();\n    private final Map<String, Course> courses = new HashMap<>();\n    private final Map<String, Set<Integer>> enrollments = new HashMap<>();\n\n    boolean addStudent(Student student) {\n        // Reject duplicate student IDs.\n        return false;\n    }\n\n    boolean addCourse(Course course) {\n        // Reject duplicate course codes and create enrollment bucket.\n        return false;\n    }\n\n    boolean enroll(int studentId, String courseCode) {\n        // Validate both references, then reject duplicate relationship.\n        return false;\n    }\n\n    Student findStudent(int id) {\n        return null;\n    }\n\n    int studentCount() { return 0; }\n    int courseCount() { return 0; }\n\n    List<Student> roster(String courseCode) {\n        // Return enrolled Student objects sorted name ascending.\n        return null;\n    }\n\n    List<Student> leaderboard() {\n        // Return all students sorted score desc, then name asc.\n        return null;\n    }\n}\n\npublic class Main {\n    static List<String> names(List<Student> students) {\n        List<String> result = new ArrayList<>();\n        for (Student s : students) result.add(s.getName());\n        return result;\n    }\n\n    static List<String> leaderboardText(List<Student> students) {\n        List<String> result = new ArrayList<>();\n        for (Student s : students) result.add(s.getName() + "=" + s.getScore());\n        return result;\n    }\n\n    public static void main(String[] args) {\n        CourseManager manager = new CourseManager();\n\n        // Register four students and two courses.\n        // Process the eight enrollment requests and count accepted/rejected.\n        // Derive every report from manager state.\n    }\n}',
    solution:
      'import java.util.*;\n\nclass Student {\n    private final int id;\n    private final String name;\n    private final int score;\n\n    Student(int id, String name, int score) {\n        this.id = id;\n        this.name = name;\n        this.score = score;\n    }\n\n    int getId() { return id; }\n    String getName() { return name; }\n    int getScore() { return score; }\n}\n\nclass Course {\n    private final String code;\n    private final String title;\n\n    Course(String code, String title) {\n        this.code = code;\n        this.title = title;\n    }\n\n    String getCode() { return code; }\n    String getTitle() { return title; }\n}\n\nclass CourseManager {\n    private final Map<Integer, Student> students = new HashMap<>();\n    private final Map<String, Course> courses = new HashMap<>();\n    private final Map<String, Set<Integer>> enrollments = new HashMap<>();\n\n    boolean addStudent(Student student) {\n        if (students.containsKey(student.getId())) return false;\n        students.put(student.getId(), student);\n        return true;\n    }\n\n    boolean addCourse(Course course) {\n        if (courses.containsKey(course.getCode())) return false;\n        courses.put(course.getCode(), course);\n        enrollments.put(course.getCode(), new HashSet<>());\n        return true;\n    }\n\n    boolean enroll(int studentId, String courseCode) {\n        if (!students.containsKey(studentId)) return false;\n        if (!courses.containsKey(courseCode)) return false;\n        return enrollments.get(courseCode).add(studentId);\n    }\n\n    Student findStudent(int id) {\n        return students.get(id);\n    }\n\n    int studentCount() { return students.size(); }\n    int courseCount() { return courses.size(); }\n\n    List<Student> roster(String courseCode) {\n        List<Student> result = new ArrayList<>();\n        Set<Integer> ids = enrollments.get(courseCode);\n        if (ids == null) return result;\n\n        for (int id : ids) {\n            Student student = students.get(id);\n            if (student != null) result.add(student);\n        }\n        result.sort(Comparator.comparing(Student::getName));\n        return result;\n    }\n\n    List<Student> leaderboard() {\n        List<Student> result = new ArrayList<>(students.values());\n        result.sort(\n            Comparator.comparingInt(Student::getScore)\n                .reversed()\n                .thenComparing(Student::getName)\n        );\n        return result;\n    }\n}\n\npublic class Main {\n    static List<String> names(List<Student> students) {\n        List<String> result = new ArrayList<>();\n        for (Student s : students) result.add(s.getName());\n        return result;\n    }\n\n    static List<String> leaderboardText(List<Student> students) {\n        List<String> result = new ArrayList<>();\n        for (Student s : students) result.add(s.getName() + "=" + s.getScore());\n        return result;\n    }\n\n    public static void main(String[] args) {\n        CourseManager manager = new CourseManager();\n        manager.addStudent(new Student(101, "Aman", 82));\n        manager.addStudent(new Student(205, "Riya", 91));\n        manager.addStudent(new Student(330, "Kabir", 82));\n        manager.addStudent(new Student(404, "Aditi", 95));\n\n        manager.addCourse(new Course("JAVA", "Java Foundations"));\n        manager.addCourse(new Course("DB", "Databases"));\n\n        int accepted = 0;\n        int rejected = 0;\n        int[] ids = {101, 205, 330, 101, 999, 404, 205, 330};\n        String[] codes = {"JAVA", "JAVA", "DB", "JAVA", "JAVA", "JAVA", "DB", "JAVA"};\n\n        for (int i = 0; i < ids.length; i++) {\n            if (manager.enroll(ids[i], codes[i])) accepted++;\n            else rejected++;\n        }\n\n        System.out.println("Students: " + manager.studentCount());\n        System.out.println("Courses: " + manager.courseCount());\n        System.out.println("Accepted enrollments: " + accepted);\n        System.out.println("Rejected enrollments: " + rejected);\n        System.out.println("JAVA roster: " + names(manager.roster("JAVA")));\n        System.out.println("DB roster size: " + manager.roster("DB").size());\n        System.out.println("Leaderboard: " + leaderboardText(manager.leaderboard()));\n        System.out.println("Student 205: " + manager.findStudent(205).getName());\n    }\n}',
    tests: tests(
      "Students: 4\nCourses: 2\nAccepted enrollments: 6\nRejected enrollments: 2\nJAVA roster: [Aditi, Aman, Kabir, Riya]\nDB roster size: 2\nLeaderboard: [Aditi=95, Riya=91, Aman=82, Kabir=82]\nStudent 205: Riya",
    ),
    minutes: 45,
  },
];

export const studentCourseCapstoneModule = specModule(
  {
    slug: "week-5-student-course-capstone",
    title: "Module 40 — 🏆 Student/Course Manager",
    description:
      "Week 5 capstone: collections, iteration, generics, ordering aur validation ko combine karke coherent student-course enrollment system build karo.",
    position: 40,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
