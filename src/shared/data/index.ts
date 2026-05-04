// ─── Palette ────────────────────────────────────────────────────────────────
// cyan #00d4ff · purple #9d4edd · green #00ff87 · pink #ff2d78 · yellow #fff12d · orange #ff6d00

// ─── Experience ─────────────────────────────────────────────────────────────
export const JOBS = [
  {
    id: "j1",
    company: "Dopamine",
    role: "Frontend Developer",
    period: "10.2025 — 02.2026",
    duration: "4 мес",
    type: "Contract",
    color: "#00d4ff",
    stack: ["Next.js", "SSR", "ZOD", "React Query", "React Hook Form", "Chart.js", "TypeScript", "FSD", "ShadcnUI"],
    desc: "Крипто-продукт, команда 13 человек — 2 фронтенда. Отвечал за сложные компоненты с анимациями, большую часть интерфейса закрывал сам. FSD, SSR-оптимизация.",
    highlight: true,
  },
  {
    id: "j2",
    company: "BasisOS",
    role: "Frontend Developer",
    period: "05.2025 — 10.2025",
    duration: "5 мес",
    type: "Contract",
    color: "#9d4edd",
    stack: ["Next.js", "SSR", "Chart.js", "React Query", "Framer Motion", "gsap", "lenis", "TypeScript", "Web3", "ethers.js"],
    desc: "Полный редизайн крипто-продукта — сложные анимации, SSR-оптимизация, переработка компонентной базы. Стартап 11 человек.",
    highlight: false,
  },
  {
    id: "j_adsm",
    company: "ADSM CRM",
    role: "Frontend Developer",
    period: "03.2025 — 04.2025",
    duration: "2 мес",
    type: "Freelance",
    color: "#ff6d00",
    stack: ["Next.js", "TypeScript", "FSD", "SSR", "React Query", "ShadcnUI"],
    desc: "CRM для трафика с нуля — спроектировал архитектуру (FSD), разработал интерфейс под высокую нагрузку пользователей. SSR, дизайн и реализация.",
    highlight: false,
  },
  {
    id: "j3",
    company: "CRM Project",
    role: "Frontend Developer",
    period: "01.2025 — 02.2025",
    duration: "2 мес",
    type: "Freelance",
    color: "#ff2d78",
    stack: ["React", "Vite", "Redux", "TypeScript", "React Query"],
    desc: "Перевёл CRM-систему с монолитной архитектуры на компонентную структуру на React — UI стал отзывчивее, система быстрее.",
    highlight: false,
  },
  {
    id: "j4",
    company: "Freelance",
    role: "Frontend Developer",
    period: "09.2024 — 12.2024",
    duration: "4 мес",
    type: "Freelance",
    color: "#fff12d",
    stack: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind", "SCSS", "REST API"],
    desc: "Брал заказы на различные проекты — лендинги, веб-приложения, небольшие сервисы. Самостоятельно вёл клиентов от ТЗ до деплоя.",
    highlight: false,
  },
  {
    id: "j5",
    company: "Dats.Team",
    role: "Frontend Developer",
    period: "12.2023 — 08.2024",
    duration: "8 мес",
    type: "Full-time",
    color: "#00ff87",
    stack: ["React", "Next.js", "TypeScript"],
    desc: "Разрабатывал и оптимизировал фронтенд веб-приложений. Создавал высокопроизводительные интерфейсы, участвовал в принятии архитектурных решений.",
    highlight: false,
  },
  {
    id: "j6",
    company: "Dats.Team",
    role: "React Native Developer",
    period: "08.2022 — 10.2023",
    duration: "1 год 2 мес",
    type: "Full-time",
    color: "#ff6d00",
    stack: ["React Native", "TypeScript", "REST API"],
    desc: "Разрабатывал мобильные приложения на React Native. Интегрировал авторизацию, REST API и локальные базы данных. Работал в команде — code review, декомпозиция задач, совместное планирование.",
    highlight: false,
  },
  {
    id: "j7",
    company: "Freelance",
    role: "Frontend Developer",
    period: "03.2022 — 09.2022",
    duration: "6 мес",
    type: "Freelance",
    color: "#ff2d78",
    stack: ["HTML", "CSS", "Bootstrap", "JavaScript", "PHP"],
    desc: "Разрабатывал сайты с адаптивной вёрсткой. Реализовывал клиент-серверное взаимодействие на JavaScript и PHP.",
    highlight: false,
  },
] as const;

export type Job = typeof JOBS[number];

// ─── Projects ────────────────────────────────────────────────────────────────
export type Project = {
  id: string; num: string; title: string; category: string;
  desc: string; stack: string[]; color: string; rawColor: string;
  year: string; link: string;
  images: string[]; video: string;
};

