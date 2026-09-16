// ==========================================================
// CareerAI - Interview Answer Evaluation Controller
// ==========================================================

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "what",
  "why",
  "how",
  "when",
  "where",
  "which",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "from",
  "by",
  "can",
  "could",
  "would",
  "should",
  "does",
  "do",
  "did",
  "explain",
  "difference",
  "between",
  "using",
  "used",
  "use",
  "your",
  "you",
  "they",
  "their",
  "it",
  "its",
  "this",
  "that",
  "than",
  "into",
  "about",
  "give",
  "example",
  "examples",
]);

const TECHNICAL_KEYWORDS = {
  Java: [
    "class",
    "object",
    "inheritance",
    "polymorphism",
    "encapsulation",
    "abstraction",
    "interface",
    "arraylist",
    "linkedlist",
    "hashmap",
    "hashset",
    "exception",
    "thread",
    "multithreading",
    "jvm",
    "jre",
    "jdk",
    "garbage collection",
    "overloading",
    "overriding",
    "constructor",
    "static",
    "final",
    "string",
    "stream",
    "lambda",
    "collection",
  ],

  Python: [
    "list",
    "tuple",
    "set",
    "dictionary",
    "dict",
    "class",
    "object",
    "inheritance",
    "decorator",
    "generator",
    "iterator",
    "exception",
    "lambda",
    "pip",
    "virtual environment",
    "mutable",
    "immutable",
    "gil",
    "thread",
    "multiprocessing",
    "comprehension",
    "function",
  ],

  JavaScript: [
    "variable",
    "let",
    "const",
    "var",
    "closure",
    "hoisting",
    "promise",
    "async",
    "await",
    "callback",
    "event loop",
    "prototype",
    "object",
    "array",
    "dom",
    "event",
    "scope",
    "arrow function",
    "map",
    "filter",
    "reduce",
  ],

  "React.js": [
    "component",
    "props",
    "state",
    "usestate",
    "useeffect",
    "hook",
    "jsx",
    "virtual dom",
    "render",
    "context",
    "redux",
    "reconciliation",
    "key",
    "lifecycle",
    "memo",
    "usememo",
    "usecallback",
  ],

  "Node.js": [
    "node",
    "express",
    "middleware",
    "event loop",
    "callback",
    "promise",
    "async",
    "await",
    "npm",
    "module",
    "http",
    "api",
    "rest",
    "stream",
    "buffer",
    "authentication",
    "authorization",
  ],

  SQL: [
    "select",
    "insert",
    "update",
    "delete",
    "join",
    "inner join",
    "left join",
    "right join",
    "group by",
    "order by",
    "having",
    "where",
    "primary key",
    "foreign key",
    "index",
    "normalization",
    "transaction",
    "acid",
    "subquery",
    "aggregate",
    "database",
  ],

  DSA: [
    "array",
    "linked list",
    "stack",
    "queue",
    "tree",
    "binary tree",
    "binary search tree",
    "graph",
    "heap",
    "hash",
    "recursion",
    "dynamic programming",
    "greedy",
    "backtracking",
    "bfs",
    "dfs",
    "binary search",
    "sorting",
    "time complexity",
    "space complexity",
    "big o",
  ],

  "Full Stack": [
    "frontend",
    "backend",
    "react",
    "node",
    "express",
    "api",
    "rest",
    "database",
    "sql",
    "mongodb",
    "authentication",
    "authorization",
    "jwt",
    "http",
    "request",
    "response",
    "deployment",
    "docker",
    "cors",
    "middleware",
  ],
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s.+#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDomain(domain) {
  const value = String(domain || "").trim();

  if (value === "React") return "React.js";
  if (value === "JavaScript") return "JavaScript";
  if (value === "Full Stack Developer") return "Full Stack";

  return value || "Software Engineer";
}

function getKeywordList(domain) {
  const normalizedDomain = getDomain(domain);

  return (
    TECHNICAL_KEYWORDS[normalizedDomain] || [
      "algorithm",
      "data structure",
      "design",
      "performance",
      "testing",
      "debugging",
      "api",
      "database",
      "security",
      "scalability",
    ]
  );
}

function extractQuestionKeywords(question) {
  const normalizedQuestion = normalizeText(question);

  const words = normalizedQuestion
    .split(" ")
    .filter(
      (word) =>
        word.length >= 4 &&
        !STOP_WORDS.has(word)
    );

  return [...new Set(words)];
}

