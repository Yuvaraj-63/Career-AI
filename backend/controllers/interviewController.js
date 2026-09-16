const questionBank = {
  Java: [
    {
      id: "java-001",
      category: "OOP",
      difficulty: "Easy",
      type: "Technical",
      question: "What is OOP and what are the four pillars of OOP?",
      tip: "Explain Encapsulation, Abstraction, Inheritance, and Polymorphism.",
    },
    {
      id: "java-002",
      category: "OOP",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a class and what is an object in Java?",
      tip: "Explain class as a blueprint and object as an instance.",
    },
    {
      id: "java-003",
      category: "OOP",
      difficulty: "Easy",
      type: "Technical",
      question: "What is inheritance in Java?",
      tip: "Explain how a child class can acquire properties and behavior from a parent class.",
    },
    {
      id: "java-004",
      category: "OOP",
      difficulty: "Easy",
      type: "Technical",
      question: "What is encapsulation?",
      tip: "Explain bundling data and methods together and controlling access using access modifiers.",
    },
    {
      id: "java-005",
      category: "OOP",
      difficulty: "Medium",
      type: "Technical",
      question: "What is polymorphism in Java?",
      tip: "Explain compile-time and runtime polymorphism with examples.",
    },
    {
      id: "java-006",
      category: "OOP",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between method overloading and method overriding?",
      tip: "Compare compile-time overloading with runtime overriding.",
    },
    {
      id: "java-007",
      category: "OOP",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between an abstract class and an interface?",
      tip: "Compare inheritance, implementation, methods, variables, and use cases.",
    },
    {
      id: "java-008",
      category: "OOP",
      difficulty: "Hard",
      type: "Technical",
      question: "Explain the SOLID principles with Java examples.",
      tip: "Explain each principle and connect it to maintainable object-oriented design.",
    },

    {
      id: "java-009",
      category: "Collections",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between ArrayList and LinkedList?",
      tip: "Compare random access, insertion, deletion, and memory structure.",
    },
    {
      id: "java-010",
      category: "Collections",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a HashMap in Java?",
      tip: "Explain key-value storage and hashing.",
    },
    {
      id: "java-011",
      category: "Collections",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between List, Set, and Map?",
      tip: "Explain ordering, duplicates, and key-value relationships.",
    },
    {
      id: "java-012",
      category: "Collections",
      difficulty: "Medium",
      type: "Technical",
      question: "How does HashSet work internally?",
      tip: "Explain hashing and how duplicates are prevented.",
    },
    {
      id: "java-013",
      category: "Collections",
      difficulty: "Medium",
      type: "Technical",
      question: "How does HashMap work internally?",
      tip: "Discuss hashing, buckets, collisions, and lookup.",
    },
    {
      id: "java-014",
      category: "Collections",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between HashMap and Hashtable?",
      tip: "Compare synchronization, null support, and modern usage.",
    },
    {
      id: "java-015",
      category: "Collections",
      difficulty: "Hard",
      type: "Technical",
      question: "How does ConcurrentHashMap provide thread-safe access?",
      tip: "Discuss concurrent operations and why it performs better than synchronizing an entire map.",
    },

    {
      id: "java-016",
      category: "Strings",
      difficulty: "Easy",
      type: "Technical",
      question: "Why is String immutable in Java?",
      tip: "Discuss security, caching, thread safety, and String Pool.",
    },
    {
      id: "java-017",
      category: "Strings",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the String Pool?",
      tip: "Explain how Java stores string literals to reduce memory usage.",
    },
    {
      id: "java-018",
      category: "Strings",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between String, StringBuilder, and StringBuffer?",
      tip: "Compare mutability, performance, and thread safety.",
    },
    {
      id: "java-019",
      category: "Strings",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between == and equals() for Strings?",
      tip: "Explain reference comparison versus content comparison.",
    },
    {
      id: "java-020",
      category: "Strings",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you efficiently process a very large amount of text in Java?",
      tip: "Discuss streaming, buffering, memory usage, and appropriate data structures.",
    },

    {
      id: "java-021",
      category: "Exception Handling",
      difficulty: "Easy",
      type: "Technical",
      question: "What is an exception in Java?",
      tip: "Explain abnormal conditions during program execution.",
    },
    {
      id: "java-022",
      category: "Exception Handling",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between checked and unchecked exceptions?",
      tip: "Explain compile-time checking and RuntimeException.",
    },
    {
      id: "java-023",
      category: "Exception Handling",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the purpose of try, catch, and finally?",
      tip: "Explain exception handling and cleanup.",
    },
    {
      id: "java-024",
      category: "Exception Handling",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between throw and throws?",
      tip: "One explicitly throws an exception; the other declares possible exceptions.",
    },
    {
      id: "java-025",
      category: "Exception Handling",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you design custom exception handling in a large application?",
      tip: "Discuss custom exceptions, centralized handling, logging, and meaningful messages.",
    },

    {
      id: "java-026",
      category: "Multithreading",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a thread in Java?",
      tip: "Explain a lightweight unit of execution.",
    },
    {
      id: "java-027",
      category: "Multithreading",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between a process and a thread?",
      tip: "Compare memory, execution, and resource sharing.",
    },
    {
      id: "java-028",
      category: "Multithreading",
      difficulty: "Medium",
      type: "Technical",
      question: "What is synchronization in Java?",
      tip: "Explain controlling concurrent access to shared resources.",
    },
    {
      id: "java-029",
      category: "Multithreading",
      difficulty: "Medium",
      type: "Technical",
      question: "What is a deadlock?",
      tip: "Explain circular waiting between threads.",
    },
    {
      id: "java-030",
      category: "Multithreading",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you diagnose and resolve a deadlock in Java?",
      tip: "Discuss thread dumps, lock analysis, ordering, and avoiding unnecessary locks.",
    },

    {
      id: "java-031",
      category: "Java 8+",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a lambda expression?",
      tip: "Explain concise representation of functional behavior.",
    },
    {
      id: "java-032",
      category: "Java 8+",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a functional interface?",
      tip: "Explain an interface with exactly one abstract method.",
    },
    {
      id: "java-033",
      category: "Java 8+",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the Stream API?",
      tip: "Explain declarative processing of collections.",
    },
    {
      id: "java-034",
      category: "Java 8+",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between map() and filter() in streams?",
      tip: "map transforms elements while filter selects elements.",
    },
    {
      id: "java-035",
      category: "Java 8+",
      difficulty: "Hard",
      type: "Technical",
      question: "What are the advantages and limitations of parallel streams?",
      tip: "Discuss parallel execution, overhead, shared state, and workload suitability.",
    },

    {
      id: "java-036",
      category: "JVM",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the JVM?",
      tip: "Explain the Java Virtual Machine and bytecode execution.",
    },
    {
      id: "java-037",
      category: "JVM",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between JDK, JRE, and JVM?",
      tip: "Explain what each component provides.",
    },
    {
      id: "java-038",
      category: "JVM",
      difficulty: "Medium",
      type: "Technical",
      question: "What is garbage collection?",
      tip: "Explain automatic memory management and unreachable objects.",
    },
    {
      id: "java-039",
      category: "JVM",
      difficulty: "Medium",
      type: "Technical",
      question: "What are heap and stack memory in Java?",
      tip: "Compare object storage and method execution memory.",
    },
    {
      id: "java-040",
      category: "JVM",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you investigate high memory usage in a Java application?",
      tip: "Discuss heap dumps, profiling, garbage collection, and object retention.",
    },

    {
      id: "java-041",
      category: "Generics",
      difficulty: "Easy",
      type: "Technical",
      question: "What are generics in Java?",
      tip: "Explain type safety and reusable classes or methods.",
    },
    {
      id: "java-042",
      category: "Generics",
      difficulty: "Medium",
      type: "Technical",
      question: "Why are generics useful in collections?",
      tip: "Explain compile-time type checking and avoiding unnecessary casts.",
    },
    {
      id: "java-043",
      category: "Generics",
      difficulty: "Hard",
      type: "Technical",
      question: "What is type erasure in Java generics?",
      tip: "Explain how generic type information is handled at runtime.",
    },

    {
      id: "java-044",
      category: "Memory",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between stack and heap memory?",
      tip: "Explain lifetime, allocation, and typical contents.",
    },
    {
      id: "java-045",
      category: "Memory",
      difficulty: "Medium",
      type: "Technical",
      question: "What can cause a memory leak in Java despite garbage collection?",
      tip: "Discuss unintended object references and long-lived collections.",
    },

    {
      id: "java-046",
      category: "Advanced",
      difficulty: "Medium",
      type: "Technical",
      question: "What is JDBC?",
      tip: "Explain how Java applications communicate with relational databases.",
    },
    {
      id: "java-047",
      category: "Advanced",
      difficulty: "Medium",
      type: "Technical",
      question: "What is dependency injection?",
      tip: "Explain providing dependencies from outside rather than constructing them internally.",
    },
    {
      id: "java-048",
      category: "Advanced",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you design a Java REST API for high traffic?",
      tip: "Discuss caching, connection pooling, database optimization, asynchronous processing, and scaling.",
    },

    {
      id: "java-049",
      category: "Behavioral",
      difficulty: "Easy",
      type: "Behavioral",
      question: "Tell me about yourself and your Java experience.",
      tip: "Connect your education, projects, Java skills, and career goals.",
    },
    {
      id: "java-050",
      category: "Behavioral",
      difficulty: "Medium",
      type: "Behavioral",
      question: "Tell me about a difficult Java problem you solved.",
      tip: "Use the STAR method and explain the technical solution clearly.",
    },
  ],

  Python: [
    {
      id: "python-001",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What are the main features of Python?",
      tip: "Discuss readability, dynamic typing, interpreted execution, libraries, and portability.",
    },
    {
      id: "python-002",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between a list and a tuple?",
      tip: "Compare mutability, performance, and use cases.",
    },
    {
      id: "python-003",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a dictionary in Python?",
      tip: "Explain key-value storage and hash-based lookup.",
    },
    {
      id: "python-004",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What is indentation used for in Python?",
      tip: "Explain how indentation defines code blocks.",
    },
    {
      id: "python-005",
      category: "Basics",
      difficulty: "Medium",
      type: "Technical",
      question: "What is dynamic typing in Python?",
      tip: "Explain that variable names are not bound to a fixed type at declaration.",
    },
    {
      id: "python-006",
      category: "Basics",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between mutable and immutable objects?",
      tip: "Use lists and strings as examples.",
    },
    {
      id: "python-007",
      category: "Basics",
      difficulty: "Medium",
      type: "Technical",
      question: "What is duck typing?",
      tip: "Explain behavior-based compatibility rather than explicit type requirements.",
    },
    {
      id: "python-008",
      category: "Basics",
      difficulty: "Hard",
      type: "Technical",
      question: "How does Python manage memory?",
      tip: "Discuss references, garbage collection, and memory management.",
    },

    {
      id: "python-009",
      category: "Functions",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a function in Python?",
      tip: "Explain reusable blocks of code.",
    },
    {
      id: "python-010",
      category: "Functions",
      difficulty: "Easy",
      type: "Technical",
      question: "What are *args and **kwargs?",
      tip: "Explain variable positional and keyword arguments.",
    },
    {
      id: "python-011",
      category: "Functions",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a lambda function?",
      tip: "Explain small anonymous functions.",
    },
    {
      id: "python-012",
      category: "Functions",
      difficulty: "Medium",
      type: "Technical",
      question: "What is a decorator?",
      tip: "Explain functions that modify or extend another function's behavior.",
    },
    {
      id: "python-013",
      category: "Functions",
      difficulty: "Medium",
      type: "Technical",
      question: "What is a generator?",
      tip: "Explain yield and lazy evaluation.",
    },
    {
      id: "python-014",
      category: "Functions",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between return and yield?",
      tip: "Compare normal function return with generator execution.",
    },
    {
      id: "python-015",
      category: "Functions",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you use decorators in a real backend application?",
      tip: "Consider logging, authorization, caching, and timing.",
    },

    {
      id: "python-016",
      category: "OOP",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a class in Python?",
      tip: "Explain a blueprint for creating objects.",
    },
    {
      id: "python-017",
      category: "OOP",
      difficulty: "Easy",
      type: "Technical",
      question: "What is self in Python?",
      tip: "Explain the reference to the current object instance.",
    },
    {
      id: "python-018",
      category: "OOP",
      difficulty: "Medium",
      type: "Technical",
      question: "What is inheritance in Python?",
      tip: "Explain reuse and extension of parent class behavior.",
    },
    {
      id: "python-019",
      category: "OOP",
      difficulty: "Medium",
      type: "Technical",
      question: "What is method overriding?",
      tip: "Explain redefining inherited behavior in a child class.",
    },
    {
      id: "python-020",
      category: "OOP",
      difficulty: "Hard",
      type: "Technical",
      question: "Explain multiple inheritance and method resolution order.",
      tip: "Discuss MRO and Python's C3 linearization.",
    },

    {
      id: "python-021",
      category: "Data Structures",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a set in Python?",
      tip: "Explain unique elements and set operations.",
    },
    {
      id: "python-022",
      category: "Data Structures",
      difficulty: "Easy",
      type: "Technical",
      question: "How do you remove duplicates from a list?",
      tip: "Mention sets and discuss when ordering matters.",
    },
    {
      id: "python-023",
      category: "Data Structures",
      difficulty: "Medium",
      type: "Technical",
      question: "What is a list comprehension?",
      tip: "Explain concise creation of lists.",
    },
    {
      id: "python-024",
      category: "Data Structures",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between shallow copy and deep copy?",
      tip: "Explain nested objects and the copy module.",
    },
    {
      id: "python-025",
      category: "Data Structures",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you optimize processing of a very large Python dataset?",
      tip: "Discuss generators, chunking, vectorization, multiprocessing, and memory usage.",
    },

    {
      id: "python-026",
      category: "Exceptions",
      difficulty: "Easy",
      type: "Technical",
      question: "How does exception handling work in Python?",
      tip: "Explain try, except, else, and finally.",
    },
    {
      id: "python-027",
      category: "Exceptions",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the purpose of finally?",
      tip: "Explain cleanup that should happen regardless of success or failure.",
    },
    {
      id: "python-028",
      category: "Exceptions",
      difficulty: "Medium",
      type: "Technical",
      question: "How do you create a custom exception?",
      tip: "Explain subclassing Exception.",
    },
    {
      id: "python-029",
      category: "Exceptions",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between raise and assert?",
      tip: "Explain explicit exceptions versus debugging/programmer assumptions.",
    },
    {
      id: "python-030",
      category: "Exceptions",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you design error handling for a production Python API?",
      tip: "Discuss validation, exception mapping, logging, and safe client responses.",
    },

    {
      id: "python-031",
      category: "Concurrency",
      difficulty: "Easy",
      type: "Technical",
      question: "What is multithreading in Python?",
      tip: "Explain threads and concurrent execution.",
    },
    {
      id: "python-032",
      category: "Concurrency",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the Global Interpreter Lock?",
      tip: "Explain the CPython GIL and its effect on CPU-bound threads.",
    },
    {
      id: "python-033",
      category: "Concurrency",
      difficulty: "Medium",
      type: "Technical",
      question: "What is multiprocessing?",
      tip: "Explain separate processes and CPU-bound workloads.",
    },
    {
      id: "python-034",
      category: "Concurrency",
      difficulty: "Medium",
      type: "Technical",
      question: "What is async programming in Python?",
      tip: "Discuss async, await, and I/O-bound workloads.",
    },
    {
      id: "python-035",
      category: "Concurrency",
      difficulty: "Hard",
      type: "Technical",
      question: "When would you choose asyncio over multiprocessing?",
      tip: "Compare I/O-bound and CPU-bound workloads.",
    },

    {
      id: "python-036",
      category: "Web",
      difficulty: "Easy",
      type: "Technical",
      question: "What is Flask?",
      tip: "Explain it as a lightweight Python web framework.",
    },
    {
      id: "python-037",
      category: "Web",
      difficulty: "Easy",
      type: "Technical",
      question: "What is FastAPI?",
      tip: "Explain API development, type hints, and asynchronous support.",
    },
    {
      id: "python-038",
      category: "Web",
      difficulty: "Medium",
      type: "Technical",
      question: "How would you create a REST API using Python?",
      tip: "Discuss routes, HTTP methods, validation, and responses.",
    },
    {
      id: "python-039",
      category: "Web",
      difficulty: "Medium",
      type: "Technical",
      question: "How do you connect a Python backend to a database?",
      tip: "Discuss drivers, ORM tools, queries, and connection management.",
    },
    {
      id: "python-040",
      category: "Web",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you scale a Python API?",
      tip: "Discuss workers, caching, database optimization, queues, and horizontal scaling.",
    },

    {
      id: "python-041",
      category: "Testing",
      difficulty: "Easy",
      type: "Technical",
      question: "What is unit testing?",
      tip: "Explain testing individual units of code.",
    },
    {
      id: "python-042",
      category: "Testing",
      difficulty: "Medium",
      type: "Technical",
      question: "What is pytest?",
      tip: "Explain its role in Python testing.",
    },
    {
      id: "python-043",
      category: "Testing",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you test a Python REST API?",
      tip: "Discuss unit tests, integration tests, mocking, and HTTP test clients.",
    },

    {
      id: "python-044",
      category: "Libraries",
      difficulty: "Easy",
      type: "Technical",
      question: "What is pip?",
      tip: "Explain Python package installation and management.",
    },
    {
      id: "python-045",
      category: "Libraries",
      difficulty: "Medium",
      type: "Technical",
      question: "What is a virtual environment?",
      tip: "Explain dependency isolation between projects.",
    },
    {
      id: "python-046",
      category: "Libraries",
      difficulty: "Medium",
      type: "Technical",
      question: "What is NumPy commonly used for?",
      tip: "Discuss numerical computing and arrays.",
    },
    {
      id: "python-047",
      category: "Libraries",
      difficulty: "Medium",
      type: "Technical",
      question: "What is Pandas commonly used for?",
      tip: "Discuss data manipulation and analysis.",
    },

    {
      id: "python-048",
      category: "Behavioral",
      difficulty: "Easy",
      type: "Behavioral",
      question: "Tell me about yourself and your Python experience.",
      tip: "Connect your projects, Python skills, and career goals.",
    },
    {
      id: "python-049",
      category: "Behavioral",
      difficulty: "Medium",
      type: "Behavioral",
      question: "Tell me about a difficult Python problem you solved.",
      tip: "Use the STAR method and explain your technical approach.",
    },
    {
      id: "python-050",
      category: "Behavioral",
      difficulty: "Medium",
      type: "Behavioral",
      question: "Why do you prefer Python for a particular project?",
      tip: "Discuss productivity, ecosystem, readability, and project requirements.",
    },
  ],

  JavaScript: [
    {
      id: "js-001",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What is JavaScript?",
      tip: "Explain its role in web development and its runtime environments.",
    },
    {
      id: "js-002",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between var, let, and const?",
      tip: "Discuss scope, redeclaration, reassignment, and hoisting.",
    },
    {
      id: "js-003",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the difference between == and ===?",
      tip: "Explain loose equality versus strict equality.",
    },
    {
      id: "js-004",
      category: "Basics",
      difficulty: "Easy",
      type: "Technical",
      question: "What are primitive data types in JavaScript?",
      tip: "Mention string, number, bigint, boolean, undefined, symbol, and null.",
    },
    {
      id: "js-005",
      category: "Functions",
      difficulty: "Medium",
      type: "Technical",
      question: "What is a closure?",
      tip: "Explain how a function retains access to its lexical environment.",
    },
    {
      id: "js-006",
      category: "Functions",
      difficulty: "Medium",
      type: "Technical",
      question: "What is a callback function?",
      tip: "Explain passing a function to another function.",
    },
    {
      id: "js-007",
      category: "Functions",
      difficulty: "Medium",
      type: "Technical",
      question: "What is an arrow function?",
      tip: "Discuss concise syntax and lexical this.",
    },
    {
      id: "js-008",
      category: "Functions",
      difficulty: "Hard",
      type: "Technical",
      question: "Explain lexical scope and closures with a practical example.",
      tip: "Connect scope chains with real application behavior.",
    },

    {
      id: "js-009",
      category: "Objects",
      difficulty: "Easy",
      type: "Technical",
      question: "What is an object in JavaScript?",
      tip: "Explain key-value properties and methods.",
    },
    {
      id: "js-010",
      category: "Objects",
      difficulty: "Easy",
      type: "Technical",
      question: "What is destructuring?",
      tip: "Explain extracting values from objects and arrays.",
    },
    {
      id: "js-011",
      category: "Objects",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the spread operator?",
      tip: "Explain copying or expanding iterables and object properties.",
    },
    {
      id: "js-012",
      category: "Objects",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between shallow copy and deep copy?",
      tip: "Discuss nested references.",
    },
    {
      id: "js-013",
      category: "Objects",
      difficulty: "Hard",
      type: "Technical",
      question: "Explain JavaScript prototypes and prototype inheritance.",
      tip: "Discuss the prototype chain and object property lookup.",
    },

    {
      id: "js-014",
      category: "Async",
      difficulty: "Easy",
      type: "Technical",
      question: "What is a Promise?",
      tip: "Explain pending, fulfilled, and rejected states.",
    },
    {
      id: "js-015",
      category: "Async",
      difficulty: "Easy",
      type: "Technical",
      question: "What is async/await?",
      tip: "Explain cleaner syntax for working with Promises.",
    },
    {
      id: "js-016",
      category: "Async",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the event loop?",
      tip: "Explain call stack, queues, and asynchronous callbacks.",
    },
    {
      id: "js-017",
      category: "Async",
      difficulty: "Medium",
      type: "Technical",
      question: "What is the difference between Promise.all and Promise.allSettled?",
      tip: "Compare failure behavior and returned results.",
    },
    {
      id: "js-018",
      category: "Async",
      difficulty: "Hard",
      type: "Technical",
      question: "Explain the JavaScript event loop with microtasks and macrotasks.",
      tip: "Discuss Promise callbacks versus timers.",
    },

    {
      id: "js-019",
      category: "DOM",
      difficulty: "Easy",
      type: "Technical",
      question: "What is the DOM?",
      tip: "Explain the document as a tree of objects.",
    },
    {
      id: "js-020",
      category: "DOM",
      difficulty: "Easy",
      type: "Technical",
      question: "How do you select an element using JavaScript?",
      tip: "Mention querySelector and related methods.",
    },
    {
      id: "js-021",
      category: "DOM",
      difficulty: "Medium",
      type: "Technical",
      question: "What is event bubbling?",
      tip: "Explain event propagation from target toward ancestors.",
    },
    {
      id: "js-022",
      category: "DOM",
      difficulty: "Medium",
      type: "Technical",
      question: "What is event delegation?",
      tip: "Explain handling child events from a common parent.",
    },
    {
      id: "js-023",
      category: "DOM",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you optimize a page with thousands of DOM elements?",
      tip: "Discuss event delegation, virtualization, batching, and minimizing DOM operations.",
    },

    {
      id: "js-024",
      category: "ES6+",
      difficulty: "Easy",
      type: "Technical",
      question: "What are template literals?",
      tip: "Explain backticks and interpolation.",
    },
    {
      id: "js-025",
      category: "ES6+",
      difficulty: "Easy",
      type: "Technical",
      question: "What are default parameters?",
      tip: "Explain default values for function parameters.",
    },
    {
      id: "js-026",
      category: "ES6+",
      difficulty: "Medium",
      type: "Technical",
      question: "What are modules in JavaScript?",
      tip: "Explain import and export.",
    },
    {
      id: "js-027",
      category: "ES6+",
      difficulty: "Medium",
      type: "Technical",
      question: "What are Map and Set?",
      tip: "Explain their differences from ordinary objects and arrays.",
    },
    {
      id: "js-028",
      category: "ES6+",
      difficulty: "Hard",
      type: "Technical",
      question: "What are generators and iterators in JavaScript?",
      tip: "Explain Symbol.iterator, next(), and yield.",
    },

    {
      id: "js-029",
      category: "Browser",
      difficulty: "Easy",
      type: "Technical",
      question: "What is localStorage?",
      tip: "Explain client-side persistent storage.",
    },
    {
      id: "js-030",
      category: "Browser",
      difficulty: "Easy",
      type: "Technical",
      question: "What is sessionStorage?",
      tip: "Explain storage scoped to a browser tab session.",
    },
    {
      id: "js-031",
      category: "Browser",
      difficulty: "Medium",
      type: "Technical",
      question: "What are cookies used for?",
      tip: "Discuss sessions, authentication, preferences, and security considerations.",
    },
    {
      id: "js-032",
      category: "Browser",
      difficulty: "Medium",
      type: "Technical",
      question: "What is CORS?",
      tip: "Explain browser cross-origin security and server permissions.",
    },
    {
      id: "js-033",
      category: "Browser",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you secure sensitive data in a browser application?",
      tip: "Discuss XSS, HTTPS, secure cookies, CSP, and server-side authorization.",
    },

    {
      id: "js-034",
      category: "Performance",
      difficulty: "Easy",
      type: "Technical",
      question: "What is debouncing?",
      tip: "Explain delaying execution until rapid events stop.",
    },
    {
      id: "js-035",
      category: "Performance",
      difficulty: "Easy",
      type: "Technical",
      question: "What is throttling?",
      tip: "Explain limiting how often a function executes.",
    },
    {
      id: "js-036",
      category: "Performance",
      difficulty: "Medium",
      type: "Technical",
      question: "How can you improve JavaScript application performance?",
      tip: "Discuss code splitting, lazy loading, caching, efficient DOM usage, and profiling.",
    },
    {
      id: "js-037",
      category: "Performance",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you investigate a JavaScript memory leak?",
      tip: "Discuss browser profiling, retained objects, event listeners, and heap snapshots.",
    },

    {
      id: "js-038",
      category: "Node",
      difficulty: "Easy",
      type: "Technical",
      question: "What is Node.js?",
      tip: "Explain JavaScript runtime outside the browser.",
    },
    {
      id: "js-039",
      category: "Node",
      difficulty: "Medium",
      type: "Technical",
      question: "Why is Node.js suitable for I/O-heavy applications?",
      tip: "Discuss asynchronous non-blocking I/O.",
    },
    {
      id: "js-040",
      category: "Node",
      difficulty: "Hard",
      type: "Technical",
      question: "How does Node.js handle concurrent requests?",
      tip: "Discuss the event loop and asynchronous I/O.",
    },

    {
      id: "js-041",
      category: "Testing",
      difficulty: "Easy",
      type: "Technical",
      question: "What is unit testing in JavaScript?",
      tip: "Explain testing individual functions or components.",
    },
    {
      id: "js-042",
      category: "Testing",
      difficulty: "Medium",
      type: "Technical",
      question: "What is Jest?",
      tip: "Explain its role in JavaScript testing.",
    },
    {
      id: "js-043",
      category: "Testing",
      difficulty: "Hard",
      type: "Technical",
      question: "How would you test asynchronous JavaScript code?",
      tip: "Discuss Promises, async/await, mocks, and timers.",
    },

    {
      id: "js-044",
      category: "Behavioral",
      difficulty: "Easy",
      type: "Behavioral",
      question: "Tell me about yourself and your JavaScript experience.",
      tip: "Connect your projects, frontend/backend experience, and JavaScript skills.",
    },
    {
      id: "js-045",
      category: "Behavioral",
      difficulty: "Medium",
      type: "Behavioral",
      question: "Tell me about a difficult JavaScript bug you solved.",
      tip: "Explain the bug, debugging process, fix, and result.",
    },
    {
      id: "js-046",
      category: "Behavioral",
      difficulty: "Medium",
      type: "Behavioral",
      question: "How do you approach learning a new JavaScript technology?",
      tip: "Discuss documentation, experimentation, projects, and debugging.",
    },
    {
      id: "js-047",
      category: "Behavioral",
      difficulty: "Medium",
      type: "Behavioral",
      question: "Describe a project where JavaScript played an important role.",
      tip: "Explain your responsibility and the technical decisions you made.",
    },
    {
      id: "js-048",
      category: "Advanced",
      difficulty: "Medium",
      type: "Technical",
      question: "What is hoisting in JavaScript?",
      tip: "Explain how declarations are processed before execution.",
    },
    {
      id: "js-049",
      category: "Advanced",
      difficulty: "Hard",
      type: "Technical",
      question: "Explain the difference between call, apply, and bind.",
      tip: "Compare how each controls function invocation and this.",
    },
    {
      id: "js-050",
      category: "Advanced",
      difficulty: "Hard",
      type: "Technical",
      question: "Explain the difference between shallow equality and deep equality.",
      tip: "Discuss references and nested structures.",
    },
  ],
};


