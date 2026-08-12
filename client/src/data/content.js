/* All copy and content in one place so the site is easy to make your own. */

export const profile = {
  name: "Rana Muhammad Usman",
  role: "Full-Stack Engineer × Data Scientist",
  tagline: "I build production web systems and the models behind them.",
  email: "dev.ranausman@gmail.com",
  location: "Lahore, PK — working worldwide",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Kaggle", href: "https://kaggle.com/" },
    { label: "X / Twitter", href: "https://x.com/" },
  ],
};

export const stats = [
  { value: 6, suffix: "+", label: "Years shipping" },
  { value: 40, suffix: "+", label: "Projects delivered" },
  { value: 12, suffix: "", label: "ML models in production" },
  { value: 99.9, suffix: "%", label: "Avg. uptime maintained", decimals: 1 },
];

export const skills = {
  web: {
    title: "Web Engineering",
    note: "Interfaces, APIs, and the infrastructure that keeps them fast.",
    items: [
      { name: "React / Next.js", level: 95 },
      { name: "Node.js / Express", level: 92 },
      { name: "MongoDB / Mongoose", level: 90 },
      { name: "TypeScript", level: 88 },
      { name: "GSAP / WebGL / R3F", level: 85 },
      { name: "REST / GraphQL / WebSockets", level: 87 },
    ],
  },
  data: {
    title: "Data Science & ML",
    note: "From raw data to models that earn their keep in production.",
    items: [
      { name: "Python", level: 94 },
      { name: "Pandas / NumPy", level: 92 },
      { name: "scikit-learn", level: 90 },
      { name: "TensorFlow / PyTorch", level: 82 },
      { name: "SQL / Data Pipelines", level: 88 },
      { name: "Visualization (Matplotlib, D3)", level: 86 },
    ],
  },
};

export const projects = {
  web: [
    {
      id: "w1",
      title: "Meridian Commerce",
      kind: "MERN · Headless storefront",
      year: "2025",
      summary:
        "A headless e-commerce platform serving 120k monthly sessions. React storefront, Express API layer, MongoDB catalog with sub-40ms p95 queries.",
      detail:
        "Built the full stack: schema design with compound indexes, Redis-backed cart sessions, Stripe billing, and an admin dashboard with role-based access. Lighthouse performance 98 on the storefront after image pipeline and route-level code splitting.",
      tech: ["React", "Express", "MongoDB", "Redis", "Stripe"],
      tone: 0,
    },
    {
      id: "w2",
      title: "Atlas Realtime Board",
      kind: "MERN · Collaboration tool",
      year: "2024",
      summary:
        "A multiplayer kanban with live cursors and presence — WebSocket sync over Socket.IO with optimistic UI and conflict-free updates.",
      detail:
        "Designed an operation-log sync model so concurrent edits never clobber each other. Presence, typing indicators, and drag-and-drop all reconcile through a single event stream persisted to MongoDB change streams.",
      tech: ["React", "Socket.IO", "Node.js", "MongoDB"],
      tone: 1,
    },
    {
      id: "w3",
      title: "Ledgerline",
      kind: "MERN · Fintech dashboard",
      year: "2024",
      summary:
        "Invoice and cash-flow dashboard for freelancers: recurring billing, PDF generation, and bank-grade audit trails.",
      detail:
        "JWT auth with refresh rotation, server-side PDF rendering, and an append-only ledger collection for auditability. Deployed with zero-downtime rolling releases on a two-node cluster.",
      tech: ["React", "Express", "Mongoose", "JWT", "Puppeteer"],
      tone: 2,
    },
  ],
  data: [
    {
      id: "d1",
      title: "Churn Horizon",
      kind: "ML · Customer retention",
      year: "2025",
      summary:
        "Gradient-boosted churn model (scikit-learn) that lifted retention-campaign precision from 31% to 74% for a SaaS client.",
      detail:
        "Feature engineering over 18 months of event data with Pandas, class-imbalance handling via focal weighting, SHAP-based explanations surfaced to the CRM, and a FastAPI scoring service the MERN app calls in real time.",
      tech: ["Python", "scikit-learn", "Pandas", "SHAP", "FastAPI"],
      tone: 3,
    },
    {
      id: "d2",
      title: "Freightcast",
      kind: "ML · Demand forecasting",
      year: "2024",
      summary:
        "Time-series forecasting for a logistics fleet — 22% reduction in idle vehicle hours across three cities.",
      detail:
        "NumPy-vectorized feature windows, ensembled gradient boosting with seasonal decomposition, backtested on 3 years of dispatch logs. Forecasts feed a Node.js scheduling service through a nightly batch pipeline.",
      tech: ["Python", "NumPy", "Pandas", "XGBoost"],
      tone: 4,
    },
    {
      id: "d3",
      title: "Signal & Noise",
      kind: "NLP · Review intelligence",
      year: "2023",
      summary:
        "NLP pipeline that clusters 2M+ product reviews into actionable themes, with sentiment drift tracking per release.",
      detail:
        "TF-IDF and embedding-based clustering, topic labeling with a lightweight classifier, and a React dashboard for the insights team. Cut manual review triage from days to under an hour.",
      tech: ["Python", "scikit-learn", "spaCy", "React"],
      tone: 5,
    },
  ],
};

export const timeline = [
  {
    period: "2024 — Present",
    role: "Senior Full-Stack & ML Engineer",
    org: "Independent / Consulting",
    text: "End-to-end delivery for product teams: MERN platforms with embedded ML services — forecasting, scoring, and search.",
  },
  {
    period: "2022 — 2024",
    role: "Data Scientist",
    org: "Northline Analytics",
    text: "Owned churn, demand, and pricing models from notebook to production. Built the internal feature store and model-monitoring stack.",
  },
  {
    period: "2020 — 2022",
    role: "Full-Stack Developer",
    org: "Studio Meridian",
    text: "Shipped client platforms on the MERN stack — e-commerce, dashboards, and realtime tools — with a focus on performance budgets.",
  },
  {
    period: "2019",
    role: "B.Sc. Computer Science",
    org: "Graduated with distinction",
    text: "Thesis on applied machine learning for time-series problems. Fell for the overlap of interfaces and inference; never looked back.",
  },
];
