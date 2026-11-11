// Professional details aligned with latest user résumé, November 2026.
export const portfolio = {
  name: "Lycos Blanza",
  resume: "/blanza-lycos-resume.pdf",
  cv: "/blanza-lycos-cv.pdf",
  email: "blanzalycos@gmail.com",
  phone: "0995 678 3687",
  phoneHref: "tel:+639956783687",
  location: "Lipa City, Batangas",
  github: "https://github.com/lycos-dev",
  linkedin: "https://www.linkedin.com/in/lycos-blanza-969305368",
  instagram: "https://www.instagram.com/_u/lcs.blnza",
  facebook: "https://www.facebook.com/LycosLB/",
  hero: { image: "/lycos-portrait.png", mask: "/lycos-portrait-cutout.png" },
};
export const projects = [
  {
    id: "safeseat", number: "01", title: "SafeSeat", category: "Embedded Systems / Undergraduate Thesis",
    description: "An add-on passenger safety system for five-seater vehicles, combining mmWave, pressure, temperature and motion sensors with event-based computer vision.",
    focus: "Sensor fusion, anomaly detection, and consent-driven system design.",
    technologies: ["ESP32", "C++", "Python", "Computer Vision", "IoT"],
    details: ["Coordinated a four-person team through milestones, sensor integration and testing.", "Adapts emergency logic to driver status, passenger presence, and user-defined escalation settings.", "Uses session-scoped data and granular consent, with camera-based verification triggered only when necessary."],
    image: "/projects/safeseat-showcase.jpg",
    imageAlt: "SafeSeat vehicle occupant monitoring project with seat sensor illustration and system architecture overview",
    imageCaption: "Sensor integration / Thesis project",
    url: "https://github.com/lycos-dev/SafeSeat",
  },
  {
    id: "docvia", number: "02", title: "DocVia", category: "Web Application / Learning",
    description: "A React learning application that turns uploaded PDFs into structured lessons and learning pathways, with contextual AI tutor interactions and quizzes.",
    focus: "Document-based learning and a clear, reusable React interface.",
    technologies: ["React", "TypeScript", "Vite"],
    details: ["The project organizes uploaded PDFs into a learning roadmap and segmented lessons.", "An AI tutor and generated microtasks support questions and active recall around learning materials.", "The linked frontend repository contains the React application foundation, authentication screens, and shared UI components."],
    image: "/projects/docvia-showcase.jpg",
    imageAlt: "Illustrative preview of the DocVia document learning workspace with lesson roadmap and AI study assistant",
    imageCaption: "Illustrative web application preview",
    url: "https://github.com/Waldric/docvia-frontend",
  },
  {
    id: "fitness", number: "03", title: "NEXA", category: "Mobile Application / Fitness",
    description: "A React Native fitness tracker for planning workout routines, logging sessions and reviewing training history, with local persistence via AsyncStorage.",
    focus: "Reusable mobile components, typed navigation, and local persistence.",
    technologies: ["React Native", "Expo", "TypeScript", "AsyncStorage"],
    details: ["Supports exercise-library management, routine creation, and workout logging.", "Persists workouts, routines, and preferences locally with AsyncStorage.", "Uses reusable interface components and typed navigation across exercise, workout, and profile screens."],
    image: "/projects/nexa-showcase.jpg",
    imageAlt: "Illustrative NEXA mobile fitness interface with a workout dashboard and exercise library",
    imageCaption: "Illustrative mobile application preview",
    url: "https://github.com/lycos-dev/final-project-group4",
  },
];
export type Project = typeof projects[number];
export const skillGroups = [
  { title: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C++"] },
  { title: "Web & Mobile", items: ["React", "React Native", "Expo", "HTML & CSS"] },
  { title: "Backend & Data", items: ["Node.js / Express", "PostgreSQL", "Prisma", "Supabase", "MySQL"] },
  { title: "Intelligent Systems", items: ["ESP32", "IoT", "Computer Vision", "Machine Learning"] },
  { title: "Analytics", items: ["Pandas", "R", "tidyverse"] },
  { title: "Development Tools", items: ["Git", "VS Code", "Linux / CLI"] },
];
