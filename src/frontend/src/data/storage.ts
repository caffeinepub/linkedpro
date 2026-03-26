export interface User {
  id: string;
  name: string;
  headline: string;
  company: string;
  location: string;
  avatar: string;
  coverColor: string;
  connections: number;
  profileViews: number;
  postImpressions: number;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Skill {
  id: string;
  name: string;
  endorsements: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
  shares: number;
  timestamp: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface Connection {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  mutualConnections: number;
  type: "request" | "suggestion" | "connected";
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  level: string;
  posted: string;
  salary: string;
  description: string;
  saved: boolean;
  applied: boolean;
  companyColor: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantHeadline: string;
  participantAvatar: string;
  messages: Message[];
  unread: number;
}

export interface Notification {
  id: string;
  type: string;
  text: string;
  avatar: string;
  timestamp: string;
  read: boolean;
}

export function seedData() {
  if (localStorage.getItem("lp_seeded")) return;

  const user: User = {
    id: "me",
    name: "Alex Johnson",
    headline: "Senior Software Engineer at TechCorp",
    company: "TechCorp",
    location: "San Francisco, CA",
    avatar: "",
    coverColor: "#0F4C75",
    connections: 847,
    profileViews: 312,
    postImpressions: 4821,
    about:
      "Passionate software engineer with 8+ years of experience building scalable web applications. I love working on open-source projects and mentoring junior developers. Currently focused on distributed systems and cloud infrastructure.",
    experience: [
      {
        id: "e1",
        title: "Senior Software Engineer",
        company: "TechCorp",
        startDate: "Jan 2021",
        endDate: "Present",
        description:
          "Leading a team of 5 engineers building microservices infrastructure.",
      },
      {
        id: "e2",
        title: "Software Engineer",
        company: "StartupXYZ",
        startDate: "Mar 2018",
        endDate: "Dec 2020",
        description: "Full-stack development using React and Node.js.",
      },
      {
        id: "e3",
        title: "Junior Developer",
        company: "CodeAgency",
        startDate: "Jun 2016",
        endDate: "Feb 2018",
        description: "Built client websites and internal tools.",
      },
    ],
    education: [
      {
        id: "ed1",
        school: "UC Berkeley",
        degree: "B.S.",
        field: "Computer Science",
        startYear: "2012",
        endYear: "2016",
      },
    ],
    skills: [
      { id: "s1", name: "React", endorsements: 48 },
      { id: "s2", name: "TypeScript", endorsements: 41 },
      { id: "s3", name: "Node.js", endorsements: 36 },
      { id: "s4", name: "System Design", endorsements: 29 },
      { id: "s5", name: "AWS", endorsements: 22 },
    ],
  };

  const people = [
    {
      id: "u1",
      name: "Sarah Chen",
      headline: "Product Manager at Google",
      avatar: "",
      color: "#7B2D8B",
    },
    {
      id: "u2",
      name: "Marcus Williams",
      headline: "CTO at FinTech Startup",
      avatar: "",
      color: "#057642",
    },
    {
      id: "u3",
      name: "Priya Patel",
      headline: "Data Scientist at Meta",
      avatar: "",
      color: "#E16B16",
    },
    {
      id: "u4",
      name: "James O'Brien",
      headline: "DevOps Engineer at AWS",
      avatar: "",
      color: "#CC1016",
    },
    {
      id: "u5",
      name: "Lisa Nguyen",
      headline: "UX Designer at Figma",
      avatar: "",
      color: "#0A66C2",
    },
    {
      id: "u6",
      name: "David Kim",
      headline: "ML Engineer at OpenAI",
      avatar: "",
      color: "#915907",
    },
    {
      id: "u7",
      name: "Emma Rodriguez",
      headline: "Frontend Engineer at Stripe",
      avatar: "",
      color: "#6B4226",
    },
    {
      id: "u8",
      name: "Tom Baker",
      headline: "Backend Engineer at Netflix",
      avatar: "",
      color: "#0073B1",
    },
  ];

  const posts: Post[] = [
    {
      id: "p1",
      authorId: "u1",
      authorName: "Sarah Chen",
      authorHeadline: "Product Manager at Google",
      authorAvatar: "",
      content:
        "Just wrapped up an incredible sprint planning session! The key to great product management is listening deeply to your users and aligning the team around a shared vision. What's your #1 tip for effective sprint planning? 🚀",
      likes: 247,
      likedByMe: false,
      comments: [
        {
          id: "c1",
          authorName: "Alex Johnson",
          authorAvatar: "",
          content:
            "Great insights Sarah! I always find that keeping sprints focused with clear acceptance criteria makes a huge difference.",
          timestamp: "2h ago",
        },
      ],
      shares: 18,
      timestamp: "3h ago",
    },
    {
      id: "p2",
      authorId: "u2",
      authorName: "Marcus Williams",
      authorHeadline: "CTO at FinTech Startup",
      authorAvatar: "",
      content:
        "We just closed our Series B! $40M to scale our payments infrastructure. Grateful for the incredible team that made this possible. The journey from a $10K MVP to processing $1B in transactions has been wild. 🎉\n\nHiring senior engineers across all stacks — link in bio!",
      likes: 1842,
      likedByMe: false,
      comments: [],
      shares: 203,
      timestamp: "5h ago",
    },
    {
      id: "p3",
      authorId: "u3",
      authorName: "Priya Patel",
      authorHeadline: "Data Scientist at Meta",
      authorAvatar: "",
      content:
        "Hot take: Most companies don't have a data problem — they have a data culture problem. You can have petabytes of data and still make terrible decisions if nobody trusts the data team or acts on insights. 📊\n\nBuilding trust is half the job.",
      likes: 583,
      likedByMe: false,
      comments: [
        {
          id: "c2",
          authorName: "Tom Baker",
          authorAvatar: "",
          content:
            "100% agree. I've seen this firsthand. Data quality AND stakeholder buy-in are equally important.",
          timestamp: "1h ago",
        },
      ],
      shares: 94,
      timestamp: "8h ago",
    },
    {
      id: "p4",
      authorId: "u4",
      authorName: "James O'Brien",
      authorHeadline: "DevOps Engineer at AWS",
      authorAvatar: "",
      content:
        "PSA: Your Kubernetes cluster is not your identity. Just spent 3 days debugging a prod incident caused by a misconfigured liveness probe. Wrote up the full post-mortem. The TL;DR: always test your health check endpoints under load. Link in comments 👇",
      likes: 412,
      likedByMe: false,
      comments: [],
      shares: 67,
      timestamp: "1d ago",
    },
    {
      id: "p5",
      authorId: "u5",
      authorName: "Lisa Nguyen",
      authorHeadline: "UX Designer at Figma",
      authorAvatar: "",
      content:
        "Design systems are love letters to your future self. After spending 6 months building our component library from scratch, our design-to-dev handoff time dropped by 70%. Consistency is a superpower. ✨",
      likes: 729,
      likedByMe: false,
      comments: [],
      shares: 115,
      timestamp: "1d ago",
    },
    {
      id: "p6",
      authorId: "u6",
      authorName: "David Kim",
      authorHeadline: "ML Engineer at OpenAI",
      authorAvatar: "",
      content:
        "Excited to share that our latest fine-tuning experiment reduced hallucinations by 34% on our benchmark dataset. Still a long way to go, but progress is real. The future of reliable AI is built on rigorous evaluation. 🤖",
      likes: 1203,
      likedByMe: false,
      comments: [],
      shares: 287,
      timestamp: "2d ago",
    },
    {
      id: "p7",
      authorId: "u7",
      authorName: "Emma Rodriguez",
      authorHeadline: "Frontend Engineer at Stripe",
      authorAvatar: "",
      content:
        "Reminder that web performance is accessibility. A slow website is an inaccessible website for people on low-end devices or poor connections. Optimize for the 90th percentile user, not your MacBook Pro. ⚡",
      likes: 934,
      likedByMe: false,
      comments: [],
      shares: 176,
      timestamp: "2d ago",
    },
    {
      id: "p8",
      authorId: "u8",
      authorName: "Tom Baker",
      authorHeadline: "Backend Engineer at Netflix",
      authorAvatar: "",
      content:
        "After 4 years at Netflix I can confidently say: the best engineers I've worked with are the ones who communicate clearly, not necessarily the ones who code the fastest. Soft skills are underrated. 💬",
      likes: 2156,
      likedByMe: false,
      comments: [],
      shares: 398,
      timestamp: "3d ago",
    },
  ];

  const connections: Connection[] = [
    {
      id: "r1",
      name: "Amy Zhang",
      headline: "Engineering Manager at Airbnb",
      avatar: "",
      mutualConnections: 12,
      type: "request",
    },
    {
      id: "r2",
      name: "Carlos Mendez",
      headline: "Product Designer at Spotify",
      avatar: "",
      mutualConnections: 8,
      type: "request",
    },
    {
      id: "r3",
      name: "Nina Kowalski",
      headline: "Tech Lead at Shopify",
      avatar: "",
      mutualConnections: 5,
      type: "request",
    },
    ...people.map((p) => ({
      id: p.id,
      name: p.name,
      headline: p.headline,
      avatar: "",
      mutualConnections: Math.floor(Math.random() * 20) + 1,
      type: "suggestion" as const,
    })),
    {
      id: "c1",
      name: "Rachel Green",
      headline: "Recruiter at Amazon",
      avatar: "",
      mutualConnections: 3,
      type: "suggestion",
    },
    {
      id: "c2",
      name: "Steve Hall",
      headline: "VP Engineering at Uber",
      avatar: "",
      mutualConnections: 15,
      type: "suggestion",
    },
    {
      id: "c3",
      name: "Mei Lin",
      headline: "Software Engineer at Apple",
      avatar: "",
      mutualConnections: 7,
      type: "suggestion",
    },
    {
      id: "c4",
      name: "Omar Hassan",
      headline: "Data Engineer at Databricks",
      avatar: "",
      mutualConnections: 9,
      type: "suggestion",
    },
  ];

  const jobs: Job[] = [
    {
      id: "j1",
      title: "Senior Frontend Engineer",
      company: "Google",
      location: "Mountain View, CA (Hybrid)",
      type: "Full-time",
      level: "Senior",
      posted: "2d ago",
      salary: "$180K–$240K",
      description: "Build the next generation of Google products.",
      saved: false,
      applied: false,
      companyColor: "#4285F4",
    },
    {
      id: "j2",
      title: "Staff Software Engineer",
      company: "Meta",
      location: "Menlo Park, CA",
      type: "Full-time",
      level: "Staff",
      posted: "3d ago",
      salary: "$220K–$300K",
      description: "Work on infrastructure at global scale.",
      saved: false,
      applied: false,
      companyColor: "#1877F2",
    },
    {
      id: "j3",
      title: "Backend Engineer",
      company: "Stripe",
      location: "Remote",
      type: "Full-time",
      level: "Mid",
      posted: "1d ago",
      salary: "$150K–$200K",
      description: "Build payments infrastructure used by millions.",
      saved: false,
      applied: false,
      companyColor: "#635BFF",
    },
    {
      id: "j4",
      title: "ML Engineer",
      company: "OpenAI",
      location: "San Francisco, CA",
      type: "Full-time",
      level: "Senior",
      posted: "5d ago",
      salary: "$200K–$280K",
      description: "Research and deploy large language models.",
      saved: false,
      applied: false,
      companyColor: "#10A37F",
    },
    {
      id: "j5",
      title: "Product Engineer",
      company: "Linear",
      location: "Remote",
      type: "Full-time",
      level: "Mid",
      posted: "1w ago",
      salary: "$140K–$180K",
      description: "Build the future of project management.",
      saved: false,
      applied: false,
      companyColor: "#5E6AD2",
    },
    {
      id: "j6",
      title: "DevOps Engineer",
      company: "Amazon",
      location: "Seattle, WA",
      type: "Full-time",
      level: "Senior",
      posted: "2d ago",
      salary: "$160K–$220K",
      description: "Scale AWS infrastructure.",
      saved: false,
      applied: false,
      companyColor: "#FF9900",
    },
    {
      id: "j7",
      title: "iOS Engineer",
      company: "Apple",
      location: "Cupertino, CA",
      type: "Full-time",
      level: "Senior",
      posted: "4d ago",
      salary: "$180K–$250K",
      description: "Build iOS apps used by 1B+ users.",
      saved: false,
      applied: false,
      companyColor: "#555555",
    },
    {
      id: "j8",
      title: "Data Engineer",
      company: "Databricks",
      location: "Remote",
      type: "Full-time",
      level: "Mid",
      posted: "3d ago",
      salary: "$130K–$175K",
      description: "Build data pipelines at petabyte scale.",
      saved: false,
      applied: false,
      companyColor: "#FF3621",
    },
    {
      id: "j9",
      title: "Frontend Engineer",
      company: "Vercel",
      location: "Remote",
      type: "Full-time",
      level: "Mid",
      posted: "6d ago",
      salary: "$130K–$170K",
      description: "Build tools for millions of developers.",
      saved: false,
      applied: false,
      companyColor: "#000000",
    },
    {
      id: "j10",
      title: "Platform Engineer",
      company: "Netflix",
      location: "Los Gatos, CA",
      type: "Full-time",
      level: "Senior",
      posted: "1w ago",
      salary: "$200K–$270K",
      description: "Build the platform powering 200M+ streams.",
      saved: false,
      applied: false,
      companyColor: "#E50914",
    },
    {
      id: "j11",
      title: "Security Engineer",
      company: "Cloudflare",
      location: "Remote",
      type: "Full-time",
      level: "Senior",
      posted: "2w ago",
      salary: "$170K–$230K",
      description: "Protect the internet.",
      saved: false,
      applied: false,
      companyColor: "#F48120",
    },
    {
      id: "j12",
      title: "Full Stack Engineer",
      company: "Notion",
      location: "Remote",
      type: "Full-time",
      level: "Mid",
      posted: "1d ago",
      salary: "$120K–$160K",
      description: "Build collaborative productivity tools.",
      saved: false,
      applied: false,
      companyColor: "#000000",
    },
  ];

  const conversations: Conversation[] = [
    {
      id: "conv1",
      participantId: "u1",
      participantName: "Sarah Chen",
      participantHeadline: "Product Manager at Google",
      participantAvatar: "",
      unread: 2,
      messages: [
        {
          id: "m1",
          senderId: "u1",
          content:
            "Hey Alex! Loved your recent post about distributed systems.",
          timestamp: "Yesterday 2:30 PM",
        },
        {
          id: "m2",
          senderId: "me",
          content: "Thanks Sarah! It was a fun topic to research.",
          timestamp: "Yesterday 2:45 PM",
        },
        {
          id: "m3",
          senderId: "u1",
          content: "Are you going to the Tech Summit next month?",
          timestamp: "Yesterday 3:00 PM",
        },
        {
          id: "m4",
          senderId: "u1",
          content: "We should grab coffee and catch up!",
          timestamp: "Today 9:15 AM",
        },
      ],
    },
    {
      id: "conv2",
      participantId: "u2",
      participantName: "Marcus Williams",
      participantHeadline: "CTO at FinTech Startup",
      participantAvatar: "",
      unread: 0,
      messages: [
        {
          id: "m5",
          senderId: "me",
          content: "Congrats on the Series B, Marcus! Huge achievement.",
          timestamp: "5h ago",
        },
        {
          id: "m6",
          senderId: "u2",
          content:
            "Thanks so much Alex! It's been a wild ride. We're hiring if you know anyone great!",
          timestamp: "4h ago",
        },
      ],
    },
    {
      id: "conv3",
      participantId: "u5",
      participantName: "Lisa Nguyen",
      participantHeadline: "UX Designer at Figma",
      participantAvatar: "",
      unread: 1,
      messages: [
        {
          id: "m7",
          senderId: "u5",
          content:
            "Alex, would you be interested in reviewing our new design system docs? Would love your engineering perspective.",
          timestamp: "2d ago",
        },
        {
          id: "m8",
          senderId: "me",
          content: "Absolutely! Send it over whenever ready.",
          timestamp: "2d ago",
        },
        {
          id: "m9",
          senderId: "u5",
          content: "Amazing, I'll share it with you tomorrow!",
          timestamp: "1d ago",
        },
      ],
    },
    {
      id: "conv4",
      participantId: "u6",
      participantName: "David Kim",
      participantHeadline: "ML Engineer at OpenAI",
      participantAvatar: "",
      unread: 0,
      messages: [
        {
          id: "m10",
          senderId: "u6",
          content: "Great meeting you at the conference last week!",
          timestamp: "1w ago",
        },
        {
          id: "m11",
          senderId: "me",
          content: "Likewise! Your talk on fine-tuning was fascinating.",
          timestamp: "1w ago",
        },
      ],
    },
    {
      id: "conv5",
      participantId: "u7",
      participantName: "Emma Rodriguez",
      participantHeadline: "Frontend Engineer at Stripe",
      participantAvatar: "",
      unread: 0,
      messages: [
        {
          id: "m12",
          senderId: "me",
          content:
            "Emma, do you have any resources on web vitals optimization?",
          timestamp: "3d ago",
        },
        {
          id: "m13",
          senderId: "u7",
          content:
            "Yes! I'll send you our internal guide. It covers LCP, FID, and CLS in depth.",
          timestamp: "3d ago",
        },
      ],
    },
  ];

  const notifications: Notification[] = [
    {
      id: "n1",
      type: "like",
      text: "Sarah Chen and 23 others liked your post about distributed systems",
      avatar: "",
      timestamp: "1h ago",
      read: false,
    },
    {
      id: "n2",
      type: "connection",
      text: "Marcus Williams accepted your connection request",
      avatar: "",
      timestamp: "3h ago",
      read: false,
    },
    {
      id: "n3",
      type: "comment",
      text: 'Priya Patel commented on your post: "Great perspective Alex!"',
      avatar: "",
      timestamp: "5h ago",
      read: false,
    },
    {
      id: "n4",
      type: "job",
      text: "New job match: Senior Engineer at Stripe (matches your profile)",
      avatar: "",
      timestamp: "6h ago",
      read: true,
    },
    {
      id: "n5",
      type: "birthday",
      text: "Today is Tom Baker's work anniversary. Wish them well!",
      avatar: "",
      timestamp: "8h ago",
      read: true,
    },
    {
      id: "n6",
      type: "connection",
      text: "Lisa Nguyen sent you a connection request",
      avatar: "",
      timestamp: "1d ago",
      read: true,
    },
    {
      id: "n7",
      type: "like",
      text: "David Kim liked your comment on Priya's post",
      avatar: "",
      timestamp: "1d ago",
      read: true,
    },
    {
      id: "n8",
      type: "job",
      text: '3 new jobs matching "Senior Software Engineer" in San Francisco',
      avatar: "",
      timestamp: "2d ago",
      read: true,
    },
    {
      id: "n9",
      type: "comment",
      text: "Emma Rodriguez replied to your comment on performance optimization",
      avatar: "",
      timestamp: "2d ago",
      read: true,
    },
    {
      id: "n10",
      type: "connection",
      text: "You have 3 pending connection requests from people you may know",
      avatar: "",
      timestamp: "3d ago",
      read: true,
    },
  ];

  localStorage.setItem("lp_user", JSON.stringify(user));
  localStorage.setItem("lp_posts", JSON.stringify(posts));
  localStorage.setItem("lp_connections", JSON.stringify(connections));
  localStorage.setItem("lp_jobs", JSON.stringify(jobs));
  localStorage.setItem("lp_conversations", JSON.stringify(conversations));
  localStorage.setItem("lp_notifications", JSON.stringify(notifications));
  localStorage.setItem("lp_seeded", "1");
}

export function getUser(): User {
  return JSON.parse(localStorage.getItem("lp_user") || "{}");
}
export function setUser(u: User) {
  localStorage.setItem("lp_user", JSON.stringify(u));
}
export function getPosts(): Post[] {
  return JSON.parse(localStorage.getItem("lp_posts") || "[]");
}
export function setPosts(p: Post[]) {
  localStorage.setItem("lp_posts", JSON.stringify(p));
}
export function getConnections(): Connection[] {
  return JSON.parse(localStorage.getItem("lp_connections") || "[]");
}
export function setConnections(c: Connection[]) {
  localStorage.setItem("lp_connections", JSON.stringify(c));
}
export function getJobs(): Job[] {
  return JSON.parse(localStorage.getItem("lp_jobs") || "[]");
}
export function setJobs(j: Job[]) {
  localStorage.setItem("lp_jobs", JSON.stringify(j));
}
export function getConversations(): Conversation[] {
  return JSON.parse(localStorage.getItem("lp_conversations") || "[]");
}
export function setConversations(c: Conversation[]) {
  localStorage.setItem("lp_conversations", JSON.stringify(c));
}
export function getNotifications(): Notification[] {
  return JSON.parse(localStorage.getItem("lp_notifications") || "[]");
}
export function setNotifications(n: Notification[]) {
  localStorage.setItem("lp_notifications", JSON.stringify(n));
}

export function avatarInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const PERSON_COLORS = [
  "#0A66C2",
  "#7B2D8B",
  "#E16B16",
  "#057642",
  "#CC1016",
  "#6B4226",
  "#0073B1",
  "#915907",
  "#4285F4",
  "#10A37F",
];
export function personColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PERSON_COLORS[Math.abs(hash) % PERSON_COLORS.length];
}
