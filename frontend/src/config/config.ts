import { Anchor, Kanban, Users, Shield } from "lucide-react";
const loremTxt =
  "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const config = {
  enable_role_based_access: true,
  title: "SprintMaster",
  description: "Manage all your tasks, your routine and you team in one place",
  logo: "/project/projectIcon.svg",
  moat: "Productivity at your fingertips",
  heroImg: "/project/heroImg.png",
  hook2Scroll: "Everything your team needs to stay aligned",
  shortFeatures: [
    {
      name: "Visual Kanban Boards",
      description:
        "Drag, drop, and organize tasks across customizable stages with real-time updates.",
      icon: Kanban,
    },
    {
      name: "Team Collaboration",
      description:
        "Assign tasks, add comments, and keep everyone aligned in one shared workspace.",
      icon: Users,
    },
    {
      name: "Role-Based Access",
      description:
        "Control who can view, edit, and manage boards with secure permissions.",
      icon: Shield,
    },
  ],
  longFeatures: [
    {
      name: "Multiple & Multidisciplinary Boards",
      description:
        "Create multiple boards for different teams, projects, or workflows. Whether it’s engineering, design, marketing, or operations, manage all disciplines independently while keeping everything connected.",
      img: "/project/feat-long.jpg",
    },
    {
      name: "Team Management & Powerful Analytics",
      description:
        "Manage teams with clear roles and permissions, track workload distribution, and gain deep insights through analytics on task progress, velocity, and bottlenecks to make better decisions.",
      img: "/project/feat-long.jpg",
    },
  ],
  testimonials: [
    {
      name: "John Doe",
      role: "CEO of Company",
      icon: "/project/projectIcon.svg",
      description: loremTxt,
    },
    {
      name: "Jane Derulo",
      role: "CFO of Another Company",
      icon: "/project/projectIcon.svg",
      description: loremTxt,
    },
    {
      name: "Jane Smith",
      role: "CTO of Another Company",
      icon: "/project/projectIcon.svg",
      description: loremTxt,
    },
  ],
  faq: [
    {
      title: "How is SprintMaster different from Jira?",
      description:
        "SprintMaster focuses on simplicity and speed, giving you essential Kanban and sprint features without unnecessary complexity.",
    },
    {
      title: "Can I manage multiple teams?",
      description:
        "Yes. You can create multiple boards, assign teams, and manage access with role-based permissions.",
    },
  ],
  cta: "Start managing sprints smarter",
  // Didn't make config for footer, idk need to improve design
};

export default config;
