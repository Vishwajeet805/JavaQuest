import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "composition-has-a-relationship",
    title: "HAS-A Relationship",
    description:
      "IS-A ke bajay object collaboration ki need identify karo: ek object doosre object ko use/contain karta hai.",
    problem:
      "Car Engine nahi hai; Car ke paas Engine hai. Inheritance yahan identity ko galat model karegi.",
    why: "Composition HAS-A relationship ko object references ke through model karti hai.",
    model:
      "INHERITANCE: Warrior IS-A Character\nCOMPOSITION: Car HAS-A Engine\n\nCar ─────► Engine",
    syntax: "class Car {\n    private Engine engine;\n}",
    remember:
      "Relationship ko sentence me bolo: 'X is a Y' vs 'X has a Y'. Ye first design filter hai.",
    example: "Order has Customer; Team has Player[]; Car has Engine.",
    trace:
      "requirements → identify collaborator → ask IS-A or HAS-A → HAS-A means composition candidate",
    mistake: "Har reuse ko `extends` se solve karna.",
    fix: "Identity nahi, collaboration ho to contained/used object model karo.",
    predict: ["Car has Engine kis relationship ka example hai?", "composition"],
    predict2: ["Car IS-A Engine? yes/no", "no"],
    prompt:
      "Relationship classification report print karo:\nCar -> has Engine\nWarrior -> is a Character\nTeam -> has Players",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Classify the three relationships from the requirements.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Car -> has Engine");\n        System.out.println("Warrior -> is a Character");\n        System.out.println("Team -> has Players");\n    }\n}',
    tests: tests(
      "Car -> has Engine\nWarrior -> is a Character\nTeam -> has Players",
    ),
  },
  {
    slug: "composition-object-as-field",
    title: "Object as a Field",
    description:
      "Collaborating object ko field ke roop me store karke one object ko another object's capability use karwao.",
    problem:
      "Car ko engine start karna hai, but engine behaviour Engine object own karta hai.",
    why: "Object field relationship ko persistent banata hai: Car ke paas Engine reference rehta hai.",
    model:
      "Car object\n└─ engine field ──► Engine object\n                    └─ start()",
    syntax: "class Car {\n    private Engine engine = new Engine();\n}",
    remember:
      "Field primitive/String hi nahi; kisi class ka object reference bhi field ho sakta hai.",
    example: "Car.start can use its engine field.",
    trace:
      "new Car → engine field points to Engine → car.start accesses collaborator",
    mistake: "Engine logic Car me duplicate karna.",
    fix: "Engine responsibility Engine me rakho; Car reference hold kare.",
    predict: [
      "Composition me collaborator object field ho sakta hai? yes/no",
      "yes",
    ],
    predict2: ["Engine.start behaviour ka natural owner?", "Engine"],
    prompt: "Car ke object field ko use karke exact output `Engine on` lao.",
    starter:
      'class Engine {\n    void start() {\n        System.out.println("Engine on");\n    }\n}\n\nclass Car {\n    private Engine engine = new Engine();\n\n    void start() {\n        // Use the engine field.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Car().start();\n    }\n}',
    solution:
      'class Engine {\n    void start() {\n        System.out.println("Engine on");\n    }\n}\n\nclass Car {\n    private Engine engine = new Engine();\n\n    void start() {\n        engine.start();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Car().start();\n    }\n}',
    tests: tests("Engine on"),
  },
  {
    slug: "composition-constructor-injection-ka-basic-idea",
    title: "Constructor Injection ka Basic Idea",
    description:
      "Collaborator ko class ke andar hard-code karne ke bajay constructor se receive karke dependency choice caller ko do.",
    problem:
      "Car always `new Engine()` internally kare to different Engine object provide karna difficult hota hai.",
    why: "Constructor injection ka basic idea: object apni required collaborator reference constructor parameter se receive karta hai.",
    model:
      "caller creates Engine\n      ↓\nnew Car(engine)\n      ↓\nCar stores same reference",
    syntax:
      "class Car {\n    private Engine engine;\n    Car(Engine engine) {\n        this.engine = engine;\n    }\n}",
    remember:
      "Injection ka matlab framework nahi; simple Java me dependency object bahar create karke constructor se dena bhi injection hai.",
    example: "Engine object Main me create hota hai and Car ko pass hota hai.",
    trace:
      "new Engine → pass reference to Car constructor → store field → later use same collaborator",
    mistake:
      "Constructor parameter receive karke bhi field me `new Engine()` bana dena.",
    fix: "Passed collaborator ko field me store karo.",
    predict: [
      "Constructor injection me collaborator kaun provide karta hai?",
      "caller",
    ],
    predict2: [
      "Car constructor Engine reference store kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Engine ko Main me create karke Car constructor ko pass karo. Exact output:\nEngine ready\nCar ready",
    starter:
      'class Engine {\n    void showStatus() {\n        System.out.println("Engine ready");\n    }\n}\n\nclass Car {\n    private Engine engine;\n\n    Car(Engine engine) {\n        // Store the provided collaborator.\n    }\n\n    void showStatus() {\n        engine.showStatus();\n        System.out.println("Car ready");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Create Engine first, inject it into Car, then show status.\n    }\n}',
    solution:
      'class Engine {\n    void showStatus() {\n        System.out.println("Engine ready");\n    }\n}\n\nclass Car {\n    private Engine engine;\n\n    Car(Engine engine) {\n        this.engine = engine;\n    }\n\n    void showStatus() {\n        engine.showStatus();\n        System.out.println("Car ready");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Engine engine = new Engine();\n        Car car = new Car(engine);\n        car.showStatus();\n    }\n}',
    tests: tests("Engine ready\nCar ready"),
  },
  {
    slug: "composition-delegation",
    title: "Delegation",
    description:
      "Outer object ka method request ko correct collaborator ko forward kare, bina collaborator ki responsibility copy kiye.",
    problem:
      "Car.start() public operation hai, but actual engine-starting work Engine.start() ka responsibility hai.",
    why: "Delegation means one object receives request and asks collaborator to perform the part it owns.",
    model:
      "caller → Car.start()\n          ↓ delegates\n        Engine.start()\n          ↓\n        Engine on",
    syntax: "void start() {\n    engine.start();\n}",
    remember:
      "Composition sirf field store karna nahi; collaboration methods ke through hoti hai.",
    example: "Car coordinates; Engine performs engine-specific behaviour.",
    trace: "call Car.start → access engine field → call Engine.start → return",
    mistake: "Engine-specific print/logic directly Car.start me rewrite karna.",
    fix: "Request ko responsibility-owning collaborator ko delegate karo.",
    predict: ["Car.start se Engine.start call karna kya hai?", "delegation"],
    predict2: ["Delegation duplication reduce kar sakti hai? yes/no", "yes"],
    prompt: "Delegation complete karo. Exact output:\nEngine on\nCar moving",
    starter:
      'class Engine {\n    void start() {\n        System.out.println("Engine on");\n    }\n}\n\nclass Car {\n    private Engine engine;\n\n    Car(Engine engine) {\n        this.engine = engine;\n    }\n\n    void drive() {\n        // Delegate engine work, then print "Car moving".\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car car = new Car(new Engine());\n        car.drive();\n    }\n}',
    solution:
      'class Engine {\n    void start() {\n        System.out.println("Engine on");\n    }\n}\n\nclass Car {\n    private Engine engine;\n\n    Car(Engine engine) {\n        this.engine = engine;\n    }\n\n    void drive() {\n        engine.start();\n        System.out.println("Car moving");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car car = new Car(new Engine());\n        car.drive();\n    }\n}',
    tests: tests("Engine on\nCar moving"),
  },
  {
    slug: "composition-lifecycle-ownership",
    title: "Lifecycle Ownership",
    description:
      "Composition me distinguish karo: owner collaborator khud create karta hai ya externally supplied object ko use karta hai.",
    problem:
      "House internally Room create kare to House strongly owns its Room. Car ko external Engine diya jaye to Engine independently exist kar sakta hai.",
    why: "Object creation location lifecycle/ownership intent communicate karti hai.",
    model:
      "STRONGER OWNERSHIP\nHouse → new Room() internally\n\nEXTERNAL COLLABORATOR\nEngine e = new Engine()\nCar → receives e",
    syntax:
      "class House {\n    private Room room = new Room();\n}\n\nCar(Engine engine) { this.engine = engine; }",
    remember:
      "Java GC details se zyada yahan design intent important hai: collaborator kis context me create/share hota hai?",
    example:
      "Team may receive existing Player objects; a Report may create its own internal formatter.",
    trace:
      "inspect creation → internal creation suggests owner controls collaborator creation; external injection allows sharing/replacement",
    mistake:
      "Har composed object ko automatically same lifecycle/ownership semantics dena.",
    fix: "Creation and sharing requirements ko explicitly decide karo.",
    predict: [
      "Externally supplied Engine independently exist kar sakta hai? yes/no",
      "yes",
    ],
    predict2: [
      "Internally `new Room()` karna stronger ownership intent dikhata hai? yes/no",
      "yes",
    ],
    prompt:
      "Do ownership styles ko executable trace me show karo. Exact output:\nHouse created its Room\nCar received Engine",
    starter:
      "class Room {}\n\nclass House {\n    private Room room = new Room();\n\n    void report() {\n        // Print ownership message.\n    }\n}\n\nclass Engine {}\n\nclass Car {\n    private Engine engine;\n\n    Car(Engine engine) {\n        this.engine = engine;\n    }\n\n    void report() {\n        // Print collaborator message.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        House house = new House();\n        Engine engine = new Engine();\n        Car car = new Car(engine);\n\n        house.report();\n        car.report();\n    }\n}",
    solution:
      'class Room {}\n\nclass House {\n    private Room room = new Room();\n\n    void report() {\n        System.out.println("House created its Room");\n    }\n}\n\nclass Engine {}\n\nclass Car {\n    private Engine engine;\n\n    Car(Engine engine) {\n        this.engine = engine;\n    }\n\n    void report() {\n        System.out.println("Car received Engine");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        House house = new House();\n        Engine engine = new Engine();\n        Car car = new Car(engine);\n\n        house.report();\n        car.report();\n    }\n}',
    tests: tests("House created its Room\nCar received Engine"),
  },
  {
    slug: "composition-composition-vs-inheritance",
    title: "Composition vs Inheritance",
    description:
      "Relationship semantics ke basis par `extends` aur object-field collaboration me deliberate choice karo.",
    problem:
      "Weapon Character ka subtype nahi; Character ke paas Weapon ho sakta hai. Warrior Character ka subtype hai.",
    why: "Use inheritance for genuine IS-A specialisation; composition for HAS-A/uses collaboration.",
    model:
      "Warrior IS-A Character → extends\nCharacter HAS-A Weapon → field\n\nCharacter ──► Weapon",
    syntax:
      "class Warrior extends Character { }\nclass Character {\n    private Weapon weapon;\n}",
    remember:
      "Reuse alone inheritance choose karne ka reason nahi. Relationship meaning primary hai.",
    example: "Warrior extends Character while Character receives Weapon.",
    trace: "requirement sentence → IS-A? inheritance; HAS-A/uses? composition",
    mistake:
      "`class Sword extends Character` just because Character needs sword behaviour.",
    fix: "Weapon ko collaborator object banao; Character identity hierarchy separate rakho.",
    predict: ["Warrior/Character relation?", "inheritance"],
    predict2: ["Character/Weapon relation?", "composition"],
    prompt:
      "Correct mixed design implement karo. Warrior IS-A Character; Character HAS-A Weapon. Exact output `Sword strikes`.",
    starter:
      'class Weapon {\n    void use() {\n        System.out.println("Sword strikes");\n    }\n}\n\nclass Character {\n    private Weapon weapon;\n\n    Character(Weapon weapon) {\n        this.weapon = weapon;\n    }\n\n    void attack() {\n        // Use the composed Weapon.\n    }\n}\n\nclass Warrior {\n    // Establish the correct identity relationship.\n    Warrior(Weapon weapon) {\n        // Initialise Character.\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior(new Weapon());\n        warrior.attack();\n    }\n}',
    solution:
      'class Weapon {\n    void use() {\n        System.out.println("Sword strikes");\n    }\n}\n\nclass Character {\n    private Weapon weapon;\n\n    Character(Weapon weapon) {\n        this.weapon = weapon;\n    }\n\n    void attack() {\n        weapon.use();\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(Weapon weapon) {\n        super(weapon);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Warrior warrior = new Warrior(new Weapon());\n        warrior.attack();\n    }\n}',
    tests: tests("Sword strikes"),
  },
  {
    slug: "composition-flexible-design",
    title: "Flexible Design",
    description:
      "Interface contract + composition combine karke collaborator implementation replace karo without owner class rewrite.",
    problem:
      "Player ko weapon use karna hai. Sword aur Bow dono Weapon capability fulfil karte hain; Player ko concrete weapon hard-code nahi karna chahiye.",
    why: "Composition becomes more flexible when field depends on a stable capability contract rather than one concrete implementation.",
    model:
      "Player HAS-A Weapon\n             ↑\n        ┌────┴────┐\n       Sword     Bow\n\nsame Player code, replace collaborator",
    syntax:
      "interface Weapon { void use(); }\nclass Player {\n    private Weapon weapon;\n    Player(Weapon weapon) { this.weapon = weapon; }\n}",
    remember:
      "Module 29 interface + Module 30 composition connect hote hain: capability contract tells what collaborator can do; composition tells who uses it.",
    example:
      "Player with Sword attacks; another Player with Bow attacks using same Player implementation.",
    trace:
      "inject Weapon → Player stores contract reference → attack delegates → actual weapon implementation runs",
    mistake:
      "Player ke andar `new Sword()` hard-code karna when requirements allow different weapons.",
    fix: "Depend on Weapon contract and inject chosen implementation.",
    predict: ["Flexible Player field type: Sword ya Weapon?", "Weapon"],
    predict2: [
      "Bow substitute karne ke liye Player class rewrite required hai? yes/no",
      "no",
    ],
    prompt:
      "Same Player class ko Sword aur Bow ke saath use karo. Exact output:\nSword strikes\nArrow flies",
    starter:
      'interface Weapon {\n    void use();\n}\n\nclass Sword implements Weapon {\n    @Override\n    public void use() {\n        System.out.println("Sword strikes");\n    }\n}\n\nclass Bow implements Weapon {\n    @Override\n    public void use() {\n        System.out.println("Arrow flies");\n    }\n}\n\nclass Player {\n    // Store a Weapon collaborator and delegate attack().\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player swordPlayer = new Player(new Sword());\n        Player bowPlayer = new Player(new Bow());\n\n        swordPlayer.attack();\n        bowPlayer.attack();\n    }\n}',
    solution:
      'interface Weapon {\n    void use();\n}\n\nclass Sword implements Weapon {\n    @Override\n    public void use() {\n        System.out.println("Sword strikes");\n    }\n}\n\nclass Bow implements Weapon {\n    @Override\n    public void use() {\n        System.out.println("Arrow flies");\n    }\n}\n\nclass Player {\n    private Weapon weapon;\n\n    Player(Weapon weapon) {\n        this.weapon = weapon;\n    }\n\n    void attack() {\n        weapon.use();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Player swordPlayer = new Player(new Sword());\n        Player bowPlayer = new Player(new Bow());\n\n        swordPlayer.attack();\n        bowPlayer.attack();\n    }\n}',
    tests: tests("Sword strikes\nArrow flies"),
  },
  {
    slug: "composition-composition-recap",
    title: "🏆 Guild Loadout Build",
    description:
      "IS-A hierarchy aur HAS-A collaboration ko independently combine karke composition design prove karo.",
    problem:
      "Guild Character identity hierarchy ke saath Weapon collaborator use karta hai. Warrior aur Ranger different weapons receive karte hain, but weapon behaviour Character me duplicate/hard-code nahi hota.",
    why: "Final proof learner relationship choose karta hai, collaborator contract design karta hai, constructor injection use karta hai aur delegation se system compose karta hai.",
    model:
      "Character HAS-A Weapon\n   ↑\nWarrior   Ranger\n\nWeapon capability\n├ Sword\n└ Bow\n\nCharacter.attack → weapon.use",
    syntax:
      "abstract class Character {\n    private Weapon weapon;\n    Character(String name, Weapon weapon) { ... }\n    void attack() { weapon.use(); }\n}",
    remember:
      "Identity inheritance aur capability composition ek dusre ke alternatives har jagah nahi; coherent design me dono different relationships solve kar sakte hain.",
    example:
      "Aman Warrior gets Sword; Riya Ranger gets Bow; shared Character attack delegates to injected weapon.",
    trace:
      "requirements → classify IS-A/HAS-A → define Weapon contract → inject collaborator → delegate → instantiate different combinations → verify",
    mistake:
      "Warrior me sword logic aur Ranger me bow logic directly hard-code karke Weapon collaborator eliminate karna.",
    fix: "Weapon responsibility separate object me rakho; Character collaborator ko use kare.",
    predict: ["Character/Weapon relationship?", "composition"],
    predict2: ["Warrior/Character relationship?", "inheritance"],
    prompt:
      "Independent build:\n- `Weapon` interface requires `use()`\n- `Sword` prints `Sword strikes`; `Bow` prints `Arrow flies`\n- abstract `Character` stores private name + Weapon through constructor\n- `showName()` prints `Name: <name>`\n- `attack()` delegates to weapon.use()\n- Warrior and Ranger extend Character; they do not duplicate attack logic\n- Aman Warrior gets Sword; Riya Ranger gets Bow\n\nExact output:\nName: Aman\nSword strikes\nName: Riya\nArrow flies",
    starter:
      "interface Weapon {\n    // Define weapon capability.\n}\n\nclass Sword {\n    // Implement Weapon.\n}\n\nclass Bow {\n    // Implement Weapon.\n}\n\nabstract class Character {\n    // Store name + Weapon.\n    // Add showName().\n    // Delegate attack() to Weapon.\n}\n\nclass Warrior {\n    // IS-A Character.\n}\n\nclass Ranger {\n    // IS-A Character.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Build Aman with Sword and Riya with Bow.\n        // For each: showName(), then attack().\n    }\n}",
    solution:
      'interface Weapon {\n    void use();\n}\n\nclass Sword implements Weapon {\n    @Override\n    public void use() {\n        System.out.println("Sword strikes");\n    }\n}\n\nclass Bow implements Weapon {\n    @Override\n    public void use() {\n        System.out.println("Arrow flies");\n    }\n}\n\nabstract class Character {\n    private String name;\n    private Weapon weapon;\n\n    Character(String name, Weapon weapon) {\n        this.name = name;\n        this.weapon = weapon;\n    }\n\n    void showName() {\n        System.out.println("Name: " + name);\n    }\n\n    void attack() {\n        weapon.use();\n    }\n}\n\nclass Warrior extends Character {\n    Warrior(String name, Weapon weapon) {\n        super(name, weapon);\n    }\n}\n\nclass Ranger extends Character {\n    Ranger(String name, Weapon weapon) {\n        super(name, weapon);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Character aman = new Warrior("Aman", new Sword());\n        Character riya = new Ranger("Riya", new Bow());\n\n        aman.showName();\n        aman.attack();\n        riya.showName();\n        riya.attack();\n    }\n}',
    tests: tests("Name: Aman\nSword strikes\nName: Riya\nArrow flies"),
  },
];

export const compositionModule = specModule(
  {
    slug: "composition",
    title: "Module 30 — Composition",
    description:
      "HAS-A relationships, object collaboration, constructor injection aur delegation se flexible OOP designs build karo.",
    position: 30,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
