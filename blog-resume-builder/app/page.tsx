import { cookies } from "next/headers";

import AuthButton from "../components/AuthButton";

import { createClient } from "@/utils/supabase/server";

import Home from "@/components/Home";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-6xl flex justify-between items-center p-3 text-sm">
          <span className="font-bold select-none">resumeGPT.</span>
          {/* 👇🏻 This is a pre given component from supabase that allows user to authenticate */}
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-6xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          {user ? (
            <Home />
          ) : (
            <h1 className="font-bold text-xl text-white">
              You are not logged in. Please authenticate...
            </h1>
          )}
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
