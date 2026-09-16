const fs = require("fs");
const path = require("path");

const API_URL =
  process.env.JOBS_API_URL || "https://jobs.indianapi.in/jobs";

const API_KEY = process.env.JOBS_API_KEY || "";

const CACHE_TTL_MS = 5 * 60 * 1000;

const CACHE_FILE = path.join(
  __dirname,
  "../data/jobs-cache.json"
);

let jobsCache = [];
let cacheUpdatedAt = 0;

const savedJobs = new Set();

// ==========================================================
// COMMON SKILLS
// ==========================================================

const COMMON_SKILLS = [
  "java",
  "python",
  "javascript",
  "typescript",
  "react",
  "react.js",
  "node.js",
  "node",
  "express",
  "express.js",
  "spring boot",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "firebase",
  "html",
  "html5",
  "css",
  "css3",
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
  "tensorflow",
  "pandas",
  "numpy",
  "data structures",
  "algorithms",
  "figma",
  "kubernetes",
  "next.js",
  "oracle",
  "selenium",
  "power bi",
  "excel",
  "linux",
  "kafka",
  "redis",
];

// ==========================================================
// HELPERS
// ==========================================================

function normalizeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8211;/gi, "-")
    .replace(/&#8212;/gi, "-")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// ==========================================================
// APPLICATION LINK VALIDATION
// ==========================================================

function getApplicationUrl(job) {
  const rawUrl =
    job?.applicationUrl ||
    job?.applyLink ||
    job?.apply_link ||
    job?.applyUrl ||
    job?.apply_url ||
    "";

  const url = String(rawUrl).trim();

  if (!url) {
    return "";
  }

  try {
    const normalizedUrl =
      url.startsWith("http://") ||
      url.startsWith("https://")
        ? url
        : `https://${url}`;

    const parsed = new URL(normalizedUrl);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return "";
    }

    return parsed.toString();
  } catch {
    return "";
  }
}

function hasValidApplicationUrl(job) {
  return Boolean(getApplicationUrl(job));
}

// ==========================================================
// SKILL DETECTION
// ==========================================================

function containsSkill(text, skill) {
  const normalized = String(text || "").toLowerCase();

  const target = skill.toLowerCase();

  if (target.length <= 2) {
    const escaped = target.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    return new RegExp(
      `(^|[^a-z0-9+#])${escaped}(?=$|[^a-z0-9+#])`,
      "i"
    ).test(normalized);
  }

  return normalized.includes(target);
}

function extractSkills(job) {
  const providerSkills = Array.isArray(job.skills)
    ? job.skills
        .map(normalizeText)
        .filter(Boolean)
    : [];

  const combinedText = [
    job.title,
    job.company,
    job.description,
    job.job_description,
    job.responsibilities,
    job.role_and_responsibility,
    job.educationAndSkills,
    job.education_and_skills,
  ]
    .map(normalizeText)
    .join(" ");

  const detectedSkills = COMMON_SKILLS.filter(
    (skill) => containsSkill(combinedText, skill)
  );

  return [
    ...new Set(
      [
        ...providerSkills,
        ...detectedSkills,
      ]
        .map(normalizeText)
        .filter(Boolean)
    ),
  ];
}

// ==========================================================
// NORMALIZE JOB
// ==========================================================

function normalizeJob(job) {
  const skills = extractSkills(job);

  const applicationUrl =
    getApplicationUrl(job);

  const id =
    job.id ||
    job._id ||
    job.jobId;

  return {
    ...job,

    id:
      id != null
        ? String(id)
        : undefined,

    title: normalizeText(
      job.title ||
        job.job_title ||
        job.role ||
        "Untitled Position"
    ),

    company: normalizeText(
      job.company ||
        job.companyName ||
        "Company"
    ),

    location: normalizeText(
      job.location ||
        job.city ||
        "Location not specified"
    ),

    type: normalizeText(
      job.type ||
        job.job_type ||
        job.jobType ||
        "Full-time"
    ),

    experience: normalizeText(
      job.experience ||
        job.experienceLevel ||
        "Not specified"
    ),

    salary: normalizeText(
      job.salary ||
        job.salaryRange ||
        ""
    ),

    description: normalizeText(
      job.description ||
        job.job_description ||
        "No description available."
    ),

    responsibilities: normalizeText(
      job.responsibilities ||
        job.role_and_responsibility ||
        ""
    ),

    educationAndSkills: normalizeText(
      job.educationAndSkills ||
        job.education_and_skills ||
        ""
    ),

    aboutCompany: normalizeText(
      job.aboutCompany ||
        job.about_company ||
        ""
    ),

    /*
     * IMPORTANT:
     *
     * Only a valid HTTP/HTTPS application
     * URL is exposed to the frontend.
     */
    applicationUrl,

    applyLink: applicationUrl,

    postedDate:
      job.postedDate ||
      job.posted_date ||
      "",

    /*
     * IndianAPI does not document a real
     * application deadline field.
     *
     * Do not fabricate one.
     */
    deadline:
      job.deadline || null,

    skills,

    source:
      job.source ||
      "IndianAPI Jobs",

    saved:
      savedJobs.has(String(id)),
  };
}

