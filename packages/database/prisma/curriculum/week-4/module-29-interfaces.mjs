import { specModule, tests } from "../week-3/spec-module-builder.mjs";

const rows = [
  {
    slug: "interfaces-interface-as-contract",
    title: "Interface as a Capability Contract",
    description:
      "Shared identity ke bina bhi objects same capability promise kar sakte hain—ye modelling need identify karo.",
    problem:
      "Drone aur Bird same family ke objects nahi, but dono `fly()` capability provide kar sakte hain.",
    why: "Interface hierarchy-independent capability ko name karta hai: object kya kar sakta hai, ye promise; implementation kaise karegi, class decide karti hai.",
    model:
      "Bird ──┐\n       ├── Flyable capability\nDrone ─┘\n\nsame capability ≠ same identity",
    syntax: "interface Flyable {\n    void fly();\n}",
    remember:
      "Abstract class shared identity/base model ke liye useful thi; interface capability contract express kar sakta hai even across different class families.",
    example:
      "Flyable says `fly()` must exist; Bird and Drone can fulfil it differently.",
    trace:
      "requirements → find common capability → shared identity required? no → interface candidate",
    mistake:
      "Sirf same method name dekhkar classes ko artificial common parent me force karna.",
    fix: "Ask whether relation identity hai or capability. Capability-only case me interface consider karo.",
    predict: [
      "Flyable primarily identity define karta hai ya capability?",
      "capability",
    ],
    predict2: [
      "Unrelated classes same interface implement kar sakti hain? yes/no",
      "yes",
    ],
    prompt:
      "Capability modelling decision ka exact report print karo:\nContract: Flyable\nPromise: fly\nImplementations: Bird, Drone",
    starter:
      "public class Main {\n    public static void main(String[] args) {\n        // Model a shared capability without inventing a shared class identity.\n    }\n}",
    solution:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Contract: Flyable");\n        System.out.println("Promise: fly");\n        System.out.println("Implementations: Bird, Drone");\n    }\n}',
    tests: tests(
      "Contract: Flyable\nPromise: fly\nImplementations: Bird, Drone",
    ),
  },
  {
    slug: "interfaces-implements-keyword",
    title: "Implementing a Contract",
    description:
      "`implements` se capability adopt karo aur required public method correctly fulfil karo.",
    problem:
      "Drone Flyable promise accept karta hai, so usable concrete Drone ko `fly()` implementation deni hogi.",
    why: "Interface adoption compiler-checkable contract banata hai.",
    model:
      "Flyable contract\n      ↓ implements\nDrone\n      ↓ must provide\npublic fly()",
    syntax:
      "interface Flyable { void fly(); }\n\nclass Drone implements Flyable {\n    public void fly() { ... }\n}",
    remember:
      "Interface method implement karte waqt public visibility preserve karni hoti hai.",
    example: "`Drone implements Flyable` then provides `public void fly()`.",
    trace:
      "declare contract → class implements → compiler checks required method → object can perform capability",
    mistake:
      "`void fly()` ko package-private chhodna and interface method implementation samajhna.",
    fix: "Implementation ko `public` rakho and signature match karo.",
    predict: ["Class interface adopt karne ka keyword?", "implements"],
    predict2: [
      "Interface method implementation public honi chahiye? yes/no",
      "yes",
    ],
    prompt:
      "Drone ko Flyable contract fulfil karwao. Exact output `Drone flying`.",
    starter:
      "interface Flyable {\n    void fly();\n}\n\nclass Drone implements Flyable {\n    // Fulfil the contract.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Drone drone = new Drone();\n        drone.fly();\n    }\n}",
    solution:
      'interface Flyable {\n    void fly();\n}\n\nclass Drone implements Flyable {\n    @Override\n    public void fly() {\n        System.out.println("Drone flying");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Drone drone = new Drone();\n        drone.fly();\n    }\n}',
    tests: tests("Drone flying"),
  },
  {
    slug: "interfaces-interface-references",
    title: "Interface References",
    description:
      "Interface reference ke through different implementations ko capability-based polymorphism se process karo.",
    problem:
      "Caller ko Drone ya Bird identity nahi chahiye; usse sirf Flyable object chahiye.",
    why: "Interface reference caller ko implementation class se decouple karke common capability API expose karta hai.",
    model:
      "Flyable ref\n├─ Bird object  → Bird.fly\n└─ Drone object → Drone.fly",
    syntax: "Flyable flyer = new Drone();\nflyer.fly();",
    remember:
      "Reference capability contract expose karta hai; runtime actual implementation ka method run karta hai.",
    example:
      "Flyable[] me unrelated concrete classes coexist kar sakti hain if both fulfil Flyable.",
    trace:
      "compile call against Flyable → actual object chosen at runtime → its fly implementation executes",
    mistake:
      "Interface reference se implementation-specific methods directly available assume karna.",
    fix: "Caller ko contract methods par depend karao.",
    predict: ["Flyable ref = new Drone(); visible common capability?", "fly"],
    predict2: ["Runtime implementation Drone ki ho sakti hai? yes/no", "yes"],
    prompt:
      "One Flyable[] me Bird aur Drone ko process karo. Exact output:\nBird flying\nDrone flying",
    starter:
      'interface Flyable {\n    void fly();\n}\n\nclass Bird implements Flyable {\n    @Override\n    public void fly() {\n        System.out.println("Bird flying");\n    }\n}\n\nclass Drone implements Flyable {\n    @Override\n    public void fly() {\n        System.out.println("Drone flying");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Store Bird and Drone behind Flyable references.\n        // Use one loop and only the Flyable API.\n    }\n}',
    solution:
      'interface Flyable {\n    void fly();\n}\n\nclass Bird implements Flyable {\n    @Override\n    public void fly() {\n        System.out.println("Bird flying");\n    }\n}\n\nclass Drone implements Flyable {\n    @Override\n    public void fly() {\n        System.out.println("Drone flying");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Flyable[] flyers = {new Bird(), new Drone()};\n\n        for (Flyable flyer : flyers) {\n            flyer.fly();\n        }\n    }\n}',
    tests: tests("Bird flying\nDrone flying"),
  },
  {
    slug: "interfaces-multiple-capabilities",
    title: "Multiple Capabilities",
    description:
      "Ek class ko one inheritance identity ke saath multiple independent capability contracts combine karna sikho.",
    problem:
      "Mage ek Character ho sakta hai aur saath me Healable aur Castable capabilities promise kar sakta hai.",
    why: "Interfaces object ko multiple orthogonal roles/capabilities express karne dete hain without multiple class inheritance.",
    model:
      "        Character\n            ↑\n           Mage\n          /    \\\n   Healable    Castable\n  capability   capability",
    syntax:
      "class Mage extends Character implements Healable, Castable { ... }",
    remember:
      "`extends` identity/base class ke liye; comma-separated `implements` multiple capability contracts ke liye.",
    example:
      "Mage can inherit Character identity and implement heal + cast capabilities.",
    trace:
      "construct Mage → inherited identity available → compiler checks both interface obligations → caller uses capabilities",
    mistake: "Har capability ko parent class hierarchy me force karna.",
    fix: "Independent behaviours ko focused interfaces me model karo.",
    predict: [
      "One class multiple interfaces implement kar sakti hai? yes/no",
      "yes",
    ],
    predict2: [
      "Mage IS-A Character and can also implement capabilities? yes/no",
      "yes",
    ],
    prompt:
      "Mage ko Healable + Castable dono contracts fulfil karwao. Exact output:\nMage heals\nMage casts",
    starter:
      "interface Healable {\n    void heal();\n}\n\ninterface Castable {\n    void cast();\n}\n\nclass Character {\n}\n\nclass Mage extends Character {\n    // Adopt both capabilities and implement both methods.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Mage mage = new Mage();\n        mage.heal();\n        mage.cast();\n    }\n}",
    solution:
      'interface Healable {\n    void heal();\n}\n\ninterface Castable {\n    void cast();\n}\n\nclass Character {\n}\n\nclass Mage extends Character implements Healable, Castable {\n    @Override\n    public void heal() {\n        System.out.println("Mage heals");\n    }\n\n    @Override\n    public void cast() {\n        System.out.println("Mage casts");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Mage mage = new Mage();\n        mage.heal();\n        mage.cast();\n    }\n}',
    tests: tests("Mage heals\nMage casts"),
  },
  {
    slug: "interfaces-default-design-thinking",
    title: "Default Design Thinking",
    description:
      "Interface me default implementation kab justified hai aur kab required method better hai—design tradeoff reason karo.",
    problem:
      "Trackable implementations ko same useful `status()` behaviour mil sakta hai, while `track()` implementation-specific rehni chahiye.",
    why: "Default method contract ko evolve/share small capability-level behaviour kar sakta hai, but class-like stateful base design ka replacement nahi.",
    model:
      "Trackable\n├─ track()   → required variation\n└─ status()  → useful default behaviour",
    syntax:
      'default void status() {\n    System.out.println("Tracking active");\n}',
    remember:
      "Default method use karo only when behaviour capability ke sab/most implementers ke liye sensible default ho.",
    example:
      "Drone and ParcelTracker can reuse status while implementing track differently.",
    trace:
      "interface ref → status call → no override? default runs; track call → concrete implementation",
    mistake:
      "Har interface method ko default bana dena just to reduce implementation work.",
    fix: "Required variation abstract contract me rakho; genuinely universal small behaviour ko default consider karo.",
    predict: [
      "Default method implementation body rakh sakti hai? yes/no",
      "yes",
    ],
    predict2: [
      "Implementation-specific track() ko forced default dena zaroori hai? yes/no",
      "no",
    ],
    prompt:
      "Trackable contract complete karo. Drone track implementation + shared default status use karke exact output:\nDrone tracking\nTracking active",
    starter:
      'interface Trackable {\n    void track();\n\n    // Add a default status() that prints "Tracking active".\n}\n\nclass Drone implements Trackable {\n    // Implement track().\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Trackable tracker = new Drone();\n        tracker.track();\n        tracker.status();\n    }\n}',
    solution:
      'interface Trackable {\n    void track();\n\n    default void status() {\n        System.out.println("Tracking active");\n    }\n}\n\nclass Drone implements Trackable {\n    @Override\n    public void track() {\n        System.out.println("Drone tracking");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Trackable tracker = new Drone();\n        tracker.track();\n        tracker.status();\n    }\n}',
    tests: tests("Drone tracking\nTracking active"),
  },
  {
    slug: "interfaces-abstract-class-vs-interface",
    title: "Abstract Class vs Interface",
    description:
      "Requirements dekhkar shared base identity/implementation aur independent capability contract ke beech deliberate choice karo.",
    problem:
      "`Character` owns shared name/state; `Healable` says some objects can heal. Ye same modelling job nahi.",
    why: "Abstract class answers 'what kind of thing is this shared base?'; interface often answers 'what can this object do?'.",
    model:
      "abstract Character → shared identity/state\nHealable interface → capability\n\nHealer IS-A Character\nHealer CAN heal",
    syntax:
      "abstract class Character { ... }\ninterface Healable { void heal(); }",
    remember:
      "Choice keyword preference se nahi, relationship semantics se karo.",
    example:
      "Character may own name constructor; Healable should not force unrelated implementations into Character hierarchy.",
    trace:
      "requirements → shared state/identity? abstract base candidate → independent capability? interface candidate",
    mistake:
      "Abstract class aur interface ko interchangeable syntax options samajhna.",
    fix: "Identity/state sharing vs capability contract ko explicitly classify karo.",
    predict: [
      "Shared name/state ka natural owner: abstract class ya interface?",
      "abstract class",
    ],
    predict2: ["Independent heal capability ka natural contract?", "interface"],
    prompt:
      "Correct combination build karo: abstract Character stores name; Healable capability; Healer uses both. Exact output:\nName: Kabir\nKabir heals",
    starter:
      'abstract class Character {\n    // Store name and provide getName().\n}\n\ninterface Healable {\n    // Require heal().\n}\n\nclass Healer {\n    // IS-A Character and CAN heal.\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Healer healer = new Healer("Kabir");\n        System.out.println("Name: " + healer.getName());\n        healer.heal();\n    }\n}',
    solution:
      'abstract class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    String getName() {\n        return name;\n    }\n}\n\ninterface Healable {\n    void heal();\n}\n\nclass Healer extends Character implements Healable {\n    Healer(String name) {\n        super(name);\n    }\n\n    @Override\n    public void heal() {\n        System.out.println(getName() + " heals");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Healer healer = new Healer("Kabir");\n        System.out.println("Name: " + healer.getName());\n        healer.heal();\n    }\n}',
    tests: tests("Name: Kabir\nKabir heals"),
  },
  {
    slug: "interfaces-loose-coupling-intro",
    title: "Loose Coupling Intro",
    description:
      "Caller ko concrete implementation ke bajay interface contract par depend karwa kar replaceability ka benefit observe karo.",
    problem:
      "AlertService ko EmailSender hard-code karne ki zarurat nahi; usse sirf Notifier capability chahiye.",
    why: "Interface dependency caller ko implementation details se separate karti hai, so another implementation same contract fulfil karke substitute ho sakti hai.",
    model:
      "AlertService → Notifier contract ← EmailNotifier / SmsNotifier\ncaller knows capability, not concrete behaviour details",
    syntax:
      "void sendAlert(Notifier notifier) {\n    notifier.notifyUser();\n}",
    remember:
      "Loose coupling ka basic idea: higher-level code concrete class se kam, stable contract se zyada depend kare.",
    example:
      "Same sendAlert method EmailNotifier aur SmsNotifier dono accept karta hai.",
    trace:
      "caller receives Notifier → calls contract → actual implementation handles notification",
    mistake:
      "Method ko `EmailNotifier` parameter type dena when any Notifier should work.",
    fix: "Parameter ko required capability type karo.",
    predict: [
      "Flexible caller parameter: Notifier ya EmailNotifier?",
      "Notifier",
    ],
    predict2: [
      "Same caller different implementations accept kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Transfer build: one `sendAlert(Notifier)` method se Email and SMS implementations process karo. Exact output:\nEmail sent\nSMS sent",
    starter:
      'interface Notifier {\n    void notifyUser();\n}\n\nclass EmailNotifier implements Notifier {\n    @Override\n    public void notifyUser() {\n        System.out.println("Email sent");\n    }\n}\n\nclass SmsNotifier implements Notifier {\n    @Override\n    public void notifyUser() {\n        System.out.println("SMS sent");\n    }\n}\n\npublic class Main {\n    static void sendAlert(/* choose the contract type */ notifier) {\n        // Call the contract.\n    }\n\n    public static void main(String[] args) {\n        sendAlert(new EmailNotifier());\n        sendAlert(new SmsNotifier());\n    }\n}',
    solution:
      'interface Notifier {\n    void notifyUser();\n}\n\nclass EmailNotifier implements Notifier {\n    @Override\n    public void notifyUser() {\n        System.out.println("Email sent");\n    }\n}\n\nclass SmsNotifier implements Notifier {\n    @Override\n    public void notifyUser() {\n        System.out.println("SMS sent");\n    }\n}\n\npublic class Main {\n    static void sendAlert(Notifier notifier) {\n        notifier.notifyUser();\n    }\n\n    public static void main(String[] args) {\n        sendAlert(new EmailNotifier());\n        sendAlert(new SmsNotifier());\n    }\n}',
    tests: tests("Email sent\nSMS sent"),
  },
  {
    slug: "interfaces-interface-recap",
    title: "🏆 Capability-Based Guild Build",
    description:
      "Identity hierarchy aur multiple capability contracts independently combine karke interface design ka module payoff prove karo.",
    problem:
      "Guild me characters same base identity share karte hain, but healing aur casting capabilities role-specific hain. Caller ko capability-based operations perform karni hain.",
    why: "Final proof: interface syntax nahi, capability boundaries + interface references + multiple contracts + abstract-base distinction independently design karna.",
    model:
      "abstract Character → name\n\nHealable ← Healer\nCastable ← Mage\n          ↑\nMage can implement both Castable + Healable\n\ncallers depend on capability",
    syntax:
      "interface Healable { void heal(); }\ninterface Castable { void cast(); }",
    remember:
      "One class identity ke saath zero/one/multiple capabilities ho sakti hain; interfaces ko focused promises rakho.",
    example:
      "Healer heals; Mage casts and heals; helper methods accept Healable/Castable.",
    trace:
      "requirements → define identity base → extract capabilities → implement roles → pass objects to capability-typed helper methods",
    mistake:
      "One giant parent class me heal/cast sab methods daal dena so irrelevant children bhi capabilities inherit karein.",
    fix: "Shared identity base me; optional/orthogonal capabilities focused interfaces me.",
    predict: [
      "Helper jo healing use karta hai uska parameter type?",
      "Healable",
    ],
    predict2: [
      "Mage multiple capability contracts implement kar sakta hai? yes/no",
      "yes",
    ],
    prompt:
      "Independent build:\n- abstract Character stores private name and exposes `getName()`\n- Healable requires `heal()`; Castable requires `cast()`\n- Healer extends Character and implements Healable → `<name> heals`\n- Mage extends Character and implements Healable, Castable → `<name> heals` and `<name> casts`\n- `performHeal(Healable)` calls heal\n- `performCast(Castable)` calls cast\n- Create Kabir Healer and Riya Mage\n\nCall in this order: heal Kabir, cast Riya, heal Riya\nExact output:\nKabir heals\nRiya casts\nRiya heals",
    starter:
      "abstract class Character {\n    // Shared identity only.\n}\n\ninterface Healable {\n    // Define healing capability.\n}\n\ninterface Castable {\n    // Define casting capability.\n}\n\nclass Healer {\n    // Character + Healable\n}\n\nclass Mage {\n    // Character + Healable + Castable\n}\n\npublic class Main {\n    static void performHeal(/* capability */ target) {\n        // use capability\n    }\n\n    static void performCast(/* capability */ target) {\n        // use capability\n    }\n\n    public static void main(String[] args) {\n        // Build Kabir and Riya, then invoke helpers in required order.\n    }\n}",
    solution:
      'abstract class Character {\n    private String name;\n\n    Character(String name) {\n        this.name = name;\n    }\n\n    String getName() {\n        return name;\n    }\n}\n\ninterface Healable {\n    void heal();\n}\n\ninterface Castable {\n    void cast();\n}\n\nclass Healer extends Character implements Healable {\n    Healer(String name) {\n        super(name);\n    }\n\n    @Override\n    public void heal() {\n        System.out.println(getName() + " heals");\n    }\n}\n\nclass Mage extends Character implements Healable, Castable {\n    Mage(String name) {\n        super(name);\n    }\n\n    @Override\n    public void heal() {\n        System.out.println(getName() + " heals");\n    }\n\n    @Override\n    public void cast() {\n        System.out.println(getName() + " casts");\n    }\n}\n\npublic class Main {\n    static void performHeal(Healable target) {\n        target.heal();\n    }\n\n    static void performCast(Castable target) {\n        target.cast();\n    }\n\n    public static void main(String[] args) {\n        Healer kabir = new Healer("Kabir");\n        Mage riya = new Mage("Riya");\n\n        performHeal(kabir);\n        performCast(riya);\n        performHeal(riya);\n    }\n}',
    tests: tests("Kabir heals\nRiya casts\nRiya heals"),
  },
];

export const interfacesModule = specModule(
  {
    slug: "interfaces",
    title: "Module 29 — Interfaces",
    description:
      "Hierarchy-independent capability contracts design karo, multiple capabilities combine karo aur callers ko concrete implementations ke bajay contracts par depend karwao.",
    position: 29,
    difficulty: "INTERMEDIATE",
  },
  rows,
);