// ============================================================
// Additional domains
// ============================================================

const additionalQuestionBanks = {
  "React.js": [
    "What is React?",
    "What is JSX?",
    "What is the difference between state and props?",
    "What is the Virtual DOM?",
    "What are React Hooks?",
    "What is useState?",
    "What is useEffect?",
    "What is conditional rendering?",
    "What are React keys?",
    "What is component composition?",
    "What are controlled components?",
    "What are uncontrolled components?",
    "What is prop drilling?",
    "How can prop drilling be avoided?",
    "What is Context API?",
    "What is useContext?",
    "What is useMemo?",
    "What is useCallback?",
    "What is React.memo?",
    "What is lazy loading in React?",
    "What is code splitting?",
    "How does React re-render?",
    "What causes unnecessary re-renders?",
    "How do you optimize React performance?",
    "What is lifting state up?",
    "What are custom Hooks?",
    "What is React Router?",
    "How does client-side routing work?",
    "What is an error boundary?",
    "How do forms work in React?",
    "How do you call an API from React?",
    "How do you handle loading states?",
    "How do you handle API errors?",
    "What is component lifecycle?",
    "What is reconciliation?",
    "Why are keys important during reconciliation?",
    "What is hydration?",
    "What is server-side rendering?",
    "What is client-side rendering?",
    "How would you structure a large React application?",
    "How would you manage global state?",
    "When would you use Redux?",
    "What is Redux middleware?",
    "How would you secure a React application?",
    "How would you optimize a large React list?",
    "How would you debug a React performance issue?",
    "Tell me about a React project you built.",
    "Tell me about a difficult React bug you solved.",
    "How do you make React applications responsive?",
    "Why should we hire you for a React role?",
  ],

  "Node.js": [
    "What is Node.js?",
    "Why is Node.js useful for backend development?",
    "What is npm?",
    "What is package.json?",
    "What is Express.js?",
    "What is middleware?",
    "What is routing in Express?",
    "What is a REST API?",
    "What are HTTP methods?",
    "What are HTTP status codes?",
    "What is asynchronous programming?",
    "What is the Node.js event loop?",
    "What is non-blocking I/O?",
    "What are callbacks?",
    "What are Promises?",
    "What is async/await?",
    "What is error handling in Express?",
    "How do you validate request data?",
    "How do you authenticate an API?",
    "What is JWT?",
    "What is authorization?",
    "What is CORS?",
    "What is rate limiting?",
    "How do you protect an API?",
    "How do you connect Node.js to a database?",
    "What is connection pooling?",
    "What is MongoDB?",
    "What is SQL?",
    "What is caching?",
    "Why use Redis?",
    "How would you design a scalable API?",
    "How would you handle file uploads?",
    "How would you handle large API responses?",
    "What is pagination?",
    "What is API versioning?",
    "How do you log backend errors?",
    "How do you test an Express API?",
    "What is unit testing?",
    "What is integration testing?",
    "How do environment variables work?",
    "How do you manage secrets?",
    "How do you deploy a Node.js application?",
    "How do you handle process crashes?",
    "What is clustering in Node.js?",
    "How do you improve Node.js performance?",
    "How do you prevent blocking the event loop?",
    "Tell me about a Node.js project you built.",
    "Tell me about a backend issue you solved.",
    "How would you secure a production Node.js API?",
    "Why should we hire you for a Node.js role?",
  ],

  SQL: [
    "What is SQL?",
    "What is a primary key?",
    "What is a foreign key?",
    "What is a unique key?",
    "What is normalization?",
    "What is denormalization?",
    "What is a JOIN?",
    "What is an INNER JOIN?",
    "What is a LEFT JOIN?",
    "What is a RIGHT JOIN?",
    "What is a FULL OUTER JOIN?",
    "What is GROUP BY?",
    "What is HAVING?",
    "What is ORDER BY?",
    "What is DISTINCT?",
    "What is a subquery?",
    "What is a correlated subquery?",
    "What is a database index?",
    "Why are indexes useful?",
    "What are the disadvantages of indexes?",
    "What is a composite index?",
    "What is a transaction?",
    "What are ACID properties?",
    "What is COMMIT?",
    "What is ROLLBACK?",
    "What is a view?",
    "What is a stored procedure?",
    "What is a trigger?",
    "What is a constraint?",
    "What is referential integrity?",
    "What is NULL?",
    "How does SQL handle NULL values?",
    "What is COALESCE?",
    "What is a window function?",
    "What is ROW_NUMBER?",
    "What is RANK?",
    "What is a CTE?",
    "What is a recursive CTE?",
    "How do you find duplicate records?",
    "How do you find the second highest salary?",
    "How do you optimize a slow SQL query?",
    "How do you analyze a query execution plan?",
    "What causes database deadlocks?",
    "How do transactions prevent inconsistent data?",
    "What is database partitioning?",
    "What is database replication?",
    "What is connection pooling?",
    "Tell me about a database project you worked on.",
    "Describe a difficult SQL query you solved.",
    "Why is database design important?",
  ],

  DSA: [
    "What is an array?",
    "What is a linked list?",
    "What is a stack?",
    "What is a queue?",
    "What is a hash table?",
    "What is a tree?",
    "What is a binary tree?",
    "What is a binary search tree?",
    "What is a graph?",
    "What is a heap?",
    "What is Big O notation?",
    "What is time complexity?",
    "What is space complexity?",
    "What is binary search?",
    "What is linear search?",
    "What is recursion?",
    "What is dynamic programming?",
    "What is greedy programming?",
    "What is backtracking?",
    "What is divide and conquer?",
    "What is BFS?",
    "What is DFS?",
    "What is a priority queue?",
    "What is a trie?",
    "What is a sliding window?",
    "What are two pointers?",
    "What is prefix sum?",
    "What is hashing?",
    "How do you detect a cycle in a linked list?",
    "How do you reverse a linked list?",
    "How do you find the middle of a linked list?",
    "How do you implement a stack using queues?",
    "How do you implement a queue using stacks?",
    "How do you find duplicates in an array?",
    "How do you find the maximum subarray sum?",
    "How does merge sort work?",
    "How does quick sort work?",
    "What is the complexity of merge sort?",
    "What is the complexity of quick sort?",
    "How do you detect a cycle in a graph?",
    "How do you find shortest paths?",
    "What is Dijkstra's algorithm?",
    "What is topological sorting?",
    "What is a minimum spanning tree?",
    "What is Kruskal's algorithm?",
    "What is Prim's algorithm?",
    "How do you solve a dynamic programming problem?",
    "How do you choose the right data structure?",
    "Tell me about a difficult DSA problem you solved.",
    "How do you approach an unknown coding problem?",
  ],

  "Full Stack": [
    "What is full-stack development?",
    "What is the role of a frontend?",
    "What is the role of a backend?",
    "What is an API?",
    "What is REST?",
    "What is HTTP?",
    "What is JSON?",
    "What is authentication?",
    "What is authorization?",
    "What is JWT?",
    "What is CORS?",
    "What is a database?",
    "What is SQL?",
    "What is NoSQL?",
    "What is MongoDB?",
    "What is React?",
    "What is Node.js?",
    "What is Express.js?",
    "What is middleware?",
    "How does frontend communicate with backend?",
    "How do you handle API errors?",
    "How do you validate form data?",
    "How do you validate backend requests?",
    "How do you protect user passwords?",
    "What is password hashing?",
    "What is HTTPS?",
    "What is caching?",
    "What is Redis?",
    "What is pagination?",
    "What is database indexing?",
    "How do you design a scalable web application?",
    "How do you structure a full-stack project?",
    "How do you manage environment variables?",
    "How do you store secrets?",
    "How do you upload files?",
    "How do you implement search?",
    "How do you implement filtering?",
    "How do you implement authentication?",
    "How do you implement role-based access?",
    "How do you deploy a full-stack application?",
    "What is Docker?",
    "What is CI/CD?",
    "How do you monitor a production application?",
    "How do you debug a full-stack issue?",
    "How do you improve frontend performance?",
    "How do you improve backend performance?",
    "How do you optimize database queries?",
    "Tell me about a full-stack project you built.",
    "Tell me about a difficult full-stack problem you solved.",
    "Why should we hire you as a full-stack developer?",
  ],
};


