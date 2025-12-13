import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Protected from "@/components/common/protected";
import { Toaster } from "@/components/ui/sonner";
import OfflinePage from "@/components/common/offline-page";
import LeftSidebar from "@/components/common/left-sidebar";
import MobileSidebar from "@/components/common/mobile-sidebar";
import Sidebar from "@/components/common/sidebar";
import SWRegistrar from "@/components/common/sw-registrar";
import config from "@/config/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  openGraph: {
    title: config.title,
    description: config.description,
    type: "website",
    url: "#", // Replace with your actual URL
    siteName: config.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Protected>
          <div className="flex flex-row w-full h-[100svh]">
            <Sidebar />
            <div className="flex flex-col p-6 w-full h-full overflow-y-auto">
              {children}
            </div>
          </div>
        </Protected>
        <OfflinePage />
        <SWRegistrar />
      </body>
    </html>
  );
}
