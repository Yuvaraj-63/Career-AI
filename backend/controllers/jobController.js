const fs = require("fs");
const path = require("path");

// Adzuna Live Recruitment API
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || "";
const ADZUNA_APP_KEY =
  process.env.ADZUNA_APP_KEY || "0d1db3096c41493f11dfa0f0fc95d46f";
const ADZUNA_COUNTRY = process.env.ADZUNA_COUNTRY || "in";

// Secondary / Fallback Provider
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

    isClosed: Boolean(job.isClosed),

    saved:
      savedJobs.has(String(id)),
  };
}

// ==========================================================
// CHECK IF JOB APPLICATION REGISTRATION IS OPEN
// ==========================================================

function isJobOpen(job) {
  if (!job) return false;

  // 1. Explicit closed or expired status
  if (
    job.isClosed === true ||
    job.status === "closed" ||
    job.status === "expired"
  ) {
    return false;
  }

  // 2. Application deadline check
  if (job.deadline) {
    const deadlineDate = new Date(job.deadline);
    if (
      !isNaN(deadlineDate.getTime()) &&
      deadlineDate.getTime() < Date.now()
    ) {
      // Application deadline has passed; remove job
      return false;
    }
  }

  return true;
}

// ==========================================================
// FILTER REAL & OPEN JOBS ONLY
// ==========================================================

function filterRealJobs(jobs) {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs
    .map(normalizeJob)
    .filter((job) => {
      /*
       * HARD RULES:
       * 1. Valid ID, title, company
       * 2. Valid HTTP/HTTPS application URL
       * 3. Application registration must be OPEN (closed/expired jobs removed)
       */
      return (
        Boolean(job.id) &&
        Boolean(job.title) &&
        Boolean(job.company) &&
        Boolean(job.applicationUrl) &&
        isJobOpen(job)
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
// FETCH LIVE JOBS FROM ADZUNA RECRUITMENT API
// ==========================================================

async function fetchJobsFromAdzuna(page = 1) {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    throw new Error(
      "Adzuna credentials not fully configured. Set ADZUNA_APP_ID and ADZUNA_APP_KEY in .env"
    );
  }

  const endpoint = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=50&content-type=application/json`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = `Adzuna API returned HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.display || parsed.exception) {
        message = `Adzuna: ${parsed.display || parsed.exception}`;
      }
    } catch {
      // ignore
    }
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const results = Array.isArray(data?.results) ? data.results : [];

  if (results.length === 0) {
    const err = new Error("Adzuna returned no active jobs.");
    err.status = 204;
    throw err;
  }

  return results.map((item) => {
    let salary = "";
    if (item.salary_min && item.salary_max) {
      salary = `₹${Math.round(item.salary_min).toLocaleString("en-IN")} - ₹${Math.round(item.salary_max).toLocaleString("en-IN")}`;
    } else if (item.salary_min) {
      salary = `₹${Math.round(item.salary_min).toLocaleString("en-IN")}+`;
    } else if (item.salary_max) {
      salary = `Up to ₹${Math.round(item.salary_max).toLocaleString("en-IN")}`;
    }

    const locationName =
      item.location?.display_name ||
      (Array.isArray(item.location?.area)
        ? item.location.area.slice(0, 3).reverse().join(", ")
        : "India");

    return {
      id: String(item.id),
      title: item.title,
      company: item.company?.display_name || "Company",
      location: locationName,
      type:
        item.contract_time === "part_time"
          ? "Part-time"
          : item.contract_time === "contract"
          ? "Contract"
          : "Full-time",
      experience:
        item.contract_type === "permanent"
          ? "Permanent / Experienced"
          : "Full-time / Fresher / Experienced",
      salary,
      description: item.description,
      applicationUrl: item.redirect_url,
      applyLink: item.redirect_url,
      postedDate: item.created,
      deadline: null,
      isClosed: false,
      source: "Adzuna (Live Recruitment)",
    };
  });
}

// ==========================================================
// FETCH LIVE JOBS FROM PROVIDER (ADZUNA / FALLBACK)
// ==========================================================

async function fetchJobsFromProvider() {
  // 1. Try Adzuna Live Jobs first (preferred live provider)
  if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
    try {
      console.log("Fetching live real-time jobs from Adzuna API...");
      const adzunaJobs = await fetchJobsFromAdzuna(1);
      const realJobs = filterRealJobs(adzunaJobs);

      if (realJobs.length > 0) {
        console.log(
          `Adzuna returned ${adzunaJobs.length} live jobs (${realJobs.length} open and verified).`
        );
        return realJobs;
      }
    } catch (adzunaError) {
      console.warn(
        "Adzuna fetch failed, falling back to secondary provider:",
        adzunaError.message
      );
    }
  } else if (ADZUNA_APP_KEY && !ADZUNA_APP_ID) {
    console.warn(
      "Adzuna: ADZUNA_APP_KEY is set, but ADZUNA_APP_ID is missing. Waiting for Application ID to stream from Adzuna."
    );
  }

  // 2. Fallback provider (IndianAPI)
  if (API_KEY) {
    try {
      console.log("Fetching from fallback provider (IndianAPI)...");
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const rawText = await response.text();
        let data = null;
        try {
          data = JSON.parse(rawText);
        } catch {
          data = null;
        }

        const rawJobs = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
          ? data.jobs
          : [];

        const realJobs = filterRealJobs(rawJobs);

        if (realJobs.length > 0) {
          console.log(
            `Fallback provider returned ${rawJobs.length} jobs (${realJobs.length} open and verified).`
          );
          return realJobs;
        }
      }
    } catch (fallbackError) {
      console.warn("Fallback provider error:", fallbackError.message);
    }
  }

  throw new Error(
    "No live jobs provider could be reached. Please check ADZUNA_APP_ID and ADZUNA_APP_KEY."
  );
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
// CLOSE JOB REGISTRATION & REMOVE FROM MODULE
// ==========================================================

const closeJobApplication = (req, res) => {
  const requestedId = String(req.params.id);

  // Filter out the closed job from in-memory cache
  const initialCount = jobsCache.length;
  jobsCache = jobsCache.filter(
    (job) => String(job.id) !== requestedId
  );

  // Write updated cache to disk
  writeDiskCache(jobsCache);

  console.log(
    `Job ${requestedId} registration closed. Removed from job module (cache count: ${jobsCache.length}).`
  );

  return res.json({
    success: true,
    message: `Job ${requestedId} registration is now closed and removed from active listings.`,
    data: {
      jobId: requestedId,
      removed: initialCount > jobsCache.length,
      remainingCount: jobsCache.length,
    },
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
  closeJobApplication,
};