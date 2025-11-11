import { Anchor } from "lucide-react";
const loremTxt =
  "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const config = {
  enable_role_based_access: true,
  title: "Title",
  description: "Describes your app in detail",
  logo: "/project/projectIcon.svg",
  moat: "What is your super power",
  heroImg: "/project/heroImg.jpg",
  hook2Scroll: "Hook them to scroll",
  shortFeatures: [
    { name: "Feature 1", description: loremTxt, icon: Anchor },
    { name: "Feature 2", description: loremTxt, icon: Anchor },
    { name: "Feature 3", description: loremTxt, icon: Anchor },
  ],
  longFeatures: [
    {
      name: "Feature 1",
      description: loremTxt + loremTxt,
      img: "/project/feat-long.jpg",
    },
    {
      name: "Feature 2",
      description: loremTxt + loremTxt,
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
      title: "What is this project about?",
      description:
        "This project is a template for building landing pages with Next.js and Tailwind CSS. It includes features like testimonials, long and short features, and a hero section.",
    },
    {
      title: "Is it accessible?",
      description: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
  ],
  cta: "Define your call to action",
  // Didn't make config for footer, idk need to improve design
};

export default config;