// ============================================================
// Convert additional question banks into the same structure
// ============================================================

function buildAdditionalBank(domain, questions) {
  return questions.map((question, index) => {
    const technicalCategories = [
      "Basics",
      "Functions",
      "API",
      "Performance",
      "Database",
      "Architecture",
    ];

    let category = technicalCategories[index % technicalCategories.length];

    let type = "Technical";

    if (
      question.toLowerCase().startsWith("tell me") ||
      question.toLowerCase().startsWith("why should")
    ) {
      category = "Behavioral";
      type = "Behavioral";
    }

    let difficulty = "Medium";

    if (index < 17) {
      difficulty = "Easy";
    } else if (index < 37) {
      difficulty = "Medium";
    } else {
      difficulty = "Hard";
    }

    return {
      id: `${domain.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${String(
        index + 1
      ).padStart(3, "0")}`,
      category,
      difficulty,
      type,
      question,
      tip: "Give a clear explanation, mention a practical example, and connect your answer to real development work.",
    };
  });
}

Object.entries(additionalQuestionBanks).forEach(
  ([domain, questions]) => {
    questionBank[domain] = buildAdditionalBank(
      domain,
      questions
    );
  }
);


// ============================================================
// Utility functions
// ============================================================

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[randomIndex]] = [
      result[randomIndex],
      result[i],
    ];
  }

  return result;
}

