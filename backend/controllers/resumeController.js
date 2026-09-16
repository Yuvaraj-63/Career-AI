const fs = require("fs");
const path = require("path");
const {
  PDFParse,
} = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../models/Resume");

/*
==================================================
TEMPORARY RESUME STORAGE
==================================================

The latest parsed resume is kept in memory and
persisted in MongoDB.
*/

let latestResume = null;

function setLatestResume(data) {
  latestResume = data;
}

/*
==================================================
SUPPORTED SKILLS
==================================================
*/

const COMMON_SKILLS = [
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "React.js",
  "Node.js",
  "Express",
  "Express.js",
  "Spring Boot",
  "Spring",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Firebase",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Git",
  "GitHub",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Angular",
  "Vue",
  "Next.js",
  "REST API",
  "REST APIs",
  "GraphQL",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Data Structures",
  "Algorithms",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Django",
  "Flask",
  "FastAPI",
  "Power BI",
  "Tableau",
  "Excel",
  "Linux",
  "Jenkins",
  "Terraform",
  "Redis",
  "Figma",
  "Selenium",
  "Jira",
  "Agile",
  "Scrum",
];

/*
==================================================
CHECK WHETHER SKILL EXISTS IN TEXT
==================================================
*/

function containsSkill(
  text,
  skill
) {
  if (!text || !skill) {
    return false;
  }

  /*
   * Short programming languages need
   * special handling.
   *
   * Otherwise "C" would match almost
   * every sentence.
   */

  if (skill === "C") {
    return /\bC\b/i.test(text);
  }

  if (skill === "C++") {
    return /\bC\+\+\b/i.test(text);
  }

  if (skill === "C#") {
    return /\bC#\b/i.test(text);
  }

  return text
    .toLowerCase()
    .includes(
      skill.toLowerCase()
    );
}

/*
==================================================
EXTRACT SKILLS
==================================================
*/

function extractSkills(
  text
) {
  return COMMON_SKILLS.filter(
    (skill) =>
      containsSkill(
        text,
        skill
      )
  );
}

/*
==================================================
EXTRACT EMAIL
==================================================
*/

function extractEmail(
  text
) {
  const match =
    text.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

  return match
    ? match[0]
    : "";
}

/*
==================================================
EXTRACT PHONE
==================================================
*/

function extractPhone(
  text
) {
  const match =
    text.match(
      /(?:\+91[\s-]?)?[6-9]\d{9}\b/
    );

  return match
    ? match[0]
    : "";
}

/*
==================================================
EXTRACT NAME
==================================================
*/

function extractName(
  text
) {
  const lines =
    text
      .split("\n")
      .map(
        (line) =>
          line.trim()
      )
      .filter(Boolean);

  /*
   * Usually the name appears near
   * the beginning of a resume.
   */

  for (
    let i = 0;
    i <
    Math.min(
      lines.length,
      10
    );
    i++
  ) {
    const line =
      lines[i];

    /*
     * Ignore lines that look like
     * contact information.
     */

    if (
      line.includes("@") ||
      /\d{7,}/.test(line) ||
      /resume|curriculum vitae|cv/i.test(
        line
      )
    ) {
      continue;
    }

    /*
     * Basic name pattern.
     */

    if (
      /^[A-Za-z][A-Za-z .'-]{2,50}$/.test(
        line
      )
    ) {
      return line;
    }
  }

  return "";
}

/*
==================================================
EXTRACT EDUCATION
==================================================
*/

function extractEducation(
  text
) {
  const lines =
    text
      .split("\n")
      .map(
        (line) =>
          line.trim()
      )
      .filter(Boolean);

  const educationKeywords = [
    "education",
    "bachelor",
    "master",
    "b.tech",
    "m.tech",
    "b.e",
    "m.e",
    "b.sc",
    "m.sc",
    "bca",
    "mca",
    "degree",
    "university",
    "college",
    "school",
  ];

  const result = [];

  let collecting =
    false;

  for (const line of lines) {
    const lower =
      line.toLowerCase();

    if (
      lower ===
        "education" ||
      lower.includes(
        "education"
      )
    ) {
      collecting = true;
      continue;
    }

    if (
      collecting &&
      result.length < 8
    ) {
      /*
       * Stop when another major
       * resume section begins.
       */

      if (
        /^(experience|skills|projects|certifications|achievements|summary|objective|internship)/i.test(
          line
        )
      ) {
        break;
      }

      if (
        educationKeywords.some(
          (keyword) =>
            lower.includes(
              keyword
            )
        ) ||
        /\b(20\d{2}|19\d{2})\b/.test(
          line
        )
      ) {
        result.push(line);
      }
    }
  }

  return result;
}

/*
==================================================
EXTRACT EXPERIENCE
==================================================
*/

