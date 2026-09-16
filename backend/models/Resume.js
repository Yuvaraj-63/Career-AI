const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    jobMatchScore: {
      type: Number,
      default: null,
    },
    breakdown: {
      sections: { type: Number, default: 0 },
      technicalSkills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      contact: { type: Number, default: 0 },
    },
    sections: {
      type: Map,
      of: Boolean,
      default: {},
    },
    detectedSkills: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    contact: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    strengths: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
