import { GeistSans } from "geist/font";
import "./globals.css";
import UserDataContextProvider from "@/components/UserDataContext";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Resume Builder with GPT4",
  description: "The fastest way to build a resume with GPT4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <UserDataContextProvider>{children}</UserDataContextProvider>
        </main>
      </body>
    </html>
  );
}
