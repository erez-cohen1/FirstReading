import "@/styles/global.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/lib/components/Navbar";
import Footer from "@/lib/components/Footer";
import VoteCount from "@/lib/components/votes";
import LawCount from "@/lib/components/laws";

export const metadata: Metadata = {
  title: "קריאה ראשונה. מה שקורה היום בכנסת",
  description:
    "פלטפורמה למעקב םחר הפעילות בכנסת, עם עדכונים יומיים על הצעות חוק, דיונים והצבעות",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html dir="rtl" lang="he">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <Navbar />
        <div>{children}</div>
        <Footer />
      </body>
    </html>
  );
}

//TODO - change the favicon