export const PROJECTS: Project[] = [
  {
    id: "p1", num: "001", title: "Dopamine", category: "Crypto · SaaS",
    desc: "Earn-to-engage платформа — пользователи продвигают крипто-проекты в Twitter и обменивают активность на награды. Квесты, лидерборды, дашборды",
    stack: ["Next.js", "TypeScript", "Chart.js", "React Query", "React Hook Form", "ZOD", "FSD", "ShadcnUI", "SSR"],
    color: "var(--color-cyan)", rawColor: "#00d4ff", year: "2026", link: "#",
    images: ["/dopamin/1.png", "/dopamin/2.png", "/dopamin/3.png", "/dopamin/4.png", "/dopamin/5.png"],
    video: "/dopamin/video.mp4",
  },
  {
    id: "p2", num: "002", title: "BasisOS", category: "Crypto · Web3",
    desc: "Web3-платформа с акцентом на UX — плавный скролл, сложные анимации и данные из блокчейна в реальном времени. Выполнил полный редизайн сайта.",
    stack: ["Next.js", "TypeScript", "GSAP", "Lenis", "Framer Motion", "Web3", "ethers.js", "Chart.js", "SSR"],
    color: "var(--color-purple)", rawColor: "#9d4edd", year: "2025", link: "#",
    images: ["/basios/1.png", "/basios/2.png", "/basios/3.png", "/basios/4.png"],
    video: "/basios/video.mp4",
  },
  {
    id: "p3", num: "003", title: "ADSM CRM", category: "CRM · Freelance",
    desc: "CRM для трафик-арбитража — таблицы с серверной фильтрацией и bulk-операциями, стабильная работа с большими объёмами данных. Спроектирована модульная архитектура без регрессий.",
    stack: ["Next.js", "TypeScript", "FSD", "SSR", "React Query", "ShadcnUI"],
    color: "#ff6d00", rawColor: "#ff6d00", year: "Будет позже", link: "#",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "p4", num: "004", title: "Pixel CRM", category: "CRM · Freelance",
    desc: "Рефакторинг legacy CRM — переход на компонентную архитектуру, упрощение работы с данными и состоянием. Интерфейс стал быстрее и предсказуемее.",
    stack: ["React", "Vite", "Redux", "TypeScript", "React Query"],
    color: "var(--color-pink)", rawColor: "#ff2d78", year: "2025", link: "#",
    images: ["/pixel/1.png", "/pixel/2.png", "/pixel/3.png"],
    video: "/pixel/video.mp4",
  },
  {
    id: "p5", num: "005", title: "Traffik", category: "SaaS · Full-time",
    desc: "Продуктовая веб-платформа с упором на производительность — быстрый рендер больших списков, оптимизация bundle, переход с CRA на Next.js. Живой продукт с реальными пользователями.",
    stack: ["React", "Next.js", "TypeScript"],
    color: "#00ff87", rawColor: "#00ff87", year: "2024", link: "#",
    images: ["/traffic/1.png", "/traffic/2.png"],
    video: "/traffic/video.mp4",
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────────
export const SKILL_GROUPS = [
  {
    category: "React Stack",
    color: "var(--color-cyan)",
    rawColor: "#00d4ff",
    skills: [
      { name: "Next.js",               level: 95 },
      { name: "React",                 level: 90 },
      { name: "Redux / RTK",           level: 90 },
      { name: "React Hook Form / Zod", level: 85 },
      { name: "React Native",          level: 75 },
    ],
  },
  {
    category: "Animation",
    color: "var(--color-purple)",
    rawColor: "#9d4edd",
    skills: [
      { name: "Tailwind / Bootstrap",  level: 100 },
      { name: "GSAP / Lenis",          level: 95 },
      { name: "Framer-motion",         level: 90 },
      { name: "Shadcn / Material UI",  level: 90 },
      { name: "SCSS",                  level: 85 },
    ],
  },
  {
    category: "APIs",
    color: "#00ff87",
    rawColor: "#00ff87",
    skills: [
      { name: "REST API",              level: 100 },
      { name: "React Query",           level: 100 },
      { name: "OpenAPI (Swagger)",     level: 90 },
      { name: "GraphQL",               level: 65 },
      { name: "WebSockets",            level: 65 },
    ],
  },
];

export const TECH_TAG_GROUPS = [
  { color: "var(--color-cyan)",   rawColor: "#00d4ff", tags: ["TypeScript", "JS", "PHP"] },
  { color: "var(--color-purple)", rawColor: "#9d4edd", tags: ["FSD", "Git/GitHub", "Docker"] },
  { color: "#00ff87",             rawColor: "#00ff87", tags: ["@Wagmi", "Rainbow-me", "Viem"] },
  { color: "#fff12d",             rawColor: "#fff12d", tags: ["Node.js", "Nest.js"] },
];

// ─── Social links ────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = [
  { label: "email",    href: "mailto:wxtx.ns@gmail.com" },
  { label: "github",   href: "https://github.com/NaSergey" },
  { label: "telegram", href: "#" },
] as const;
