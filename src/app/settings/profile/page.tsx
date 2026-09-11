import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
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
    .select("username, display_name, bio, avatar_url, avatar_color")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <>
      <Nav />
      <main className="eit-app flex-1 pb-24">
        <div className="eit-shell max-w-sm mx-auto">
          <ProfileEditForm
            displayName={profile.display_name}
            bio={profile.bio ?? ""}
            avatarUrl={profile.avatar_url}
            avatarColor={profile.avatar_color}
          />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
