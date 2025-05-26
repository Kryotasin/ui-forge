// src/app/layout.tsx (updated)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles/variables.scss";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Sidebar from "@/app/components/Sidebar";
import RightNav from "@/app/components/RightNav";
import { ApolloProvider } from "./components/providers/ApolloProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Website",
  description: "My Next.js Website with Bootstrap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="d-flex flex-column min-vh-100">
          <Header />

          <div className="flex-grow-1">
            <div className="container-fluid mh-100">
              <div className="row row-layout">
                <div className="col-12 col-md-3 col-sidebar">
                  <Sidebar />
                </div>

                <div className="col-12 col-md-6 col-main">
                <ApolloProvider>
                  {children}
                </ApolloProvider>
                </div>

                <div className="col-12 col-md-3 col-rightnav">
                  <RightNav />
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}