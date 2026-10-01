import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "resource-handling-why-resources-need-closing",
    title: "Why Resources Need Closing",
    description:
      "Resource ko ordinary object se distinguish karo: kuch objects external/limited capability hold karte hain jise deterministic cleanup chahiye.",
    problem:
      "File reader, stream ya connection use karke reference bhool jana enough cleanup guarantee nahi deta. Resource OS/file handle jaisi external state hold kar sakta hai.",
    why:
      "Module 43 ne Files/Paths se I/O introduce kiya. Ab learner ko operation ke saath lifecycle responsibility samajhni hai: acquire → use → release.",
    model:
      "ordinary value: create → use → GC eventually\n\nresource: acquire external capability → use → RELEASE deterministically\n\nopen → work → close",
    syntax:
      "BufferedReader reader = ...;\ntry {\n    // use reader\n} finally {\n    reader.close();\n}",
    remember:
      "Garbage collection memory lifecycle manage karta hai; deterministic resource release ke liye explicit close semantics important hain.",
    example:
      "Reader file/stream se associated resource hold kar sakta hai. Work complete hone par close required hota hai.",
    trace:
      "resource acquired → operation runs → success/failure possible → cleanup must still happen",
    mistake:
      "Reference scope se bahar gaya = resource immediately safely closed assume karna.",
    fix:
      "Resource lifecycle ko explicit responsibility treat karo; `AutoCloseable` resources ke liye try-with-resources prefer karo.",
    predict: ["Resource lifecycle ka final responsibility step?", "close"],
    predict2: ["Garbage collection ko deterministic resource closing ka replacement assume karna safe hai? yes/no", "no"],
    prompt:
      "A simple custom resource banao jo `close()` par `Closed` print kare. Manual try/finally lifecycle se exact output lao:\nOpened\nUsing\nClosed",
    starter:
      'class DemoResource {\n    void use() { System.out.println("Using"); }\n    void close() { System.out.println("Closed"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        DemoResource resource = new DemoResource();\n        System.out.println("Opened");\n        // Ensure close happens in finally.\n    }\n}',
    solution:
      'class DemoResource {\n    void use() { System.out.println("Using"); }\n    void close() { System.out.println("Closed"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        DemoResource resource = new DemoResource();\n        System.out.println("Opened");\n        try {\n            resource.use();\n        } finally {\n            resource.close();\n        }\n    }\n}',
    tests: tests("Opened\nUsing\nClosed"),
  },
  {
    slug: "resource-handling-autocloseable-idea",
    title: "`AutoCloseable` Idea",
    description:
      "Resource class ko `AutoCloseable` contract implement karao so Java lifecycle cleanup ko try-with-resources ke saath automate kar sake.",
    problem:
      "Java ko kaise pata chale ki custom object resource hai aur block end par kaunsa cleanup method call karna hai?",
    why:
      "`AutoCloseable` Week 4 interface thinking ka real standard-library connection hai: implementation promises a `close()` capability.",
    model:
      "AutoCloseable contract\n        ↓\n      close()\n        ↑\nFile/Reader/custom resource\n\ntry-with-resources can manage objects implementing this contract.",
    syntax:
      "class QuestSession implements AutoCloseable {\n    @Override\n    public void close() {\n        ...\n    }\n}",
    remember:
      "`AutoCloseable` ek interface contract hai. Try-with-resources resource ko close kar sakta hai because its type supports `close()`.",
    example:
      'class Session implements AutoCloseable {\n    public void close() { System.out.println("closed"); }\n}',
    trace:
      "construct AutoCloseable → enter try-with-resources → use → block exits → Java invokes close",
    mistake:
      "Sirf `close()` naam ka arbitrary method add karke assume karna ki try-with-resources accept karega.",
    fix:
      "`AutoCloseable` (or compatible closeable type) implement karo so compiler lifecycle contract recognize kare.",
    predict: ["Try-with-resources ke core resource contract interface?", "AutoCloseable"],
    predict2: ["Custom class `AutoCloseable` implement kar sakti hai? yes/no", "yes"],
    prompt:
      "`QuestSession implements AutoCloseable` banao. Constructor `Opened`, `run()` `Running`, close `Closed` print kare. try-with-resources se exact output:\nOpened\nRunning\nClosed",
    starter:
      'class QuestSession implements AutoCloseable {\n    QuestSession() { System.out.println("Opened"); }\n    void run() { System.out.println("Running"); }\n\n    @Override\n    public void close() {\n        // Print Closed.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Use QuestSession with try-with-resources.\n    }\n}',
    solution:
      'class QuestSession implements AutoCloseable {\n    QuestSession() { System.out.println("Opened"); }\n    void run() { System.out.println("Running"); }\n\n    @Override\n    public void close() {\n        System.out.println("Closed");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try (QuestSession session = new QuestSession()) {\n            session.run();\n        }\n    }\n}',
    tests: tests("Opened\nRunning\nClosed"),
  },
  {
    slug: "resource-handling-try-with-resources-syntax",
    title: "Try-with-Resources Syntax",
    description:
      "Resource declaration ko `try (...)` header me place karke automatic cleanup scope aur close timing trace karo.",
    problem:
      "Manual `finally` cleanup repetitive hai aur multiple exit paths me easy to get wrong. Java structured syntax lifecycle ko control-flow construct me encode karti hai.",
    why:
      "Try-with-resources cleanup policy ko code structure me visible banata hai: resource scope and cleanup responsibility same construct me defined hain.",
    model:
      "try (resource = acquire()) {\n    use\n    return/throw/end\n}\n↓\nautomatic close\n↓\nouter flow continues",
    syntax:
      "try (BufferedReader br = new BufferedReader(...)) {\n    System.out.println(br.readLine());\n}",
    remember:
      "Resource `try` header me acquire hota hai, block ke andar usable hota hai, aur block exit par automatically close hota hai.",
    example:
      'try (StringReader reader = new StringReader("Java")) {\n    System.out.println((char) reader.read());\n}',
    trace:
      "resource created → body executes → body exits normally/abruptly → close invoked → outer code continues if no unhandled failure",
    mistake:
      "Try-with-resources ke andar manual `close()` call karke duplicate lifecycle management create karna.",
    fix:
      "Automatic cleanup construct ko cleanup own karne do unless API-specific reason ho.",
    predict: ["Resource declaration try-with-resources me parentheses ke andar hoti hai? yes/no", "yes"],
    predict2: ["Normal block completion par automatic close hota hai? yes/no", "yes"],
    prompt:
      'Custom `Tracker` resource use karo. try block me `Inside`, close me `Closed`, after block `After`. Exact output:\nInside\nClosed\nAfter',
    starter:
      'class Tracker implements AutoCloseable {\n    @Override\n    public void close() {\n        System.out.println("Closed");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Use Tracker in try-with-resources.\n        System.out.println("After");\n    }\n}',
    solution:
      'class Tracker implements AutoCloseable {\n    @Override\n    public void close() {\n        System.out.println("Closed");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try (Tracker tracker = new Tracker()) {\n            System.out.println("Inside");\n        }\n        System.out.println("After");\n    }\n}',
    tests: tests("Inside\nClosed\nAfter"),
  },
  {
    slug: "resource-handling-bufferedreader-example",
    title: "`BufferedReader` Example",
    description:
      "`BufferedReader` ko real closeable text resource ke roop me use karo and line-by-line processing ko lifecycle boundary ke andar rakho.",
    problem:
      "Module 43 me `Files.readString` whole small file convenience thi. Larger/stream-like text workflows me line-oriented reader useful hota hai.",
    why:
      "Learner ko toy `AutoCloseable` se standard I/O resource par transfer karna hai without losing exception/cleanup reasoning.",
    model:
      "Reader source\n   ↓\nBufferedReader\n   ↓ readLine()\nline → process\nline → process\nnull → end\n   ↓\nautomatic close",
    syntax:
      "try (BufferedReader br = Files.newBufferedReader(path)) {\n    String line;\n    while ((line = br.readLine()) != null) {\n        ...\n    }\n}",
    remember:
      "`readLine()` next line return karta hai; end-of-stream par `null`. Reader ko try-with-resources boundary ke andar consume karo.",
    example:
      'try (BufferedReader br = new BufferedReader(new StringReader("Java\\nQuest"))) {\n    System.out.println(br.readLine());\n}',
    trace:
      "readLine → Java → readLine → Quest → readLine → null → loop ends → reader closes",
    mistake:
      "`readLine()` ko empty string at EOF assume karna.",
    fix:
      "EOF condition `null` trace karo; content processing loop resource scope ke andar rakho.",
    predict: ["`BufferedReader.readLine()` EOF par kya return karta hai?", "null"],
    predict2: ["BufferedReader try-with-resources me manage ho sakta hai? yes/no", "yes"],
    prompt:
      'BufferedReader + StringReader se `"Java\\nQuest\\nXP"` line-by-line read karke line count aur joined output print karo. Exact output:\nLines: 3\nText: Java|Quest|XP',
    starter:
      'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        List<String> lines = new ArrayList<>();\n        // Use BufferedReader in try-with-resources and collect every line.\n\n        System.out.println("Lines: " + lines.size());\n        System.out.println("Text: " + String.join("|", lines));\n    }\n}',
    solution:
      'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        List<String> lines = new ArrayList<>();\n        try (BufferedReader br = new BufferedReader(new StringReader("Java\\nQuest\\nXP"))) {\n            String line;\n            while ((line = br.readLine()) != null) {\n                lines.add(line);\n            }\n        }\n\n        System.out.println("Lines: " + lines.size());\n        System.out.println("Text: " + String.join("|", lines));\n    }\n}',
    tests: tests("Lines: 3\nText: Java|Quest|XP"),
  },
  {
    slug: "resource-handling-multiple-resources",
    title: "Multiple Resources",
    description:
      "Ek try-with-resources statement me multiple dependent resources manage karo aur reverse close order reason karo.",
    problem:
      "Workflow reader + writer ya outer wrapper + inner source jaise multiple resources acquire kar sakta hai. Cleanup order dependencies matter kar sakta hai.",
    why:
      "Structured resource handling ka power single object se aage hai. Java resources ko declaration order ke reverse me close karta hai.",
    model:
      "try (\n  A a = ...;   // opens first\n  B b = ...;   // opens second\n) { ... }\n\nclose order: B → A",
    syntax:
      "try (\n    ResourceA a = new ResourceA();\n    ResourceB b = new ResourceB()\n) {\n    ...\n}",
    remember:
      "Multiple resources declaration order me open hote hain aur reverse declaration order me close hote hain.",
    example:
      "Open A → Open B → work → Close B → Close A",
    trace:
      "construct A → construct B → body → close B → close A",
    mistake:
      "Close order ko same as declaration order assume karna.",
    fix:
      "Nested/dependent resources ko stack-like lifecycle samjho: last acquired, first closed.",
    predict: ["Resources A then B declare hon to pehle kaun close hoga?", "B"],
    predict2: ["Try-with-resources multiple resources manage kar sakta hai? yes/no", "yes"],
    prompt:
      "Two `Tracker` resources A then B declare karo. Constructor Open, close Close print kare. Exact output:\nOpen A\nOpen B\nUsing\nClose B\nClose A",
    starter:
      'class Tracker implements AutoCloseable {\n    private final String name;\n    Tracker(String name) {\n        this.name = name;\n        System.out.println("Open " + name);\n    }\n    public void close() {\n        System.out.println("Close " + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Declare A then B in one try-with-resources statement.\n    }\n}',
    solution:
      'class Tracker implements AutoCloseable {\n    private final String name;\n    Tracker(String name) {\n        this.name = name;\n        System.out.println("Open " + name);\n    }\n    public void close() {\n        System.out.println("Close " + name);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try (Tracker a = new Tracker("A"); Tracker b = new Tracker("B")) {\n            System.out.println("Using");\n        }\n    }\n}',
    tests: tests("Open A\nOpen B\nUsing\nClose B\nClose A"),
  },
  {
    slug: "resource-handling-exceptions-during-resource-use",
    title: "Exceptions During Resource Use",
    description:
      "Try body fail hone par automatic close ko trace karo and primary exception vs cleanup exception ka basic relationship observe karo.",
    problem:
      "Cleanup ki sabse zyada zarurat often failure path par hoti hai. Manual code me thrown exception cleanup line skip kar sakta hai.",
    why:
      "Try-with-resources ka core correctness benefit exactly exceptional control flow me visible hota hai: block failure ke bawajood resource close hota hai.",
    model:
      "open resource\n   ↓\nbody throws WorkException\n   ↓\nclose still runs\n   ↓\nexception propagates/caught\n\nIf close also fails, Java can preserve it as a suppressed exception.",
    syntax:
      "try (Resource r = new Resource()) {\n    throw new IOException(\"work failed\");\n} catch (IOException e) {\n    ...\n}",
    remember:
      "Body exception automatic cleanup skip nahi karti. If both body and close throw, body failure is typically primary and close failure can be available via `getSuppressed()`.",
    example:
      "body throws → close prints/runs → outer catch handles original body failure",
    trace:
      "resource opens → body throws → implicit close executes → original exception leaves try → matching catch",
    mistake:
      "Exception aate hi resource close nahi hoga assume karna.",
    fix:
      "Try-with-resources ko exceptional exit path par explicitly trace karo; cleanup automatic hai.",
    predict: ["Try body exception throw kare to managed resource still close hota hai? yes/no", "yes"],
    predict2: ["Body aur close dono fail hon to close failure suppressed ho sakta hai? yes/no", "yes"],
    prompt:
      'Custom resource close par `Closed` print kare. Try body `IllegalStateException("Work failed")` throw kare; catch message print kare. Exact output:\nWorking\nClosed\nCaught: Work failed',
    starter:
      'class Tracker implements AutoCloseable {\n    public void close() {\n        System.out.println("Closed");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Use Tracker, throw Work failed inside body, catch outside.\n    }\n}',
    solution:
      'class Tracker implements AutoCloseable {\n    public void close() {\n        System.out.println("Closed");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try (Tracker tracker = new Tracker()) {\n            System.out.println("Working");\n            throw new IllegalStateException("Work failed");\n        } catch (IllegalStateException e) {\n            System.out.println("Caught: " + e.getMessage());\n        }\n    }\n}',
    tests: tests("Working\nClosed\nCaught: Work failed"),
  },
  {
    slug: "resource-handling-cleanup-thinking",
    title: "Cleanup Thinking",
    description:
      "Manual `finally` cleanup aur try-with-resources compare karke resource ownership, acquisition scope aur cleanup guarantees reason karo.",
    problem:
      "Not every cleanup problem same hai. AutoCloseable resource, temporary file deletion, in-memory state reset aur multi-resource lifecycle different mechanisms demand kar sakte hain.",
    why:
      "Learner ko cargo-cult `finally` ya try-with-resources se aage jaana hai: first ask what resource is owned, who acquires it, and who must release it.",
    model:
      "Ask:\n1. What resource/capability is acquired?\n2. Who owns it?\n3. Is it AutoCloseable?\n4. What exits can happen?\n5. What cleanup must be guaranteed?\n\nAutoCloseable → usually try-with-resources\nother finalization → maybe finally",
    syntax:
      "try (BufferedReader br = ...) {\n    ...\n} // close owned here\n\ntry {\n    ...\n} finally {\n    Files.deleteIfExists(temp);\n}",
    remember:
      "Try-with-resources closeable resource lifecycle ke liye preferred hai; `finally` still useful ho sakta hai non-AutoCloseable cleanup/final actions ke liye.",
    example:
      "Reader close → try-with-resources. Temporary path delete → often finally around workflow.",
    trace:
      "identify owned resource → choose lifecycle mechanism → enumerate success/failure exits → verify cleanup on each path",
    mistake:
      "Resource caller se receive hua ho phir callee blindly close kar de, breaking ownership expectations.",
    fix:
      "Ownership explicit rakho. Generally jis scope ne resource acquire kiya, wahi uske lifecycle ka responsible owner hona chahiye unless contract says otherwise.",
    predict: ["AutoCloseable resource ke liye preferred structured cleanup?", "try-with-resources"],
    predict2: ["Resource ownership cleanup decision ko affect karta hai? yes/no", "yes"],
    prompt:
      "Temp file create karo. Reader ko try-with-resources se close karo; temp file ko outer finally me delete karo. Exact output:\nRead: JavaQuest\nDeleted: true",
    starter:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path temp = Files.createTempFile("javaquets-", ".txt");\n        Files.writeString(temp, "JavaQuest");\n\n        try {\n            // Read first line with BufferedReader using try-with-resources.\n        } finally {\n            // Delete temp and print whether it no longer exists.\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path temp = Files.createTempFile("javaquets-", ".txt");\n        Files.writeString(temp, "JavaQuest");\n\n        try {\n            try (BufferedReader br = Files.newBufferedReader(temp)) {\n                System.out.println("Read: " + br.readLine());\n            }\n        } finally {\n            Files.deleteIfExists(temp);\n            System.out.println("Deleted: " + !Files.exists(temp));\n        }\n    }\n}',
    tests: tests("Read: JavaQuest\nDeleted: true"),
  },
  {
    slug: "resource-handling-resource-recap",
    title: "🏆 Safe Quest Report Pipeline",
    description:
      "Files/Paths, BufferedReader, AutoCloseable, multiple resources, exception propagation aur guaranteed cleanup ko one resource-safe pipeline me integrate karo.",
    problem:
      "Quest progress file read karke completed quests report write karna hai. Input processing fail bhi ho sakta hai; readers/writers close hone chahiye aur temporary workspace cleanup hona chahiye.",
    why:
      "Module proof `try(...)` syntax recall nahi. Learner ko resource ownership architecture design karni hai: which scope owns reader/writer, how failure propagates, and what cleanup remains outside resource closing.",
    model:
      "temp workspace\n ├─ input.txt\n └─ report.txt\n\ntry (reader; writer) {\n  read lines\n  validate/parse\n  write completed quests\n} // writer then reader close\ncatch parse failure\nfinally delete files/workspace\n\ncloseable cleanup ≠ filesystem artifact cleanup",
    syntax:
      "try (\n    BufferedReader reader = Files.newBufferedReader(input);\n    BufferedWriter writer = Files.newBufferedWriter(report)\n) {\n    ...\n}",
    remember:
      "Resource-safe design separates lifecycle layers: try-with-resources closes open handles; validation exceptions describe bad data; finally can clean temporary artifacts owned by the workflow.",
    example:
      "Input lines `JAVA,done`, `OOP,pending`, `COLLECTIONS,done` → report only completed quest codes.",
    trace:
      "create workspace → write input → acquire reader/writer → process each line → writer flush/close then reader close → read report → finally delete artifacts",
    mistake:
      "Reader/writer manually close on only success path, swallow parse errors, or leave temporary files after test workflow.",
    fix:
      "Acquire closeables in try header, let failures propagate to meaningful catch, keep artifact cleanup in guaranteed outer finalization.",
    predict: ["Two declared resources close in declaration order or reverse?", "reverse"],
    predict2: ["Try-with-resources closing file handles automatically deletes the files themselves? yes/no", "no"],
    prompt:
      'Safe Quest Report Pipeline complete karo. Temporary directory me `input.txt` with lines `JAVA,done`, `OOP,pending`, `COLLECTIONS,done` create karo. One try-with-resources statement me `BufferedReader` + `BufferedWriter` use karke only `done` quest codes report me one per line write karo. Processing ke baad report read karke exact output print karo, then outer finally me files/directory delete karo:\nCompleted: 2\nReport:\nJAVA\nCOLLECTIONS\nWorkspace deleted: true',
    starter:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path root = Files.createTempDirectory("javaquets-");\n        Path input = root.resolve("input.txt");\n        Path report = root.resolve("report.txt");\n\n        try {\n            Files.writeString(input, "JAVA,done\\nOOP,pending\\nCOLLECTIONS,done");\n            int completed = 0;\n\n            // Use ONE try-with-resources statement containing both reader and writer.\n            // Parse each line as code,status and write only done codes.\n\n            System.out.println("Completed: " + completed);\n            System.out.println("Report:");\n            System.out.println(Files.readString(report));\n        } finally {\n            Files.deleteIfExists(report);\n            Files.deleteIfExists(input);\n            Files.deleteIfExists(root);\n            System.out.println("Workspace deleted: " + !Files.exists(root));\n        }\n    }\n}',
    solution:
      'import java.nio.file.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        Path root = Files.createTempDirectory("javaquets-");\n        Path input = root.resolve("input.txt");\n        Path report = root.resolve("report.txt");\n\n        try {\n            Files.writeString(input, "JAVA,done\\nOOP,pending\\nCOLLECTIONS,done");\n            int completed = 0;\n\n            try (\n                BufferedReader reader = Files.newBufferedReader(input);\n                BufferedWriter writer = Files.newBufferedWriter(report)\n            ) {\n                String line;\n                while ((line = reader.readLine()) != null) {\n                    String[] parts = line.split(",");\n                    if (parts.length != 2) {\n                        throw new IllegalArgumentException("Invalid row: " + line);\n                    }\n                    if (parts[1].equals("done")) {\n                        writer.write(parts[0]);\n                        writer.newLine();\n                        completed++;\n                    }\n                }\n            }\n\n            String reportText = Files.readString(report).stripTrailing();\n            System.out.println("Completed: " + completed);\n            System.out.println("Report:");\n            System.out.println(reportText);\n        } finally {\n            Files.deleteIfExists(report);\n            Files.deleteIfExists(input);\n            Files.deleteIfExists(root);\n            System.out.println("Workspace deleted: " + !Files.exists(root));\n        }\n    }\n}',
    tests: tests(
      "Completed: 2\nReport:\nJAVA\nCOLLECTIONS\nWorkspace deleted: true",
    ),
    minutes: 40,
  },
];

export const resourceHandlingModule = specModule(
  {
    slug: "resource-handling",
    title: "Module 44 — Resource Handling",
    description:
      "Resource ownership aur lifecycle ko reason karke `AutoCloseable` aur try-with-resources se closeable I/O resources ko safely manage karo.",
    position: 44,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