// ==========================================================
// FILTER REAL JOBS ONLY
// ==========================================================

function filterRealJobs(jobs) {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs
    .map(normalizeJob)
    .filter((job) => {
      /*
       * HARD RULE:
       *
       * A job without a valid real application
       * URL must NEVER reach the frontend.
       */
      return (
        Boolean(job.id) &&
        Boolean(job.title) &&
        Boolean(job.company) &&
        Boolean(job.applicationUrl)
      );
    });
}

// ==========================================================
// CACHE DIRECTORY
// ==========================================================

function ensureCacheDirectory() {
  const directory =
    path.dirname(CACHE_FILE);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {
      recursive: true,
    });
  }
}

// ==========================================================
// WRITE REAL JOB CACHE
// ==========================================================

function writeDiskCache(jobs) {
  try {
    ensureCacheDirectory();

    const realJobs =
      filterRealJobs(jobs);

    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify(
        realJobs,
        null,
        2
      ),
      "utf-8"
    );

    console.log(
      `Saved ${realJobs.length} real jobs to disk cache.`
    );
  } catch (error) {
    console.error(
      "Unable to write jobs cache:",
      error.message
    );
  }
}

// ==========================================================
// READ REAL JOB CACHE
// ==========================================================

function readDiskCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return [];
    }

    const content =
      fs.readFileSync(
        CACHE_FILE,
        "utf-8"
      );

    if (!content.trim()) {
      return [];
    }

    const parsed =
      JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [];
    }

    /*
     * Even if an old cache contains
     * demo/broken jobs, remove them.
     */
    return filterRealJobs(parsed);
  } catch (error) {
    console.error(
      "Unable to read jobs cache:",
      error.message
    );

    return [];
  }
}

// ==========================================================
// GET CACHED REAL JOBS
// ==========================================================

function getCachedJobs() {
  if (jobsCache.length > 0) {
    return jobsCache;
  }

  const diskJobs =
    readDiskCache();

  if (diskJobs.length > 0) {
    jobsCache =
      diskJobs.map(normalizeJob);

    cacheUpdatedAt =
      Date.now();

    console.log(
      `Loaded ${jobsCache.length} real jobs from disk cache.`
    );
  }

  return jobsCache;
}

// ==========================================================
// SET CACHE
// ==========================================================

function setCache(jobs) {
  const realJobs =
    filterRealJobs(jobs);

  /*
   * Never cache jobs without
   * a working-looking application URL.
   */
  if (realJobs.length === 0) {
    console.warn(
      "IndianAPI returned no jobs with valid application links. Cache was not updated."
    );

    return false;
  }

  jobsCache =
    realJobs.map(normalizeJob);

  cacheUpdatedAt =
    Date.now();

  writeDiskCache(
    jobsCache
  );

  return true;
}

// ==========================================================
// FILTER + SORT + LIMIT
// ==========================================================

