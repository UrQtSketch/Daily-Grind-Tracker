/**
 * Daily Grind Tracker — Skill Quiz Arena Engine
 * Domains:
 *  1. Programming Languages (Python, Java, JavaScript, C, C++, Rust, Kotlin, React)
 *  2. Mathematics (Calculus, Linear Algebra, Probability & Statistics, Discrete Mathematics)
 *  3. English & Verbal (Grammar & Sentence Correction, Vocabulary & Verbal Ability)
 *  4. Reasoning & Aptitude (Logical Reasoning & Puzzles, Analytical Reasoning & Sequences)
 *
 * Session Rules:
 *  - 10 Questions per session
 *  - 5-Minute Overall Timer (300 seconds)
 *  - Trophies Rule:
 *      Score 10 / 10 => 7 Trophies
 *      Score 5 - 9 / 10 => 3 Trophies
 *      Score 0 - 4 / 10 => 0 Trophies
 *  - Daily Non-Repeating Question Selector with History Tracking
 */

(function () {
  function sfc32(a, b, c, d) {
    return function () {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = c << 21 | c >>> 11;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function createPrng(seedStr) {
    const h = hashString(seedStr || "dailygrind");
    return sfc32(h, h + 12345, h + 67890, h + 13579);
  }

  function seededShuffle(array, prng) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function shuffleQuestionOptions(question, prng) {
    const originalAnswerText = question.options[question.answer];
    const shuffledOptions = seededShuffle(question.options, prng);
    const newAnswerIndex = shuffledOptions.indexOf(originalAnswerText);
    return {
      ...question,
      options: shuffledOptions,
      answer: newAnswerIndex
    };
  }

  const DOMAINS = {
    programming: {
      id: "programming",
      title: "Programming Languages",
      icon: "💻",
      desc: "Algorithms, syntax, memory models, runtime internals, and interview problem-solving.",
      topics: [
        { id: "prog_python", name: "Python", icon: "🐍", tag: "Generators · GIL · Decorators" },
        { id: "prog_java", name: "Java", icon: "☕", tag: "JVM · OOP · Concurrency" },
        { id: "prog_javascript", name: "JavaScript", icon: "⚡", tag: "Event Loop · Closures · Async" },
        { id: "prog_c", name: "C Language", icon: "⚙️", tag: "Pointers · Memory · Structs" },
        { id: "prog_cpp", name: "C++", icon: "🚀", tag: "STL · RAII · Smart Pointers" },
        { id: "prog_rust", name: "Rust", icon: "🦀", tag: "Ownership · Borrowing · Lifetimes" },
        { id: "prog_kotlin", name: "Kotlin", icon: "🎯", tag: "Null Safety · Coroutines" },
        { id: "prog_react", name: "React", icon: "⚛️", tag: "Hooks · VDOM · Reconciliation" }
      ]
    },
    math: {
      id: "math",
      title: "Mathematics",
      icon: "📐",
      desc: "Calculus, Linear Algebra, Probability & Statistics, and Discrete Mathematics.",
      topics: [
        { id: "math_calculus", name: "Calculus", icon: "∫", tag: "Derivatives · Integrals · Limits" },
        { id: "math_linear_algebra", name: "Linear Algebra", icon: "🔢", tag: "Matrices · Eigenvalues · Rank" },
        { id: "math_prob_stats", name: "Probability & Stats", icon: "📊", tag: "Bayes · Distributions · Variance" },
        { id: "math_discrete", name: "Discrete Math", icon: "🧠", tag: "Graphs · Combinatorics · Logic" }
      ]
    },
    english: {
      id: "english",
      title: "English & Verbal Ability",
      icon: "📖",
      desc: "Grammar, sentence correction, verbal aptitude, analogies, and vocabulary.",
      topics: [
        { id: "english_grammar", name: "Grammar & Usage", icon: "📝", tag: "Tenses · Modifiers · Agreement" },
        { id: "english_verbal", name: "Vocabulary & Verbal", icon: "📚", tag: "Synonyms · Idioms · Analogies" }
      ]
    },
    reasoning: {
      id: "reasoning",
      title: "Reasoning & Aptitude",
      icon: "🧩",
      desc: "Logical deduction, seating puzzles, series, coding-decoding, and critical thinking.",
      topics: [
        { id: "reasoning_logical", name: "Logical Reasoning", icon: "🧩", tag: "Syllogisms · Puzzles · Relations" },
        { id: "reasoning_analytical", name: "Analytical Aptitude", icon: "🔍", tag: "Series · Coding · Deduction" }
      ]
    }
  };

  const QUIZ_BANK = {
  "prog_python": {
    "title": "Python Programming",
    "icon": "🐍",
    "questions": [
      {
        "id": "py_1",
        "q": "What is the output of the following list comprehension with a conditional filter?",
        "code": "nums = [1, 2, 3, 4, 5, 6]\nres = [x**2 for x in nums if x % 2 == 0]\nprint(res)",
        "options": [
          "[4, 16, 36]",
          "[1, 9, 25]",
          "[2, 4, 6]",
          "[4, 8, 12]"
        ],
        "answer": 0,
        "explanation": "The filter 'if x % 2 == 0' selects even numbers [2, 4, 6], and squaring them yields [4, 16, 36]."
      },
      {
        "id": "py_2",
        "q": "What is the common pitfall with mutable default arguments in Python functions?",
        "code": "def add_item(val, target=[]):\n    target.append(val)\n    return target\n\nprint(add_item(1))\nprint(add_item(2))",
        "options": [
          "[1] then [1, 2]",
          "[1] then [2]",
          "TypeError: mutable default",
          "[1] then [1]"
        ],
        "answer": 0,
        "explanation": "Default parameter expressions in Python are evaluated once when the function is defined, so the same list object is shared across subsequent calls."
      },
      {
        "id": "py_3",
        "q": "In Python, what is the fundamental difference between the 'is' operator and '==' operator?",
        "options": [
          "'is' checks memory identity (id), while '==' checks equality of values.",
          "'==' checks memory identity, while 'is' checks value equality.",
          "They are exact synonyms with identical bytecode.",
          "'is' is used only for strings and numbers."
        ],
        "answer": 0,
        "explanation": "'is' checks if two variables refer to the exact same object in memory, while '==' invokes the __eq__ method to compare values."
      },
      {
        "id": "py_4",
        "q": "What is the average time complexity of checking membership ('x in s') in a Python set versus a list?",
        "options": [
          "O(1) for set, O(n) for list",
          "O(n) for set, O(1) for list",
          "O(log n) for both",
          "O(1) for both"
        ],
        "answer": 0,
        "explanation": "Python sets use hash tables allowing O(1) average lookup, whereas lists require O(n) linear search."
      },
      {
        "id": "py_5",
        "q": "What is the primary role of Python's Global Interpreter Lock (GIL)?",
        "options": [
          "To prevent multiple native threads from executing Python bytecodes simultaneously in CPython.",
          "To speed up asynchronous I/O operations.",
          "To encrypt Python memory for security.",
          "To allocate stack memory for local variables."
        ],
        "answer": 0,
        "explanation": "The GIL is a mutex in CPython that protects access to Python objects, preventing race conditions by allowing only one native thread to run bytecode at a time."
      },
      {
        "id": "py_6",
        "q": "What will the following generator function output when iterated with next()?",
        "code": "def gen():\n    yield 1\n    yield 2\n    return 3\n\ng = gen()\nprint(next(g), next(g))",
        "options": [
          "1 2",
          "1 2 3",
          "3 2 1",
          "StopIteration"
        ],
        "answer": 0,
        "explanation": "The generator yields 1 then 2. The return value 3 is attached to the StopIteration exception when exhausted."
      },
      {
        "id": "py_7",
        "q": "What is the optimal LeetCode approach for 'Two Sum' to achieve O(n) time complexity?",
        "options": [
          "Use a hash map to store each number's complement (target - num) and its index.",
          "Sort the array and use binary search for every element (O(n log n)).",
          "Use two nested loops to check every pair (O(n^2)).",
          "Use dynamic programming with an n x target matrix."
        ],
        "answer": 0,
        "explanation": "A single pass with a hash map stores visited numbers and checks if the complement (target - current) exists in O(1) time, giving O(n) overall."
      },
      {
        "id": "py_8",
        "q": "What is the type of variable x in: x = (42)?",
        "code": "x = (42)\nprint(type(x))",
        "options": [
          "<class 'int'>",
          "<class 'tuple'>",
          "<class 'list'>",
          "SyntaxError"
        ],
        "answer": 0,
        "explanation": "A single element inside parentheses without a trailing comma is simply an integer in grouping parentheses. To create a tuple, use (42,)."
      },
      {
        "id": "py_9",
        "q": "What does the @functools.wraps decorator do when creating custom decorators?",
        "options": [
          "It preserves the original function's metadata like __name__ and __doc__.",
          "It compiles the decorated function into C bytecode for speed.",
          "It automatically memoizes return values.",
          "It catches all runtime exceptions thrown by the wrapper."
        ],
        "answer": 0,
        "explanation": "@functools.wraps copies the original function's name, docstring, and annotations to the wrapper function, preventing metadata loss."
      },
      {
        "id": "py_10",
        "q": "What happens when you use a mutable object like a list as a key in a Python dictionary?",
        "code": "d = {}\nd[[1, 2]] = 'val'",
        "options": [
          "TypeError: unhashable type: 'list'",
          "It is inserted with hash computed from list values.",
          "KeyError: invalid key",
          "It is converted to a string automatically."
        ],
        "answer": 0,
        "explanation": "Dictionary keys must be hashable and immutable. Lists are mutable and do not implement __hash__, raising a TypeError."
      },
      {
        "id": "py_11",
        "q": "In Python OOP, what is the key difference between __new__ and __init__?",
        "options": [
          "__new__ creates and returns the instance, while __init__ initializes it.",
          "__init__ allocates memory, while __new__ sets attributes.",
          "__new__ is called after __init__ completes.",
          "There is no difference; __new__ is an alias for __init__."
        ],
        "answer": 0,
        "explanation": "__new__ is the static constructor that creates and returns a new object instance. __init__ receives this instance as 'self' to initialize its fields."
      },
      {
        "id": "py_12",
        "q": "What does the 'with' statement use under the hood in Python for resource management?",
        "options": [
          "Context Manager protocol with __enter__ and __exit__ methods.",
          "Iterators with __iter__ and __next__ methods.",
          "Garbage collection hooks in the sys module.",
          "Operating system thread locks."
        ],
        "answer": 0,
        "explanation": "The 'with' statement invokes __enter__ at the beginning and guarantees __exit__ is called upon leaving the block, even if an error occurs."
      }
    ]
  },
  "prog_javascript": {
    "title": "JavaScript Engine & Core",
    "icon": "⚡",
    "questions": [
      {
        "id": "js_1",
        "q": "In the JavaScript Event Loop, what is the execution order of the following snippet?",
        "code": "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
        "options": [
          "1, 4, 3, 2",
          "1, 2, 3, 4",
          "1, 3, 4, 2",
          "1, 4, 2, 3"
        ],
        "answer": 0,
        "explanation": "Synchronous code runs first ('1', '4'). Microtasks (Promise.then) run next before the next tick ('3'). Macrotasks (setTimeout) execute in the next event loop iteration ('2')."
      },
      {
        "id": "js_2",
        "q": "What does the following closure code print?",
        "code": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}",
        "options": [
          "3, 3, 3",
          "0, 1, 2",
          "undefined, undefined, undefined",
          "0, 0, 0"
        ],
        "answer": 0,
        "explanation": "'var' is function-scoped. By the time the timeouts fire, the loop has finished and the shared variable 'i' has reached 3."
      },
      {
        "id": "js_3",
        "q": "Why does 0.1 + 0.2 === 0.3 evaluate to false in JavaScript?",
        "options": [
          "Because IEEE 754 binary floating-point representation produces precision rounding errors.",
          "Because JavaScript converts numbers to 32-bit integers before comparison.",
          "Because addition is asynchronous in V8.",
          "Because 0.3 is treated as a symbol."
        ],
        "answer": 0,
        "explanation": "0.1 and 0.2 cannot be represented exactly in binary floating point, resulting in 0.30000000000000004, which is not strictly equal to 0.3."
      },
      {
        "id": "js_4",
        "q": "How does an arrow function handle the 'this' keyword differently from a traditional function?",
        "options": [
          "Arrow functions do not have their own 'this'; they inherit it lexically from the enclosing scope.",
          "Arrow functions always bind 'this' to the global window object.",
          "Arrow functions allow dynamic re-binding of 'this' using .bind().",
          "Arrow functions bind 'this' to undefined in non-strict mode."
        ],
        "answer": 0,
        "explanation": "Arrow functions capture the 'this' value of the enclosing execution context and cannot be rebound using call(), apply(), or bind()."
      },
      {
        "id": "js_5",
        "q": "What is the key difference between Promise.all() and Promise.allSettled()?",
        "options": [
          "Promise.all rejects immediately if any promise rejects, whereas allSettled waits for all promises to resolve or reject.",
          "Promise.all runs sequentially, while allSettled runs in parallel.",
          "Promise.allSettled throws an error if all promises resolve.",
          "There is no difference in modern ES2022+."
        ],
        "answer": 0,
        "explanation": "Promise.all short-circuits on the first rejection. Promise.allSettled waits for all promises to complete and returns an array of objects describing each outcome."
      },
      {
        "id": "js_6",
        "q": "What is the Temporal Dead Zone (TDZ) in JavaScript?",
        "options": [
          "The period between entering scope and variable declaration where accessing let/const throws a ReferenceError.",
          "The time between setTimeout call and execution.",
          "The time taken for garbage collection in the V8 heap.",
          "The delay before Web Workers postMessage returns."
        ],
        "answer": 0,
        "explanation": "Variables declared with 'let' and 'const' are hoisted, but uninitialized until evaluation reaches the declaration line. Accessing them before that causes a ReferenceError."
      },
      {
        "id": "js_7",
        "q": "What is the built-in modern browser JavaScript method to deeply clone complex objects without JSON serialization quirks?",
        "options": [
          "structuredClone(obj)",
          "Object.assign({}, obj)",
          "obj.deepClone()",
          "Reflect.clone(obj)"
        ],
        "answer": 0,
        "explanation": "structuredClone() is the standard algorithm that handles cyclical references, Dates, RegExps, Maps, Sets, and binary TypedArrays safely."
      },
      {
        "id": "js_8",
        "q": "What is the result of typeof NaN in JavaScript?",
        "options": [
          "'number'",
          "'nan'",
          "'undefined'",
          "'object'"
        ],
        "answer": 0,
        "explanation": "According to IEEE 754 and JavaScript specs, NaN represents 'Not a Number', but its primitive data type is still numeric, returning 'number'."
      },
      {
        "id": "js_9",
        "q": "What is the difference between Object.freeze() and Object.seal() in JavaScript?",
        "options": [
          "Object.freeze() prevents adding, deleting, AND modifying properties; Object.seal() prevents adding/deleting but allows modifying existing writable properties.",
          "Object.seal() prevents modification of properties while freeze allows modifying existing ones.",
          "Object.freeze() works deeply on nested objects, while seal() is shallow.",
          "They are identical alias methods in ES6."
        ],
        "answer": 0,
        "explanation": "Object.freeze makes an object completely immutable (configurable: false, writable: false). Object.seal prevents adding/removing properties (configurable: false), but existing writable properties can still be modified."
      },
      {
        "id": "js_10",
        "q": "In LeetCode 'Merge Intervals', what is the initial optimal step to merge overlapping intervals in O(n log n)?",
        "options": [
          "Sort intervals by their start times.",
          "Insert intervals into a max-heap sorted by end time.",
          "Compare all pairs with two nested loops (O(n^2)).",
          "Use a hash table indexed by interval length."
        ],
        "answer": 0,
        "explanation": "Sorting intervals by their starting boundary ensures that all potentially overlapping intervals are adjacent, enabling a single linear pass merge in O(n log n)."
      },
      {
        "id": "js_11",
        "q": "What does the following JavaScript code output regarding variable shadowing and TDZ?",
        "code": "let x = 10;\nfunction test() {\n    console.log(x);\n    let x = 20;\n}\ntest();",
        "options": [
          "ReferenceError: Cannot access 'x' before initialization",
          "10",
          "undefined",
          "20"
        ],
        "answer": 0,
        "explanation": "The inner 'let x' shadows the outer 'x' throughout the entire function scope, but accessing it before its declaration triggers the Temporal Dead Zone (ReferenceError)."
      },
      {
        "id": "js_12",
        "q": "What is the time complexity of Array.prototype.sort() in V8 (Chrome / Node.js)?",
        "options": [
          "O(n log n) using TimSort",
          "O(n^2) using QuickSort",
          "O(n) using Radix Sort",
          "O(log n) using Binary Search"
        ],
        "answer": 0,
        "explanation": "Modern V8 uses TimSort (a hybrid stable sorting algorithm derived from merge sort and insertion sort), providing guaranteed O(n log n) worst-case time complexity."
      }
    ]
  },
  "prog_java": {
    "title": "Java & JVM Core",
    "icon": "☕",
    "questions": [
      {
        "id": "java_1",
        "q": "In Java, what is the consequence of overriding the .equals() method without also overriding .hashCode()?",
        "options": [
          "Objects equal according to equals() will have different hash codes, breaking HashMap and HashSet lookups.",
          "The code will fail to compile with a syntax error.",
          "The garbage collector will instantly deallocate the object.",
          "equals() will automatically fall back to reference identity comparison."
        ],
        "answer": 0,
        "explanation": "The Java contract requires that if a.equals(b) is true, then a.hashCode() must equal b.hashCode(). Breaking this causes HashMaps to store equal keys in different buckets."
      },
      {
        "id": "java_2",
        "q": "What does the following Integer comparison evaluate to in standard Java?",
        "code": "Integer a = 127;\nInteger b = 127;\nInteger c = 128;\nInteger d = 128;\nSystem.out.println((a == b) + \" \" + (c == d));",
        "options": [
          "true false",
          "true true",
          "false false",
          "false true"
        ],
        "answer": 0,
        "explanation": "The JVM caches Integer objects in the range -128 to 127. Values within this range share the same object reference (a == b is true), whereas 128 creates distinct objects (c == d is false)."
      },
      {
        "id": "java_3",
        "q": "In Java 8+, what data structure does a HashMap bucket transform into when it exceeds 8 elements (TREEIFY_THRESHOLD)?",
        "options": [
          "Red-Black Tree (TreeMap / TreeNode)",
          "Doubly Linked List",
          "B-Tree",
          "SkipList"
        ],
        "answer": 0,
        "explanation": "To prevent hash collision DoS attacks and maintain O(log n) worst-case lookup rather than O(n), Java 8 transforms linked lists into Red-Black trees once bucket size exceeds 8."
      },
      {
        "id": "java_4",
        "q": "What is the primary guarantee provided by the 'volatile' keyword on a variable in Java?",
        "options": [
          "Changes made by one thread are immediately visible to all other threads, preventing CPU cache reordering.",
          "It prevents the variable from being reassigned (immutability).",
          "It acquires an intrinsic monitor lock on the object.",
          "It persists the variable value to local disk storage."
        ],
        "answer": 0,
        "explanation": "'volatile' ensures happens-before memory visibility by preventing CPU instruction reordering and flushing reads/writes directly to main memory rather than thread CPU caches."
      },
      {
        "id": "java_5",
        "q": "Where in JVM memory are Java object instances physically allocated?",
        "options": [
          "Heap Memory",
          "Stack Memory",
          "Method Area (Metaspace)",
          "JVM PC Register"
        ],
        "answer": 0,
        "explanation": "All object instances in Java reside on the Heap, while local primitive variables and method call frames are stored on the Stack."
      },
      {
        "id": "java_6",
        "q": "What is the difference between String, StringBuilder, and StringBuffer in Java?",
        "options": [
          "String is immutable; StringBuilder is mutable and not thread-safe; StringBuffer is mutable and thread-safe (synchronized).",
          "StringBuilder is immutable; String and StringBuffer are mutable.",
          "StringBuffer is faster than StringBuilder in single-threaded operations.",
          "They are completely identical in memory allocation."
        ],
        "answer": 0,
        "explanation": "String cannot be modified after creation. StringBuilder offers fast mutable string manipulation without sync overhead. StringBuffer synchronizes methods for thread safety."
      },
      {
        "id": "java_7",
        "q": "In Java, what is the key difference between HashMap and ConcurrentHashMap?",
        "options": [
          "ConcurrentHashMap is thread-safe using bucket/segment-level locking without synchronizing the whole map, while HashMap is not thread-safe.",
          "HashMap is thread-safe while ConcurrentHashMap is designed for single-threaded batch performance.",
          "ConcurrentHashMap allows null keys, while HashMap throws NullPointerException.",
          "HashMap stores data off-heap, while ConcurrentHashMap stores data on the JVM heap."
        ],
        "answer": 0,
        "explanation": "ConcurrentHashMap achieves thread-safety without locking the entire table (using CAS and synchronized on individual bin nodes), whereas HashMap is non-synchronized and causes race conditions."
      },
      {
        "id": "java_8",
        "q": "What is the output of the following Java string comparison?",
        "code": "String s1 = \"grind\";\nString s2 = new String(\"grind\");\nSystem.out.println((s1 == s2) + \" \" + (s1.equals(s2)));",
        "options": [
          "false true",
          "true true",
          "false false",
          "true false"
        ],
        "answer": 0,
        "explanation": "s1 is stored in the String Constant Pool while s2 is allocated as a new object on the heap. '==' compares references (false), while '.equals()' compares character contents (true)."
      },
      {
        "id": "java_9",
        "q": "In Java Generics, what does '? extends T' (covariance) signify according to PECS principle?",
        "options": [
          "Producer Extends: the collection can be read from (produces T), but you cannot add elements to it (except null).",
          "Consumer Extends: you can write elements to the collection, but cannot read from it.",
          "It forces the type to be a subclass of T and enables mutating any item at runtime.",
          "It disables compiler type erasure for performance."
        ],
        "answer": 0,
        "explanation": "PECS stands for 'Producer Extends, Consumer Super'. If you need to read elements from a generic collection, use '? extends T' (it produces instances of T)."
      },
      {
        "id": "java_10",
        "q": "How does the Java Garbage Collector handle objects in the G1 (Garbage-First) collector?",
        "options": [
          "It partitions the heap into equal-sized virtual regions and prioritizes collecting regions with the most garbage first.",
          "It pauses the entire application continuously using Stop-The-World on the single contiguous young gen.",
          "It only frees memory when OutOfMemoryError is thrown.",
          "It deletes objects deterministically the moment they go out of scope like C++ RAII."
        ],
        "answer": 0,
        "explanation": "G1 divides the heap into multiple equal-sized regions (Eden, Survivor, Old) and tracks the amount of live data in each region to collect garbage-heavy regions first."
      },
      {
        "id": "java_11",
        "q": "In LeetCode 'Course Schedule' (detecting cycles in directed graph), which algorithm is standard in Java?",
        "options": [
          "Topological Sort using Kahn's Algorithm (BFS with In-degree) or DFS with 3-color cycle detection.",
          "Dijkstra's Shortest Path Algorithm.",
          "Kruskal's Minimum Spanning Tree Algorithm.",
          "Binary Search on course IDs."
        ],
        "answer": 0,
        "explanation": "Course Schedule models prerequisites as a directed graph. A cycle means prerequisites cannot be completed. Kahn's BFS (in-degree array) or DFS with visited states detects cycles in O(V + E)."
      },
      {
        "id": "java_12",
        "q": "What happens when you invoke thread.start() vs thread.run() in Java?",
        "options": [
          "start() creates a new native OS thread and invokes run() on it; calling run() directly executes on the caller's current thread.",
          "run() spawns a daemon thread; start() spawns a user thread.",
          "start() is deprecated in Java 21; only run() is valid.",
          "Both spawn asynchronous native worker threads identically."
        ],
        "answer": 0,
        "explanation": "thread.start() performs JVM native state initialization and allocates an OS thread. Calling run() directly is just a standard synchronous method call on the calling thread."
      }
    ]
  },
  "prog_c": {
    "title": "C Language & Systems",
    "icon": "⚙️",
    "questions": [
      {
        "id": "c_1",
        "q": "If 'int *ptr = 1000;' on a system where sizeof(int) is 4 bytes, what is the value of ptr + 2?",
        "options": [
          "1008",
          "1002",
          "1004",
          "1016"
        ],
        "answer": 0,
        "explanation": "Pointer arithmetic increments by the number of elements multiplied by sizeof(type): 1000 + (2 * 4) = 1008."
      },
      {
        "id": "c_2",
        "q": "What is the crucial difference between malloc() and calloc() in the C standard library?",
        "options": [
          "calloc() initializes allocated memory to zero; malloc() leaves memory uninitialized (garbage values).",
          "malloc() allocates on the stack; calloc() allocates on the heap.",
          "calloc() cannot allocate arrays of structs.",
          "malloc() automatically frees memory when out of scope."
        ],
        "answer": 0,
        "explanation": "calloc(n, size) allocates contiguous memory and clears every byte to 0, whereas malloc(size) allocates raw uninitialized heap memory."
      },
      {
        "id": "c_3",
        "q": "What is a 'dangling pointer' in C?",
        "options": [
          "A pointer pointing to a memory location that has already been deallocated (freed).",
          "A pointer that has never been initialized.",
          "A pointer with value NULL.",
          "A pointer pointing to another pointer."
        ],
        "answer": 0,
        "explanation": "A dangling pointer arises when memory is freed via free(ptr), but the pointer variable continues pointing to that invalid memory address."
      },
      {
        "id": "c_4",
        "q": "Why do C compilers add structure padding (alignment bytes) inside structs?",
        "options": [
          "To align data fields to CPU word boundaries for faster hardware memory bus access.",
          "To prevent stack overflow attacks.",
          "To make all structs exactly 64 bytes.",
          "To encrypt struct fields in memory."
        ],
        "answer": 0,
        "explanation": "CPUs read memory in chunks of 4 or 8 bytes. Accessing misaligned data requires multiple memory bus cycles. Padding ensures optimal single-cycle reads."
      },
      {
        "id": "c_5",
        "q": "What does the following bitwise XOR swap trick accomplish?",
        "code": "a ^= b;\nb ^= a;\na ^= b;",
        "options": [
          "Swaps values of a and b without needing a temporary variable.",
          "Sets both a and b to 0.",
          "Calculates the bitwise sum of a and b.",
          "Inverts all bits of variable a."
        ],
        "answer": 0,
        "explanation": "Because x ^ x = 0 and x ^ 0 = x, three sequential XOR operations swap the contents of registers a and b without extra memory."
      },
      {
        "id": "c_6",
        "q": "What is the behavior of calling free() on a pointer and subsequently dereferencing it in C?",
        "code": "int *p = (int *)malloc(sizeof(int));\n*p = 42;\nfree(p);\nprintf(\"%d\\n\", *p);",
        "options": [
          "Undefined Behavior (Dangling Pointer / Use-After-Free).",
          "Guaranteed segmentation fault on all operating systems.",
          "Always prints 0 because memory is cleared.",
          "Always prints 42 without issue."
        ],
        "answer": 0,
        "explanation": "Dereferencing freed memory is classic Undefined Behavior (UB). The memory page may still be accessible or reallocated to another process component."
      },
      {
        "id": "c_7",
        "q": "What is the difference between 'char str[] = \"hello\";' and 'char *str = \"hello\";' in C?",
        "options": [
          "'char str[]' creates a modifiable array on the stack; 'char *str' points to read-only string literal memory.",
          "'char *str' is modifiable while 'char str[]' is read-only.",
          "Both allocate heap memory via invisible malloc calls.",
          "They have identical memory layouts and write capabilities."
        ],
        "answer": 0,
        "explanation": "Array declaration copies the string characters into local stack memory (which can be edited), while pointer declaration points directly to the read-only text/data segment (modifying it causes a segmentation fault)."
      },
      {
        "id": "c_8",
        "q": "In C, what does the 'volatile' keyword signify to the compiler optimizer?",
        "options": [
          "Tells the compiler that the variable's value may change unexpectedly (e.g., hardware register or interrupt) and prevents caching it in a CPU register.",
          "Guarantees that access to the variable is atomic and thread-safe.",
          "Allocates the variable in CPU L1 cache memory for highest speed.",
          "Prevents the variable from ever being modified by any function."
        ],
        "answer": 0,
        "explanation": "The volatile qualifier warns the optimizer that the variable can be altered by external factors (hardware, ISR), forcing every read and write to access RAM directly."
      },
      {
        "id": "c_9",
        "q": "What is the output of sizeof on an array parameter passed to a function in C?",
        "code": "void check(int arr[10]) {\n    printf(\"%zu\\n\", sizeof(arr));\n}",
        "options": [
          "Size of a pointer (e.g., 8 bytes on 64-bit architecture), because arrays decay to pointers when passed as parameters.",
          "40 bytes (10 * sizeof(int)).",
          "10 bytes.",
          "Compilation error: cannot take sizeof parameter."
        ],
        "answer": 0,
        "explanation": "In C, array parameters decay into pointer types in function arguments ('int arr[10]' becomes 'int *arr'). Thus sizeof(arr) yields sizeof(int*)."
      },
      {
        "id": "c_10",
        "q": "What does memory alignment and structure padding achieve in C?",
        "options": [
          "Allows CPU hardware to read multi-byte data types efficiently in single bus memory cycles.",
          "Compresses the total RAM footprint of structs to minimum bytes.",
          "Encrypts struct fields to prevent memory dumping.",
          "Ensures structs can be serialized to JSON automatically."
        ],
        "answer": 0,
        "explanation": "Processors access memory faster when 4-byte or 8-byte values align to memory addresses divisible by 4 or 8. The compiler inserts padding bytes between struct members to satisfy alignment rules."
      },
      {
        "id": "c_11",
        "q": "In LeetCode 'Reverse Linked List', what is the iterative pointer manipulation technique in C?",
        "code": "struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head, *next = NULL;\n    while (curr) {\n        next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}",
        "options": [
          "O(n) time and O(1) space by tracking prev, curr, and next pointers in a single pass.",
          "O(n^2) time by repeatedly swapping values.",
          "O(n) auxiliary space using recursive function stack frames.",
          "O(log n) time using binary split reversal."
        ],
        "answer": 0,
        "explanation": "The classic 3-pointer iterative reversal reverses next pointers one node at a time in O(n) linear time with O(1) constant space."
      },
      {
        "id": "c_12",
        "q": "What is the role of the 'static' keyword when declared on a global function or variable in C?",
        "options": [
          "Restricts the linkage and visibility of the symbol to the current translation unit (.c file).",
          "Forces the variable to be allocated in thread-local storage.",
          "Makes the function inline for compiler loop unrolling.",
          "Makes the variable immutable like const."
        ],
        "answer": 0,
        "explanation": "Static at file scope grants internal linkage, meaning the identifier cannot be accessed or resolved by the linker from other translation units."
      }
    ]
  },
  "prog_cpp": {
    "title": "C++ & Modern STL",
    "icon": "🚀",
    "questions": [
      {
        "id": "cpp_1",
        "q": "What is the core principle of RAII (Resource Acquisition Is Initialization) in C++?",
        "options": [
          "Holding a resource is tied to object lifetime; resource is acquired in constructor and released in destructor.",
          "All variables must be initialized to 0 on declaration.",
          "Resources can only be allocated through dynamic raw pointers.",
          "Every class must implement an explicit clone method."
        ],
        "answer": 0,
        "explanation": "RAII guarantees resource management (memory, file handles, mutex locks) by binding cleanup to stack-unwinding destructors, preventing leaks even on exceptions."
      },
      {
        "id": "cpp_2",
        "q": "Why must a base class have a 'virtual' destructor if derived objects are deleted through base pointers?",
        "options": [
          "To ensure the derived class destructor is invoked, preventing resource leaks and undefined behavior.",
          "To enable multiple inheritance.",
          "To speed up compiler inline optimizations.",
          "To prevent derived classes from having private fields."
        ],
        "answer": 0,
        "explanation": "Without a virtual destructor, 'delete basePtr' will only call the base destructor, leaking any resources allocated by the derived class."
      },
      {
        "id": "cpp_3",
        "q": "What is the difference between std::vector::push_back and std::vector::emplace_back?",
        "options": [
          "emplace_back constructs the element in-place inside the container, avoiding extra copy/move operations.",
          "push_back is faster because it uses move semantics exclusively.",
          "emplace_back only works with primitive types.",
          "There is no difference in C++11 and above."
        ],
        "answer": 0,
        "explanation": "emplace_back forwards its arguments directly to the element constructor in the vector's storage, eliminating temporary object creation."
      },
      {
        "id": "cpp_4",
        "q": "What is the ownership model of std::unique_ptr in Modern C++?",
        "options": [
          "Exclusive ownership: cannot be copied, can only be transferred using std::move.",
          "Shared ownership with reference counting.",
          "Garbage collected by the runtime.",
          "Weak reference that automatically expires."
        ],
        "answer": 0,
        "explanation": "std::unique_ptr enforces sole ownership of a resource. Its copy constructor is deleted, so ownership transfer requires explicit move semantics."
      },
      {
        "id": "cpp_5",
        "q": "What is the time complexity of lookup in std::map versus std::unordered_map?",
        "options": [
          "std::map is O(log n) (Red-Black tree); std::unordered_map is O(1) average (Hash table).",
          "std::map is O(1); std::unordered_map is O(log n).",
          "Both are O(n) worst case only.",
          "Both are O(log n) in all cases."
        ],
        "answer": 0,
        "explanation": "std::map maintains elements in sorted order using a self-balancing binary search tree (O(log n)), while std::unordered_map uses hash buckets for O(1) average access."
      },
      {
        "id": "cpp_6",
        "q": "What is the key principle behind RAII (Resource Acquisition Is Initialization) in modern C++?",
        "options": [
          "Binding the lifecycle of resources (heap memory, sockets, locks) to the lifetime of stack objects via constructors and destructors.",
          "Initialising all variables to zero upon application boot.",
          "Using garbage collection threads to sweep dead pointers.",
          "Compiling templates at initialization time instead of runtime."
        ],
        "answer": 0,
        "explanation": "RAII guarantees that resources are acquired in constructors and deterministically released in destructors when objects leave scope, even when exceptions are thrown."
      },
      {
        "id": "cpp_7",
        "q": "What is the difference between std::unique_ptr and std::shared_ptr in modern C++?",
        "options": [
          "std::unique_ptr enforces exclusive single ownership with zero overhead; std::shared_ptr uses reference counting for shared ownership.",
          "std::unique_ptr can be copied anywhere; std::shared_ptr cannot be copied.",
          "std::shared_ptr is only for primitive types; std::unique_ptr is for custom classes.",
          "std::unique_ptr has higher memory overhead due to atomic control blocks."
        ],
        "answer": 0,
        "explanation": "std::unique_ptr cannot be copied (move-only) and has zero runtime overhead over a raw pointer. std::shared_ptr maintains a thread-safe reference count in an allocated control block."
      },
      {
        "id": "cpp_8",
        "q": "What does std::move actually do in C++11 and later?",
        "code": "std::string a = \"Grind\";\nstd::string b = std::move(a);",
        "options": [
          "It performs an unconditional static_cast to an rvalue reference (T&&), enabling move constructors without copying bytes.",
          "It actively copies memory from address a to address b and frees address a.",
          "It creates an asynchronous thread to move data in the background.",
          "It sets variable a to null immediately at compile time."
        ],
        "answer": 0,
        "explanation": "std::move does not move anything by itself; it merely casts an lvalue to an rvalue reference (static_cast<T&&>), signaling to constructors/operators that the resource may be stolen."
      },
      {
        "id": "cpp_9",
        "q": "What is the average time complexity of insertion, deletion, and lookup in std::unordered_map vs std::map in C++?",
        "options": [
          "std::unordered_map is O(1) average (hash table); std::map is O(log n) (Red-Black self-balancing BST).",
          "std::unordered_map is O(log n); std::map is O(1).",
          "Both are strictly O(1) in all circumstances.",
          "Both are O(n) linear search collections."
        ],
        "answer": 0,
        "explanation": "std::unordered_map is backed by hash buckets giving O(1) average lookup, whereas std::map is a Red-Black tree maintaining sorted keys with O(log n) guaranteed operations."
      },
      {
        "id": "cpp_10",
        "q": "In LeetCode 'Trapping Rain Water', what is the two-pointer technique in C++ that achieves O(n) time and O(1) space?",
        "options": [
          "Maintain left and right pointers with leftMax and rightMax, filling water based on min(leftMax, rightMax) from the shorter side.",
          "Calculate the area between every pair of bars with nested loops in O(n^2).",
          "Sort the height array and calculate water levels with binary search.",
          "Allocate an n x n 2D grid and count empty cells."
        ],
        "answer": 0,
        "explanation": "Because trapped water is constrained by the minimum of boundary heights, moving the pointer on the lower boundary inward while updating maximums computes trapped water in O(n) time and O(1) space."
      },
      {
        "id": "cpp_11",
        "q": "Why should base class destructors be marked virtual in C++ polymorphic hierarchies?",
        "code": "class Base { public: virtual ~Base() {} };\nclass Derived : public Base { int* data; };",
        "options": [
          "To ensure the derived class destructor is invoked when deleting a derived object through a base class pointer, preventing resource leaks.",
          "To force child classes to implement pure virtual methods.",
          "To allow derived classes to be instantiated without new.",
          "To speed up compiler vtable resolution."
        ],
        "answer": 0,
        "explanation": "If a base destructor is not virtual, deleting a Derived instance via a Base* leads to undefined behavior where only Base's destructor executes, leaking Derived resources."
      },
      {
        "id": "cpp_12",
        "q": "What is the difference between constexpr and const in C++?",
        "options": [
          "constexpr variables and functions must be capable of evaluation at compile-time; const only specifies immutability at runtime.",
          "const is evaluated at compile-time; constexpr is evaluated only at runtime.",
          "constexpr is only allowed for integer types.",
          "They are identical keywords introduced for backwards compatibility."
        ],
        "answer": 0,
        "explanation": "const promises that a variable will not be modified after initialization, while constexpr strictly requires computation during compilation whenever arguments are compile-time constants."
      }
    ]
  },
  "prog_rust": {
    "title": "Rust Systems & Memory",
    "icon": "🦀",
    "questions": [
      {
        "id": "rust_1",
        "q": "What is the fundamental rule of Rust references and borrowing?",
        "options": [
          "You may have any number of immutable references (&T), OR exactly one mutable reference (&mut T), but not both simultaneously.",
          "You can have unlimited mutable references if running in release mode.",
          "Mutable references can outlive the owner.",
          "References are automatically freed by reference counting."
        ],
        "answer": 0,
        "explanation": "Rust's aliasing XOR mutability rule ensures data race freedom at compile time: either shared read-only access or single exclusive write access."
      },
      {
        "id": "rust_2",
        "q": "What happens when you assign a non-Copy type like String to another variable in Rust?",
        "code": "let s1 = String::from(\"grind\");\nlet s2 = s1;\nprintln!(\"{}\", s1);",
        "options": [
          "Compile error: borrow of moved value 's1'.",
          "Prints 'grind' because it deep-clones automatically.",
          "s1 and s2 both point to the same memory and double-free on exit.",
          "Prints empty string."
        ],
        "answer": 0,
        "explanation": "In Rust, assignment transfers ownership ('moves'). After 'let s2 = s1;', s1 is invalidated, and attempting to read it causes a compile-time error."
      },
      {
        "id": "rust_3",
        "q": "What does the '?' operator do in Rust when applied to a Result<T, E>?",
        "options": [
          "Unwraps Ok(T) on success, or returns early with Err(E) from the current function.",
          "Throws a panic if the result is an error.",
          "Retries the function up to 3 times.",
          "Converts the Result into an Option."
        ],
        "answer": 0,
        "explanation": "The '?' operator is concise error propagation: if Ok(val), it unpacks val; if Err(e), it returns Err(From::from(e)) from the enclosing function."
      },
      {
        "id": "rust_4",
        "q": "What is the difference between Rc<T> and Arc<T> in Rust?",
        "options": [
          "Arc<T> uses atomic operations and is thread-safe (Send/Sync); Rc<T> is non-atomic and single-threaded only.",
          "Rc<T> is thread-safe; Arc<T> is single-threaded.",
          "Rc<T> allocates on the stack; Arc<T> allocates on the heap.",
          "They are completely interchangeable aliases."
        ],
        "answer": 0,
        "explanation": "Arc stands for Atomically Reference Counted. Its counter uses CPU atomic primitives, allowing safe sharing across threads with slight overhead compared to Rc."
      },
      {
        "id": "rust_5",
        "q": "What is the key principle of the Borrow Checker in Rust regarding references?",
        "options": [
          "You can have any number of immutable references (&T) OR exactly one mutable reference (&mut T) at any given time, but not both.",
          "You can have unlimited mutable references as long as they are on separate threads.",
          "Mutable references can coexist with immutable references if unsafe block is not used.",
          "Borrowing is checked at runtime with an internal reference counter."
        ],
        "answer": 0,
        "explanation": "Rust's borrow checker eliminates data races and iterator invalidation at compile time by strictly enforcing the aliasing XOR mutability rule."
      },
      {
        "id": "rust_6",
        "q": "What does the 'unwrap()' method do on an Option<T> or Result<T, E> in Rust?",
        "options": [
          "Returns the inner value if Some/Ok, or causes the thread to panic! if None/Err.",
          "Returns null safely if None without terminating.",
          "Automatically retries the operation up to 3 times.",
          "Converts an Err into an empty string."
        ],
        "answer": 0,
        "explanation": "unwrap() extracts the contained value, but panics and crashes the current thread if the variant is None or Err."
      },
      {
        "id": "rust_7",
        "q": "What is the difference between String and &str in Rust?",
        "options": [
          "String is an owned, heap-allocated, growable UTF-8 buffer; &str is an immutable borrowed string slice pointing to existing bytes.",
          "&str is allocated on heap; String is stored in CPU registers.",
          "String is UTF-16 while &str is ASCII.",
          "They are identical types with different syntax sugar."
        ],
        "answer": 0,
        "explanation": "String owns its buffer on the heap (with pointer, capacity, and length). &str is a fat pointer (pointer and length) referencing a sequence of UTF-8 bytes elsewhere."
      },
      {
        "id": "rust_8",
        "q": "What is the role of the 'Drop' trait in Rust?",
        "options": [
          "It defines custom cleanup code that runs deterministically when a value goes out of scope (similar to C++ destructors).",
          "It flags memory to be collected by the background garbage collector.",
          "It drops packets in network sockets when congested.",
          "It forces an object to remain in memory permanently."
        ],
        "answer": 0,
        "explanation": "The Drop trait specifies destructor logic via 'drop(&mut self)', ensuring deterministic resource deallocation when an owner leaves scope."
      },
      {
        "id": "rust_9",
        "q": "What does the '?' operator do when used on a Result in Rust?",
        "code": "let file = File::open(\"data.txt\")?;",
        "options": [
          "Unwraps Ok(val), or early-returns Err(from(err)) from the enclosing function.",
          "Checks whether the file is null and prompts the user.",
          "Swallows the error silently and returns a default value.",
          "Spawns an async task to handle the error."
        ],
        "answer": 0,
        "explanation": "The '?' operator simplifies error propagation: if Ok, it yields the inner value; if Err, it performs From::from conversion and returns early from the current function."
      },
      {
        "id": "rust_10",
        "q": "In Rust, what does 'Arc<Mutex<T>>' enable across multiple threads?",
        "options": [
          "Atomic Reference Counting (Arc) for shared multi-thread ownership combined with Mutex for mutually exclusive thread-safe mutation.",
          "Asynchronous non-blocking file streaming without locks.",
          "Lock-free single-threaded pointer aliasing.",
          "Compiling code directly into GPU shaders."
        ],
        "answer": 0,
        "explanation": "Arc<T> allows multiple threads to safely share ownership of memory, and Mutex<T> ensures only one thread can borrow the inner data mutably at a time."
      },
      {
        "id": "rust_11",
        "q": "In LeetCode 'LRU Cache' implemented in Rust, which standard data structures or patterns are typically used?",
        "options": [
          "A HashMap mapping keys to pointers in a doubly-linked list, or std::collections with RefCell/unsafe.",
          "A simple Vec with linear scan search.",
          "A single BTreeMap sorted by key value.",
          "A recursive binary tree without hash mapping."
        ],
        "answer": 0,
        "explanation": "LRU Cache requires O(1) get and put. A doubly linked list provides O(1) node removal and insertion at head, while a HashMap enables O(1) key lookups."
      },
      {
        "id": "rust_12",
        "q": "What does the 'Send' and 'Sync' auto traits denote in Rust's concurrency model?",
        "options": [
          "Send indicates ownership can be transferred across thread boundaries; Sync indicates it is safe to share references between multiple threads (&T is Send).",
          "Send is for TCP packets; Sync is for database transactions.",
          "Send requires Mutex; Sync requires Channels.",
          "They disable compiler data race checks."
        ],
        "answer": 0,
        "explanation": "Send means an object can be moved to another thread. Sync means &T can be accessed concurrently by multiple threads without data races."
      }
    ]
  },
  "prog_kotlin": {
    "title": "Kotlin & Coroutines",
    "icon": "🎯",
    "questions": [
      {
        "id": "kt_1",
        "q": "How does Kotlin eliminate NullPointerExceptions at compile time?",
        "options": [
          "By distinguishing nullable types (String?) from non-nullable types (String) in its type system.",
          "By converting all null values into empty strings automatically.",
          "By wrapping all code in hidden try-catch blocks.",
          "By disallowing null values anywhere in the language."
        ],
        "answer": 0,
        "explanation": "Kotlin's type system makes types non-nullable by default. You must explicitly append '?' to allow nulls, forcing safe calls (?.) or elvis operators (?:)."
      },
      {
        "id": "kt_2",
        "q": "What does the 'suspend' keyword signify on a Kotlin function?",
        "options": [
          "The function can pause execution without blocking the underlying thread, and resume later.",
          "The function runs on a separate OS background daemon thread.",
          "The function cannot return any value (Unit only).",
          "The function terminates the calling process."
        ],
        "answer": 0,
        "explanation": "Suspend functions are the foundation of Kotlin Coroutines. They can yield control at suspension points without tying up the calling thread."
      },
      {
        "id": "kt_3",
        "q": "What methods are automatically synthesized for a Kotlin 'data class'?",
        "options": [
          "equals(), hashCode(), toString(), copy(), and componentN() destructuring functions.",
          "Only getters and setters.",
          "Only JSON serialization methods.",
          "Thread synchronization locks."
        ],
        "answer": 0,
        "explanation": "The compiler automatically derives structural equals/hashCode, a human-readable toString, copy() for immutable transformations, and component functions for destructuring."
      },
      {
        "id": "kt_4",
        "q": "What is Kotlin's Null Safety system and what does '?.' (safe call) and '?:' (elvis operator) do?",
        "options": [
          "Safe call '?.' executes only if the reference is non-null; Elvis '?:' provides a default fallback value if null.",
          "Safe call throws NullPointerException; Elvis catches the exception.",
          "They are bitwise shift operators.",
          "They convert objects to JSON strings."
        ],
        "answer": 0,
        "explanation": "Kotlin types distinguish nullable (T?) and non-nullable (T) at compile-time. 'a?.b' returns null if 'a' is null, and 'a ?: fallback' provides a fallback when 'a' is null."
      },
      {
        "id": "kt_5",
        "q": "What makes Kotlin Coroutines lightweight compared to traditional Java threads?",
        "options": [
          "Coroutines are cooperatively suspended without blocking underlying OS threads, allowing tens of thousands to run on a small thread pool.",
          "Coroutines run on the GPU instead of the CPU.",
          "Coroutines bypass JVM bytecode and compile to raw machine code.",
          "Coroutines disable garbage collection during execution."
        ],
        "answer": 0,
        "explanation": "Coroutines represent suspendable computations. Instead of blocking an OS thread (which takes ~1MB stack memory), coroutine suspension saves state into a lightweight heap object."
      },
      {
        "id": "kt_6",
        "q": "What does the 'data class' keyword automatically generate in Kotlin?",
        "code": "data class User(val id: Int, val name: String)",
        "options": [
          "equals(), hashCode(), toString(), copy(), and componentN() destructuring functions based on primary constructor properties.",
          "Database SQL schema migrations.",
          "REST API endpoints and serialization controllers.",
          "A singleton instance with private constructor."
        ],
        "answer": 0,
        "explanation": "Kotlin data classes automatically derive boilerplate methods: equals(), hashCode(), toString(), copy(), and positional componentN() functions for destructuring."
      },
      {
        "id": "kt_7",
        "q": "What is the difference between 'val' and 'var' in Kotlin?",
        "options": [
          "'val' declares a read-only variable (immutable reference assigned once); 'var' declares a mutable variable.",
          "'val' is static; 'var' is an instance variable.",
          "'var' is thread-safe; 'val' is not thread-safe.",
          "They are aliases with identical behavior."
        ],
        "answer": 0,
        "explanation": "'val' corresponds to Java's 'final' variable (cannot be reassigned after initialization), whereas 'var' can be reassigned freely."
      },
      {
        "id": "kt_8",
        "q": "How does Kotlin's 'extension function' feature work under the hood in JVM bytecode?",
        "code": "fun String.isGrind(): Boolean = this.contains(\"grind\")",
        "options": [
          "It compiles to a static method where the receiver object is passed as the first parameter.",
          "It modifies the Java String bytecode dynamically at runtime using classloader agents.",
          "It creates a subclass of the target class via reflection.",
          "It replaces the standard Java Virtual Machine with a Kotlin runtime."
        ],
        "answer": 0,
        "explanation": "Extension functions are resolved statically: 'fun String.isGrind()' compiles to 'public static final boolean isGrind(String $this)'."
      },
      {
        "id": "kt_9",
        "q": "What is the difference between 'launch' and 'async' coroutine builders in Kotlin?",
        "options": [
          "'launch' returns a Job (fire-and-forget without a result); 'async' returns a Deferred<T> which yields a result via .await().",
          "'launch' is synchronous; 'async' is asynchronous.",
          "'async' blocks the main UI thread; 'launch' does not.",
          "'launch' is only for Android; 'async' is for backend."
        ],
        "answer": 0,
        "explanation": "launch launches a coroutine without blocking or expecting a result (returns Job). async returns a Deferred<T> (a light promise) where calling .await() retrieves the computed value."
      },
      {
        "id": "kt_10",
        "q": "In LeetCode 'Top K Frequent Elements' in Kotlin, what is an idiomatic and optimal approach?",
        "options": [
          "Count frequencies using groupingBy { it }.eachCount(), then use a Min-Heap (PriorityQueue) of size K in O(n log k) time.",
          "Sort the entire array K times using bubble sort in O(k * n^2).",
          "Convert elements to strings and sort alphabetically.",
          "Run an exhaustive brute force search over all subsets."
        ],
        "answer": 0,
        "explanation": "groupingBy { it }.eachCount() builds the frequency map in O(n). Inserting into a min-heap bounded at capacity k extracts the top k elements in O(n log k)."
      },
      {
        "id": "kt_11",
        "q": "What is a 'sealed class' in Kotlin and how does it enhance 'when' expressions?",
        "options": [
          "It represents restricted class hierarchies where all direct subclasses are known at compile-time, allowing exhaustive 'when' statements without an 'else' branch.",
          "It encrypts class bytecode to prevent reverse engineering.",
          "It prevents inheritance completely like final classes in Java.",
          "It restricts class instantiation to a single thread."
        ],
        "answer": 0,
        "explanation": "Sealed classes restrict subclassing to the same package/module. Because the compiler knows all possible subclasses, 'when' expressions can be proven exhaustive without requiring a fallback 'else'."
      },
      {
        "id": "kt_12",
        "q": "What does the 'inline' keyword with 'reified' type parameters allow in Kotlin?",
        "code": "inline fun <reified T> printType() { println(T::class.java) }",
        "options": [
          "It preserves the generic type parameter T at runtime by inlining the function body at call sites, bypassing JVM type erasure.",
          "It forces the method to run in CPU hardware cache.",
          "It creates an interface proxy dynamically.",
          "It compiles the generic type into an Object array."
        ],
        "answer": 0,
        "explanation": "Normally JVM type erasure removes generic parameters at runtime. By inlining the function bytecode, reified parameters substitute the actual class token directly at call sites."
      }
    ]
  },
  "prog_react": {
    "title": "React & Modern Hooks",
    "icon": "⚛️",
    "questions": [
      {
        "id": "react_1",
        "q": "Why must dependencies be accurately listed in the useEffect dependency array in React?",
        "options": [
          "To prevent stale closures and ensure the effect re-runs when referenced state/props change.",
          "To compile JSX into plain HTML strings.",
          "To prevent other components from unmounting.",
          "To trigger garbage collection on old DOM nodes."
        ],
        "answer": 0,
        "explanation": "Omitting dependencies causes the effect closure to capture outdated state or props from prior renders, leading to subtle out-of-sync bugs."
      },
      {
        "id": "react_2",
        "q": "What is the primary difference between useMemo and useCallback?",
        "options": [
          "useMemo memoizes the computed value of a function; useCallback memoizes the function reference itself.",
          "useCallback memoizes computed values; useMemo memoizes DOM nodes.",
          "useMemo is asynchronous, while useCallback is synchronous.",
          "There is no difference; they are exact aliases."
        ],
        "answer": 0,
        "explanation": "useMemo(() => compute(), [deps]) caches the calculation result. useCallback(fn, [deps]) caches the function instance itself to prevent child re-renders."
      },
      {
        "id": "react_3",
        "q": "Why is using array index as the 'key' prop discouraged for dynamic lists in React?",
        "options": [
          "It can cause incorrect component state and visual bugs when items are reordered, inserted, or deleted.",
          "It throws a fatal compile-time syntax error.",
          "It increases memory usage by 10x.",
          "It converts keys to string symbols."
        ],
        "answer": 0,
        "explanation": "React uses keys to identify which items have changed, moved, or been removed. When indexes shift, React mismatches component instances and state."
      },
      {
        "id": "react_4",
        "q": "How does the useRef hook differ from useState in React?",
        "options": [
          "Updating a ref's .current value does NOT trigger a component re-render, whereas setState schedules a re-render.",
          "useRef can only store HTML DOM elements.",
          "useState does not preserve state across renders.",
          "useRef is deprecated in React 18+."
        ],
        "answer": 0,
        "explanation": "useRef provides a persistent mutable container across renders without causing the component function to re-execute on mutation."
      },
      {
        "id": "react_5",
        "q": "What is the purpose of the 'useEffect' cleanup function in React?",
        "code": "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);",
        "options": [
          "To clean up side effects (e.g., unsubscribing listeners, clearing timers) before component unmount or before re-running the effect.",
          "To clear browser memory cache and cookies.",
          "To reset the component's state variables back to initial values.",
          "To force the browser to reload the page."
        ],
        "answer": 0,
        "explanation": "Returning a function from useEffect schedules cleanup. React calls this cleanup function when the component unmounts or before re-executing the effect when dependencies change."
      },
      {
        "id": "react_6",
        "q": "What is the difference between 'useMemo' and 'useCallback' in React?",
        "options": [
          "'useMemo' memoizes the computed result value of a function; 'useCallback' memoizes the function definition itself between renders.",
          "'useCallback' runs asynchronously on web workers; 'useMemo' runs synchronously.",
          "'useMemo' is for DOM elements; 'useCallback' is for state variables.",
          "They are identical aliases in React 18."
        ],
        "answer": 0,
        "explanation": "useMemo(() => computeValue(a, b), [a, b]) caches the returned value, while useCallback(fn, deps) caches the function reference to prevent unnecessary child re-renders."
      },
      {
        "id": "react_7",
        "q": "Why should you never mutate state directly in React (e.g., 'state.count = 5')?",
        "options": [
          "React uses shallow reference equality (Object.is) to detect state changes; direct mutation doesn't change object reference and won't trigger re-renders.",
          "Direct mutation throws an immediate JavaScript SyntaxError.",
          "Direct mutation corrupts the HTML5 canvas renderer.",
          "Direct mutation disables all CSS transitions on the page."
        ],
        "answer": 0,
        "explanation": "React relies on immutable state updates. If you mutate state directly, the object reference remains the same, so React's reconciliation algorithm skips re-rendering."
      },
      {
        "id": "react_8",
        "q": "What problem does the 'React.memo' Higher-Order Component solve?",
        "options": [
          "It skips re-rendering a component if its props have not changed (shallow prop comparison).",
          "It caches database queries on the client side.",
          "It converts functional components into class components.",
          "It automatically adds error boundaries to all children."
        ],
        "answer": 0,
        "explanation": "React.memo is a performance optimization that wraps a component to memoize its rendered output, skipping re-renders when incoming props are shallowly identical."
      },
      {
        "id": "react_9",
        "q": "What is the Virtual DOM in React and why does React use Reconciliation?",
        "options": [
          "An in-memory lightweight representation of the real DOM used to compute minimum necessary DOM changes via a diffing algorithm.",
          "A 3D WebGL canvas that mimics the browser window.",
          "A shadow copy of the backend database in LocalStorage.",
          "A browser extension that speeds up network requests."
        ],
        "answer": 0,
        "explanation": "Direct DOM operations are slow. React keeps a Virtual DOM tree, computes diffs when state changes, and batches minimal updates to the real browser DOM via its Fiber reconciler."
      },
      {
        "id": "react_10",
        "q": "What are the rules of Hooks in React?",
        "options": [
          "Only call hooks at the top level of React functions (not inside loops, conditions, or nested functions), and only from React components or custom hooks.",
          "Hooks must always return a Promise and be prefixed with 'async'.",
          "Hooks must only be used in class components with constructor binding.",
          "Hooks cannot accept parameters."
        ],
        "answer": 0,
        "explanation": "React relies on the call order of hooks across renders to preserve state. Calling hooks conditionally or inside loops disrupts this fixed order and corrupts state mapping."
      },
      {
        "id": "react_11",
        "q": "In LeetCode / React system design, how do you handle Debouncing for a search input?",
        "options": [
          "Use a timer inside useEffect or custom hook to delay API calls until the user stops typing for a designated delay window (e.g., 300ms).",
          "Make an API request on every single keystroke synchronously.",
          "Store each character in localStorage before sending requests.",
          "Block the user keyboard input until the previous API response returns."
        ],
        "answer": 0,
        "explanation": "Debouncing postpones function execution until after a specified interval has elapsed since the last event, preventing overwhelming API servers with every single keypress."
      },
      {
        "id": "react_12",
        "q": "What does 'useRef' provide beyond holding references to DOM elements?",
        "options": [
          "It provides a persistent mutable container whose '.current' property survives re-renders without triggering a re-render when mutated.",
          "It triggers an immediate synchronous re-render when its value changes.",
          "It synchronizes state across multiple browser tabs automatically.",
          "It encrypts sensitive form passwords."
        ],
        "answer": 0,
        "explanation": "useRef returns a plain JavaScript object with a .current property that persists across the full lifecycle of the component. Changing .current does not cause a re-render."
      }
    ]
  },
  "math_calculus": {
    "title": "Calculus & Analysis",
    "icon": "∫",
    "questions": [
      {
        "id": "calc_1",
        "q": "What is the fundamental limit: lim (x -> 0) [sin(x) / x]?",
        "options": [
          "1",
          "0",
          "Infinity",
          "Undefined"
        ],
        "answer": 0,
        "explanation": "Using the geometric squeeze theorem or L'Hôpital's Rule (cos(0)/1), the limit of sin(x)/x as x approaches 0 equals 1."
      },
      {
        "id": "calc_2",
        "q": "What is the derivative of f(x) = e^(x^2) with respect to x?",
        "options": [
          "2x * e^(x^2)",
          "e^(x^2)",
          "x^2 * e^(x^2 - 1)",
          "2 * e^(x^2)"
        ],
        "answer": 0,
        "explanation": "By the Chain Rule: d/dx[e^u] = e^u * du/dx. Here u = x^2, du/dx = 2x, giving 2x * e^(x^2)."
      },
      {
        "id": "calc_3",
        "q": "What is the definite integral: ∫ [1 / (1 + x^2)] dx?",
        "options": [
          "arctan(x) + C",
          "ln(1 + x^2) + C",
          "arcsin(x) + C",
          "1 / (2x) + C"
        ],
        "answer": 0,
        "explanation": "The standard antiderivative of 1/(1+x^2) is the inverse tangent function, arctan(x) + C."
      },
      {
        "id": "calc_4",
        "q": "Under what conditions can L'Hôpital's Rule be applied to evaluate a limit?",
        "options": [
          "When direct substitution yields an indeterminate form like 0/0 or ±∞/±∞.",
          "Whenever the numerator is a polynomial.",
          "Only when evaluating limits as x approaches infinity.",
          "Whenever the derivative of the denominator is constant."
        ],
        "answer": 0,
        "explanation": "L'Hôpital's Rule requires the limit to produce the indeterminate form 0/0 or ±∞/±∞ and that the derivatives are continuous and exist near the point."
      },
      {
        "id": "calc_5",
        "q": "What is the derivative of f(x) = ln(x) with respect to x?",
        "options": [
          "1 / x",
          "1 / (x^2)",
          "e^x",
          "x * ln(x)"
        ],
        "answer": 0,
        "explanation": "The derivative of the natural logarithm ln(x) is 1/x for all x > 0."
      },
      {
        "id": "calc_6",
        "q": "What is the value of: lim (x -> ∞) [ (1 + 1/x)^x ]?",
        "options": [
          "e (Euler's number ≈ 2.718)",
          "1",
          "Infinity",
          "0"
        ],
        "answer": 0,
        "explanation": "This is the classic compound-interest definition of Euler's constant e."
      },
      {
        "id": "calc_7",
        "q": "What is the condition for a function f(x) to have an inflection point at x = c?",
        "options": [
          "f''(c) = 0 or is undefined, and f''(x) changes sign across c.",
          "f'(c) = 0 only.",
          "f(c) = 0 only.",
          "f'(x) is strictly negative."
        ],
        "answer": 0,
        "explanation": "An inflection point occurs where concavity changes, meaning the second derivative f''(x) switches sign (positive to negative or vice versa)."
      },
      {
        "id": "calc_8",
        "q": "What is the integral ∫ ln(x) dx evaluated using integration by parts?",
        "options": [
          "x * ln(x) - x + C",
          "1/x + C",
          "x^2 / 2 * ln(x) + C",
          "(ln(x))^2 / 2 + C"
        ],
        "answer": 0,
        "explanation": "Using ∫ u dv = uv - ∫ v du with u = ln(x), dv = dx: uv = x*ln(x), ∫ v du = ∫ x*(1/x) dx = x, giving x*ln(x) - x + C."
      },
      {
        "id": "calc_9",
        "q": "What is the derivative of f(x) = ln(x^2 + 1)?",
        "options": [
          "2x / (x^2 + 1)",
          "1 / (x^2 + 1)",
          "2 / (x^2 + 1)",
          "2x * ln(x^2 + 1)"
        ],
        "answer": 0,
        "explanation": "By the Chain Rule: d/dx[ln(u)] = (1/u) * u'. Here u = x^2 + 1 and u' = 2x, so the derivative is 2x / (x^2 + 1)."
      },
      {
        "id": "calc_10",
        "q": "What does the Mean Value Theorem (MVT) state for a continuous function on [a, b] differentiable on (a, b)?",
        "options": [
          "There exists at least one c in (a, b) such that f'(c) = [f(b) - f(a)] / (b - a).",
          "f'(x) must be zero everywhere in the interval.",
          "f(a) must equal f(b) for all functions.",
          "The integral of f(x) over [a, b] must equal zero."
        ],
        "answer": 0,
        "explanation": "The Mean Value Theorem guarantees that there is at least one point c where the instantaneous rate of change (derivative) equals the average rate of change over the interval."
      },
      {
        "id": "calc_11",
        "q": "What is the integral of e^(2x) with respect to x?",
        "options": [
          "(1/2) e^(2x) + C",
          "2 e^(2x) + C",
          "e^(2x) + C",
          "(1/4) e^(2x) + C"
        ],
        "answer": 0,
        "explanation": "Using substitution u = 2x, du = 2 dx -> dx = du/2. Thus ∫ e^(2x) dx = (1/2) e^(2x) + C."
      },
      {
        "id": "calc_12",
        "q": "In optimization problems, if f''(c) > 0 at a critical point where f'(c) = 0, what does the Second Derivative Test indicate?",
        "options": [
          "f(x) has a local minimum at x = c.",
          "f(x) has a local maximum at x = c.",
          "The test is inconclusive.",
          "x = c is a point of inflection."
        ],
        "answer": 0,
        "explanation": "When f'(c) = 0 and f''(c) > 0, the curve is concave upward (∪), which guarantees a local minimum at x = c."
      }
    ]
  },
  "math_linear_algebra": {
    "title": "Linear Algebra & Vectors",
    "icon": "🔢",
    "questions": [
      {
        "id": "la_1",
        "q": "What is the determinant of the 2x2 matrix [[a, b], [c, d]]?",
        "options": [
          "ad - bc",
          "ab - cd",
          "ac - bd",
          "ad + bc"
        ],
        "answer": 0,
        "explanation": "The determinant of a 2x2 matrix is computed by multiplying the main diagonal elements and subtracting the product of the off-diagonal elements: ad - bc."
      },
      {
        "id": "la_2",
        "q": "What is the necessary and sufficient condition for a square matrix A to be invertible?",
        "options": [
          "det(A) ≠ 0 (determinant is non-zero).",
          "All entries of A must be positive.",
          "A must be a diagonal matrix.",
          "The trace of A must equal 0."
        ],
        "answer": 0,
        "explanation": "A square matrix is invertible (non-singular) if and only if its determinant is non-zero, meaning its columns are linearly independent and full rank."
      },
      {
        "id": "la_3",
        "q": "If λ is an eigenvalue of matrix A with corresponding eigenvector v, which equation holds?",
        "options": [
          "A * v = λ * v",
          "A * v = v / λ",
          "A + v = λ",
          "det(A) = λ * v"
        ],
        "answer": 0,
        "explanation": "By definition, an eigenvector v under linear transformation A is only scaled by scalar factor λ: Av = λv."
      },
      {
        "id": "la_4",
        "q": "What does the Rank-Nullity Theorem state for an m x n matrix A?",
        "options": [
          "Rank(A) + Nullity(A) = n (number of columns).",
          "Rank(A) * Nullity(A) = m.",
          "Rank(A) - Nullity(A) = 0.",
          "Rank(A) + Nullity(A) = m + n."
        ],
        "answer": 0,
        "explanation": "The Rank-Nullity Theorem states that the dimension of the column space (Rank) plus the dimension of the null space (Nullity) equals the total dimension of the domain (n)."
      },
      {
        "id": "la_5",
        "q": "What is the dot product of two non-zero perpendicular (orthogonal) vectors in R^n?",
        "options": [
          "0",
          "1",
          "-1",
          "Equal to the product of their lengths."
        ],
        "answer": 0,
        "explanation": "The dot product u · v = ||u|| ||v|| cos(θ). When vectors are perpendicular, θ = 90° and cos(90°) = 0, so the dot product is 0."
      },
      {
        "id": "la_6",
        "q": "For any two invertible matrices A and B, what is the inverse of their product (AB)^(-1)?",
        "options": [
          "B^(-1) * A^(-1)",
          "A^(-1) * B^(-1)",
          "(BA)^(-1)",
          "A^(-1) + B^(-1)"
        ],
        "answer": 0,
        "explanation": "The order of multiplication reverses when taking the inverse of a product: (AB)^(-1) = B^(-1) * A^(-1)."
      },
      {
        "id": "la_7",
        "q": "What is an orthogonal matrix Q defined by?",
        "options": [
          "Q^T * Q = I (its transpose equals its inverse).",
          "Q = -Q^T.",
          "det(Q) = 0.",
          "All elements are equal to 1."
        ],
        "answer": 0,
        "explanation": "An orthogonal matrix has orthonormal columns, meaning Q^T * Q = I, so Q^(-1) = Q^T."
      },
      {
        "id": "la_8",
        "q": "What are the eigenvalues of a diagonal or triangular matrix?",
        "options": [
          "The entries along the main diagonal.",
          "The sum of all entries in each row.",
          "The reciprocal of the determinant.",
          "They are always equal to 1 or 0."
        ],
        "answer": 0,
        "explanation": "For any diagonal or triangular matrix, det(A - λI) is simply the product of (a_ii - λ) across the diagonal, making the diagonal entries precisely the eigenvalues."
      },
      {
        "id": "la_9",
        "q": "What does it mean if the dot product of two non-zero vectors in R^n is zero?",
        "options": [
          "The two vectors are orthogonal (perpendicular) to each other.",
          "The two vectors are linearly dependent and parallel.",
          "One of the vectors must be the zero vector.",
          "Their cross product is also zero."
        ],
        "answer": 0,
        "explanation": "u · v = ||u|| ||v|| cos(θ). If u · v = 0 for non-zero vectors, cos(θ) = 0, which means the angle θ is 90 degrees (orthogonal)."
      },
      {
        "id": "la_10",
        "q": "According to the Rank-Nullity Theorem for an m x n matrix A, what is the relationship between rank and nullity?",
        "options": [
          "rank(A) + nullity(A) = n (number of columns)",
          "rank(A) * nullity(A) = m (number of rows)",
          "rank(A) - nullity(A) = 0",
          "rank(A) + nullity(A) = det(A)"
        ],
        "answer": 0,
        "explanation": "The Rank-Nullity Theorem states that the dimension of the column space (rank) plus the dimension of the null space (nullity) equals the total dimension of the domain (n columns)."
      },
      {
        "id": "la_11",
        "q": "What is an orthogonal matrix Q defined as?",
        "options": [
          "A square invertible matrix whose transpose equals its inverse: Q^T Q = Q Q^T = I.",
          "A matrix where all entries are equal to 0 except one.",
          "A matrix whose determinant is always zero.",
          "A matrix with all positive eigenvalues."
        ],
        "answer": 0,
        "explanation": "An orthogonal matrix has orthonormal columns and rows, satisfying Q^T = Q^(-1), preserving vector lengths and angles under transformation."
      },
      {
        "id": "la_12",
        "q": "In Machine Learning / PCA, what does Singular Value Decomposition (SVD) decompose matrix A into?",
        "options": [
          "A = U Σ V^T, where U and V are orthogonal matrices and Σ contains singular values.",
          "A = L U, lower and upper triangular matrices.",
          "A = Q R, orthogonal matrix Q and upper triangular R.",
          "A = P D P^(-1), where D is a diagonal matrix."
        ],
        "answer": 0,
        "explanation": "SVD decomposes any m x n matrix into A = U Σ V^T, where singular values in Σ represent variance along principal component directions."
      }
    ]
  },
  "math_prob_stats": {
    "title": "Probability & Statistics",
    "icon": "📊",
    "questions": [
      {
        "id": "ps_1",
        "q": "What is Bayes' Theorem for conditional probability P(A | B)?",
        "options": [
          "P(A | B) = [P(B | A) * P(A)] / P(B)",
          "P(A | B) = P(A) * P(B)",
          "P(A | B) = [P(A) + P(B)] / P(A ∩ B)",
          "P(A | B) = P(B | A) / P(A)"
        ],
        "answer": 0,
        "explanation": "Bayes' Theorem updates the prior probability P(A) given evidence B using likelihood P(B|A) normalized by total evidence P(B)."
      },
      {
        "id": "ps_2",
        "q": "What is the expected value (mean) of rolling a fair 6-sided die?",
        "options": [
          "3.5",
          "3.0",
          "4.0",
          "3.6"
        ],
        "answer": 0,
        "explanation": "E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3.5."
      },
      {
        "id": "ps_3",
        "q": "In a standard normal distribution (Gaussian), approximately what percentage of data falls within 1 standard deviation (±1σ) of the mean?",
        "options": [
          "68.2%",
          "95.4%",
          "99.7%",
          "50.0%"
        ],
        "answer": 0,
        "explanation": "According to the empirical rule (68-95-99.7 rule), approximately 68.2% of normal data lies within 1 standard deviation of the mean."
      },
      {
        "id": "ps_4",
        "q": "If two events A and B are mutually exclusive, what is P(A ∩ B)?",
        "options": [
          "0",
          "P(A) * P(B)",
          "1",
          "0.5"
        ],
        "answer": 0,
        "explanation": "Mutually exclusive events cannot happen at the same time, meaning their intersection is the empty set and P(A ∩ B) = 0."
      },
      {
        "id": "ps_5",
        "q": "What is the variance of a constant value c?",
        "options": [
          "0",
          "c",
          "c^2",
          "1"
        ],
        "answer": 0,
        "explanation": "A constant has no dispersion or variability around its mean; hence Var(c) = E[(c - c)^2] = 0."
      },
      {
        "id": "ps_6",
        "q": "What is the probability of getting at least one Head when flipping two fair coins?",
        "options": [
          "3 / 4 (75%)",
          "1 / 2 (50%)",
          "1 / 4 (25%)",
          "2 / 3 (66.7%)"
        ],
        "answer": 0,
        "explanation": "Sample space: {HH, HT, TH, TT}. Outcomes with at least one head are {HH, HT, TH} = 3 out of 4 (75%)."
      },
      {
        "id": "ps_7",
        "q": "What unique property characterizes the Poisson distribution with parameter λ?",
        "options": [
          "Mean equals Variance (Mean = Var = λ).",
          "Mean is always greater than Variance.",
          "Variance is always 0.",
          "It has a bell-shaped continuous density."
        ],
        "answer": 0,
        "explanation": "In a Poisson process, both the expected value E[X] and the variance Var(X) are identically equal to parameter λ."
      },
      {
        "id": "ps_8",
        "q": "What is Bayes' Theorem formula for conditional probability P(A|B)?",
        "options": [
          "P(A|B) = [P(B|A) * P(A)] / P(B)",
          "P(A|B) = P(A) * P(B)",
          "P(A|B) = P(A ∩ B) * P(B)",
          "P(A|B) = [P(A) + P(B)] / P(A ∩ B)"
        ],
        "answer": 0,
        "explanation": "Bayes' Theorem updates the prior probability P(A) given evidence B using likelihood P(B|A) and marginal likelihood P(B): P(A|B) = [P(B|A) P(A)] / P(B)."
      },
      {
        "id": "ps_9",
        "q": "What is the relationship between Variance and Standard Deviation (σ)?",
        "options": [
          "Variance = σ^2 (Standard Deviation squared)",
          "Variance = √σ",
          "Variance = 2 * σ",
          "Variance = 1 / σ"
        ],
        "answer": 0,
        "explanation": "Variance measures average squared deviations from the mean; Standard Deviation is the positive square root of the variance: Var(X) = σ^2."
      },
      {
        "id": "ps_10",
        "q": "In a Normal (Gaussian) distribution, approximately what percentage of data falls within 1 standard deviation of the mean (μ ± 1σ)?",
        "options": [
          "68.2%",
          "95.4%",
          "99.7%",
          "50.0%"
        ],
        "answer": 0,
        "explanation": "By the empirical 68-95-99.7 rule: ~68.2% lies within ±1σ, ~95.4% within ±2σ, and ~99.7% within ±3σ."
      },
      {
        "id": "ps_11",
        "q": "What is the expected value (mean) of a fair 6-sided die roll?",
        "options": [
          "3.5",
          "3.0",
          "4.0",
          "3.66"
        ],
        "answer": 0,
        "explanation": "E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3.5."
      },
      {
        "id": "ps_12",
        "q": "What does the Central Limit Theorem (CLT) state about the distribution of sample means from any population with finite variance?",
        "options": [
          "As the sample size n becomes large (typically n >= 30), the sampling distribution of the sample mean approaches a Normal distribution regardless of the population's shape.",
          "All populations become normally distributed over time.",
          "The variance of the sample increases proportionally to n.",
          "The sample median must always equal the sample mean."
        ],
        "answer": 0,
        "explanation": "The CLT is fundamental to statistics: regardless of the underlying distribution, the normalized sum or mean of a sufficiently large sample converges to a Gaussian distribution."
      }
    ]
  },
  "math_discrete": {
    "title": "Discrete Mathematics",
    "icon": "🧠",
    "questions": [
      {
        "id": "dm_1",
        "q": "According to the Handshaking Lemma, what is the sum of degrees of all vertices in an undirected graph with E edges?",
        "options": [
          "2 * E",
          "E",
          "E^2",
          "E / 2"
        ],
        "answer": 0,
        "explanation": "Every edge connects two vertices and contributes exactly 2 to the sum of degrees, making the total degree sum 2*E."
      },
      {
        "id": "dm_2",
        "q": "What does the Pigeonhole Principle state?",
        "options": [
          "If n items are put into m containers and n > m, at least one container must hold more than one item.",
          "Every graph with n vertices has at least n edges.",
          "A set with n elements has n! subsets.",
          "All planar graphs can be 3-colored."
        ],
        "answer": 0,
        "explanation": "The Pigeonhole Principle states that if more pigeons than pigeonholes are placed, at least one pigeonhole must contain multiple pigeons."
      },
      {
        "id": "dm_3",
        "q": "How many edges are in any connected tree graph with n vertices?",
        "options": [
          "n - 1",
          "n",
          "n + 1",
          "2 * n"
        ],
        "answer": 0,
        "explanation": "A tree is a connected acyclic graph. Any tree with n vertices has exactly n - 1 edges."
      },
      {
        "id": "dm_4",
        "q": "How many subsets (power set size) does a set with n distinct elements contain?",
        "options": [
          "2^n",
          "n^2",
          "n!",
          "2 * n"
        ],
        "answer": 0,
        "explanation": "Each element has 2 choices (either included or excluded in a subset), yielding 2^n total subsets."
      },
      {
        "id": "dm_5",
        "q": "Under what condition does a connected undirected graph possess an Eulerian Circuit?",
        "options": [
          "Every vertex has an even degree.",
          "All vertices have an odd degree.",
          "The graph contains no cycles.",
          "The graph has exactly two vertices with odd degree."
        ],
        "answer": 0,
        "explanation": "Euler proved that a connected graph has a closed Eulerian circuit if and only if every single vertex has an even degree."
      },
      {
        "id": "dm_6",
        "q": "In mathematical logic, if proposition P is False, what is the truth value of the implication: P → Q?",
        "options": [
          "Always True (Vacuous Truth)",
          "Always False",
          "Depends on Q",
          "Undefined"
        ],
        "answer": 0,
        "explanation": "An implication P → Q is False only when P is True and Q is False. When premise P is False, the statement is vacuously True."
      },
      {
        "id": "dm_7",
        "q": "What is Euler's Formula for any connected planar graph with V vertices, E edges, and F faces?",
        "options": [
          "V - E + F = 2",
          "V + E + F = 2",
          "V - E - F = 0",
          "E = 2V + F"
        ],
        "answer": 0,
        "explanation": "Euler's characteristic for planar graphs states: Vertices - Edges + Faces = 2."
      },
      {
        "id": "dm_8",
        "q": "What does the Pigeonhole Principle state?",
        "options": [
          "If n items are placed into m containers where n > m, at least one container must hold more than one item.",
          "Every connected graph has an even number of vertices.",
          "Every set with n elements has 2^n subsets.",
          "Prime numbers cannot be divided into equal groups."
        ],
        "answer": 0,
        "explanation": "If you have more pigeons than holes, at least one hole must contain at least two pigeons. This fundamental counting theorem is widely used in competitive programming proofs."
      },
      {
        "id": "dm_9",
        "q": "How many subsets does a set with n elements have (power set cardinality)?",
        "options": [
          "2^n",
          "n^2",
          "n!",
          "2n"
        ],
        "answer": 0,
        "explanation": "Each element has 2 choices (either included or excluded in a subset), giving 2 * 2 * ... * 2 = 2^n total subsets."
      },
      {
        "id": "dm_10",
        "q": "What is the Handshaking Lemma in Graph Theory?",
        "options": [
          "The sum of degrees of all vertices in a graph equals twice the number of edges: Σ deg(v) = 2|E|.",
          "Every graph contains at least two vertices with degree zero.",
          "A bipartite graph cannot contain cycles of even length.",
          "The number of edges in a tree is equal to the number of vertices."
        ],
        "answer": 0,
        "explanation": "Each edge connects two vertices and contributes 1 to the degree count of both incident vertices, so the total sum of all vertex degrees is exactly 2 * |E|."
      },
      {
        "id": "dm_11",
        "q": "In modular arithmetic, what does Fermat's Little Theorem state for a prime p and integer a not divisible by p?",
        "options": [
          "a^(p - 1) ≡ 1 (mod p)",
          "a^p ≡ 0 (mod p)",
          "a^(p + 1) ≡ 1 (mod p)",
          "a * p ≡ a (mod p)"
        ],
        "answer": 0,
        "explanation": "Fermat's Little Theorem states that if p is prime and gcd(a, p) = 1, then a^(p-1) modulo p is 1. This forms the basis of RSA cryptography and modular inverses."
      },
      {
        "id": "dm_12",
        "q": "What is the number of edges in a tree with n vertices?",
        "options": [
          "n - 1",
          "n",
          "n + 1",
          "n(n - 1) / 2"
        ],
        "answer": 0,
        "explanation": "By definition, a tree is a connected acyclic graph. Any tree with n vertices has exactly n - 1 edges."
      }
    ]
  },
  "english_grammar": {
    "title": "Grammar & Sentence Correction",
    "icon": "📝",
    "questions": [
      {
        "id": "eng_g_1",
        "q": "Choose the grammatically correct sentence regarding subject-verb agreement with correlative conjunctions:",
        "options": [
          "Neither the teacher nor the students were present in the hall.",
          "Neither the teacher nor the students was present in the hall.",
          "Neither the teacher or the students was present in the hall.",
          "Neither the teacher nor the students is present in the hall."
        ],
        "answer": 0,
        "explanation": "With 'neither... nor', the verb agrees with the closer subject. 'Students' is plural, so 'were' is correct."
      },
      {
        "id": "eng_g_2",
        "q": "Which sentence uses the correct conditional subjunctive mood?",
        "options": [
          "If I were you, I would accept the challenge.",
          "If I was you, I would accept the challenge.",
          "If I am you, I will accepted the challenge.",
          "If I be you, I would have accepted the challenge."
        ],
        "answer": 0,
        "explanation": "In hypothetical or contrary-to-fact conditional clauses, the subjunctive mood requires 'were' regardless of whether the subject is singular (I, he, she)."
      },
      {
        "id": "eng_g_3",
        "q": "Identify the correct usage of 'fewer' versus 'less':",
        "options": [
          "There were fewer errors in the code today and less memory consumed.",
          "There were less errors in the code today and fewer memory consumed.",
          "There were fewer error in the code today and fewer memory consumed.",
          "There were less errors in the code today and less memory consumed."
        ],
        "answer": 0,
        "explanation": "'Fewer' is used for countable nouns (errors), while 'less' is used for uncountable or continuous quantities (memory, time, water)."
      },
      {
        "id": "eng_g_4",
        "q": "Complete the sentence with the correct preposition: 'He was congratulated ______ his outstanding milestone.'",
        "options": [
          "on",
          "for",
          "at",
          "about"
        ],
        "answer": 0,
        "explanation": "The standard English idiomatic preposition following 'congratulate' is 'on' ('congratulate someone on something')."
      },
      {
        "id": "eng_g_5",
        "q": "Identify the sentence that correctly avoids a dangling modifier:",
        "options": [
          "Walking into the arena, the player saw the scoreboard illuminate.",
          "Walking into the arena, the scoreboard illuminated.",
          "Having finished the task, the computer was shut down by him.",
          "Barking loudly, the mail carrier was chased by the dog."
        ],
        "answer": 0,
        "explanation": "The participle 'Walking into the arena' must logically modify the subject that follows ('the player'). The scoreboard cannot walk."
      },
      {
        "id": "eng_g_6",
        "q": "Which word correctly completes the sentence: 'The committee has arrived at ______ unanimous decision.'",
        "options": [
          "a",
          "an",
          "the other",
          "no article"
        ],
        "answer": 0,
        "explanation": "'Unanimous' begins with a consonant sound /juː/ (like 'you'), so it takes the indefinite article 'a', not 'an'."
      },
      {
        "id": "eng_7",
        "q": "Identify the grammatically correct sentence regarding subject-verb agreement with compound subjects:",
        "options": [
          "Neither the manager nor the employees were informed about the schedule change.",
          "Neither the manager nor the employees was informed about the schedule change.",
          "Neither the manager or the employees was informed about the schedule change.",
          "Neither the manager nor the employees has been informed about the schedule change."
        ],
        "answer": 0,
        "explanation": "When subjects are connected by 'neither... nor', the verb agrees with the subject closest to it. Here, 'employees' is plural, requiring the plural verb 'were'."
      },
      {
        "id": "eng_8",
        "q": "Which sentence correctly avoids a dangling modifier?",
        "options": [
          "Walking into the library, she was impressed by the towering shelves of antique books.",
          "Walking into the library, the towering shelves of antique books impressed her.",
          "Having finished the code, the laptop was closed.",
          "To succeed in exams, good study habits must be practiced."
        ],
        "answer": 0,
        "explanation": "The introductory participial phrase 'Walking into the library' must logically modify the subject that immediately follows ('she'). In the second option, it erroneously implies the shelves were walking."
      },
      {
        "id": "eng_9",
        "q": "Which sentence uses the correct subjunctive mood for expressing a hypothetical condition contrary to fact?",
        "options": [
          "If I were you, I would accept the software engineering offer immediately.",
          "If I was you, I would accept the software engineering offer immediately.",
          "If I am you, I will accept the software engineering offer immediately.",
          "If I be you, I would accept the software engineering offer immediately."
        ],
        "answer": 0,
        "explanation": "The subjunctive mood for hypothetical, unreal, or contrary-to-fact conditions uses 'were' regardless of the singular subject (e.g., 'If I were', 'If he were')."
      },
      {
        "id": "eng_10",
        "q": "Select the sentence that maintains proper parallel structure:",
        "options": [
          "The engineer loves designing algorithms, writing clean tests, and optimizing database queries.",
          "The engineer loves designing algorithms, to write clean tests, and optimizing database queries.",
          "The engineer loves to design algorithms, writing clean tests, and optimize database queries.",
          "The engineer loves designing algorithms, clean test writing, and to optimize database queries."
        ],
        "answer": 0,
        "explanation": "Parallel structure requires items in a list or comparison to take the same grammatical form. All three items ('designing', 'writing', 'optimizing') are gerund phrases."
      },
      {
        "id": "eng_11",
        "q": "What is the correct pronoun usage in: 'Between you and ____, the project deadline cannot be delayed.'?",
        "options": [
          "me",
          "I",
          "myself",
          "mine"
        ],
        "answer": 0,
        "explanation": "'Between' is a preposition. Prepositions govern objective case pronouns (me, him, her, us, them). Therefore, 'between you and me' is grammatically correct."
      },
      {
        "id": "eng_12",
        "q": "Choose the sentence that correctly distinguishes 'affect' vs 'effect':",
        "options": [
          "The new architectural policy will affect system latency, and the effect will be noticed immediately.",
          "The new architectural policy will effect system latency, and the affect will be noticed immediately.",
          "The new architectural policy will affect system latency, and the affect will be noticed immediately.",
          "The new architectural policy will effect system latency, and the effect will be noticed immediately."
        ],
        "answer": 0,
        "explanation": "'Affect' is typically a verb meaning to influence; 'effect' is typically a noun meaning the result or outcome."
      }
    ]
  },
  "english_verbal": {
    "title": "Vocabulary, Idioms & Verbal Aptitude",
    "icon": "📚",
    "questions": [
      {
        "id": "eng_v_1",
        "q": "What is the closest SYNONYM for the word 'EPHEMERAL'?",
        "options": [
          "Transient (Short-lived)",
          "Permanent",
          "Monumental",
          "Deceitful"
        ],
        "answer": 0,
        "explanation": "'Ephemeral' means lasting for a very short time; its synonym is transient or fleeting."
      },
      {
        "id": "eng_v_2",
        "q": "What is the closest ANTONYM for the word 'PRAGMATIC'?",
        "options": [
          "Idealistic / Impractical",
          "Sensible",
          "Realistic",
          "Diligent"
        ],
        "answer": 0,
        "explanation": "'Pragmatic' means dealing with things sensibly and realistically. The opposite is idealistic or visionary without practical grounding."
      },
      {
        "id": "eng_v_3",
        "q": "What does the common idiom 'Burn the midnight oil' mean?",
        "options": [
          "To work or study late into the night.",
          "To waste resources unnecessarily.",
          "To cause an explosive conflict.",
          "To travel to distant places."
        ],
        "answer": 0,
        "explanation": "'Burning the midnight oil' refers to working or studying late into the night, derived from historic oil lamps."
      },
      {
        "id": "eng_v_4",
        "q": "What is the one-word substitution for: 'A person who hates or distrusts humankind'?",
        "options": [
          "Misanthrope",
          "Philanthropist",
          "Altruist",
          "Polyglot"
        ],
        "answer": 0,
        "explanation": "A 'misanthrope' is a person who dislikes humankind and avoids human society. A 'philanthropist' is the opposite."
      },
      {
        "id": "eng_v_5",
        "q": "Complete the analogy: OARSMAN : REGATTA :: RUNNER : ______",
        "options": [
          "MARATHON",
          "TRACK",
          "STADIUM",
          "BATON"
        ],
        "answer": 0,
        "explanation": "An oarsman participates in a regatta (boat race), just as a runner participates in a marathon (foot race)."
      },
      {
        "id": "eng_v_6",
        "q": "What does the word 'UBIQUITOUS' mean?",
        "options": [
          "Present, appearing, or found everywhere.",
          "Extremely rare and secluded.",
          "Hazardous to health.",
          "Lacking clear shape."
        ],
        "answer": 0,
        "explanation": "'Ubiquitous' means omnipresent or existing everywhere at once (e.g., 'smartphones have become ubiquitous')."
      },
      {
        "id": "verb_7",
        "q": "What is the meaning of the word 'EPHEMERAL'?",
        "options": [
          "Lasting for a very short time; fleeting and transient.",
          "Permanent, eternal, and everlasting.",
          "Extremely heavy and dense.",
          "Deeply mystical and spiritual."
        ],
        "answer": 0,
        "explanation": "'Ephemeral' comes from Greek 'ephemeros' (lasting a day), describing something fleeting or short-lived."
      },
      {
        "id": "verb_8",
        "q": "Complete the analogy: CANDID : DISSEMBLING :: LOQUACIOUS : ____",
        "options": [
          "RETICENT",
          "GARRULOUS",
          "VERBOSE",
          "ELOQUENT"
        ],
        "answer": 0,
        "explanation": "'Candid' (honest/forthright) is the antonym of 'dissembling' (deceiving). Similarly, 'loquacious' (talkative) is the antonym of 'reticent' (reserved/silent)."
      },
      {
        "id": "verb_9",
        "q": "What does the idiom 'to burn the midnight oil' mean?",
        "options": [
          "To work or study late into the night.",
          "To waste valuable resources carelessly.",
          "To cause an irreversible crisis.",
          "To wake up very early before sunrise."
        ],
        "answer": 0,
        "explanation": "The idiom 'burn the midnight oil' historically refers to burning oil lamps to work or study long past midnight."
      },
      {
        "id": "verb_10",
        "q": "Select the word that is nearest in meaning to 'UBIQUITOUS':",
        "options": [
          "Omnipresent (found everywhere)",
          "Rare and scarce",
          "Dangerous and hazardous",
          "Outdated and obsolete"
        ],
        "answer": 0,
        "explanation": "'Ubiquitous' means present, appearing, or found everywhere simultaneously (omnipresent)."
      },
      {
        "id": "verb_11",
        "q": "Choose the antonym for 'ALACRITY':",
        "options": [
          "Reluctance or apathy (sluggishness)",
          "Eagerness and enthusiasm",
          "Swiftness and speed",
          "Sharp mental agility"
        ],
        "answer": 0,
        "explanation": "'Alacrity' means brisk and cheerful readiness. Its antonym is reluctance, apathy, or sluggishness."
      },
      {
        "id": "verb_12",
        "q": "Which word best completes the sentence: 'The CEO gave a ____ explanation that covered all complex points concisely and effectively.'?",
        "options": [
          "cogent",
          "diffuse",
          "tenuous",
          "specious"
        ],
        "answer": 0,
        "explanation": "'Cogent' means clear, logical, and convincing. 'Specious' means superficially plausible but wrong; 'diffuse' means wordy."
      }
    ]
  },
  "reasoning_logical": {
    "title": "Logical Reasoning & Puzzles",
    "icon": "🧩",
    "questions": [
      {
        "id": "rl_1",
        "q": "Blood Relations: Pointing to a photograph, a woman says: 'His mother is the only daughter of my mother.' Who is the person in the photograph to the woman?",
        "options": [
          "Her Son",
          "Her Brother",
          "Her Husband",
          "Her Nephew"
        ],
        "answer": 0,
        "explanation": "The 'only daughter of my mother' is the woman herself. Therefore, 'his mother is myself', meaning the person is her son."
      },
      {
        "id": "rl_2",
        "q": "Direction Sense: Kabir walks 10 meters North, turns right and walks 15 meters, then turns right and walks 10 meters. How far is he from his starting point?",
        "options": [
          "15 meters East",
          "10 meters North",
          "25 meters East",
          "5 meters West"
        ],
        "answer": 0,
        "explanation": "Moving 10m North and then 10m South cancels the vertical displacement, leaving him 15 meters directly East of the starting point."
      },
      {
        "id": "rl_3",
        "q": "Syllogism: Statements:\n1. All roses are flowers.\n2. Some flowers fade quickly.\nWhich conclusion definitely follows?",
        "options": [
          "Neither conclusion definitely follows.",
          "All roses fade quickly.",
          "No roses fade quickly.",
          "Some roses are definitely not flowers."
        ],
        "answer": 0,
        "explanation": "Since only 'some' flowers fade quickly, those flowers might not overlap with roses at all. Thus neither claim follows necessarily."
      },
      {
        "id": "rl_4",
        "q": "Clocks: What is the angle between the hour hand and the minute hand of a clock at 3:30?",
        "options": [
          "75 degrees",
          "90 degrees",
          "60 degrees",
          "85 degrees"
        ],
        "answer": 0,
        "explanation": "Minute hand is at 180° (6). Hour hand at 3:30 is at 3*30° + 30*(0.5°) = 90° + 15° = 105°. Difference: 180° - 105° = 75°."
      },
      {
        "id": "rl_5",
        "q": "Calendar: If January 1st of a non-leap year falls on a Monday, what day of the week does December 31st fall on?",
        "options": [
          "Monday",
          "Tuesday",
          "Sunday",
          "Wednesday"
        ],
        "answer": 0,
        "explanation": "A standard year has 365 days = 52 weeks + 1 day. The first day and the last day of a non-leap year are always identical (Monday)."
      },
      {
        "id": "rl_6",
        "q": "Seating Puzzle: Five friends A, B, C, D, E sit in a row facing North. C sits in the middle. A sits at the extreme left. B is immediately to the right of C. Who is between A and C?",
        "options": [
          "D or E",
          "B",
          "A",
          "Nobody"
        ],
        "answer": 0,
        "explanation": "Positions 1 to 5: Pos 1 = A, Pos 3 = C, Pos 4 = B. Position 2 (between A and C) must be occupied by either D or E."
      },
      {
        "id": "logic_7",
        "q": "In a family, A is the brother of B. B is the daughter of C. D is the father of A. How is C related to D?",
        "options": [
          "C is the wife of D (mother of A and B).",
          "C is the sister of D.",
          "C is the daughter of D.",
          "Cannot be determined without additional info."
        ],
        "answer": 0,
        "explanation": "A and B are siblings (A is son, B is daughter). D is the father of A, which means D is also father of B. Since B is the daughter of C and D, C is the mother and therefore the wife of D."
      },
      {
        "id": "logic_8",
        "q": "Five friends (P, Q, R, S, T) are sitting in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the exact middle?",
        "options": [
          "S",
          "T",
          "Q",
          "R"
        ],
        "answer": 0,
        "explanation": "Ordering from left to right: P is left of T -> P, T. S is between T and Q -> P, T, S, Q. Q is immediate left of R -> P, T, S, Q, R. The exact middle person is S."
      },
      {
        "id": "logic_9",
        "q": "Statements: All cats are animals. All animals are mammals. Conclusion I: All cats are mammals. Conclusion II: Some mammals are cats.",
        "options": [
          "Both Conclusion I and II follow.",
          "Only Conclusion I follows.",
          "Only Conclusion II follows.",
          "Neither conclusion follows."
        ],
        "answer": 0,
        "explanation": "If Cats ⊆ Animals and Animals ⊆ Mammals, then Cats ⊆ Mammals (Conclusion I holds). Since the set of cats is non-empty within mammals, Some mammals are cats (Conclusion II holds)."
      },
      {
        "id": "logic_10",
        "q": "A man walks 5 km South, turns left and walks 3 km, turns left again and walks 5 km. In which direction and distance is he from his starting point?",
        "options": [
          "3 km East",
          "3 km West",
          "5 km North",
          "8 km South"
        ],
        "answer": 0,
        "explanation": "Starting at (0,0): South 5 km -> (0, -5). Left turn (facing South, left is East) 3 km -> (3, -5). Left turn (facing East, left is North) 5 km -> (3, 0). He is exactly 3 km East of the origin."
      },
      {
        "id": "logic_11",
        "q": "Pointing to a photograph, a woman says: 'He is the only son of my grandfather's only son.' How is the man in the photograph related to the woman?",
        "options": [
          "Brother",
          "Father",
          "Cousin",
          "Uncle"
        ],
        "answer": 0,
        "explanation": "'My grandfather's only son' is the woman's father. 'The only son of my father' is her brother."
      },
      {
        "id": "logic_12",
        "q": "If South-East becomes North, North-East becomes West, and so on, what will West become?",
        "options": [
          "South-East",
          "South-West",
          "North-East",
          "North-West"
        ],
        "answer": 0,
        "explanation": "South-East (135° clockwise from North) becomes North (0°), which is a 135° counter-clockwise rotation. Applying a 135° counter-clockwise rotation to West (270°) lands at 135°, which is South-East."
      }
    ]
  },
  "reasoning_analytical": {
    "title": "Analytical Aptitude & Sequences",
    "icon": "🔍",
    "questions": [
      {
        "id": "ra_1",
        "q": "Find the next number in the quadratic sequence: 2, 6, 12, 20, 30, ?",
        "options": [
          "42",
          "40",
          "36",
          "48"
        ],
        "answer": 0,
        "explanation": "Pattern is n * (n + 1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30. The next term is 6 * 7 = 42."
      },
      {
        "id": "ra_2",
        "q": "Coding-Decoding: If 'APPLE' is coded as 'BQQMF' (+1 shift), how is 'GRIND' coded in that same language?",
        "options": [
          "HSJOE",
          "HRJND",
          "FSIMC",
          "GSJOE"
        ],
        "answer": 0,
        "explanation": "Each letter shifts forward by +1: G->H, R->S, I->J, N->O, D->E. Result: HSJOE."
      },
      {
        "id": "ra_3",
        "q": "Find the missing term in the geometric series: 3, 9, 27, 81, ?",
        "options": [
          "243",
          "162",
          "324",
          "729"
        ],
        "answer": 0,
        "explanation": "Every term is multiplied by 3 (powers of 3): 3^1=3, 3^2=9, 3^3=27, 3^4=81, 3^5 = 243."
      },
      {
        "id": "ra_4",
        "q": "Number Analogy: 11 : 121 :: 13 : ?",
        "options": [
          "169",
          "144",
          "196",
          "182"
        ],
        "answer": 0,
        "explanation": "11^2 = 121, so 13^2 = 169."
      },
      {
        "id": "ra_5",
        "q": "Find the odd one out from the given set of numbers: 27, 64, 125, 144, 216",
        "options": [
          "144",
          "27",
          "64",
          "125"
        ],
        "answer": 0,
        "explanation": "27 (3^3), 64 (4^3), 125 (5^3), and 216 (6^3) are perfect cubes. 144 is 12^2 (a square, not a cube)."
      },
      {
        "id": "ra_6",
        "q": "If in a certain code, '+' means '×', '×' means '÷', and '÷' means '-', what is the value of: 10 + 5 × 2?",
        "options": [
          "25",
          "10",
          "50",
          "20"
        ],
        "answer": 0,
        "explanation": "Replacing operators: 10 × 5 ÷ 2. By BODMAS / order of operations, 10 × 5 = 50, then 50 ÷ 2 = 25."
      },
      {
        "id": "ana_7",
        "q": "Find the next number in the sequence: 2, 6, 12, 20, 30, 42, ?",
        "options": [
          "56",
          "54",
          "52",
          "58"
        ],
        "answer": 0,
        "explanation": "The pattern is n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42, 7*8=56 (or differences are +4, +6, +8, +10, +12, +14 -> 42 + 14 = 56)."
      },
      {
        "id": "ana_8",
        "q": "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that same code?",
        "options": [
          "EOJDJEFM",
          "EOJDEJFM",
          "MFEJDJOE",
          "EOJDJFEM"
        ],
        "answer": 0,
        "explanation": "The first and last letters are swapped: C and R become R and C. The middle letters are each shifted +1 and written in reverse order: O->P, M->N, P->Q, U->V, T->U, E->F. Applying this to MEDICINE (M and E swap to E and M; inner EDICIN reversed and +1 gives OJDJEF) yields EOJDJEFM."
      },
      {
        "id": "ana_9",
        "q": "Find the missing number in the alternating series: 4, 8, 12, 24, 36, 72, ?",
        "options": [
          "108",
          "144",
          "96",
          "84"
        ],
        "answer": 0,
        "explanation": "The pattern alternates multiplying by 2 and multiplying by 1.5: 4 * 2 = 8, 8 * 1.5 = 12, 12 * 2 = 24, 24 * 1.5 = 36, 36 * 2 = 72, 72 * 1.5 = 108."
      },
      {
        "id": "ana_10",
        "q": "If '+' means 'x', '-' means '÷', 'x' means '-', and '÷' means '+', then what is the value of: 16 + 4 - 8 x 5 ÷ 3?",
        "options": [
          "6",
          "8",
          "10",
          "12"
        ],
        "answer": 0,
        "explanation": "Substituting operators: 16 * 4 / 8 - 5 + 3. Following BODMAS: 16 * 4 = 64; 64 / 8 = 8; 8 - 5 + 3 = 3 + 3 = 6."
      },
      {
        "id": "ana_11",
        "q": "Find the odd one out among: 37, 47, 57, 67, 79",
        "options": [
          "57",
          "37",
          "47",
          "67"
        ],
        "answer": 0,
        "explanation": "57 is composite (3 x 19 = 57), whereas 37, 47, 67, and 79 are all prime numbers."
      },
      {
        "id": "ana_12",
        "q": "A clock shows 3:40. What is the angle between the hour hand and the minute hand?",
        "options": [
          "130°",
          "120°",
          "140°",
          "125°"
        ],
        "answer": 0,
        "explanation": "Angle formula: |30H - (11/2)M|. Here H = 3, M = 40. |30(3) - (11/2)(40)| = |90 - 220| = |-130| = 130°."
      }
    ]
  }
};

  let session = {
    topic: null,
    topicTitle: "",
    topicIcon: "",
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    totalDuration: 300, // 5 minutes (300 seconds)
    timeRemaining: 300,
    timerInterval: null,
    completed: false,
    trophiesAwarded: 0,
    startedAt: null
  };

  function calculateQuizTrophies(score) {
    if (score === 10) return 7; // 10/10 -> 7 Trophies
    if (score >= 5) return 3;   // 5/10 to 9/10 -> 3 Trophies
    return 0;                   // < 5 -> 0 Trophies
  }

  const DailyGrindQuiz = {
    getDomains() {
      return DOMAINS;
    },

    getBank() {
      return QUIZ_BANK;
    },

    getSession() {
      return session;
    },

    calculateTrophies: calculateQuizTrophies,

    startSession(topicKey, userEmail = "anonymous", dateKey = "", previouslyAnsweredIds = []) {
      const topicData = QUIZ_BANK[topicKey];
      if (!topicData || !topicData.questions || topicData.questions.length === 0) {
        throw new Error("Invalid topic selected.");
      }

      const cleanEmail = String(userEmail || "anonymous").trim().toLowerCase();
      const cleanDate = String(dateKey || new Date().toISOString().slice(0, 10));

      // Seeded PRNG based on user + date + topic
      const seedString = `${cleanEmail}_${cleanDate}_${topicKey}`;
      const prng = createPrng(seedString);

      // Question filtering: eliminate recently answered questions so they don't repeat daily
      const rawPool = JSON.parse(JSON.stringify(topicData.questions));
      let candidatePool = rawPool.filter(q => !previouslyAnsweredIds.includes(q.id));

      // If exhausted, recycle pool
      if (candidatePool.length < 10) {
        candidatePool = rawPool;
      }

      // Shuffle candidate pool
      const shuffledDeck = seededShuffle(candidatePool, prng);
      const selectedTen = shuffledDeck.slice(0, 10);

      // Dynamically shuffle options so A, B, C, D distribution is fair and unpredictable
      const finalQuestions = selectedTen.map((q, idx) => {
        const optionPrng = createPrng(`${seedString}_q${q.id}_${idx}`);
        return shuffleQuestionOptions(q, optionPrng);
      });

      session = {
        topic: topicKey,
        topicTitle: topicData.title,
        topicIcon: topicData.icon,
        questions: finalQuestions,
        currentIndex: 0,
        userAnswers: new Array(finalQuestions.length).fill(null),
        totalDuration: 300, // 5 minutes overall timer
        timeRemaining: 300,
        timerInterval: null,
        completed: false,
        trophiesAwarded: 0,
        startedAt: Date.now()
      };

      return session;
    },

    stopTimer() {
      if (session.timerInterval) {
        clearInterval(session.timerInterval);
        session.timerInterval = null;
      }
    },

    // 5-Minute overall countdown timer
    startOverallTimer(onTick, onExpire) {
      this.stopTimer();
      session.timerInterval = setInterval(() => {
        session.timeRemaining--;
        if (typeof onTick === "function") {
          onTick(session.timeRemaining);
        }

        if (session.timeRemaining <= 0) {
          this.stopTimer();
          if (typeof onExpire === "function") {
            onExpire();
          }
        }
      }, 1000);
    },

    recordAnswer(questionIndex, selectedOptionIndex) {
      if (questionIndex < 0 || questionIndex >= session.questions.length) return;
      const q = session.questions[questionIndex];
      const isCorrect = selectedOptionIndex !== null && selectedOptionIndex === q.answer;

      session.userAnswers[questionIndex] = {
        questionId: q.id,
        selectedIndex: selectedOptionIndex,
        isCorrect
      };

      return session.userAnswers[questionIndex];
    },

    generateFinalReport() {
      this.stopTimer();
      session.completed = true;

      const total = session.questions.length;
      let correctCount = 0;

      const review = session.questions.map((q, idx) => {
        const userAns = session.userAnswers[idx] || { selectedIndex: null, isCorrect: false };
        const isCorrect = !!userAns.isCorrect;
        if (isCorrect) correctCount++;

        return {
          index: idx + 1,
          id: q.id,
          question: q.q,
          code: q.code || null,
          options: q.options,
          correctAnswerIndex: q.answer,
          userAnswerIndex: userAns.selectedIndex,
          isCorrect,
          explanation: q.explanation
        };
      });

      const percentage = Math.round((correctCount / total) * 100);
      const trophiesEarned = calculateQuizTrophies(correctCount);
      session.trophiesAwarded = trophiesEarned;

      let rankTitle = "Apex Scholar ⚡";
      let rankDesc = "Flawless technical precision. Unbreakable standard.";
      if (correctCount < 5) {
        rankTitle = "Challenger in Training 🌱";
        rankDesc = "Need 5 or more correct to unlock Vault Trophies. Analyze the breakdown and try again!";
      } else if (correctCount < 10) {
        rankTitle = "Disciplined Master ⚔️";
        rankDesc = "Great job! 5+ questions answered correctly. 3 Vault Trophies unlocked!";
      } else {
        rankTitle = "Flawless Conqueror 👑";
        rankDesc = "Perfection! 10 out of 10 answered correctly. Maximum +7 Vault Trophies awarded!";
      }

      const totalTimeSpent = Math.max(0, session.totalDuration - Math.max(0, session.timeRemaining));

      return {
        topic: session.topic,
        topicTitle: session.topicTitle,
        topicIcon: session.topicIcon,
        score: correctCount,
        total,
        percentage,
        trophies: trophiesEarned,
        totalTimeSpent,
        rankTitle,
        rankDesc,
        review
      };
    }
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DailyGrindQuiz = DailyGrindQuiz;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DailyGrindQuiz;
  }
})();
