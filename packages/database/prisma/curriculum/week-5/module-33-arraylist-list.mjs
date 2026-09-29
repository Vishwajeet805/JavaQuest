import { buildTopicModule } from "../shared/topic-module-builder.mjs";

const points = [
  { slug: "arraylist-list-why-list", title: "Why List", code: false },
  { slug: "arraylist-list-create-arraylist", title: "Create ArrayList", code: true },
  { slug: "arraylist-list-add-and-get", title: "`add` and `get`", code: false },
  { slug: "arraylist-list-set-and-remove", title: "`set` and `remove`", code: true },
  { slug: "arraylist-list-size-and-contains", title: "`size` and `contains`", code: false },
  { slug: "arraylist-list-loop-through-list", title: "Loop Through List", code: true },
  { slug: "arraylist-list-list-of-objects", title: "List of Objects", code: false },
  { slug: "arraylist-list-list-recap", title: "List Recap", code: true }
];

export const arrayListListModule = buildTopicModule({
  slug: "arraylist-list",
  title: "Module 33 — ArrayList & List",
  description: "Dynamic ordered collections ko `List` aur `ArrayList` ke saath use karo.",
  position: 33,
  difficulty: "INTERMEDIATE",
  capstone: false,
  coreIdea: "`List` ordered collection contract hai aur `ArrayList` resizable implementation hai.",
  model: "List<String> names -> ordered values -> index access",
  syntax: "List<String> names = new ArrayList<>();",
  example: "List<String> names=new ArrayList<>();\nnames.add(\"Aman\");\nnames.add(\"Riya\");",
  trace: "add -> size grows -> get(0) returns Aman",
  mistake: "Fixed-size array aur dynamic list ke behaviour ko mix karna.",
  fix: "Dynamic size chahiye to List/ArrayList useful hai; index rules zero-based hi rehte hain.",
  remember: "Variable type me `List` use karna implementation detail ko flexible rakhta hai.",
  check: "Resizable ordered collection implementation?",
  answer: "ArrayList",
  labs: [{
    starterCode: "import java.util.*;\npublic class Main{public static void main(String[] args){List<String> names=new ArrayList<>():\n\n\n\n\n\t\t}\n\t}",
    solution: "import java.util.*;\npublic class Main{public static void main(String[] args)\n{\n\tList<String> names=new ArrayList<>();\nnames.add(\"Aman\");\nnames.add(\"Riya\");\nSystem.out.println(names.size());\nSystem.out.println(names.get(0));}}",
    expectedOutput: "2\nAman",
  }],
}, points);
