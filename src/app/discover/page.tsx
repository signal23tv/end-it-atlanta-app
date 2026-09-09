import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import DiscoverSearch from "@/components/DiscoverSearch";

export default function DiscoverPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-black text-paper pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl">Find People</h1>
            <p className="text-muted text-sm">
              Search for other members by name or username.
            </p>
          </div>
          <DiscoverSearch />
        </div>
      </main>
      <ToddLauncher />
      <BottomNav />
    </>
  );
}
