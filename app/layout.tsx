import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FYP Vault",
  description: "Upload and manage Final Year Project data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>

        {/* Navbar appears on every page */}
        <Navbar />

        {/* Page content */}
        <main className="mx-auto max-w-6xl px-6 py-10">
          {children}
        </main>

        {/* Toast notifications — sits outside all pages */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: "14px",
              borderRadius: "10px",
              padding: "12px 16px",
            },
            success: {
              style: {
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0",
              },
            },
            error: {
              style: {
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
              },
            },
          }}
        />

      </body>
    </html>
  );
}