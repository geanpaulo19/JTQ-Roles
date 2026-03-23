/**
 * ============================================================
 *  JTQ GLOBAL — JOBS DATA FILE
 *  This is the only file you need to edit to manage listings.
 *
 *  HOW TO ADD A ROLE:
 *  1. Copy one of the objects below
 *  2. Paste it inside the JOBS array
 *  3. Fill in the fields and set active: true
 *  4. Push to GitHub — the site updates automatically
 *
 *  HOW TO CLOSE A ROLE:
 *  Set  active: false  — it disappears from the board
 *
 *  VALID VALUES
 *  ─────────────────────────────────────────────────
 *  department:     "Customer Support" | "Sales & Marketing" | "Tech"
 *                  "Operations" | "Finance" | "HR" | "Other"
 *
 *  workSetup:      "Remote" | "On-site" | "Hybrid"
 *
 *  employmentType: "Full-time" | "Part-time" | "Contract" | "Project-based"
 *
 *  postedDate:     "YYYY-MM-DD"
 * ============================================================
 */

const JOBS = [

  {
    id: "cs-001",
    active: true,
    title: "Customer Support Specialist",
    department: "Customer Support",
    location: "BGC, Taguig City",
    workSetup: "Remote",
    employmentType: "Full-time",
    postedDate: "2026-03-10",
    shortDescription: "Be the frontline voice for our global clients, delivering world-class support via chat, email, and phone.",
    responsibilities: [
      "Handle inbound customer inquiries via chat, email, and phone",
      "Resolve issues within SLA guidelines with empathy and accuracy",
      "Escalate complex concerns to the relevant teams",
      "Maintain accurate records in the CRM system",
      "Contribute to the knowledge base and FAQ documentation",
    ],
    qualifications: [
      "1–2 years of customer service experience (BPO preferred)",
      "Excellent written and verbal English communication",
      "Strong problem-solving and multitasking skills",
      "Comfortable working on shifting schedules including weekends",
    ],
    niceToHave: [
      "Experience with Zendesk, Freshdesk, or similar platforms",
      "Background in e-commerce or SaaS support",
    ],
    applyEmail: "joyce@jtqglobal.com",
  },

  {
    id: "sm-001",
    active: true,
    title: "Sales Development Representative",
    department: "Sales & Marketing",
    location: "Remote — Philippines",
    workSetup: "Remote",
    employmentType: "Full-time",
    postedDate: "2026-03-12",
    shortDescription: "Drive pipeline growth by identifying and qualifying new business opportunities for our international clients.",
    responsibilities: [
      "Prospect and qualify outbound leads via email, LinkedIn, and cold calling",
      "Set and confirm discovery calls for Account Executives",
      "Maintain accurate pipeline records in CRM",
      "Meet and exceed weekly and monthly activity KPIs",
      "Collaborate with the marketing team on outreach campaigns",
    ],
    qualifications: [
      "1+ year in an SDR, BDR, or outbound sales role",
      "Strong English communication — confident on the phone",
      "Goal-oriented with a track record of hitting targets",
      "Familiarity with CRM tools such as HubSpot or Salesforce",
    ],
    niceToHave: [
      "Experience selling to US or UAE markets",
      "Knowledge of appointment-setting techniques",
    ],
    applyEmail: "joyce@jtqglobal.com",
  },

  {
    id: "sm-002",
    active: true,
    title: "Social Media Manager",
    department: "Sales & Marketing",
    location: "Remote — Philippines",
    workSetup: "Remote",
    employmentType: "Full-time",
    postedDate: "2026-03-18",
    shortDescription: "Own and grow our clients' social media presence with consistent, on-brand content across all major platforms.",
    responsibilities: [
      "Create and schedule content across Instagram, Facebook, LinkedIn, and TikTok",
      "Develop monthly content calendars aligned with client goals",
      "Monitor engagement and respond to comments and messages",
      "Report on performance metrics weekly and suggest optimisations",
      "Collaborate with the design team on visual assets",
    ],
    qualifications: [
      "2+ years managing social media for a brand or agency",
      "Strong writing skills and an eye for visual content",
      "Proficiency with scheduling tools (Buffer, Later, Hootsuite, etc.)",
      "Familiarity with Meta Business Suite and LinkedIn analytics",
    ],
    niceToHave: [
      "Basic video editing skills for Reels and TikTok",
      "Experience with Canva or Adobe Creative Suite",
    ],
    applyEmail: "joyce@jtqglobal.com",
  },

  {
    id: "ops-001",
    active: true,
    title: "Virtual Assistant",
    department: "Operations",
    location: "Remote — Philippines",
    workSetup: "Remote",
    employmentType: "Part-time",
    postedDate: "2026-03-20",
    shortDescription: "Provide reliable administrative and operational support to business owners and executives across a variety of day-to-day tasks.",
    responsibilities: [
      "Manage calendars, appointments, and inbox organisation",
      "Research, data entry, and report preparation",
      "Coordinate travel arrangements and logistics",
      "Handle client communication and follow-ups as directed",
      "Assist with ad-hoc admin tasks as they arise",
    ],
    qualifications: [
      "Proven experience as a VA or in an administrative support role",
      "Excellent English communication — written and verbal",
      "Highly organised, proactive, and detail-oriented",
      "Comfortable with Google Workspace and Microsoft 365",
    ],
    niceToHave: [
      "Experience supporting executives in the US, UK, or UAE",
      "Familiarity with project management tools like Asana or Notion",
    ],
    applyEmail: "joyce@jtqglobal.com",
  },

];
