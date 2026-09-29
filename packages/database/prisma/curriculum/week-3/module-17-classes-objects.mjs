export const classesObjectsModule = {
  slug: "week-3-classes-objects",
  title: "Week 3 — Classes & Objects",
  description:
    "Related data ko classes me model karna, objects create karna, fields ke through state read/update karna, multiple independent objects trace karna aur object-based programs debug/build karna seekho.",
  position: 17,

  quests: {
    create: [
      {
        slug: "why-objects",
        title: "Why Do We Need Objects?",
        description:
          "Scattered variables se start karke samjho ki related data ko ek meaningful model me group karne ki zarurat kyun padti hai.",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        position: 1,
        estimatedMinutes: 15,
        lessons: {
          create: [
            {
              slug: "scattered-player-data",
              title: "Scattered Data Ki Problem",
              kind: "THEORY",
              position: 1,
              content: String.raw`
Ab tak hum individual variables ke saath programs bana rahe the. Ek player ke liye ye manageable hai:

~~~java
String playerName = "Aman";
int playerLevel = 3;
int playerXp = 250;
~~~

Lekin do players ke saath variables multiply hone lagte hain:

~~~java
String player1Name = "Aman";
int player1Level = 3;
int player1Xp = 250;

String player2Name = "Riya";
int player2Level = 5;
int player2Xp = 470;
~~~

Problem syntax ki nahi hai. Problem ye hai ki **related data scattered hai**.

~~~text
Aman
├── name
├── level
└── xp

Riya
├── name
├── level
└── xp
~~~

Programming me jab kuch values ek hi real concept ko describe karti hain, hume unhe ek model ki tarah sochna useful hota hai.

~~~java
class Player {
    String name;
    int level;
    int xp;
}
~~~

## Mental model

~~~text
related values
     ↓
one concept/entity
     ↓
class model
~~~

> 💡 Class ka first benefit syntax short karna nahi, data ko meaning ke saath organize karna hai.
`,
            },
            {
              slug: "class-as-blueprint",
              title: "Class = Blueprint",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
Class ko beginner level par **blueprint** samjho.

~~~java
class Book {
    String title;
    String author;
    int pages;
}
~~~

Ye code kisi specific book ko create nahi karta. Ye sirf define karta hai ki ek Book kis type ki information rakh sakti hai.

~~~text
Book blueprint
├── title
├── author
└── pages
~~~

Different concepts ke fields naturally different honge:

~~~text
Book             Enemy
├── title        ├── name
├── author       ├── health
└── pages        └── damage
~~~

Design question hamesha ye hai:

> **Kaunsi values ek hi entity ko describe karti hain?**

Isi question ka answer future classes ke fields decide karne me help karega.
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "identify-player-grouping",
              title: "Find the Entity Boundary",
              prompt: `Ek game me har enemy ke liye name, health aur damage store karna hai. Har enemy ka spawnTime bhi usi enemy ko describe karta hai.

In values ko ek meaningful model me group karne ke liye entity ka best naam kya hoga?

Exactly enter karo:
Enemy`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "Enemy",
            },
            {
              slug: "book-fields-check",
              title: "Spot the Unrelated Field",
              prompt: `Ek Book model ke planned fields hain:

title
author
pages
playerXp

Kaunsa field Book entity ko naturally describe nahi karta?

Exactly field name enter karo.`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 2,
              solution: "playerXp",
            },
          ],
        },
      },

      {
        slug: "your-first-class",
        title: "Your First Class",
        description:
          "Class declaration ko read karo aur fields ke through apna first custom data model define karo.",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        position: 2,
        estimatedMinutes: 18,
        lessons: {
          create: [
            {
              slug: "class-and-fields",
              title: "Class Aur Fields",
              kind: "THEORY",
              position: 1,
              content: String.raw`
Ek simple class dekho:

~~~java
class Player {
    String name;
    int level;
    int xp;
}
~~~

## Breakdown

~~~text
class Player
      └──── class name

String name;
  │     └── field name
  └──────── field type
~~~

Three important terms:

**Class** → custom type / blueprint  
**Field** → object ke andar stored information  
**Object** → class ka actual instance

~~~text
class defines shape
        ↓
fields define stored data
        ↓
objects will hold actual values
~~~

Abhi hum sirf public/default-access simple fields use kar rahe hain. Constructors, **this**, **private** aur **static** later modules me deliberately aayenge.
`,
            },
            {
              slug: "different-class-models",
              title: "Different Problems, Different Models",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
Class ke fields problem domain se aate hain.

~~~java
class Enemy {
    String name;
    int health;
}

class Quest {
    String title;
    int xpReward;
}

class Book {
    String title;
    String author;
    int pages;
}
~~~

Notice karo: har class me random variables nahi daale gaye. Fields us entity ko describe karte hain.

## Mental model

~~~text
entity ka naam
     ↓
entity ko describe karne wali values
     ↓
field types + field names
~~~

Class design ka first skill syntax nahi, **model boundary choose karna** hai.
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "identify-field",
              title: "Read the Class",
              prompt: `Code ko read karo:

class Product {
    String name;
    int stock;
    double price;
}

Product ki quantity ko represent karne wala field kaunsa hai?

Exactly field name enter karo.`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "stock",
            },
            {
              slug: "build-quest-class",
              title: "Build a Quest Class",
              prompt: `Quest naam ki class complete karo.

Required fields:
- String title
- int xpReward

Main method already provided hai. Required fields sahi define hue to program compile hoga aur expected output print karega.`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 2,
              starterCode: `class Quest {
  // Add the two required fields here
}

public class Main {
  public static void main(String[] args) {
    Quest quest = new Quest();
    quest.title = "Object Basics";
    quest.xpReward = 100;

    System.out.println(quest.title);
    System.out.println(quest.xpReward);
  }
}`,
              solution: `class Quest {
  String title;
  int xpReward;
}

public class Main {
  public static void main(String[] args) {
    Quest quest = new Quest();
    quest.title = "Object Basics";
    quest.xpReward = 100;

    System.out.println(quest.title);
    System.out.println(quest.xpReward);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Object Basics\n100",
                    isHidden: false,
                  },
                ],
              },
            },
            {
              slug: "fix-class-field-syntax",
              title: "Fix the Field Syntax",
              prompt: `Product class compile nahi ho rahi. Field declaration me syntax bug fix karo.

Expected output:
Keyboard`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 3,
              starterCode: `class Product {
  String name
}

public class Main {
  public static void main(String[] args) {
    Product product = new Product();
    product.name = "Keyboard";
    System.out.println(product.name);
  }
}`,
              solution: `class Product {
  String name;
}

public class Main {
  public static void main(String[] args) {
    Product product = new Product();
    product.name = "Keyboard";
    System.out.println(product.name);
  }
}`,
              testCases: {
                create: [
                  { position: 1, expectedOutput: "Keyboard", isHidden: false },
                ],
              },
            },
          ],
        },
      },

      {
        slug: "creating-objects-with-new",
        title: "Create Objects with new",
        description:
          "Class blueprint aur actual object ke beech difference samjho aur new ke saath instances create karo.",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        position: 3,
        estimatedMinutes: 18,
        lessons: {
          create: [
            {
              slug: "first-object",
              title: "Class Se Object Tak",
              kind: "THEORY",
              position: 1,
              content: String.raw`
Class sirf blueprint hai. Actual values rakhne ke liye hume **object** create karna hota hai.

~~~java
class Player {
    String name;
    int xp;
}

Player player = new Player();
~~~

## Mental model

~~~text
Player class
    ↓ blueprint
new Player()
    ↓ creates
actual Player object
    ↓ referenced by
player
~~~

Ek line ko teen parts me read karo:

~~~java
Player player = new Player();
~~~

~~~text
Player        → variable ka type
player        → reference variable ka naam
new Player()  → naya Player object create karo
~~~

> 💡 Class definition aur object creation same event nahi hain.
`,
            },
            {
              slug: "object-variable-breakdown",
              title: "Object Creation Ko Read Karna",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
~~~java
class Enemy {
    String name;
    int health;
}

Enemy boss = new Enemy();
~~~

Is statement ko left-to-right samjho:

~~~text
Enemy     boss      =     new Enemy();
  │        │                 │
 type   reference         new object
~~~

Agar hum do baar **new Enemy()** execute karte hain, do separate objects create hote hain:

~~~java
Enemy first = new Enemy();
Enemy second = new Enemy();
~~~

~~~text
first  ──→ Enemy object A
second ──→ Enemy object B
~~~

Abhi focus creation par hai. In objects ki independent state ko thodi der me trace karenge.
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "new-keyword-check",
              title: "Count the Created Objects",
              prompt: `Code ko mentally execute karo:

Player p1 = new Player();
Player p2 = new Player();
Player p3 = p1;

new Player() kitni baar execute hua?

Sirf number enter karo.`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "2",
            },
            {
              slug: "create-enemy-object",
              title: "Create the Boss Object",
              prompt: `Enemy class already defined hai.

boss naam ka Enemy object create karo, uska name "Dragon" aur health 500 set karo, phir exact output print karo:

Dragon
500`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 2,
              starterCode: `class Enemy {
  String name;
  int health;
}

public class Main {
  public static void main(String[] args) {
    // Create boss and assign its fields

  }
}`,
              solution: `class Enemy {
  String name;
  int health;
}

public class Main {
  public static void main(String[] args) {
    Enemy boss = new Enemy();
    boss.name = "Dragon";
    boss.health = 500;

    System.out.println(boss.name);
    System.out.println(boss.health);
  }
}`,
              testCases: {
                create: [
                  { position: 1, expectedOutput: "Dragon\n500", isHidden: false },
                ],
              },
            },
            {
              slug: "fix-missing-new",
              title: "Fix the Missing new",
              prompt: `Object creation statement incomplete hai. Compile error fix karo without changing expected values.

Expected output:
Slime
40`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 3,
              starterCode: `class Enemy {
  String name;
  int health;
}

public class Main {
  public static void main(String[] args) {
    Enemy enemy = Enemy();
    enemy.name = "Slime";
    enemy.health = 40;

    System.out.println(enemy.name);
    System.out.println(enemy.health);
  }
}`,
              solution: `class Enemy {
  String name;
  int health;
}

public class Main {
  public static void main(String[] args) {
    Enemy enemy = new Enemy();
    enemy.name = "Slime";
    enemy.health = 40;

    System.out.println(enemy.name);
    System.out.println(enemy.health);
  }
}`,
              testCases: {
                create: [
                  { position: 1, expectedOutput: "Slime\n40", isHidden: false },
                ],
              },
            },
          ],
        },
      },      {
        slug: "working-with-object-fields",
        title: "Working with Object Fields",
        description:
          "object.field ke through object state assign, read aur update karna seekho.",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        position: 4,
        estimatedMinutes: 20,
        lessons: {
          create: [
            {
              slug: "field-access",
              title: "Read and Write Object State",
              kind: "THEORY",
              position: 1,
              content: String.raw`
Object create karne ke baad uske fields ko dot operator ke through access karte hain.

~~~java
Player player = new Player();

player.name = "Aman";
player.xp = 100;
~~~

Read karna bhi same pattern follow karta hai:

~~~java
System.out.println(player.name);
System.out.println(player.xp);
~~~

## Mental model

~~~text
player
  │
  ├── name ──→ "Aman"
  └── xp   ──→ 100
~~~

Dot operator ko beginner level par aise read kar sakte ho:

~~~text
player.xp
   ↓
player object ke andar xp field
~~~

Important point:

> Field kisi class ka abstract idea nahi reh gaya. Object create hone ke baad us field ki actual value us specific object ki state ka part hai.
`,
            },
            {
              slug: "state-updates",
              title: "Object State Can Change",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
Object fields ko update bhi kiya ja sakta hai.

~~~java
class Player {
    String name;
    int xp;
}

Player player = new Player();
player.name = "Aman";
player.xp = 100;

player.xp = player.xp + 50;
~~~

Trace:

~~~text
initial state

player
├── name → Aman
└── xp   → 100

player.xp = player.xp + 50
                     ↓
                  100 + 50

new state

player
├── name → Aman
└── xp   → 150
~~~

Is module me hum fields ko directly update kar rahe hain intentionally.

Later hum question karenge:

> Kya outside code ko object ki state freely change karni chahiye?

Wahi discussion encapsulation tak le jayegi.
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "predict-field-update",
              title: "Trace the XP Update",
              prompt: `Code ko trace karo:

Player player = new Player();
player.xp = 120;
player.xp = player.xp + 30;
player.xp = player.xp * 2;

System.out.println(player.xp);

Exact output enter karo.`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "300",
            },
            {
              slug: "update-product-state",
              title: "Update Product Stock",
              prompt: `Product object create karo.

Initial state:
name = "Keyboard"
stock = 10

Phir 3 items sell hone ko represent karne ke liye stock update karo.

Exact output:
Keyboard
7`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 2,
              starterCode: `class Product {
  String name;
  int stock;
}

public class Main {
  public static void main(String[] args) {
    // Create product, assign initial state, then update stock
  }
}`,
              solution: `class Product {
  String name;
  int stock;
}

public class Main {
  public static void main(String[] args) {
    Product product = new Product();
    product.name = "Keyboard";
    product.stock = 10;

    product.stock = product.stock - 3;

    System.out.println(product.name);
    System.out.println(product.stock);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Keyboard\n7",
                    isHidden: false,
                  },
                ],
              },
            },
            {
              slug: "fix-wrong-field-name",
              title: "Fix the Field Access",
              prompt: `Book class me field ka naam pages hai, lekin main method wrong field access kar raha hai.

Bug fix karo.

Expected output:
Clean Code
464`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 3,
              starterCode: `class Book {
  String title;
  int pages;
}

public class Main {
  public static void main(String[] args) {
    Book book = new Book();
    book.title = "Clean Code";
    book.pageCount = 464;

    System.out.println(book.title);
    System.out.println(book.pages);
  }
}`,
              solution: `class Book {
  String title;
  int pages;
}

public class Main {
  public static void main(String[] args) {
    Book book = new Book();
    book.title = "Clean Code";
    book.pages = 464;

    System.out.println(book.title);
    System.out.println(book.pages);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Clean Code\n464",
                    isHidden: false,
                  },
                ],
              },
            },
          ],
        },
      },

      {
        slug: "multiple-independent-objects",
        title: "Multiple Independent Objects",
        description:
          "Same class se multiple objects create karke unki independent state ko reason aur trace karo.",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        position: 5,
        estimatedMinutes: 22,
        lessons: {
          create: [
            {
              slug: "same-class-different-state",
              title: "Same Blueprint, Different State",
              kind: "THEORY",
              position: 1,
              content: String.raw`
Ek class se multiple objects create kiye ja sakte hain.

~~~java
class Player {
    String name;
    int xp;
}

Player p1 = new Player();
Player p2 = new Player();
~~~

Dono ka blueprint same hai, lekin objects separate hain.

~~~text
Player class
   ├─────────────┐
   ↓             ↓
Object A       Object B
p1             p2
├─ name        ├─ name
└─ xp          └─ xp
~~~

Ab actual state assign karo:

~~~java
p1.name = "Aman";
p1.xp = 100;

p2.name = "Riya";
p2.xp = 300;
~~~

~~~text
p1 → { name:Aman, xp:100 }

p2 → { name:Riya, xp:300 }
~~~

> 💡 Same class ka matlab same state nahi hota.
`,
            },
            {
              slug: "independent-state-update",
              title: "Update the Correct Object",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
Suppose Aman earns XP:

~~~java
p1.xp = p1.xp + 50;
~~~

Trace:

~~~text
before

p1 → xp:100
p2 → xp:300

update p1

p1 → xp:150
p2 → xp:300
~~~

Sirf **p1** ke through accessed state update hui.

~~~java
System.out.println(p1.xp); // 150
System.out.println(p2.xp); // 300
~~~

Is quest ka scope intentionally small hai:

~~~text
two manually-created objects
+
independent field values
~~~

Object references ke deeper cases, aliasing aur arrays of objects later module me aayenge.
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "predict-independent-state",
              title: "Which Object Changed?",
              prompt: `Code trace karo:

Player p1 = new Player();
Player p2 = new Player();

p1.xp = 100;
p2.xp = 300;

p1.xp = p1.xp + 50;

System.out.println(p1.xp);
System.out.println(p2.xp);

Exact two-line output enter karo.`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "150\n300",
            },
            {
              slug: "build-two-products",
              title: "Build Two Independent Products",
              prompt: `Same Product class se do separate objects create karo.

Product 1:
name = Keyboard
stock = 10

Product 2:
name = Mouse
stock = 25

Keyboard ke stock me 5 add karo. Mouse unchanged rehna chahiye.

Exact output:
Keyboard: 15
Mouse: 25`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 2,
              starterCode: `class Product {
  String name;
  int stock;
}

public class Main {
  public static void main(String[] args) {
    // Create and initialize two independent Product objects
  }
}`,
              solution: `class Product {
  String name;
  int stock;
}

public class Main {
  public static void main(String[] args) {
    Product keyboard = new Product();
    keyboard.name = "Keyboard";
    keyboard.stock = 10;

    Product mouse = new Product();
    mouse.name = "Mouse";
    mouse.stock = 25;

    keyboard.stock = keyboard.stock + 5;

    System.out.println(keyboard.name + ": " + keyboard.stock);
    System.out.println(mouse.name + ": " + mouse.stock);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Keyboard: 15\nMouse: 25",
                    isHidden: false,
                  },
                ],
              },
            },
            {
              slug: "fix-wrong-object-update",
              title: "Fix the Wrong Object",
              prompt: `Aman ko 40 XP milna chahiye, lekin code Riya ko update kar raha hai.

Sirf intended object update karo.

Expected output:
Aman: 140
Riya: 250`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 3,
              starterCode: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player aman = new Player();
    aman.name = "Aman";
    aman.xp = 100;

    Player riya = new Player();
    riya.name = "Riya";
    riya.xp = 250;

    riya.xp = riya.xp + 40;

    System.out.println(aman.name + ": " + aman.xp);
    System.out.println(riya.name + ": " + riya.xp);
  }
}`,
              solution: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player aman = new Player();
    aman.name = "Aman";
    aman.xp = 100;

    Player riya = new Player();
    riya.name = "Riya";
    riya.xp = 250;

    aman.xp = aman.xp + 40;

    System.out.println(aman.name + ": " + aman.xp);
    System.out.println(riya.name + ": " + riya.xp);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Aman: 140\nRiya: 250",
                    isHidden: false,
                  },
                ],
              },
            },
          ],
        },
      },

      {
        slug: "object-prediction-lab",
        title: "Trace Object State",
        description:
          "Object programs ko line-by-line mentally execute karke changing state aur copied primitive values ko accurately trace karo.",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        position: 6,
        estimatedMinutes: 22,
        lessons: {
          create: [
            {
              slug: "state-tracing-process",
              title: "Trace, Don't Guess",
              kind: "THEORY",
              position: 1,
              content: String.raw`
Object code ko predict karte waqt variable names dekh kar guess mat karo.

Har object ki state separately track karo.

Example:

~~~java
Player p1 = new Player();
Player p2 = new Player();

p1.xp = 100;
p2.xp = 200;

p1.xp = p2.xp + 50;
~~~

Trace table:

~~~text
step                  p1.xp     p2.xp
-------------------------------------
objects created          0         0
p1.xp = 100            100         0
p2.xp = 200            100       200
p1.xp = p2.xp + 50     250       200
~~~

## Mental model

~~~text
execute one line
      ↓
update only affected state
      ↓
record new value
      ↓
continue
~~~

Object tracing ka goal ye samajhna hai ki **kis statement ne kis object's state change ki**.
`,
            },
            {
              slug: "copied-field-value",
              title: "A Copied int Keeps Its Value",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
Ab ek subtle case:

~~~java
Player player = new Player();
player.xp = 100;

int savedXp = player.xp;

player.xp = 500;
~~~

Trace:

~~~text
player.xp = 100

savedXp = player.xp
         = 100

player.xp = 500

final:
savedXp   → 100
player.xp → 500
~~~

savedXp me **int value copy** hui thi.

Baad me field update hone se pehle copy ki hui primitive value automatically change nahi hoti.

Abhi hum primitive field-value copying tak limited hain. Object-reference aliasing later module ka topic hai.
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "trace-one-object",
              title: "Trace One Object",
              prompt: `Code trace karo:

Player player = new Player();
player.level = 2;
player.level = player.level + 3;
player.level = player.level * 2;

System.out.println(player.level);

Exact output?`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "10",
            },
            {
              slug: "trace-two-objects",
              title: "Trace Two Objects",
              prompt: `Code trace karo:

Player a = new Player();
Player b = new Player();

a.xp = 100;
b.xp = 300;

a.xp = b.xp - 50;
b.xp = b.xp + 20;

System.out.println(a.xp);
System.out.println(b.xp);

Exact two-line output?`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 2,
              solution: "250\n320",
            },
            {
              slug: "trace-copied-field-value",
              title: "Trace the Saved Value",
              prompt: `Code trace karo:

Player player = new Player();
player.xp = 120;

int savedXp = player.xp;

player.xp = 500;

System.out.println(savedXp);
System.out.println(player.xp);

Exact two-line output?`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 3,
              solution: "120\n500",
            },
            {
              slug: "build-state-trace",
              title: "Implement a State Trace",
              prompt: `Player object ki state ko following sequence me update karo:

start xp = 80
gain 20
double current xp

Har important state print karo.

Exact output:
Start: 80
After gain: 100
After double: 200`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 4,
              starterCode: `class Player {
  int xp;
}

public class Main {
  public static void main(String[] args) {
    // Create the object and implement the state changes
  }
}`,
              solution: `class Player {
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player player = new Player();

    player.xp = 80;
    System.out.println("Start: " + player.xp);

    player.xp = player.xp + 20;
    System.out.println("After gain: " + player.xp);

    player.xp = player.xp * 2;
    System.out.println("After double: " + player.xp);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput:
                      "Start: 80\nAfter gain: 100\nAfter double: 200",
                    isHidden: false,
                  },
                ],
              },
            },
          ],
        },
      },      
      {
        slug: "object-bug-hunt",
        title: "Object Bug Hunt",
        description:
          "Class, object creation, field access aur independent state se related realistic bugs systematically diagnose karo.",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        position: 7,
        estimatedMinutes: 24,
        lessons: {
          create: [
            {
              slug: "object-debugging-checklist",
              title: "Object Debugging Checklist",
              kind: "THEORY",
              position: 1,
              content: String.raw`
Object code fail ho raha ho to random edits mat karo.

Ek fixed checklist follow karo.

## 1. Class check karo

~~~java
class Player {
    String name;
    int xp;
}
~~~

Required field actually declared hai?

## 2. Object creation check karo

~~~java
Player player = new Player();
~~~

- type correct hai?
- reference variable correct hai?
- **new** present hai?
- class name correct hai?

## 3. Field access check karo

~~~java
player.xp = 100;
~~~

Kya \`xp\` Player me actually exist karta hai?

## 4. Correct object check karo

Multiple objects hone par:

~~~java
aman.xp = aman.xp + 50;
~~~

Agar reward Aman ko milna tha, accidentally \`riya.xp\` update to nahi kar diya?

## 5. Output check karo

State correct update hui ho sakti hai, lekin wrong object print ho raha ho:

~~~java
System.out.println(riya.xp);
~~~

jab expected Aman tha.

## Mental model

~~~text
bug
 ↓
class?
 ↓
object created?
 ↓
new?
 ↓
field exists?
 ↓
correct object.field?
 ↓
correct object printed?
~~~

Debugging ka goal working solution yaad karna nahi hai.

Goal hai **failure ko isolate karna**.
`,
            },
            {
              slug: "debug-state-not-lines",
              title: "Debug the State",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
Suppose expected output hai:

~~~text
Aman: 150
Riya: 300
~~~

Lekin code:

~~~java
Player aman = new Player();
aman.name = "Aman";
aman.xp = 100;

Player riya = new Player();
riya.name = "Riya";
riya.xp = 300;

riya.xp = riya.xp + 50;
~~~

Sirf statement dekhne ke bajay state trace karo:

~~~text
before reward

aman → xp:100
riya → xp:300

intended:
aman → xp:150

actual:
riya → xp:350
~~~

Ab bug obvious hai:

~~~java
aman.xp = aman.xp + 50;
~~~

Debugging ka powerful question:

> **Is line ke baad kaunsa object change hona chahiye tha, aur actually kaunsa change hua?**
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "spot-missing-new",
              title: "Spot the Creation Bug",
              prompt: `Code compile nahi hoga:

Player player = Player();

Missing Java keyword exactly enter karo.`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "new",
            },
            {
              slug: "fix-debug-field",
              title: "Fix the Wrong Field",
              prompt: `Player class me field \`xp\` hai, lekin code wrong field name use kar raha hai.

Expected output:
Aman: 150`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 2,
              starterCode: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player player = new Player();
    player.name = "Aman";
    player.experience = 150;

    System.out.println(player.name + ": " + player.xp);
  }
}`,
              solution: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player player = new Player();
    player.name = "Aman";
    player.xp = 150;

    System.out.println(player.name + ": " + player.xp);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Aman: 150",
                    isHidden: false,
                  },
                ],
              },
            },
            {
              slug: "fix-debug-output-object",
              title: "Fix the Wrong Output Object",
              prompt: `Aman aur Riya ki state correct hai, lekin second output wrong object ko read kar raha hai.

Expected output:
Aman: 120
Riya: 300`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 3,
              starterCode: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player aman = new Player();
    aman.name = "Aman";
    aman.xp = 120;

    Player riya = new Player();
    riya.name = "Riya";
    riya.xp = 300;

    System.out.println(aman.name + ": " + aman.xp);
    System.out.println(riya.name + ": " + aman.xp);
  }
}`,
              solution: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player aman = new Player();
    aman.name = "Aman";
    aman.xp = 120;

    Player riya = new Player();
    riya.name = "Riya";
    riya.xp = 300;

    System.out.println(aman.name + ": " + aman.xp);
    System.out.println(riya.name + ": " + riya.xp);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Aman: 120\nRiya: 300",
                    isHidden: false,
                  },
                ],
              },
            },
            {
              slug: "repair-mixed-object-bugs",
              title: "Repair the Mixed Object Bugs",
              prompt: `Is program me multiple object-related bugs hain.

Requirements:
- Aman starts with 100 XP.
- Riya starts with 250 XP.
- Aman earns 50 XP.
- Riya does not change.

Exact output:
Aman: 150
Riya: 250`,
              kind: "CODE",
              difficulty: "INTERMEDIATE",
              position: 4,
              starterCode: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player aman = Player();
    aman.name = "Aman";
    aman.xp = 100;

    Player riya = new Player();
    riya.name = "Riya";
    riya.xp = 250;

    riya.xp = riya.xp + 50;

    System.out.println(aman.name + ": " + riya.xp);
    System.out.println(riya.name + ": " + riya.xp);
  }
}`,
              solution: `class Player {
  String name;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Player aman = new Player();
    aman.name = "Aman";
    aman.xp = 100;

    Player riya = new Player();
    riya.name = "Riya";
    riya.xp = 250;

    aman.xp = aman.xp + 50;

    System.out.println(aman.name + ": " + aman.xp);
    System.out.println(riya.name + ": " + riya.xp);
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput: "Aman: 150\nRiya: 250",
                    isHidden: false,
                  },
                ],
              },
            },
          ],
        },
      },

      {
        slug: "player-profile-build",
        title: "🏆 Build Player Profiles",
        description:
          "Class, object creation, fields, state updates aur multiple independent objects ko combine karke Module 17 ka independent build complete karo.",
        status: "PUBLISHED",
        difficulty: "INTERMEDIATE",
        position: 8,
        estimatedMinutes: 30,
        lessons: {
          create: [
            {
              slug: "profile-build-plan",
              title: "From Requirements to Objects",
              kind: "RECAP",
              position: 1,
              content: String.raw`
Ab Module 17 ke concepts ko ek small build me combine karenge.

Requirement:

Har game character ke paas:

~~~text
name
role
level
xp
~~~

hona chahiye.

Pehla design decision:

> Ye four values ek hi entity ko describe karti hain?

Yes.

So:

~~~java
class Character {
    String name;
    String role;
    int level;
    int xp;
}
~~~

Ab multiple actual characters chahiye:

~~~text
Character blueprint
      ↓
  ┌───┴────┐
  ↓        ↓
Aman      Riya
~~~

Each object gets its own state.

## Build flow

~~~text
requirements
     ↓
class + fields
     ↓
create objects
     ↓
assign starting state
     ↓
apply updates
     ↓
print final state
~~~

Is final build me constructor use nahi karna.

Why?

Because Module 17 ka goal current manual object workflow ko master karna hai:

~~~java
Character aman = new Character();

aman.name = "Aman";
aman.role = "Warrior";
aman.level = 3;
aman.xp = 250;
~~~

Is repetition ko notice karo.

Next module me isi pain point ko solve karenge.
`,
            },
            {
              slug: "profile-build-boundaries",
              title: "What You Should Decide",
              kind: "EXAMPLE",
              position: 2,
              content: String.raw`
Final challenge me starter structure intentionally minimal hai.

Tumhe decide karna hoga:

1. Character class kaha define karni hai.
2. Required fields ke correct types kya hain.
3. Do separate objects kaise create honge.
4. Starting state kis object me jayegi.
5. XP update kis object par apply hoga.
6. Level update kis object par apply hoga.
7. Final output kis object's fields se build hoga.

## State plan

~~~text
Aman
name  → Aman
role  → Warrior
level → 3
xp    → 250
       ↓ +50 XP
xp    → 300

Riya
name  → Riya
role  → Mage
level → 5
xp    → 480
       ↓ level +1
level → 6
~~~

Final code ka important part length nahi hai.

Important part ye hai ki **correct state correct object ke saath attached rahe**.

Aur ek aur important boundary:

~~~text
No constructor
No this
No private
No static
No object array
~~~

Ye concepts future modules me aayenge.
`,
            },
          ],
        },
        exercises: {
          create: [
            {
              slug: "profile-plan-check",
              title: "Trace the Final State",
              prompt: `Aman starts at level 3 with 250 XP.
Aman earns 50 XP.

Riya starts at level 5 with 480 XP.
Riya levels up once.

Final state me values kya hongi?

Exact output enter karo:

Aman: LEVEL XP
Riya: LEVEL XP

Numbers fill karke exact two lines submit karo.`,
              kind: "OUTPUT_PREDICTION",
              difficulty: "BEGINNER",
              position: 1,
              solution: "Aman: 3 300\nRiya: 6 480",
            },
            {
              slug: "build-one-character-profile",
              title: "Warm-up: Build One Character",
              prompt: `Character class banao with:

String name
String role
int level
int xp

Aman create karo:

name = Aman
role = Warrior
level = 3
xp = 250

Usse 50 XP do.

Exact output:
Aman - Warrior - Level 3 - XP 300

Constructor use mat karo.`,
              kind: "CODE",
              difficulty: "BEGINNER",
              position: 2,
              starterCode: `public class Main {
  public static void main(String[] args) {
    // Create and update Aman
  }
}

// Define Character below`,
              solution: `class Character {
  String name;
  String role;
  int level;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Character aman = new Character();

    aman.name = "Aman";
    aman.role = "Warrior";
    aman.level = 3;
    aman.xp = 250;

    aman.xp = aman.xp + 50;

    System.out.println(
      aman.name + " - " +
      aman.role + " - Level " +
      aman.level + " - XP " +
      aman.xp
    );
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput:
                      "Aman - Warrior - Level 3 - XP 300",
                    isHidden: false,
                  },
                ],
              },
            },
            {
              slug: "player-profile-final",
              title: "🏆 Character Profiles — Independent Build",
              prompt: `Complete object-based program independently build karo.

Create a Character class with:
- String name
- String role
- int level
- int xp

Create TWO separate Character objects.

Character 1 starting state:
Aman
Warrior
Level 3
XP 250

Character 2 starting state:
Riya
Mage
Level 5
XP 480

Then apply these events:
- Aman earns 50 XP.
- Riya levels up once.

Important:
- Aman aur Riya separate objects hone chahiye.
- Update correct object par apply hona chahiye.
- Constructor use mat karo.
- this/private/static/object arrays use mat karo.

Exact final output:

Aman - Warrior - Level 3 - XP 300
Riya - Mage - Level 6 - XP 480`,
              kind: "CODE",
              difficulty: "INTERMEDIATE",
              position: 3,
              starterCode: `public class Main {
  public static void main(String[] args) {
    // Build both characters, apply the events,
    // and print their final profiles.
  }
}

// Design Character below`,
              solution: `class Character {
  String name;
  String role;
  int level;
  int xp;
}

public class Main {
  public static void main(String[] args) {
    Character aman = new Character();
    aman.name = "Aman";
    aman.role = "Warrior";
    aman.level = 3;
    aman.xp = 250;

    Character riya = new Character();
    riya.name = "Riya";
    riya.role = "Mage";
    riya.level = 5;
    riya.xp = 480;

    aman.xp = aman.xp + 50;
    riya.level = riya.level + 1;

    System.out.println(
      aman.name + " - " +
      aman.role + " - Level " +
      aman.level + " - XP " +
      aman.xp
    );

    System.out.println(
      riya.name + " - " +
      riya.role + " - Level " +
      riya.level + " - XP " +
      riya.xp
    );
  }
}`,
              testCases: {
                create: [
                  {
                    position: 1,
                    expectedOutput:
                      "Aman - Warrior - Level 3 - XP 300\nRiya - Mage - Level 6 - XP 480",
                    isHidden: false,
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};