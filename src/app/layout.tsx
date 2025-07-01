import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { AuthProvider } from "@/components/providers/auth-provider";
import ConditionalFooter from "@/components/layout/conditional-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xolotembikai Gift - Experience Gifts Platform",
  description: "Don't give boring gifts. Give unforgettable experiences that create lasting memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sourceCodePro.variable} antialiased min-h-screen font-sans`}
      >
        <AuthProvider>
          <Header />
          {children}
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
