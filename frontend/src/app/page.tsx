import Image from "next/image";
import React from "react";
import config from "../config/config";
import Link from "next/link";
import ShortFeatureCard from "./(landing)/short-feat-card";
import LongFeat from "./(landing)/long-feat";
import CardOrCarousel from "./(landing)/card-or-carousal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type NavigationLink = {
  name: string;
  href: string;
  imp?: boolean;
};

const navigationLinks: NavigationLink[] = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Proof", href: "#proof" },
  { name: "FAQ", href: "#faq" },
  { name: "Login", href: "/auth/login", imp: true },
  { name: "Sign Up", href: "/auth/signup", imp: true },
];

const Landing = () => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="top-0 z-50 sticky flex flex-row bg-test1 p-2 w-full">
        <section className="flex flex-row justify-between section">
          {/* Logo */}
          <div className="flex flex-row items-center gap-1">
            <Image
              src={config.logo}
              alt="Logo"
              width={40}
              height={40}
              className="size-7 md:size-10"
            />
            <span className="font-roboto font-semibold text-2xl md:text-3xl">
              {config.title}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex flex-row items-center gap-8 font-medium text-teal-600 text-sm md:text-base">
            {navigationLinks.map((link) => (
              <Link key={link.name} href={link.href} className="font-roboto">
                {link.name}
              </Link>
            ))}
          </div>
          <div className="sm:hidden flex flex-row items-center gap-7 font-medium text-teal-600 text-sm md:text-base">
            {navigationLinks
              .filter((link) => link.imp)
              .map((link) => (
                <Link key={link.name} href={link.href} className="font-roboto">
                  {link.name}
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* Hero Section */}
      <div id="home" className="flex bg-test2 p-2 w-full h-[75vh]">
        <section className="flex sm:flex-row flex-col justify-around items-center gap-5 sm:gap-10 px-10 sm:px-16 w-full h-full section">
          {/* Left Text and CTA */}
          <div className="flex flex-col justify-center items-start gap-3 w-full sm:w-1/3 md:w-1/2 lg:w-1/3 translate-y-8 sm:-translate-y-8">
            <h1 className="font-bold text-gray-800 text-3xl md:text-5xl">
              {config.moat}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mt-3">
              {config.description}
            </p>
            <Link
              href="/auth/signup"
              className="bg-teal-600 hover:bg-teal-700 mt-4 px-6 py-2 rounded-md text-white transition duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex justify-center items-center mb-8 sm:mb-0 w-1/2 max-[440px]:w-full min-[440px]:min-w-80">
            <Image
              src={config.heroImg}
              alt="Hero Image"
              width={500}
              height={500}
              className="rounded-md w-full h-auto"
            />
          </div>
        </section>
      </div>

      {/* Features */}
      <div id="features" className="flex flex-col p-2 w-full ">
        <section className="flex flex-col items-center gap-5 my-6 w-full h-full section">
          {/* Hook to scroll */}
          <h2 className="mt-4 mb-8 font-bold text-gray-800 text-2xl md:text-5xl">
            {config.hook2Scroll}
          </h2>
          <div className="flex flex-row flex-wrap justify-around gap-6 w-full max-w-6xl">
            {config.shortFeatures.map((feature, index) => (
              <ShortFeatureCard
                key={index}
                Icon={feature.icon}
                name={feature.name}
                description={feature.description}
              />
            ))}
          </div>

          {/* Long features */}
          <div className="flex flex-col gap-4 mt-6 w-full h-full">
            {config.longFeatures.map((feature, index) => (
              <LongFeat
                key={index}
                index={index}
                img={feature.img}
                name={feature.name}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Proof */}
      {/* <div id="proof" className="flex bg-test1 w-full h-full">
        <section className="flex flex-col items-center gap-2 my-16 w-full h-full section">
          <h2 className="mb-4 py-6 font-bold text-gray-800 text-3xl md:text-5xl">
            Social Proof
          </h2>

          <div className="flex flex-row justify-center items-center w-full">
            <CardOrCarousel data={config.testimonials} />
          </div>
        </section>
      </div> */}

      {/* FAQ */}
      <div
        id="faq"
        className="flex flex-col items-center gap-2 p-2 w-full h-full"
      >
        <section className="flex flex-col items-center gap-2 my-16 w-full h-full section">
          <h2 className="mb-4 py-6 font-bold text-gray-800 text-3xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Here are some common questions we get asked.
          </p>
          <div className="flex flex-col gap-4 mt-6 w-full max-w-4xl">
            {/* Add FAQ items here */}
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-2"
            >
              {config.faq.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="shadow-md px-3 py-2"
                >
                  <AccordionTrigger className="border-0 ring-0 focus:ring-0 text-md no-underline hover:no-underline cursor-pointer">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>{item.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-2 bg-test2 p-2 w-full h-full">
        <section className="flex flex-col items-center gap-2 my-16 w-full h-full section">
          <h2 className="mb-2 py-6 font-bold text-gray-800 text-3xl md:text-5xl">
            {config.cta}
          </h2>
          <Link
            href="/auth/signup"
            className="bg-teal-600 hover:bg-teal-700 mt-4 px-6 py-2 rounded-md text-white transition duration-300"
          >
            Get Started
          </Link>
        </section>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-2 bg-test5 p-2 w-full h-full">
        <section className="flex flex-col items-center gap-2 my-16 w-full h-full section">
          <p className="text-white text-lg md:text-xl">
            © {new Date().getFullYear()} {config.title}. All rights reserved.
          </p>
          <div className="flex flex-row flex-wrap gap-4 mt-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-teal-600 hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