function calculateKeywordCoverage(question, answer, domain) {
  const normalizedAnswer = normalizeText(answer);

  const domainKeywords = getKeywordList(domain);

  const questionKeywords = extractQuestionKeywords(question);

  const relevantKeywords = [
    ...new Set([
      ...questionKeywords,
      ...domainKeywords,
    ]),
  ];

  const matchedKeywords = relevantKeywords.filter(
    (keyword) => normalizedAnswer.includes(keyword)
  );

  const keywordScore =
    relevantKeywords.length > 0
      ? Math.round(
          (matchedKeywords.length /
            relevantKeywords.length) *
            100
        )
      : 0;

  return {
    keywordScore: Math.min(keywordScore, 100),
    matchedKeywords: matchedKeywords.slice(0, 10),
  };
}

function calculateAnswerQuality(answer) {
  const words = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      score: 0,
      level: "No answer",
    };
  }

  if (wordCount < 15) {
    return {
      score: 35,
      level: "Too short",
    };
  }

  if (wordCount < 35) {
    return {
      score: 55,
      level: "Basic",
    };
  }

  if (wordCount < 70) {
    return {
      score: 75,
      level: "Good",
    };
  }

  if (wordCount < 130) {
    return {
      score: 90,
      level: "Detailed",
    };
  }

  return {
    score: 95,
    level: "Very detailed",
  };
}

function detectExplanationSignals(answer) {
  const normalizedAnswer = normalizeText(answer);

  const signals = {
    example:
      /\bexample\b|\bfor instance\b|\bsuch as\b/.test(
        normalizedAnswer
      ),

    comparison:
      /\bwhereas\b|\bwhile\b|\bdifference\b|\bcompared\b|\bin contrast\b/.test(
        normalizedAnswer
      ),

    reasoning:
      /\bbecause\b|\btherefore\b|\bso that\b|\bthis allows\b|\bthis means\b/.test(
        normalizedAnswer
      ),

    complexity:
      /\bo\(\s*[a-z0-9^]+\s*\)/i.test(answer) ||
      /\btime complexity\b|\bspace complexity\b|\bbig o\b/.test(
        normalizedAnswer
      ),

    implementation:
      /\bcode\b|\bimplementation\b|\bsyntax\b|\bmethod\b|\bfunction\b/.test(
        normalizedAnswer
      ),
  };

  return signals;
}

function calculateTechnicalDepth(answer, domain) {
  const normalizedAnswer = normalizeText(answer);
  const keywords = getKeywordList(domain);

  const matched = keywords.filter((keyword) =>
    normalizedAnswer.includes(keyword)
  );

  const signals = detectExplanationSignals(answer);

  let score = Math.min(
    matched.length * 10,
    60
  );

  if (signals.example) score += 10;
  if (signals.comparison) score += 10;
  if (signals.reasoning) score += 10;
  if (signals.complexity) score += 10;
  if (signals.implementation) score += 10;

  return Math.min(score, 100);
}

function getSuggestions({
  answer,
  answerQuality,
  keywordScore,
  technicalDepth,
  matchedKeywords,
}) {
  const suggestions = [];

  if (answerQuality.score < 55) {
    suggestions.push(
      "Give a more detailed explanation instead of only stating the definition."
    );
  }

  if (keywordScore < 40) {
    suggestions.push(
      "Include more technical concepts directly related to the question."
    );
  }

  if (technicalDepth < 50) {
    suggestions.push(
      "Explain how the concept works internally and why it is useful."
    );
  }

  const signals = detectExplanationSignals(answer);

  if (!signals.example) {
    suggestions.push(
      "Add a simple real-world or coding example when appropriate."
    );
  }

  if (!signals.reasoning) {
    suggestions.push(
      "Explain the reasoning behind your answer using 'because', 'therefore', or a similar explanation."
    );
  }

  if (
    matchedKeywords.length === 0
  ) {
    suggestions.push(
      "Use important terminology from the question instead of giving only a general answer."
    );
  }

  return suggestions.slice(0, 4);
}

