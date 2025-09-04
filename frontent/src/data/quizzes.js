// src/data/quizzes.js

const quizzes = [
  {
    id: "tcs",
    name: "TCS NQT Placement Quiz (PYQ)",
    duration: 1200, // 20 min
    questions: [
      // Aptitude
      {
        id: "tcs1",
        question: "The average of 20 numbers is zero. At most, how many of them can be greater than zero?",
        options: ["0", "1", "19", "20"],
        correctAnswer: "19",
      },
      {
        id: "tcs2",
        question: "If the cost price is 80% of the selling price, the profit percentage is?",
        options: ["20%", "25%", "15%", "30%"],
        correctAnswer: "25%",
      },
      {
        id: "tcs3",
        question: "A boat goes 15 km downstream in 30 minutes. Stream speed = 5 km/hr. Find boat speed in still water.",
        options: ["20 km/hr", "25 km/hr", "15 km/hr", "10 km/hr"],
        correctAnswer: "25 km/hr",
      },
      // Reasoning
      {
        id: "tcs4",
        question: "If MONKEY is written as XDJMNL, how will TIGER be written?",
        options: ["QDFHS", "QHFDS", "QDFSH", "QDHFS"],
        correctAnswer: "QDFHS",
      },
      {
        id: "tcs5",
        question: "Find the odd one out: 2, 6, 12, 20, 30, 42",
        options: ["12", "20", "30", "42"],
        correctAnswer: "30",
      },
      // Technical
      {
        id: "tcs6",
        question: "Worst case time complexity of QuickSort?",
        options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
        correctAnswer: "O(n^2)",
      },
      {
        id: "tcs7",
        question: "Which is not an SQL aggregate function?",
        options: ["COUNT", "MAX", "AVG", "CREATE"],
        correctAnswer: "CREATE",
      },
      {
        id: "tcs8",
        question: "Which is used for dynamic memory allocation in C?",
        options: ["alloc()", "malloc()", "new", "calloc()"],
        correctAnswer: "malloc()",
      },
      // Verbal
      {
        id: "tcs9",
        question: "Correct spelling:",
        options: ["Reciept", "Receipt", "Recipt", "Receit"],
        correctAnswer: "Receipt",
      },
      {
        id: "tcs10",
        question: "Synonym of 'Abundant':",
        options: ["Plentiful", "Scarce", "Rare", "Little"],
        correctAnswer: "Plentiful",
      },
    ],
  },

  {
    id: "wipro",
    name: "Wipro Elite NLTH Quiz (PYQ)",
    duration: 1200,
    questions: [
      {
        id: "w1",
        question: "Which data structure uses LIFO?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: "Stack",
      },
      {
        id: "w2",
        question: "Output of: int x=10; System.out.println(++x);",
        options: ["9", "10", "11", "Error"],
        correctAnswer: "11",
      },
      {
        id: "w3",
        question: "Simplify: (2x + 5)(2x - 5)",
        options: ["4x^2 - 25", "4x^2 + 25", "2x^2 - 25", "x^2 - 25"],
        correctAnswer: "4x^2 - 25",
      },
      {
        id: "w4",
        question: "Which protocol is used to send email?",
        options: ["SMTP", "HTTP", "FTP", "SNMP"],
        correctAnswer: "SMTP",
      },
      {
        id: "w5",
        question: "Antonym of 'Benevolent':",
        options: ["Kind", "Cruel", "Generous", "Merciful"],
        correctAnswer: "Cruel",
      },
      {
        id: "w6",
        question: "Which of these is not a programming language?",
        options: ["Python", "Ruby", "Pascal", "Oracle"],
        correctAnswer: "Oracle",
      },
      {
        id: "w7",
        question: "What is the binary of decimal 25?",
        options: ["11001", "10101", "11100", "10011"],
        correctAnswer: "11001",
      },
      {
        id: "w8",
        question: "Which sorting has best case O(n)?",
        options: ["QuickSort", "MergeSort", "BubbleSort", "HeapSort"],
        correctAnswer: "BubbleSort",
      },
      {
        id: "w9",
        question: "Find next in series: 2, 6, 12, 20, ?",
        options: ["28", "30", "32", "36"],
        correctAnswer: "30",
      },
      {
        id: "w10",
        question: "Synonym of 'Obsolete':",
        options: ["Modern", "Ancient", "Outdated", "Recent"],
        correctAnswer: "Outdated",
      },
    ],
  },

  {
    id: "infosys",
    name: "Infosys Placement Quiz (PYQ)",
    duration: 1500,
    questions: [
      {
        id: "i1",
        question: "Which layer of OSI handles error detection?",
        options: ["Application", "Transport", "Network", "Session"],
        correctAnswer: "Transport",
      },
      {
        id: "i2",
        question: "Which is not an OOP principle?",
        options: ["Encapsulation", "Polymorphism", "Abstraction", "Compilation"],
        correctAnswer: "Compilation",
      },
      {
        id: "i3",
        question: "The sum of first 50 natural numbers is?",
        options: ["1250", "1275", "1225", "1300"],
        correctAnswer: "1275",
      },
      {
        id: "i4",
        question: "Choose the correctly spelled word:",
        options: ["Acommodate", "Accommodate", "Acomodate", "Acomodet"],
        correctAnswer: "Accommodate",
      },
      {
        id: "i5",
        question: "Which SQL command removes a table?",
        options: ["DELETE", "DROP", "REMOVE", "CLEAR"],
        correctAnswer: "DROP",
      },
      {
        id: "i6",
        question: "Binary search requires:",
        options: ["Sorted array", "Unsorted array", "Tree", "Graph"],
        correctAnswer: "Sorted array",
      },
      {
        id: "i7",
        question: "Which scheduling is preemptive?",
        options: ["FCFS", "SJF", "Round Robin", "Priority (Non-preemptive)"],
        correctAnswer: "Round Robin",
      },
      {
        id: "i8",
        question: "Find odd one: Circle, Triangle, Square, Cube",
        options: ["Circle", "Triangle", "Square", "Cube"],
        correctAnswer: "Cube",
      },
      {
        id: "i9",
        question: "Antonym of 'Arrogant':",
        options: ["Humble", "Proud", "Selfish", "Angry"],
        correctAnswer: "Humble",
      },
      {
        id: "i10",
        question: "Output of: 5 & 3 (bitwise AND)?",
        options: ["1", "2", "3", "0"],
        correctAnswer: "1",
      },
    ],
  },

  {
    id: "accenture",
    name: "Accenture Assessment Quiz (PYQ)",
    duration: 1500,
    questions: [
      {
        id: "a1",
        question: "Which data structure is used in BFS?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctAnswer: "Queue",
      },
      {
        id: "a2",
        question: "What is 111111 in binary equal to in decimal?",
        options: ["62", "63", "64", "65"],
        correctAnswer: "63",
      },
      {
        id: "a3",
        question: "Which of the following is a NOT gate truth table?",
        options: ["0→0, 1→1", "0→1, 1→0", "0→0, 1→0", "0→1, 1→1"],
        correctAnswer: "0→1, 1→0",
      },
      {
        id: "a4",
        question: "Which SQL keyword is used to remove duplicate rows?",
        options: ["UNIQUE", "DISTINCT", "DELETE", "CLEAR"],
        correctAnswer: "DISTINCT",
      },
      {
        id: "a5",
        question: "Choose synonym of 'Alleviate':",
        options: ["Increase", "Relieve", "Burden", "Pressure"],
        correctAnswer: "Relieve",
      },
      {
        id: "a6",
        question: "The cube root of 1728 is?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "12",
      },
      {
        id: "a7",
        question: "Which of these is a stable sorting algorithm?",
        options: ["QuickSort", "HeapSort", "MergeSort", "SelectionSort"],
        correctAnswer: "MergeSort",
      },
      {
        id: "a8",
        question: "What is the default scope of a bean in Spring?",
        options: ["Singleton", "Prototype", "Request", "Session"],
        correctAnswer: "Singleton",
      },
      {
        id: "a9",
        question: "Antonym of 'Transparent':",
        options: ["Opaque", "Clear", "Glass", "Light"],
        correctAnswer: "Opaque",
      },
      {
        id: "a10",
        question: "Find missing number: 1, 4, 9, 16, ?, 36",
        options: ["20", "24", "25", "30"],
        correctAnswer: "25",
      },
    ],
  },
];

export default quizzes;
