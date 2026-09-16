const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../models/Resume");
const { setLatestResume } = require("./resumeController");

/*
|--------------------------------------------------------------------------
| SKILLS DATABASE
|--------------------------------------------------------------------------
*/

const SKILLS = [
  "java",
  "python",
  "javascript",
  "typescript",
  "react",
  "react.js",
  "node.js",
  "node",
  "express",
  "spring boot",
  "spring",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "firebase",
  "html",
  "css",
  "tailwind",
  "git",
  "github",
  "docker",
  "aws",
  "azure",
  "rest api",
  "api",
  "testing",
  "jest",
  "junit",
  "c++",
  "c#",
  "machine learning",
  "artificial intelligence",
  "tensorflow",
  "pandas",
  "numpy",
  "data structures",
  "algorithms",
  "figma",
  "linux",
  "kubernetes",
  "redis",
  "graphql",
  "next.js",
  "angular",
  "vue",
  "django",
  "flask",
  "fastapi",
  "php",
  "go",
  "rust",
  "scala",
  "power bi",
  "tableau",
  "jenkins",
  "terraform",
  "oracle",
  "postgres",
];

/*
|--------------------------------------------------------------------------
| SKILL DETECTION
|--------------------------------------------------------------------------
*/

function containsSkill(text, skill) {
  const normalized = text.toLowerCase();

  if (skill === "c") {
    return /\b(c)\b/i.test(normalized);
  }

  if (skill === "c++") {
    return /c\+\+/i.test(normalized);
  }

  if (skill === "c#") {
    return /c#/i.test(normalized);
  }

  if (skill === "node.js") {
    return (
      /\bnode\.js\b/i.test(normalized) ||
      /\bnodejs\b/i.test(normalized)
    );
  }

  if (skill === "react.js") {
    return (
      /\breact\.js\b/i.test(normalized) ||
      /\breactjs\b/i.test(normalized)
    );
  }

  if (skill === "next.js") {
    return (
      /\bnext\.js\b/i.test(normalized) ||
      /\bnextjs\b/i.test(normalized)
    );
  }

  return normalized.includes(skill.toLowerCase());
}

function extractSkills(text) {
  return [
    ...new Set(
      SKILLS.filter((skill) =>
        containsSkill(text, skill)
      )
    ),
  ];
}

/*
|--------------------------------------------------------------------------
| EXTRACT RESUME TEXT
|--------------------------------------------------------------------------
*/

async function extractResumeText(file) {
  if (!file) {
    throw new Error("Resume file is missing.");
  }

  let resumeText = "";

  /*
  |--------------------------------------------------------------------------
  | PDF
  |--------------------------------------------------------------------------
  */

  if (
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    const parser = new PDFParse({
      data: file.buffer,
    });

    try {
      const result = await parser.getText();
      resumeText = result.text || "";
    } finally {
      await parser.destroy();
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DOCX
  |--------------------------------------------------------------------------
  */

  else if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    resumeText = result.value || "";
  } else {
    throw new Error("Please upload a PDF or DOCX resume.");
  }

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE TEXT (Preserve newlines for line-by-line section extraction)
  |--------------------------------------------------------------------------
  */

  resumeText = resumeText
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!resumeText) {
    throw new Error("Could not extract text from this resume.");
  }

  return resumeText;
}

/*
|--------------------------------------------------------------------------
| EXTRACT CONTACT DETAILS
|--------------------------------------------------------------------------
*/

function extractContact(text) {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/);
  const linkedinMatch = text.match(/(?:linkedin\.com\/(?:in|company)\/[a-zA-Z0-9_-]+)/i);
  const githubMatch = text.match(/(?:github\.com\/[a-zA-Z0-9_-]+)/i);

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let name = "";

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (
      !line.includes("@") &&
      !/\d{7,}/.test(line) &&
      !/resume|curriculum|vitae|cv|contact|portfolio/i.test(line) &&
      /^[A-Za-z][A-Za-z .'-]{2,40}$/.test(line)
    ) {
      name = line;
      break;
    }
  }

  return {
    name,
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0].trim() : "",
    linkedin: linkedinMatch ? linkedinMatch[0] : "",
    github: githubMatch ? githubMatch[0] : "",
  };
}

