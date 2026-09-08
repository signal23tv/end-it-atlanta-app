export type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: Pick<Profile, "id" | "username" | "display_name" | "avatar_url">;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
};
