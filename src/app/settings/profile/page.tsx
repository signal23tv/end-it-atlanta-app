import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";
import ProfileEditForm from "@/components/ProfileEditForm";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <>
      <Nav />
      <main className="flex-1 bg-[color:var(--paper)]">
        <div className="max-w-sm mx-auto px-4 py-6">
          <ProfileEditForm
            displayName={profile.display_name}
            bio={profile.bio ?? ""}
          />
        </div>
      </main>
    </>
  );
}