function filterAndLimitJobs(
  jobs,
  req
) {
  const search =
    String(
      req.query.search || ""
    )
      .trim()
      .toLowerCase();

  const location =
    String(
      req.query.location || ""
    )
      .trim()
      .toLowerCase();

  const jobType =
    String(
      req.query.jobType || ""
    )
      .trim()
      .toLowerCase();

  const experience =
    String(
      req.query.experience || ""
    )
      .trim()
      .toLowerCase();

  /*
   * Safety filter again.
   *
   * This guarantees that even cached
   * data cannot expose a job without
   * an application link.
   */
  let result =
    filterRealJobs(jobs).filter(
      (job) => {
        const searchableText = [
          job.title,
          job.company,
          job.location,
          job.description,
          job.aboutCompany,
          job.responsibilities,
          job.educationAndSkills,
          ...(Array.isArray(job.skills)
            ? job.skills
            : []),
        ]
          .join(" ")
          .toLowerCase();

        if (
          search &&
          !searchableText.includes(search)
        ) {
          return false;
        }

        if (
          location &&
          !job.location
            .toLowerCase()
            .includes(location)
        ) {
          return false;
        }

        if (
          jobType &&
          !job.type
            .toLowerCase()
            .includes(jobType)
        ) {
          return false;
        }

        if (
          experience &&
          !job.experience
            .toLowerCase()
            .includes(experience)
        ) {
          return false;
        }

        return true;
      }
    );

  const sort =
    String(
      req.query.sort || "newest"
    ).toLowerCase();

  if (sort === "oldest") {
    result.sort(
      (a, b) =>
        new Date(
          a.postedDate || 0
        ) -
        new Date(
          b.postedDate || 0
        )
    );
  } else {
    result.sort(
      (a, b) =>
        new Date(
          b.postedDate || 0
        ) -
        new Date(
          a.postedDate || 0
        )
    );
  }

  const requestedLimit =
    Number(req.query.limit);

  const limit =
    Number.isFinite(
      requestedLimit
    ) &&
    requestedLimit > 0
      ? Math.min(
          Math.floor(
            requestedLimit
          ),
          100
        )
      : 50;

  return result.slice(
    0,
    limit
  );
}

// ==========================================================
// FETCH LIVE JOBS FROM INDIANAPI
// ==========================================================

async function fetchJobsFromProvider() {
  if (!API_KEY) {
    const error =
      new Error(
        "JOBS_API_KEY is not configured."
      );

    error.status = 500;

    throw error;
  }

  const response =
    await fetch(
      API_URL,
      {
        method: "GET",

        headers: {
          "X-Api-Key":
            API_KEY,

          Accept:
            "application/json",
        },
      }
    );

  const rawText =
    await response.text();

  let data;

  try {
    data =
      rawText
        ? JSON.parse(rawText)
        : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error =
      new Error(
        data?.message ||
          data?.error ||
          `Jobs provider returned HTTP ${response.status}`
      );

    error.status =
      response.status;

    throw error;
  }

  const jobs =
    Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : Array.isArray(data?.jobs)
          ? data.jobs
          : [];

  if (jobs.length === 0) {
    const error =
      new Error(
        "IndianAPI returned no jobs."
      );

    error.status = 204;

    throw error;
  }

  /*
   * Filter immediately after receiving
   * the provider response.
   */
  const realJobs =
    filterRealJobs(jobs);

  console.log(
    `IndianAPI returned ${jobs.length} jobs. ${realJobs.length} have valid application links.`
  );

  if (realJobs.length === 0) {
    const error =
      new Error(
        "IndianAPI returned jobs, but none had a valid application link."
      );

    error.status = 422;

    throw error;
  }

  return realJobs;
}

// ==========================================================
// GET JOBS
// ==========================================================