function extractExperience(
  text
) {
  const lines =
    text
      .split("\n")
      .map(
        (line) =>
          line.trim()
      )
      .filter(Boolean);

  const result = [];

  let collecting =
    false;

  for (const line of lines) {
    const lower =
      line.toLowerCase();

    if (
      /^experience$/i.test(
        line
      ) ||
      lower.includes(
        "work experience"
      ) ||
      lower.includes(
        "professional experience"
      )
    ) {
      collecting = true;
      continue;
    }

    if (
      collecting &&
      result.length < 12
    ) {
      if (
        /^(education|skills|projects|certifications|achievements|summary|objective)/i.test(
          line
        )
      ) {
        break;
      }

      result.push(line);
    }
  }

  return result;
}

/*
==================================================
EXTRACT PROJECTS
==================================================
*/

function extractProjects(
  text
) {
  const lines =
    text
      .split("\n")
      .map(
        (line) =>
          line.trim()
      )
      .filter(Boolean);

  const result = [];

  let collecting =
    false;

  for (const line of lines) {
    const lower =
      line.toLowerCase();

    if (
      /^projects?$/i.test(
        line
      ) ||
      lower.includes(
        "academic projects"
      ) ||
      lower.includes(
        "personal projects"
      )
    ) {
      collecting = true;
      continue;
    }

    if (
      collecting &&
      result.length < 12
    ) {
      if (
        /^(education|skills|experience|certifications|achievements|summary|objective)/i.test(
          line
        )
      ) {
        break;
      }

      result.push(line);
    }
  }

  return result;
}

/*
==================================================
PARSE RESUME
==================================================
*/

async function parseResumeFile(
  file
) {
  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();

  let text = "";

  /*
   * PDF
   */

  if (extension === ".pdf") {
  const buffer =
    fs.readFileSync(
      file.path
    );

  const parser =
    new PDFParse({
      data: buffer,
    });

  try {
    const result =
      await parser.getText();

    text =
      result.text || "";
  } finally {
    await parser.destroy();
  }
}

  /*
   * DOCX
   */

  else if (
    extension === ".docx"
  ) {
    const result =
      await mammoth.extractRawText(
        {
          path: file.path,
        }
      );

    text =
      result.value || "";
  }

  /*
   * Unsupported
   */

  else {
    throw new Error(
      "Only PDF and DOCX resumes are supported."
    );
  }

  /*
   * Normalize whitespace.
   */

  text =
    text
      .replace(/\r/g, "")
      .replace(
        /[ \t]+/g,
        " "
      )
      .replace(
        /\n{3,}/g,
        "\n\n"
      )
      .trim();

  return text;
}

/*
==================================================
UPLOAD + ANALYZE
==================================================
*/

async function uploadResume(
  req,
  res,
  next
) {
  let filePath = null;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Please upload a PDF or DOCX resume.",
        });
    }

    filePath =
      req.file.path;

    /*
     * Parse file.
     */

    const text =
      await parseResumeFile(
        req.file
      );

    if (!text.trim()) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Could not extract text from this resume.",
        });
    }

    /*
     * Extract information.
     */

    const skills =
      extractSkills(
        text
      );

    const resume = {
      fileName:
        req.file.originalname,

      fileType:
        path.extname(
          req.file.originalname
        ).toLowerCase(),

      name:
        extractName(
          text
        ),

      email:
        extractEmail(
          text
        ),

      phone:
        extractPhone(
          text
        ),

      skills,

      education:
        extractEducation(
          text
        ),

      experience:
        extractExperience(
          text
        ),

      projects:
        extractProjects(
          text
        ),

      rawText:
        text,

      uploadedAt:
        new Date().toISOString(),
    };

    /*
     * Temporary memory storage.
     */

    latestResume =
      resume;

    res.json({
      success: true,

      message:
        "Resume uploaded and analyzed successfully.",

      data: {
        ...resume,

        /*
         * Don't expose the full raw text
         * to the frontend response.
         */

        rawText:
          undefined,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    /*
     * Delete uploaded temporary file.
     */

    if (
      filePath &&
      fs.existsSync(
        filePath
      )
    ) {
      fs.unlinkSync(
        filePath
      );
    }
  }
}

/*
==================================================
GET CURRENT RESUME
==================================================
*/

async function getResume(
  req,
  res
) {
  try {
    if (latestResume) {
      return res.json({
        success: true,
        data: {
          ...latestResume,
          rawText: undefined,
        },
      });
    }

    const dbResume = await Resume.findOne().sort({ createdAt: -1 });

    if (dbResume) {
      latestResume = dbResume.toObject();
      return res.json({
        success: true,
        data: {
          ...latestResume,
          rawText: undefined,
        },
      });
    }

    return res.json({
      success: true,
      data: null,
    });
  } catch (error) {
    return res.json({
      success: true,
      data: latestResume,
    });
  }
}

/*
==================================================
DELETE CURRENT RESUME
==================================================
*/

async function deleteResume(
  req,
  res
) {
  latestResume = null;

  try {
    await Resume.deleteMany({});
  } catch (err) {
    // ignore
  }

  res.json({
    success: true,
    message: "Resume removed successfully.",
  });
}

/*
==================================================
EXPORT
==================================================
*/

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
  setLatestResume,
};