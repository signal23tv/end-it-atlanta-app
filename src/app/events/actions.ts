"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { EVENTS } from "@/lib/events-data";

export type RsvpState = {
  eventId: string;
  count: number;
  going: boolean;
};

/** Real RSVP counts + the current user's own status, for every known event. */
export async function getRsvpStates(): Promise<RsvpState[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("event_rsvps")
    .select("event_id, user_id");

  return EVENTS.map((e) => {
    const forEvent = (rows ?? []).filter((r) => r.event_id === e.id);
    return {
      eventId: e.id,
      count: forEvent.length,
      going: user ? forEvent.some((r) => r.user_id === user.id) : false,
    };
  });
}

export async function toggleRsvp(eventId: string, currentlyGoing: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Reject RSVPs for event ids that don't correspond to a real, known event.
  if (!EVENTS.some((e) => e.id === eventId)) return;

  if (currentlyGoing) {
    await supabase
      .from("event_rsvps")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("event_rsvps")
      .insert({ event_id: eventId, user_id: user.id });
  }

  revalidatePath("/events");
  revalidatePath("/discover");
  revalidatePath("/feed");
}
