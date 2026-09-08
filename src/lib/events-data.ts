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
};

export const EVENTS: EventItem[] = [
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
  },
];
