import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "../components/ui/toaster";
// import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Veterinary Appointments Manager",
  description: "Manage veterinary clinic appointments efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-primary-600 text-white p-4 shadow-lg">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">🏥 Veterinary Clinic</h1>
            <p className="text-primary-100">Appointments Manager</p>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