function normalizeDomain(domain) {
  const domains = Object.keys(questionBank);

  if (domains.includes(domain)) {
    return domain;
  }

  return "Java";
}

function normalizeDifficulty(difficulty) {
  const difficulties = ["Easy", "Medium", "Hard"];

  if (difficulties.includes(difficulty)) {
    return difficulty;
  }

  return "Medium";
}


// ============================================================
// Select balanced random questions
// ============================================================

function selectRandomQuestions(bank, difficulty) {
  /*
   * First try to select questions matching the requested
   * difficulty.
   */

  let candidates = bank.filter(
    (question) =>
      question.difficulty === difficulty
  );

  /*
   * If the requested difficulty has fewer than 5 questions,
   * use the complete domain bank to guarantee a session.
   */

  if (candidates.length < 5) {
    candidates = bank;
  }

  candidates = shuffle(candidates);

  /*
   * We want different categories whenever possible.
   */

  const selected = [];
  const usedCategories = new Set();

  for (const question of candidates) {
    if (
      selected.length >= 5
    ) {
      break;
    }

    if (
      !usedCategories.has(question.category)
    ) {
      selected.push(question);
      usedCategories.add(question.category);
    }
  }

  /*
   * Fill remaining positions if there were not enough
   * unique categories.
   */

  if (selected.length < 5) {
    for (const question of candidates) {
      if (selected.length >= 5) {
        break;
      }

      if (
        !selected.some(
          (item) => item.id === question.id
        )
      ) {
        selected.push(question);
      }
    }
  }

  return shuffle(selected);
}


// ============================================================
// GET /api/interview/questions
// ============================================================

const getInterviewQuestions = (req, res) => {
  try {
    const domain = normalizeDomain(
      req.query.domain || req.query.role
    );

    const difficulty = normalizeDifficulty(
      req.query.difficulty
    );

    const bank = questionBank[domain];

    const questions = selectRandomQuestions(
      bank,
      difficulty
    );

    res.json({
      success: true,
      message:
        "Random interview questions generated successfully.",

      domain,

      /*
       * Keep role in the response as well so the current
       * frontend remains compatible.
       */
      role: domain,

      difficulty,

      totalQuestionsInBank: bank.length,

      sessionQuestionCount: questions.length,

      randomized: true,

      questions,
    });
  } catch (error) {
    console.error(
      "Interview question generation error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to generate interview questions.",
    });
  }
};


module.exports = {
  getInterviewQuestions,
};