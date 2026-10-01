import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "files-paths-path-basics",
    title: "Path Basics",
    description:
      "`Path` ko filesystem location ke structured value ki tarah samjho—file contents ya actual I/O operation ki tarah nahi.",
    problem:
      "Plain String se path hold karna possible hai, but segments, parent aur filename reason karne ke liye Java ka `Path` abstraction clearer hai.",
    why:
      "Exceptions ke baad Week 6 ab external filesystem boundary par ja raha hai. I/O se pehle learner ko location aur operation ko separate mental models banana hoga.",
    model:
      'Path.of("data", "players.txt")\n        ↓\ndata/players.txt\n ├─ parent   → data\n └─ fileName → players.txt\n\nPath describes WHERE. Files performs operations.',
    syntax:
      'Path path = Path.of("data", "players.txt");\nSystem.out.println(path.getFileName());\nSystem.out.println(path.getParent());',
    remember:
      "`Path` ek location representation hai. `Path` create karne se file automatically create/read/write nahi hoti.",
    example:
      'Path p = Path.of("logs", "app.txt");\nSystem.out.println(p.getFileName()); // app.txt',
    trace:
      'segments ["logs","app.txt"] → Path value → getFileName selects last segment → getParent selects preceding path',
    mistake:
      "`Path.of(...)` ko file creation operation samajhna.",
    fix:
      "Location representation (`Path`) aur filesystem action (`Files`) ko explicitly separate rakho.",
    predict: ["Filesystem location represent karne wali Java type?", "Path"],
    predict2: ["`Path.of(\"x.txt\")` alone actual file create karta hai? yes/no", "no"],
    prompt:
      'Path `quests/week6/notes.txt` build karo and exact output lao:\nFile: notes.txt\nParent: quests/week6',
    starter:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build the path from segments, not manual separator concatenation.\n    }\n}',
    solution:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Path path = Path.of("quests", "week6", "notes.txt");\n        System.out.println("File: " + path.getFileName());\n        System.out.println("Parent: " + path.getParent());\n    }\n}',
    tests: tests("File: notes.txt\nParent: quests/week6"),
  },
  {
    slug: "files-paths-build-paths",
    title: "Build Paths",
    description:
      "Path segments aur `resolve` se locations compose karo instead of separator-heavy String concatenation.",
    problem:
      'Base directory `"data"` aur child `"students.txt"` ko combine karna hai. `"data/" + name` filesystem semantics ko String manipulation me leak karta hai.',
    why:
      "Structured path composition readable, portable aur later dynamic filesystem workflows ke liye safer mental model deta hai.",
    model:
      'base Path("data")\n      + resolve("students.txt")\n      ↓\nPath("data/students.txt")',
    syntax:
      'Path base = Path.of("data");\nPath file = base.resolve("students.txt");',
    remember:
      "`Path.of` initial path build karta hai; `resolve` existing base ke against child path compose karta hai.",
    example:
      'Path root = Path.of("javaquets");\nPath report = root.resolve("report.txt");',
    trace:
      "base=data → resolve students.txt → composed Path data/students.txt → base object itself unchanged",
    mistake:
      'Manual `"data/" + filename` ya Windows-specific `"data\\\\..."` separators hardcode karna.',
    fix:
      "`Path.of` segments aur `resolve` use karo so path logic String formatting se separate rahe.",
    predict: ["Existing base Path ke saath child combine karne ka method?", "resolve"],
    predict2: ["Path APIs manual separator concatenation ki need reduce karti hain? yes/no", "yes"],
    prompt:
      'Base `javaquets` se `reports/week6.txt` path compose karo using `resolve`. Exact output:\njavaquets/reports/week6.txt\nweek6.txt',
    starter:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Path base = Path.of("javaquets");\n        // Compose reports/week6.txt using resolve.\n    }\n}',
    solution:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Path base = Path.of("javaquets");\n        Path reports = base.resolve("reports");\n        Path file = reports.resolve("week6.txt");\n        System.out.println(file);\n        System.out.println(file.getFileName());\n    }\n}',
    tests: tests("javaquets/reports/week6.txt\nweek6.txt"),
  },
  {
    slug: "files-paths-absolute-vs-relative",
    title: "Absolute vs Relative",
    description:
      "Relative path ko process context ke against aur absolute path ko filesystem-rooted location ke roop me distinguish karo.",
    problem:
      "`data.txt` ka meaning current working directory par depend karta hai. Debugging me learner ko know karna chahiye path self-contained absolute hai ya contextual relative.",
    why:
      "File-not-found bugs often API syntax nahi, wrong location assumptions hote hain. Absolute/relative distinction diagnosis ka foundation hai.",
    model:
      "relative: reports/result.txt\n         interpreted from working directory\n\nabsolute: filesystem root se complete location\n\nPath.isAbsolute() tells category.",
    syntax:
      'Path p = Path.of("reports", "result.txt");\nSystem.out.println(p.isAbsolute());\nPath absolute = p.toAbsolutePath();',
    remember:
      "Relative path ka base usually process working directory hota hai. `toAbsolutePath()` environment-specific absolute form produce karta hai.",
    example:
      'Path relative = Path.of("data.txt");\nSystem.out.println(relative.isAbsolute()); // false',
    trace:
      "relative path value → runtime working directory context → absolute representation can be derived",
    mistake:
      "Relative path ko machine-independent fixed physical location assume karna.",
    fix:
      "Debugging me `isAbsolute`, working context aur derived absolute path inspect karo.",
    predict: ["`Path.of(\"data.txt\").isAbsolute()` normally?", "false"],
    predict2: ["Relative path ka interpretation execution context par depend kar sakta hai? yes/no", "yes"],
    prompt:
      'Relative `reports/result.txt` inspect karo. Output environment-independent rakhne ke liye sirf category aur filename print karo:\nAbsolute: false\nFile: result.txt',
    starter:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Path path = Path.of("reports", "result.txt");\n        // Print whether it is absolute and its filename.\n    }\n}',
    solution:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Path path = Path.of("reports", "result.txt");\n        System.out.println("Absolute: " + path.isAbsolute());\n        System.out.println("File: " + path.getFileName());\n    }\n}',
    tests: tests("Absolute: false\nFile: result.txt"),
  },
  {
    slug: "files-paths-normalize-and-resolve",
    title: "Normalize and Resolve",
    description:
      "`resolve` se paths compose aur `normalize` se redundant `.`/`..` segments simplify karo—without confusing lexical cleanup with filesystem verification.",
    problem:
      'Generated path `quests/week6/../week5/./report.txt` readable but noisy hai. Learner ko structured simplification chahiye.',
    why:
      "Path transformations samajhna later file lookup/debugging ko safer banata hai, especially when multiple components path build karte hain.",
    model:
      'base = quests/week6\nresolve("../week5/./report.txt")\n      ↓\nquests/week6/../week5/./report.txt\n      ↓ normalize\nquests/week5/report.txt',
    syntax:
      'Path clean = base.resolve("../week5/./report.txt").normalize();',
    remember:
      "`normalize()` lexical path cleanup karta hai; ye necessarily filesystem access karke existence/symlinks verify nahi karta.",
    example:
      'Path p = Path.of("a", "b", "..", "c").normalize(); // a/c',
    trace:
      "compose segments → encounter `..` removes preceding normal segment lexically → `.` removed → simplified Path",
    mistake:
      "`normalize()` ko `Files.exists()` ya real filesystem canonicalization samajhna.",
    fix:
      "Normalize = path syntax cleanup; existence/access = separate filesystem operation.",
    predict: ["Redundant `.` and `..` segments simplify karne ka Path method?", "normalize"],
    predict2: ["`normalize()` file existence verify karta hai? yes/no", "no"],
    prompt:
      'Base `quests/week6` ke against `../week5/./report.txt` resolve + normalize karo. Exact output:\nRaw: quests/week6/../week5/./report.txt\nClean: quests/week5/report.txt',
    starter:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Path base = Path.of("quests", "week6");\n        // Build raw path then normalize it.\n    }\n}',
    solution:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Path base = Path.of("quests", "week6");\n        Path raw = base.resolve("../week5/./report.txt");\n        Path clean = raw.normalize();\n        System.out.println("Raw: " + raw);\n        System.out.println("Clean: " + clean);\n    }\n}',
    tests: tests("Raw: quests/week6/../week5/./report.txt\nClean: quests/week5/report.txt"),
  },
  {
    slug: "files-paths-files-exists",
    title: "`Files.exists`",
    description:
      "Path representation se real filesystem query tak transition karo and existence check ko time-sensitive observation ki tarah treat karo.",
    problem:
      "Path object valid-looking ho sakta hai even when target file absent hai. Program ko kabhi branch karna hota hai based on current filesystem state.",
    why:
      "`Files.exists` first clear bridge hai: Path tells WHERE, Files asks filesystem WHAT IS THERE.",
    model:
      "Path value\n   ↓\nFiles.exists(path)\n   ↓\nboolean observation of filesystem state",
    syntax:
      "if (Files.exists(path)) {\n    ...\n}",
    remember:
      "`Files.exists` ek current-state check hai, guarantee nahi ki next operation tak state unchanged rahegi. Real I/O can still fail and exceptions still matter.",
    example:
      'Path p = Path.of("config.txt");\nif (Files.exists(p)) { ... }',
    trace:
      "construct Path → query filesystem → true/false → branch; later read remains separate operation",
    mistake:
      "`exists == true` ke baad read impossible-to-fail assume karna.",
    fix:
      "Existence check ko convenience/branching signal treat karo; actual I/O failure handling still required.",
    predict: ["Filesystem target currently exists ya nahi query karne ka method?", "Files.exists"],
    predict2: ["`Files.exists(path)` true ho to later read guaranteed successful hai? yes/no", "no"],
    prompt:
      "Temporary file create karo, `Files.exists` before and after deletion check karo. Exact output:\nBefore delete: true\nAfter delete: false",
    starter:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Path file = Files.createTempFile("javaquets-", ".txt");\n        // Check existence, delete, check again.\n    }\n}',
    solution:
      'import java.nio.file.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Path file = Files.createTempFile("javaquets-", ".txt");\n        System.out.println("Before delete: " + Files.exists(file));\n        Files.delete(file);\n        System.out.println("After delete: " + Files.exists(file));\n    }\n}',
    tests: tests("Before delete: true\nAfter delete: false"),
  },
  {
    slug: "files-paths-read-text-basics",
    title: "Read Text Basics",
    description:
      "`Files.readString` se small text file read karo and checked I/O failure ko Module 41–42 exception model se connect karo.",
    problem:
      "Filesystem read external operation hai: target missing, inaccessible ya otherwise unreadable ho sakta hai. Successful path ke saath failure contract bhi understand karna hai.",
    why:
      "Yahan Week 6 concepts converge karte hain: Path identifies location, Files performs I/O, and IOException communicates checked failure.",
    model:
      "Path\n ↓\nFiles.readString(path)\n ├─ success → String content\n └─ I/O failure → IOException",
    syntax:
      'String text = Files.readString(path);',
    remember:
      "`readString` small text files ke liye convenient hai. It performs actual I/O and can throw `IOException`, so caller must handle/declare it.",
    example:
      'try {\n    String text = Files.readString(path);\n} catch (IOException e) {\n    ...\n}',
    trace:
      "Path exists → readString opens/reads/decodes text → returns String; failure → IOException propagates",
    mistake:
      "Read operation ko pure String conversion samajhna aur checked I/O failure ignore karna.",
    fix:
      "Actual filesystem operations ko exception-producing boundary treat karo.",
    predict: ["Small text file ko String me read karne ka convenient Files method?", "readString"],
    predict2: ["`Files.readString` I/O perform karta hai? yes/no", "yes"],
    prompt:
      'Temporary file me `"JavaQuest\\nWeek 6"` write karke `Files.readString` se read karo. Exact output:\nJavaQuest\nWeek 6',
    starter:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path file = Files.createTempFile("javaquets-", ".txt");\n        try {\n            Files.writeString(file, "JavaQuest\\nWeek 6");\n            // Read and print the text.\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path file = Files.createTempFile("javaquets-", ".txt");\n        try {\n            Files.writeString(file, "JavaQuest\\nWeek 6");\n            String text = Files.readString(file);\n            System.out.println(text);\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}',
    tests: tests("JavaQuest\nWeek 6"),
  },
  {
    slug: "files-paths-write-text-basics",
    title: "Write Text Basics",
    description:
      "`Files.writeString` se text persist karo, overwrite behavior observe karo, aur write→read round trip se state verify karo.",
    problem:
      "In-memory String process end hone par disappear ho jata hai. File write external persistent state create/update karta hai, so mutation semantics explicit honi chahiye.",
    why:
      "Learner first time application state ko process memory ke bahar move kar raha hai. File write ko external mutation ki responsibility ke saath treat karna hai.",
    model:
      "String content\n     ↓ Files.writeString\nfilesystem file state\n     ↓ Files.readString\nobserved content",
    syntax:
      'Files.writeString(path, "XP=120");',
    remember:
      "`writeString` default behavior target ko create ya truncate/overwrite kar sakta hai. Append ek separate deliberate option hai; default assumptions ko understand karo.",
    example:
      'Files.writeString(file, "first");\nFiles.writeString(file, "second"); // final text is second',
    trace:
      "write first → file content first → write second default → previous content replaced → read returns second",
    mistake:
      "Repeated `writeString` automatically append karega assume karna.",
    fix:
      "Overwrite vs append requirement explicitly decide karo; default behavior verify karo.",
    predict: ["Simple text write ka Files method?", "writeString"],
    predict2: ["Default repeated `writeString` ko automatic append assume karna safe hai? yes/no", "no"],
    prompt:
      'Temp file me first `"XP=100"` then `"XP=150"` write karo and final text read karo. Exact output:\nFinal: XP=150',
    starter:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path file = Files.createTempFile("javaquets-", ".txt");\n        try {\n            // Write XP=100, then overwrite with XP=150, then read.\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path file = Files.createTempFile("javaquets-", ".txt");\n        try {\n            Files.writeString(file, "XP=100");\n            Files.writeString(file, "XP=150");\n            System.out.println("Final: " + Files.readString(file));\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}',
    tests: tests("Final: XP=150"),
  },
  {
    slug: "files-paths-files-paths-recap",
    title: "🏆 Quest Progress File",
    description:
      "Path composition, normalization, existence checks, text read/write aur exception-safe cleanup ko ek small persistence workflow me combine karo.",
    problem:
      "Quest progress ko file me save/load karna hai. First run file absent ho sakti hai; later run existing state read/update karega. Path handling aur I/O failure boundaries dono correct hone chahiye.",
    why:
      "Module proof API recall nahi. Learner ko external state lifecycle reason karna hai: location build → state inspect → write → read → update → verify → cleanup.",
    model:
      "temp root\n   ↓ resolve\nplayer/progress.txt\n   ↓ parent directory create\nexists? → false\n   ↓ write\nJAVA=2\nOOP=1\n   ↓ read/parse/update\nJAVA=3\nOOP=1\n   ↓ verify\ncleanup",
    syntax:
      "Path file = root.resolve(\"player\").resolve(\"progress.txt\");\nFiles.createDirectories(file.getParent());\nFiles.writeString(file, text);\nString loaded = Files.readString(file);",
    remember:
      "Filesystem workflow me Path composition, actual Files operations, checked failures aur cleanup separate responsibilities hain. `exists` useful hai but read/write exception handling ko replace nahi karta.",
    example:
      "Missing progress → initialize; existing progress → load/update; finally temp test resources delete.",
    trace:
      "build path → normalize → ensure parent → observe absent → write initial → read → transform → overwrite → read final → cleanup",
    mistake:
      "Hardcoded absolute machine path, parent directory assume karna, exists check ko error handling substitute banana, or test files leave karna.",
    fix:
      "Portable Paths compose karo, directory lifecycle explicit rakho, actual I/O exceptions acknowledge karo, cleanup guarantee karo.",
    predict: ["Parent directories create karne ka Files helper?", "Files.createDirectories"],
    predict2: ["Final persisted content ko read-back karke verify karna useful hai? yes/no", "yes"],
    prompt:
      'Quest Progress File workflow complete karo using a temporary root. `player/progress.txt` path `resolve` se build karo. Parent directory create karo. Initial existence print karo, initial text `"JAVA=2\\nOOP=1"` write/read karo, JAVA progress 3 karke overwrite karo, final read print karo. Cleanup `finally` me karo. Exact output:\nExists initially: false\nLoaded JAVA: 2\nLoaded OOP: 1\nFinal file:\nJAVA=3\nOOP=1',
    starter:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\n\npublic class Main {\n    static Map<String, Integer> parse(String text) {\n        Map<String, Integer> progress = new LinkedHashMap<>();\n        // Parse lines like JAVA=2.\n        return progress;\n    }\n\n    static String serialize(Map<String, Integer> progress) {\n        // Produce deterministic JAVA then OOP lines from map iteration order.\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        Path root = Files.createTempDirectory("javaquets-");\n        Path playerDir = root.resolve("player");\n        Path file = playerDir.resolve("./progress.txt").normalize();\n\n        try {\n            // Create parent, inspect existence, write initial state,\n            // load it, update JAVA to 3, overwrite, and print final file.\n        } finally {\n            Files.deleteIfExists(file);\n            Files.deleteIfExists(playerDir);\n            Files.deleteIfExists(root);\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\nimport java.util.*;\n\npublic class Main {\n    static Map<String, Integer> parse(String text) {\n        Map<String, Integer> progress = new LinkedHashMap<>();\n        for (String line : text.split("\\\\R")) {\n            String[] parts = line.split("=");\n            progress.put(parts[0], Integer.parseInt(parts[1]));\n        }\n        return progress;\n    }\n\n    static String serialize(Map<String, Integer> progress) {\n        List<String> lines = new ArrayList<>();\n        for (Map.Entry<String, Integer> entry : progress.entrySet()) {\n            lines.add(entry.getKey() + "=" + entry.getValue());\n        }\n        return String.join("\\n", lines);\n    }\n\n    public static void main(String[] args) throws IOException {\n        Path root = Files.createTempDirectory("javaquets-");\n        Path playerDir = root.resolve("player");\n        Path file = playerDir.resolve("./progress.txt").normalize();\n\n        try {\n            Files.createDirectories(file.getParent());\n            System.out.println("Exists initially: " + Files.exists(file));\n\n            Files.writeString(file, "JAVA=2\\nOOP=1");\n            Map<String, Integer> progress = parse(Files.readString(file));\n            System.out.println("Loaded JAVA: " + progress.get("JAVA"));\n            System.out.println("Loaded OOP: " + progress.get("OOP"));\n\n            progress.put("JAVA", 3);\n            Files.writeString(file, serialize(progress));\n            System.out.println("Final file:");\n            System.out.println(Files.readString(file));\n        } finally {\n            Files.deleteIfExists(file);\n            Files.deleteIfExists(playerDir);\n            Files.deleteIfExists(root);\n        }\n    }\n}',
    tests: tests(
      "Exists initially: false\nLoaded JAVA: 2\nLoaded OOP: 1\nFinal file:\nJAVA=3\nOOP=1",
    ),
    minutes: 40,
  },
];

export const filesPathsModule = specModule(
  {
    slug: "files-paths",
    title: "Module 43 — Files & Paths",
    description:
      "`Path` se portable locations model karo aur `Files` APIs se basic text persistence ko exception-aware, state-safe workflows me use karo.",
    position: 43,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