/*
|--------------------------------------------------------------------------
| EXTRACT EDUCATION
|--------------------------------------------------------------------------
*/

function extractEducation(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const items = [];
  let inSection = false;

  const headerKeywords = [
    "education", "academic", "academics", "educational background", "qualification", "qualifications"
  ];
  const stopKeywords = [
    "experience", "work experience", "professional experience", "skills", 
    "technical skills", "projects", "certifications", "achievements", 
    "summary", "objective", "internships", "interests", "languages"
  ];
  const degreePattern = /\b(b\.?tech|btech|m\.?tech|mtech|b\.?e\.?|m\.?e\.?|bca|mca|b\.?sc|m\.?sc|bachelor|master|phd|diploma|higher secondary|secondary school|12th|10th|hsc|sslc|cbse|icse)\b/i;
  const institutionPattern = /\b(university|college|institute|school|academy|campus)\b/i;
  const yearPattern = /\b(19\d{2}|20\d{2})\b/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (headerKeywords.some((k) => lower === k || lower.startsWith(k + ":") || lower.startsWith(k + " -"))) {
      inSection = true;
      continue;
    }

    if (inSection && stopKeywords.some((k) => lower === k || lower.startsWith(k + ":") || lower.startsWith(k + " -"))) {
      inSection = false;
      continue;
    }

    if (inSection) {
      if (line.length >= 4 && line.length <= 180 && !headerKeywords.includes(lower)) {
        items.push(line);
      }
    } else {
      if (degreePattern.test(line) && (institutionPattern.test(line) || yearPattern.test(line))) {
        if (!items.includes(line)) {
          items.push(line);
        }
      }
    }
  }

  return items.slice(0, 8);
}

/*
|--------------------------------------------------------------------------
| EXTRACT EXPERIENCE
|--------------------------------------------------------------------------
*/

function extractExperience(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const items = [];
  let inSection = false;

  const headerKeywords = [
    "experience", "work experience", "professional experience", 
    "employment", "work history", "internships", "internship experience"
  ];
  const stopKeywords = [
    "education", "academic", "skills", "technical skills", 
    "projects", "academic projects", "certifications", "achievements", 
    "summary", "objective", "interests", "languages"
  ];
  const rolePattern = /\b(intern|developer|engineer|analyst|designer|consultant|manager|lead|associate|specialist|officer|trainee|full stack|frontend|backend)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (headerKeywords.some((k) => lower === k || lower.startsWith(k + ":") || lower.startsWith(k + " -"))) {
      inSection = true;
      continue;
    }

    if (inSection && stopKeywords.some((k) => lower === k || lower.startsWith(k + ":") || lower.startsWith(k + " -"))) {
      inSection = false;
      continue;
    }

    if (inSection) {
      if (line.length >= 5 && line.length <= 250 && !headerKeywords.includes(lower)) {
        items.push(line);
      }
    } else {
      if (rolePattern.test(line) && /\b(at|@|-|\||20\d{2})\b/i.test(line)) {
        if (!items.includes(line)) {
          items.push(line);
        }
      }
    }
  }

  return items.slice(0, 10);
}

/*
|--------------------------------------------------------------------------
| EXTRACT PROJECTS
|--------------------------------------------------------------------------
*/

function extractProjects(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const items = [];
  let inSection = false;

  const headerKeywords = [
    "projects", "personal projects", "academic projects", "key projects"
  ];
  const stopKeywords = [
    "education", "experience", "work experience", "skills", 
    "technical skills", "certifications", "achievements", "summary"
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (headerKeywords.some((k) => lower === k || lower.startsWith(k + ":") || lower.startsWith(k + " -"))) {
      inSection = true;
      continue;
    }

    if (inSection && stopKeywords.some((k) => lower === k || lower.startsWith(k + ":") || lower.startsWith(k + " -"))) {
      inSection = false;
      continue;
    }

    if (inSection) {
      if (line.length >= 5 && line.length <= 250 && !headerKeywords.includes(lower)) {
        items.push(line);
      }
    }
  }

  return items.slice(0, 8);
}

