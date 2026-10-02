import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: "Crextio Dashboard",
  description: "HR dashboard built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <StoreProvider>
          <div className="shell">
            <div className="frame">
              <Header />
              <main>{children}</main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
