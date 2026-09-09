import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import ToddLauncher from "@/components/ToddLauncher";
import DiscoverSearch from "@/components/DiscoverSearch";

export default function DiscoverPage() {
  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell flex flex-col gap-4">
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(6 11 19 / .55), rgb(6 11 19 / .92)), url(/assets/endit/v1/backgrounds/atmosphere-purple.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h1 className="text-3xl" style={{ fontFamily: "var(--eit-font-display)" }}>
              Find People
            </h1>
            <p className="eit-muted text-sm">
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
