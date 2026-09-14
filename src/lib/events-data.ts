/**
 * Real community events. Copy ported verbatim from the homepage's
 * "Featured Community Event" section -- not new content. This is
 * the only confirmed event as of this build; do not add placeholder
 * or invented events here. `dateISO` drives the honest
 * upcoming-vs-past split on /events (computed against the current
 * date at render time, not hardcoded).
 */

export type EventItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  dateISO: string; // event start, ISO 8601
  dateLabel: string;
  timeLabel: string;
  detailLine: string;
  locationLine: string;
  imageSrc: string;
  imageAlt: string;
  // Real intrinsic pixel dimensions of imageSrc -- required so
  // <Image> renders at the image's true aspect ratio instead of
  // stretching/squishing it to a hardcoded ratio that doesn't match.
  imageWidth: number;
  imageHeight: number;
  // Aspect ratio the /events grid card crops its thumbnail to.
  // Defaults to "16/9" (the original event-photo shape) when
  // omitted; set to "1/1" for a square flyer/poster asset so
  // object-cover doesn't crop it.
  cardAspect?: "16/9" | "1/1";
};

export const EVENTS: EventItem[] = [
  {
    id: "prep-rally-2026",
    title: "PrEP Rally Atlanta",
    subtitle: "Powerful performances. Real conversations. A brighter tomorrow.",
    description:
      "Same people, brighter futures. Good health looks good on you -- safe, sexier, stronger, together. Community, culture, prevention, all of us.",
    dateISO: "2026-10-10T18:00:00-04:00",
    dateLabel: "Saturday, October 10, 2026",
    timeLabel: "6:00 PM",
    detailLine: "Powerful performances. Real conversations. A brighter tomorrow.",
    locationLine: "MIXX ATL, Atlanta, Georgia",
    imageSrc: "/assets/endit/v1/events/prep-rally-2026.webp",
    imageAlt:
      "PrEP Rally Atlanta flyer -- End It Atlanta presents, October 10, 2026 at MIXX ATL, over an Atlanta skyline at night",
    imageWidth: 1200,
    imageHeight: 1200,
    cardAspect: "1/1",
  },
  {
    id: "night-to-reign-2026",
    title: "A Night to Reign",
    subtitle: "The 2026 Signal Fest Gay Prom",
    description:
      "An unforgettable evening of purpose, elegance, and community presented by End It Atlanta.",
    dateISO: "2026-09-06T18:00:00-04:00",
    dateLabel: "Sunday, September 6, 2026",
    timeLabel: "6:00 PM",
    detailLine: "Atlanta Black Pride Weekend",
    locationLine: "Atlanta, Georgia — official venue reveal coming soon",
    imageSrc: "/images/night-to-reign-prom.png",
    imageAlt: "Guests in formal black-tie attire beneath an illuminated gold crown at a gala",
    imageWidth: 1672,
    imageHeight: 941,
  },
];