function getStrengths({
  answerQuality,
  keywordScore,
  technicalDepth,
  answer,
}) {
  const strengths = [];

  if (answerQuality.score >= 75) {
    strengths.push(
      "Your answer has enough detail to demonstrate your understanding."
    );
  }

  if (keywordScore >= 60) {
    strengths.push(
      "You used several relevant technical concepts."
    );
  }

  if (technicalDepth >= 60) {
    strengths.push(
      "Your answer shows good technical depth."
    );
  }

  const signals = detectExplanationSignals(answer);

  if (signals.example) {
    strengths.push(
      "You included an example, which makes the explanation stronger."
    );
  }

  if (signals.reasoning) {
    strengths.push(
      "You explained the reasoning instead of only giving a definition."
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "You attempted the question and provided a starting point for improvement."
    );
  }

  return strengths.slice(0, 4);
}

function generateImprovedAnswer(question, domain, answer) {
  const normalizedDomain = getDomain(domain);

  const words = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const originalSummary =
    words.length > 25
      ? words.slice(0, 35).join(" ") + "..."
      : answer.trim();

  return `A stronger ${normalizedDomain} interview answer should directly answer the question, explain the important technical concepts, describe why they matter, and include a short example when appropriate.

Your current answer:
"${originalSummary}"

Improve it by:
1. Starting with a clear definition or direct answer.
2. Explaining the underlying concept.
3. Mentioning important technical details.
4. Giving an example where appropriate.
5. Mentioning complexity or trade-offs when the question involves algorithms or performance.`;
}

function getOverallScore({
  keywordScore,
  answerQuality,
  technicalDepth,
}) {
  const score =
    keywordScore * 0.35 +
    answerQuality * 0.25 +
    technicalDepth * 0.4;

  return Math.round(
    Math.max(0, Math.min(score, 100))
  );
}

// ==========================================================
// POST /api/interview/evaluate
// ==========================================================

const evaluateInterviewAnswer = (req, res) => {
  try {
    const {
      question,
      answer,
      domain,
      difficulty,
    } = req.body;

    if (!question || !String(question).trim()) {
      return res.status(400).json({
        success: false,
        message: "Interview question is required.",
      });
    }

    if (!answer || !String(answer).trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide an answer before requesting feedback.",
      });
    }

    const cleanQuestion = String(question).trim();
    const cleanAnswer = String(answer).trim();

    const answerQuality = calculateAnswerQuality(
      cleanAnswer
    );

    const keywordAnalysis =
      calculateKeywordCoverage(
        cleanQuestion,
        cleanAnswer,
        domain
      );

    const technicalDepth =
      calculateTechnicalDepth(
        cleanAnswer,
        domain
      );

    const overallScore = getOverallScore({
      keywordScore:
        keywordAnalysis.keywordScore,
      answerQuality: answerQuality.score,
      technicalDepth,
    });

    const strengths = getStrengths({
      answerQuality,
      keywordScore:
        keywordAnalysis.keywordScore,
      technicalDepth,
      answer: cleanAnswer,
    });

    const suggestions = getSuggestions({
      answer: cleanAnswer,
      answerQuality,
      keywordScore:
        keywordAnalysis.keywordScore,
      technicalDepth,
      matchedKeywords:
        keywordAnalysis.matchedKeywords,
    });

    let verdict = "Needs Improvement";

    if (overallScore >= 80) {
      verdict = "Excellent Answer";
    } else if (overallScore >= 65) {
      verdict = "Good Answer";
    } else if (overallScore >= 50) {
      verdict = "Fair Answer";
    }

    res.json({
      success: true,

      evaluation: {
        score: overallScore,
        scoreOutOf10:
          Math.round((overallScore / 10) * 10) / 10,

        verdict,

        domain: getDomain(domain),

        difficulty:
          difficulty || "Medium",

        wordCount:
          cleanAnswer
            .split(/\s+/)
            .filter(Boolean).length,

        breakdown: {
          technicalRelevance:
            keywordAnalysis.keywordScore,

          answerQuality:
            answerQuality.score,

          technicalDepth,
        },

        matchedKeywords:
          keywordAnalysis.matchedKeywords,

        strengths,

        suggestions,

        improvedAnswer:
          generateImprovedAnswer(
            cleanQuestion,
            domain,
            cleanAnswer
          ),

        interviewTip:
          "A strong interview answer should be clear, structured, technically accurate, and supported with an example when possible.",
      },
    });
  } catch (error) {
    console.error(
      "Interview evaluation error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to evaluate the interview answer.",
    });
  }
};

module.exports = {
  evaluateInterviewAnswer,
};