const getJobs =
  async (
    req,
    res,
    next
  ) => {
    try {
      const cacheAge =
        Date.now() -
        cacheUpdatedAt;

      /*
       * ----------------------------------------------------
       * 1. FRESH IN-MEMORY REAL CACHE
       * ----------------------------------------------------
       */

      if (
        jobsCache.length > 0 &&
        cacheAge <
          CACHE_TTL_MS
      ) {
        const result =
          filterAndLimitJobs(
            jobsCache,
            req
          );

        return res.json({
          success: true,

          source:
            "live-cache",

          count:
            result.length,

          data:
            result,
        });
      }

      /*
       * ----------------------------------------------------
       * 2. ALWAYS TRY INDIANAPI FIRST
       * ----------------------------------------------------
       */

      try {
        const liveJobs =
          await fetchJobsFromProvider();

        const cacheSaved =
          setCache(
            liveJobs
          );

        if (!cacheSaved) {
          return res.status(503).json({
            success: false,
            message:
              "No real jobs with valid application links are currently available.",
            data: [],
          });
        }

        const result =
          filterAndLimitJobs(
            jobsCache,
            req
          );

        return res.json({
          success: true,

          source:
            "live",

          count:
            result.length,

          data:
            result,
        });
      } catch (
        providerError
      ) {
        console.warn(
          `Live jobs unavailable (${providerError.status || "error"}):`,
          providerError.message
        );

        /*
         * ------------------------------------------------
         * 3. PROVIDER DOWN / RATE LIMITED
         *
         * Use ONLY previously fetched REAL jobs.
         * NEVER use demo jobs.
         * ------------------------------------------------
         */

        const cachedJobs =
          getCachedJobs();

        if (
          cachedJobs.length > 0
        ) {
          const result =
            filterAndLimitJobs(
              cachedJobs,
              req
            );

          return res.json({
            success: true,

            source:
              "cached-live",

            warning:
              providerError.status ===
              429
                ? "IndianAPI is temporarily rate-limited. Showing previously fetched real jobs."
                : "IndianAPI is temporarily unavailable. Showing previously fetched real jobs.",

            count:
              result.length,

            data:
              result,
          });
        }

        /*
         * ------------------------------------------------
         * 4. NO LIVE JOBS + NO REAL CACHE
         *
         * DO NOT SHOW DEMO DATA.
         * ------------------------------------------------
         */

        return res.status(503).json({
          success: false,

          source:
            "unavailable",

          message:
            providerError.status ===
            429
              ? "Live job provider is temporarily rate-limited and no previously fetched real jobs are available."
              : "Live job provider is temporarily unavailable and no previously fetched real jobs are available.",

          count: 0,

          data: [],
        });
      }
    } catch (error) {
      next(error);
    }
  };

// ==========================================================
// GET SINGLE JOB
// ==========================================================

const getJobById =
  async (
    req,
    res,
    next
  ) => {
    try {
      const requestedId =
        String(
          req.params.id
        );

      /*
       * First check real cached jobs.
       */
      let jobs =
        getCachedJobs();

      let found =
        jobs.find(
          (job) =>
            String(
              job.id
            ) === requestedId
        );

      if (found) {
        return res.json({
          success: true,

          source:
            "cache",

          data:
            normalizeJob(
              found
            ),
        });
      }

      /*
       * If not found, try live IndianAPI.
       */
      try {
        const liveJobs =
          await fetchJobsFromProvider();

        setCache(
          liveJobs
        );

        jobs =
          jobsCache;

        found =
          jobs.find(
            (job) =>
              String(
                job.id
              ) === requestedId
          );
      } catch (
        providerError
      ) {
        console.warn(
          "Unable to refresh jobs for ID lookup:",
          providerError.message
        );
      }

      /*
       * Never return a demo job.
       */
      if (
        !found ||
        !hasValidApplicationUrl(
          found
        )
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Real job not found or application link is unavailable.",
        });
      }

      return res.json({
        success: true,

        source:
          "live-cache",

        data:
          normalizeJob(
            found
          ),
      });
    } catch (error) {
      next(error);
    }
  };

// ==========================================================
// TOGGLE SAVE
// ==========================================================

const toggleSaveJob =
  (
    req,
    res
  ) => {
    const requestedId =
      String(
        req.params.id
      );

    /*
     * Only allow saving a real job.
     */
    const jobs =
      getCachedJobs();

    const job =
      jobs.find(
        (item) =>
          String(
            item.id
          ) === requestedId
      );

    if (
      !job ||
      !hasValidApplicationUrl(
        job
      )
    ) {
      return res.status(404).json({
        success: false,

        message:
          "Real job not found.",
      });
    }

    if (
      savedJobs.has(
        requestedId
      )
    ) {
      savedJobs.delete(
        requestedId
      );
    } else {
      savedJobs.add(
        requestedId
      );
    }

    return res.json({
      success: true,

      data: {
        jobId:
          requestedId,

        saved:
          savedJobs.has(
            requestedId
          ),
      },
    });
  };

// ==========================================================
// GET SAVED JOBS
// ==========================================================

const getSavedJobs =
  (
    req,
    res
  ) => {
    const jobs =
      getCachedJobs();

    const result =
      jobs
        .filter(
          (job) =>
            savedJobs.has(
              String(
                job.id
              )
            ) &&
            hasValidApplicationUrl(
              job
            )
        )
        .map(
          normalizeJob
        );

    return res.json({
      success: true,

      count:
        result.length,

      data:
        result,
    });
  };

// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {
  getJobs,
  getJobById,
  toggleSaveJob,
  getSavedJobs,
};