/*
|--------------------------------------------------------------------------
| RESUME SECTIONS DETECTION
|--------------------------------------------------------------------------
*/

function detectSections(text, extracted) {
  const hasContact =
    Boolean(extracted?.contact?.email || extracted?.contact?.phone) ||
    /\b(email|phone|mobile|linkedin|github)\b/i.test(text);

  const hasEducation =
    (extracted?.education && extracted.education.length > 0) ||
    /\b(education|academic|qualification|bachelor|master|b\.tech|btech|degree|university|college)\b/i.test(text);

  const hasExperience =
    (extracted?.experience && extracted.experience.length > 0) ||
    /\b(experience|employment|work history|work experience|professional experience|internship|internships)\b/i.test(text);

  const hasProjects =
    (extracted?.projects && extracted.projects.length > 0) ||
    /\b(projects|personal projects|academic projects|key projects)\b/i.test(text);

  return {
    contact: hasContact,
    summary: /\b(summary|objective|profile|professional summary|about me)\b/i.test(text),
    education: hasEducation,
    skills: /\b(skills|technical skills|technologies|tech stack|core competencies)\b/i.test(text),
    experience: hasExperience,
    projects: hasProjects,
    certifications: /\b(certification|certifications|courses|licenses)\b/i.test(text),
    achievements: /\b(achievement|achievements|awards|honors)\b/i.test(text),
  };
}

/*
|--------------------------------------------------------------------------
| ATS SCORE CALCULATION
|--------------------------------------------------------------------------
*/

function calculateATSScore(resumeText, detectedSkills, extracted) {
  const text = resumeText.toLowerCase();
  const sections = detectSections(resumeText, extracted);

  /* 1. SECTIONS SCORE (Max: 20) */
  let sectionScore = 0;
  if (sections.contact) sectionScore += 4;
  if (sections.education) sectionScore += 4;
  if (sections.skills) sectionScore += 4;
  if (sections.experience) sectionScore += 4;
  if (sections.projects) sectionScore += 2;
  if (sections.summary || sections.certifications || sections.achievements) sectionScore += 2;
  sectionScore = Math.min(sectionScore, 20);

  /* 2. TECHNICAL SKILLS SCORE (Max: 25) */
  let technicalSkillsScore = 0;
  if (detectedSkills.length >= 12) {
    technicalSkillsScore = 25;
  } else if (detectedSkills.length >= 10) {
    technicalSkillsScore = 23;
  } else if (detectedSkills.length >= 8) {
    technicalSkillsScore = 20;
  } else if (detectedSkills.length >= 6) {
    technicalSkillsScore = 17;
  } else if (detectedSkills.length >= 4) {
    technicalSkillsScore = 14;
  } else if (detectedSkills.length >= 2) {
    technicalSkillsScore = 10;
  } else if (detectedSkills.length === 1) {
    technicalSkillsScore = 6;
  }

  /* 3. EXPERIENCE SCORE (Max: 15) */
  let experienceScore = 0;
  if (extracted?.experience && extracted.experience.length >= 2) {
    experienceScore = 15;
  } else if (extracted?.experience && extracted.experience.length >= 1) {
    experienceScore = 13;
  } else if (sections.experience) {
    experienceScore = 12;
  } else {
    experienceScore = 0;
  }

  /* 4. EDUCATION SCORE (Max: 10) */
  let educationScore = 0;
  if (extracted?.education && extracted.education.length >= 1) {
    educationScore = 10;
  } else if (sections.education) {
    educationScore = 8;
  } else {
    educationScore = 0;
  }

  /* 5. PROJECTS SCORE (Max: 10) */
  let projectsScore = 0;
  if (extracted?.projects && extracted.projects.length >= 2) {
    projectsScore = 10;
  } else if (extracted?.projects && extracted.projects.length >= 1) {
    projectsScore = 8;
  } else if (sections.projects) {
    projectsScore = 7;
  } else {
    projectsScore = 0;
  }

  /* 6. CONTACT SCORE (Max: 10) */
  let contactScore = 0;
  if (extracted?.contact?.email) contactScore += 5;
  if (extracted?.contact?.phone) contactScore += 3;
  if (extracted?.contact?.linkedin || extracted?.contact?.github) contactScore += 2;
  contactScore = Math.min(contactScore, 10);

  /* 7. FORMATTING / ACHIEVEMENTS BONUS (Max: 10) */
  const numbers = resumeText.match(
    /\b\d+(?:\.\d+)?%|\b\d+\+|\b\d+(?:\.\d+)?\s*(users|projects|months|years|members|customers|requests|records)\b/gi
  );
  const numberCount = numbers ? numbers.length : 0;

  let bonusScore = 0;
  if (resumeText.length >= 1200) bonusScore += 4;
  else if (resumeText.length >= 600) bonusScore += 2;
  if (numberCount >= 2) bonusScore += 4;
  else if (numberCount >= 1) bonusScore += 2;
  if (sections.certifications || sections.achievements) bonusScore += 2;
  bonusScore = Math.min(bonusScore, 10);

  let atsScore =
    sectionScore +
    technicalSkillsScore +
    experienceScore +
    educationScore +
    projectsScore +
    contactScore +
    bonusScore;

  atsScore = Math.max(0, Math.min(100, atsScore));

  return {
    atsScore,
    sections,
    breakdown: {
      sections: sectionScore,
      technicalSkills: technicalSkillsScore,
      experience: experienceScore,
      education: educationScore,
      projects: projectsScore,
      contact: contactScore,
    },
    numberCount,
  };
}

