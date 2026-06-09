import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Newcastle.dog — Find Dog-Friendly Venues in Newcastle",
    template: "%s | Newcastle.dog",
  },
  description:
    "Discover the best dog-friendly pubs, restaurants, cafés and hotels in Newcastle upon Tyne. Find venues with water bowls, dog menus, outdoor seating and more.",
  keywords: ["dog friendly", "Newcastle", "pubs", "restaurants", "cafes", "hotels", "dog menu", "pets welcome"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://newcastle.dog",
    siteName: "Newcastle.dog",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
