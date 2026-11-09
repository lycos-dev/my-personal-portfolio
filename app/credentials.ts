export type CredentialCategory = "Courses" | "Seminars & Events" | "Recognition";

export type Credential = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: CredentialCategory;
  description: string;
  image: string;
  pdf: string;
  verification?: string;
  eventImage?: string;
  eventSource?: string;
};

// Every preview is rendered directly from the first page of the user's original PDF.
// Only the DataCamp entries have external, issuer-hosted verification URLs.
export const credentials: Credential[] = [
  {
    id: "pytorch", title: "Deep Learning for Text with PyTorch", issuer: "DataCamp", date: "October 11, 2026", category: "Courses",
    description: "Completed a 4-hour course focused on deep learning approaches for text with PyTorch.",
    image: "/credentials/images/pytorch.webp", pdf: "/credentials/pdf/pytorch.pdf",
    verification: "https://www.datacamp.com/completed/statement-of-accomplishment/course/91ee1ca2f0db3eaac9449b28cbeda9c78ff0473e",
  },
  {
    id: "honor", title: "Second Honor Awardee", issuer: "De La Salle Lipa", date: "First Semester · AY 2025–2026", category: "Recognition",
    description: "Academic recognition for achieving a GPA of 3.6389 during the first semester of AY 2025–2026.",
    image: "/credentials/images/honor.webp", pdf: "/credentials/pdf/honor.pdf",
  },
  {
    id: "calabarzon", title: "CaLaBaRZon Young Innovators’ Challenge", issuer: "De La Salle Lipa", date: "April 14, 2026", category: "Seminars & Events",
    description: "Participated in the regional Young Innovators’ Challenge, working on a practical, community-focused idea.",
    image: "/credentials/images/calabarzon.webp", pdf: "/credentials/pdf/calabarzon.pdf",
    eventImage: "https://www.dlsl.edu.ph/storage/ckeditor-images/nVMfZXHayYWTkhKv9SVL674M1j85Tz48EgZh48pC.jpg",
    eventSource: "https://www.dlsl.edu.ph/news-and-articles/view/36-schools-one-stage-calabarzon-innovators-battle-at-dlsl",
  },
  {
    id: "ethical", title: "Bridging Ethical Hacking and Data Analytics", issuer: "De La Salle Lipa", date: "January 13, 2026", category: "Seminars & Events",
    description: "Attended a seminar on building smarter and safer systems through security and data analytics.",
    image: "/credentials/images/ethical.webp", pdf: "/credentials/pdf/ethical.pdf",
  },
  {
    id: "research", title: "Innovative Research Horizons", issuer: "DLSL student organizations", date: "February 3, 2026", category: "Seminars & Events",
    description: "Participated in an academic seminar exploring innovative research and its applications.",
    image: "/credentials/images/research.webp", pdf: "/credentials/pdf/research.pdf",
  },
  {
    id: "python", title: "Introduction to Python", issuer: "DataCamp", date: "February 11, 2026", category: "Courses",
    description: "Completed a 4-hour foundational course in Python programming.",
    image: "/credentials/images/python.webp", pdf: "/credentials/pdf/python.pdf",
    verification: "https://www.datacamp.com/completed/statement-of-accomplishment/course/c7866ded5af0cb60f1871666ea9ec6a953d7989c",
  },
  {
    id: "intro-r", title: "Introduction to R", issuer: "DataCamp", date: "March 21, 2026", category: "Courses",
    description: "Completed a 4-hour introduction to R programming for working with data.",
    image: "/credentials/images/intro-r.webp", pdf: "/credentials/pdf/intro-r.pdf",
    verification: "https://www.datacamp.com/completed/statement-of-accomplishment/course/fa7e71dc4654a40417e0417ad912c6bcc944b670",
  },
  {
    id: "intermediate-r", title: "Intermediate R", issuer: "DataCamp", date: "March 22, 2026", category: "Courses",
    description: "Completed 6 hours of intermediate R coursework.",
    image: "/credentials/images/intermediate-r.webp", pdf: "/credentials/pdf/intermediate-r.pdf",
    verification: "https://www.datacamp.com/completed/statement-of-accomplishment/course/791caf81605267416ab3300a754700ecd07dd772",
  },
  {
    id: "tidyverse", title: "Introduction to the Tidyverse", issuer: "DataCamp", date: "March 22, 2026", category: "Courses",
    description: "Completed a 4-hour introduction to tidyverse tools for working with data in R.",
    image: "/credentials/images/tidyverse.webp", pdf: "/credentials/pdf/tidyverse.pdf",
    verification: "https://www.datacamp.com/completed/statement-of-accomplishment/course/ada7f77d741049495f8cd36e806cf83a4be778a5",
  },
  {
    id: "deepdive", title: "Project Deepdive — Session 2", issuer: "Animo.Dev · De La Salle Lipa", date: "March 12, 2026", category: "Seminars & Events",
    description: "Participated in Animo.Dev’s Project Deepdive Session 2 event.",
    image: "/credentials/images/deepdive.webp", pdf: "/credentials/pdf/deepdive.pdf",
  },
  {
    id: "career", title: "Career Launchpad & The Grit Factor", issuer: "De La Salle Lipa · Guidance and Counseling Center", date: "August 13, 2026", category: "Seminars & Events",
    description: "Attended the Career 104 / SEEDS 104 seminars on transitioning from campus to career and navigating setbacks.",
    image: "/credentials/images/career.webp", pdf: "/credentials/pdf/career.pdf",
  },
  {
    id: "masterclass", title: "Masterclass 101", issuer: "JPCS · De La Salle Lipa", date: "May 15, 2025", category: "Seminars & Events",
    description: "Participated in the JPCS–DLSL Chapter Masterclass 101 event.",
    image: "/credentials/images/masterclass.webp", pdf: "/credentials/pdf/masterclass.pdf",
  },
];

export const featuredCredentials = credentials.slice(0, 3);