/*
|--------------------------------------------------------------------------
| JOB DESCRIPTION MATCH
|--------------------------------------------------------------------------
*/

function calculateJobMatch(
  resumeText,
  detectedSkills,
  jobDescription,
  atsScore
) {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      jobMatchScore: null,
      requiredSkills: [],
      matchedSkills: [],
      missingJobSkills: [],
    };
  }

  const jobText = jobDescription.toLowerCase();

  const requiredSkills = [
    ...new Set(
      SKILLS.filter((skill) => containsSkill(jobText, skill))
    ),
  ];

  const matchedSkills = requiredSkills.filter((skill) =>
    detectedSkills.some(
      (resumeSkill) => resumeSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  const missingJobSkills = requiredSkills.filter(
    (skill) =>
      !matchedSkills.some(
        (matched) => matched.toLowerCase() === skill.toLowerCase()
      )
  );

  let jobMatchScore = null;

  if (requiredSkills.length > 0) {
    const skillMatchPercentage = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );

    jobMatchScore = Math.round(
      skillMatchPercentage * 0.7 + atsScore * 0.3
    );
  }

  return {
    jobMatchScore,
    requiredSkills,
    matchedSkills,
    missingJobSkills,
  };
}

/*
|--------------------------------------------------------------------------
| STRENGTHS & SUGGESTIONS
|--------------------------------------------------------------------------
*/

function generateStrengths(detectedSkills, sections, numberCount, matchedSkills) {
  const strengths = [];

  if (detectedSkills.length >= 8) {
    strengths.push("Strong technical skill coverage across key technologies");
  } else if (detectedSkills.length >= 4) {
    strengths.push("Good range of recognized technical skills");
  }

  if (sections.projects) {
    strengths.push("Projects section clearly identified");
  }

  if (sections.experience) {
    strengths.push("Relevant practical/work experience highlighted");
  }

  if (numberCount >= 2) {
    strengths.push("Uses measurable numbers and quantitative achievements");
  }

  if (sections.education) {
    strengths.push("Clear educational qualifications included");
  }

  if (sections.contact) {
    strengths.push("Contact information properly provided");
  }

  if (matchedSkills.length >= 3) {
    strengths.push("Strong alignment with target role job requirements");
  }

  if (strengths.length === 0) {
    strengths.push("Resume content was successfully extracted and formatted");
  }

  return strengths;
}

