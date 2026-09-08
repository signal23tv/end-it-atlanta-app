import Nav from "@/components/Nav";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { getFeedPosts } from "@/lib/posts";

export default async function FeedPage() {
  const posts = await getFeedPosts();

  return (
    <>
      <Nav />
      <main className="flex-1 bg-[color:var(--paper)]">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
          <PostComposer />

          {posts.length === 0 ? (
            <p className="text-muted text-center py-12">
              No posts yet — be the first to share something.
            </p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>
    </>
  );
}
