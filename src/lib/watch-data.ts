/**
 * Real END IT ATLANTA video playlist, embedded from Cloudflare Stream
 * (same videos already live on Signal 23 Universe). Public/free streams,
 * no auth needed -- `https://iframe.videodelivery.net/<id>`. Copy ported
 * verbatim from the source embed Henderson supplied; do not add
 * placeholder or invented videos, series, or categories here -- if we
 * don't have real content for a section (episodes, PSAs, reels), we
 * don't fake one.
 */

export type WatchVideo = {
  id: string;
  streamId: string;
  title: string;
};

export const WATCH_VIDEOS: WatchVideo[] = [
  {
    id: "the-real-catch",
    streamId: "755ec140bb3a8ac55045d209598cba6d",
    title: "The Real Catch",
  },
  {
    id: "shit-dont-stank",
    streamId: "6f127a3f88f2c0273a50506d90fadaf7",
    title: "Shit Don't Stank!",
  },
  {
    id: "end-it-atlanta-march",
    streamId: "48844e66eb241845e156a50e5a453187",
    title: "End It Atlanta March!",
  },
];

/**
 * Cloudflare Stream auto-generates a thumbnail from the actual video --
 * this is a real frame of the real content, not a placeholder image.
 * Docs: https://developers.cloudflare.com/stream/viewing-videos/displaying-thumbnails/
 */
export function watchThumbnail(streamId: string, height = 480) {
  return `https://videodelivery.net/${streamId}/thumbnails/thumbnail.jpg?time=1s&height=${height}`;
}