function generateSuggestions(sections, detectedSkills, numberCount, missingJobSkills) {
  const suggestions = [];

  if (numberCount < 2) {
    suggestions.push("Use numbers, percentages, and metrics to demonstrate measurable project results.");
  }

  if (detectedSkills.length < 6) {
    suggestions.push("Add more relevant technical tools, frameworks, and programming languages to your skills section.");
  }

  if (!sections.experience) {
    suggestions.push("Include any internships, freelance work, or open-source contributions in an Experience section.");
  }

  if (!sections.projects) {
    suggestions.push("Add 2–3 featured projects detailing the technologies used and what problems they solved.");
  }

  if (missingJobSkills.length > 0) {
    suggestions.push(
      `Consider highlighting experience with: ${missingJobSkills.slice(0, 4).join(", ")}.`
    );
  }

  if (!sections.certifications) {
    suggestions.push("Consider adding relevant industry certifications or online course credentials.");
  }

  return suggestions;
}

/*
|--------------------------------------------------------------------------
| MAIN CONTROLLER
|--------------------------------------------------------------------------
*/

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file.",
      });
    }

    const jobDescription = req.body.jobDescription || "";

    const resumeText = await extractResumeText(req.file);

    // Run extractions
    const detectedSkills = extractSkills(resumeText);
    const contact = extractContact(resumeText);
    const education = extractEducation(resumeText);
    const experience = extractExperience(resumeText);
    const projects = extractProjects(resumeText);

    const extracted = {
      contact,
      education,
      experience,
      projects,
    };

    // Calculate ATS Score & Breakdown
    const atsData = calculateATSScore(resumeText, detectedSkills, extracted);

    // Calculate Job Match
    const jobData = calculateJobMatch(
      resumeText,
      detectedSkills,
      jobDescription,
      atsData.atsScore
    );

    // Generate Strengths & Suggestions
    const strengths = generateStrengths(
      detectedSkills,
      atsData.sections,
      atsData.numberCount,
      jobData.matchedSkills
    );

    const suggestions = generateSuggestions(
      atsData.sections,
      detectedSkills,
      atsData.numberCount,
      jobData.missingJobSkills
    );

    const analysisResult = {
      fileName: req.file.originalname,
      atsScore: atsData.atsScore,
      jobMatchScore: jobData.jobMatchScore,
      detectedSkills,
      requiredSkills: jobData.requiredSkills,
      matchedSkills: jobData.matchedSkills,
      missingJobSkills: jobData.missingJobSkills,
      strengths,
      suggestions,
      breakdown: atsData.breakdown,
      sections: atsData.sections,
      education,
      experience,
      projects,
      contact,
      hasJobDescription: Boolean(jobDescription.trim()),
      uploadedAt: new Date().toISOString(),
    };

    // Keep latest in memory so GET /api/resume returns it immediately
    setLatestResume(analysisResult);

    // Persist in MongoDB
    try {
      await Resume.create({
        fileName: req.file.originalname,
        atsScore: atsData.atsScore,
        jobMatchScore: jobData.jobMatchScore,
        breakdown: atsData.breakdown,
        sections: atsData.sections,
        detectedSkills,
        education,
        experience,
        projects,
        contact,
        strengths,
        suggestions,
      });
    } catch (dbError) {
      console.warn("MongoDB Resume save warning:", dbError.message);
    }

    return res.json({
      success: true,
      message: "Resume analyzed successfully.",
      data: analysisResult,
    });
  } catch (error) {
    console.error("RESUME ANALYSIS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while analyzing the resume.",
    });
  }
};

module.exports = {
  analyzeResume,
  extractSkills,
  extractContact,
  extractEducation,
  extractExperience,
  extractProjects,
  detectSections,
  calculateATSScore,
};