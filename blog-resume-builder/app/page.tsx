import Home from "@/components/Home";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-6xl flex justify-between items-center p-3 text-sm">
          <span className="font-bold select-none">resumeGPT.</span>
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col opacity-0 max-w-6xl px-3">
        <Home />
      </div>
    </div>
  );
}
