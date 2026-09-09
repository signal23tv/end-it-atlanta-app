"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  FULTON_LOCATIONS,
  MORE_RESOURCES,
  FULTON_BOARD_OF_HEALTH,
  TODD_CONTACT,
  LAST_VERIFIED,
  mapsUrl,
  mapEmbedUrl,
  telHref,
  type ServiceTag,
  type FultonLocation,
  type MoreResource,
} from "@/lib/resources-data";
import { sendReferralEvent, submitConnectionRequest } from "@/lib/tracking";

// Leaflet touches `window` at import time, so it can only run in the
// browser -- ssr: false keeps it out of the server render entirely
// instead of crashing the build.
const ClinicMap = dynamic(() => import("@/components/ClinicMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-[#304055] mb-8 h-80 flex items-center justify-center text-muted text-sm bg-[#0A1422]">
      Loading map…
    </div>
  ),
});

const SERVICE_LABELS: Record<string, string> = {
  testing: "getting tested",
  prep: "starting PrEP",
  unsure: "seeing all resources",
};

function reorder<T extends { services: ServiceTag[] }>(
  list: T[],
  selected: ServiceTag | null
): T[] {
  if (!selected || selected === "unsure") return list.slice();
  const match = list.filter((l) => l.services.includes(selected));
  const rest = list.filter((l) => !l.services.includes(selected));
  return match.concat(rest);
}

function ResourceCard({
  loc,
  selectedService,
}: {
  loc: FultonLocation;
  selectedService: ServiceTag | null;
}) {
  const isRecommended =
    Boolean(selectedService) && selectedService !== "unsure" && loc.services.includes(selectedService!);
  const [showMap, setShowMap] = useState(false);

  return (
    <article
      className={`rounded-xl border p-5 bg-[#101A28] text-[#F7FAFF] ${
        isRecommended ? "border-gold ring-1 ring-gold" : "border-[#304055]"
      }`}
    >
      {isRecommended && (
        <span className="inline-block bg-gold text-black text-xs font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">
          Recommended for you
        </span>
      )}
      <h3 className="font-display text-xl">{loc.name}</h3>
      <p className="text-sm mt-1">{loc.address}</p>
      <p className="text-sm text-muted mt-1">{loc.servicesLabel}</p>
      {loc.hours && <p className="text-xs text-muted mt-2">{loc.hours}</p>}
      <p className="text-xs text-muted mt-2">
        {loc.note} Call before visiting to confirm current hours, services, cost, and
        appointment requirements.
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        <a
          href={telHref(loc.phone)}
          onClick={() =>
            sendReferralEvent("call_clicked", {
              provider_id: "fulton_boh",
              location_id: loc.id,
              action: "call",
            })
          }
          className="bg-red hover:bg-red-dark text-paper text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          Call • {loc.phone}
        </a>
        <a
          href={mapsUrl(loc.address)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendReferralEvent("directions_clicked", {
              provider_id: "fulton_boh",
              location_id: loc.id,
              action: "directions",
            })
          }
          className="border border-gold text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          Get Directions
        </a>
        <button
          type="button"
          onClick={() => setShowMap((s) => !s)}
          className="border border-[#304055] text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
        <a
          href={loc.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendReferralEvent("official_site_clicked", {
              provider_id: "fulton_boh",
              location_id: loc.id,
              action: "official_site",
            })
          }
          className="border border-gold text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          View Official Info ↗
        </a>
        <a
          href="#connect-form"
          className="bg-black text-paper text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          Ask For Help Connecting
        </a>
      </div>
      {showMap && (
        <div className="mt-4 rounded-lg overflow-hidden border border-[#304055]">
          <iframe
            src={mapEmbedUrl(loc.address)}
            title={`Map showing ${loc.name}`}
            loading="lazy"
            className="w-full h-64 border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </article>
  );
}

function MoreResourceCard({ loc }: { loc: MoreResource }) {
  const links = [loc.officialUrl, loc.officialUrl2].filter(Boolean) as string[];
  return (
    <article className="rounded-xl border border-[#304055] p-5 bg-[#101A28] text-[#F7FAFF]">
      <h3 className="font-display text-xl">{loc.name}</h3>
      <p className="text-sm mt-1">{loc.address}</p>
      <p className="text-sm text-muted mt-1">{loc.servicesLabel}</p>
      <p className="text-xs text-muted mt-2">{loc.note}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        <a
          href={telHref(loc.phone)}
          onClick={() => sendReferralEvent("call_clicked", { provider_id: loc.id, action: "call" })}
          className="bg-red hover:bg-red-dark text-paper text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          Call • {loc.phone}
        </a>
        <a
          href={mapsUrl(loc.address)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            sendReferralEvent("directions_clicked", { provider_id: loc.id, action: "directions" })
          }
          className="border border-gold text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          Get Directions
        </a>
        {links.map((url, i) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              sendReferralEvent("official_site_clicked", { provider_id: loc.id, action: "official_site" })
            }
            className="border border-gold text-[#F7FAFF] text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
          >
            View Official Info{links.length > 1 ? ` ${i + 1}` : ""} ↗
          </a>
        ))}
        <a
          href="#connect-form"
          className="bg-black text-paper text-xs font-bold uppercase tracking-wide rounded-md px-3 py-2"
        >
          Ask For Help Connecting
        </a>
      </div>
    </article>
  );
}

export default function GetConnectedClient() {
  const [selectedService, setSelectedService] = useState<ServiceTag | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [formStarted, setFormStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"idle" | "ok" | "error">("idle");
  const [contactMethod, setContactMethod] = useState<"phone" | "text" | "email" | "">("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    if (service === "testing" || service === "prep" || service === "unsure") {
      setSelectedService(service);
    }
  }, []);

  const orderedFulton = useMemo(
    () => reorder(FULTON_LOCATIONS, selectedService),
    [selectedService]
  );

  function chooseService(service: ServiceTag) {
    sendReferralEvent("service_selected", { service_type: service, source: "get_connected_page" });
    setSelectedService(service);
    setStatusMsg(`Showing resources for ${SERVICE_LABELS[service] || service}.`);
    const url = `?service=${encodeURIComponent(service)}`;
    window.history.pushState({ service }, "", url);
    document.getElementById("results-heading")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const method = formData.get("contact_method") as "phone" | "text" | "email" | null;
    const contactValue = String(formData.get("contact_value") || "").trim();
    const zip = String(formData.get("zip_code") || "").trim();
    const interest = formData.get("service_interest") as string;
    const preferredTime = (formData.get("preferred_time") as string) || null;
    const consent = formData.get("consent");

    if (!name || !method || !contactValue || !interest || !consent) {
      setSubmitResult("error");
      return;
    }
    if (zip && !/^[0-9]{5}$/.test(zip)) {
      setSubmitResult("error");
      return;
    }

    setSubmitting(true);
    const result = await submitConnectionRequest({
      first_name_or_nickname: name,
      contact_method: method,
      contact_value: contactValue,
      zip_code: zip || null,
      service_interest: interest as "testing" | "prep" | "pep" | "sti" | "unsure",
      preferred_time: preferredTime as "morning" | "afternoon" | "evening" | null,
      consent_at: new Date().toISOString(),
      status: "new",
    });
    setSubmitting(false);

    if (result.ok) {
      sendReferralEvent("help_form_submitted", {
        service_type: interest as "testing" | "prep" | "pep" | "sti" | "unsure",
        source: "get_connected_page",
      });
      form.reset();
      setContactMethod("");
      setSubmitResult("ok");
    } else {
      setSubmitResult("error");
    }
  }

  return (
    <>
      {/* INTRO */}
      <section
        className="py-14 md:py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgb(6 11 19 / .3), rgb(6 11 19 / .96)), url(/assets/endit/v1/backgrounds/atmosphere-blue.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-red font-bold uppercase tracking-wide text-sm mb-2">
            Take the First Step
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">YOU&apos;RE ONE STEP CLOSER.</h1>
          <p className="mb-3">
            Choose what you need and we&apos;ll connect you with trusted Atlanta-area
            resources. You can view every resource without giving us your name.
          </p>
          <p className="text-sm text-muted flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/endit/v1/icons/lock.svg" alt="" width={14} height={14} />
            Your privacy matters. Selecting an option below does not require you to share
            personal or medical information.
          </p>
        </div>
      </section>

      {/* SERVICE CHOICE */}
      <section className="pb-12" aria-label="Choose what you need">
        <div className="max-w-4xl mx-auto px-4">
          <div
            role="group"
            aria-label="What do you need help with?"
            className="grid md:grid-cols-3 gap-4"
          >
            {(
              [
                { key: "testing", title: "I WANT TO GET TESTED", body: "Find HIV and sexual-health testing options, phone numbers, directions, and official information.", icon: "science" },
                { key: "prep", title: "I WANT TO START PrEP", body: "Connect with providers who can explain PrEP, eligibility, appointments, and payment-assistance options.", icon: "pill" },
                { key: "unsure", title: "I'M NOT SURE YET", body: "See all resources or speak with someone who can help you decide on a next step.", icon: "help" },
              ] as const
            ).map((s) => (
              <button
                key={s.key}
                type="button"
                aria-pressed={selectedService === s.key}
                onClick={() => chooseService(s.key)}
                className={`text-left rounded-xl border p-5 transition-colors ${
                  selectedService === s.key
                    ? "border-gold bg-gold/10"
                    : "border-[#304055] hover:border-gold"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/endit/v1/icons/${s.icon}.svg`}
                  alt=""
                  width={22}
                  height={22}
                  className="mb-2"
                />
                <h2 className="font-display text-xl mb-2">{s.title}</h2>
                <p className="text-sm text-muted">{s.body}</p>
              </button>
            ))}
          </div>
          <p role="status" aria-live="polite" className="mt-3 text-sm text-muted">
            {statusMsg}
          </p>
        </div>
      </section>

      {/* PEP ALERT */}
      <section className="py-10 bg-black text-paper">
        <div className="max-w-4xl mx-auto px-4">
          <div className="border border-red rounded-xl p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/endit/v1/icons/warning.svg" alt="" width={26} height={26} className="mb-2" />
            <h2 className="font-display text-2xl md:text-3xl mb-3">
              WAS THE POSSIBLE EXPOSURE WITHIN THE LAST 72 HOURS?
            </h2>
            <p className="text-muted mb-4">
              PEP is an emergency medication that may help prevent HIV after a possible
              exposure. It must be started as soon as possible and within 72 hours. Contact a
              healthcare provider, urgent care center, or emergency department now. Do not wait
              for a response from this website.
            </p>
            <a
              href="https://www.cdc.gov/hiv/prevention/pep.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                sendReferralEvent("official_site_clicked", { provider_id: "cdc_pep", action: "official_site" })
              }
              className="inline-block bg-paper text-black hover:bg-white font-bold uppercase tracking-wide rounded-md px-5 py-2.5 text-sm"
            >
              CDC: PEP Information ↗
            </a>
          </div>
        </div>
      </section>

      {/* TODD CONTACT CARD */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-xl border-2 border-gold p-6 md:p-8 bg-[#101A28] text-[#F7FAFF] flex flex-col sm:flex-row gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/endit/v1/todd/todd-avatar.webp"
              alt="Todd Hall"
              className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-gold/60"
            />
            <div>
              <p className="text-red font-bold uppercase tracking-wide text-xs mb-2">
                Need a Human Connection?
              </p>
              <h2 className="font-display text-2xl md:text-3xl mb-3">
                {TODD_CONTACT.name} — {TODD_CONTACT.role}
              </h2>
            <p className="mb-5">
              Todd is END IT ATLANTA&apos;s point of contact for questions and help connecting
              with public-health resources. You may call, text, or email him directly.
            </p>
            <div className="flex flex-wrap gap-3 mb-5">
              <a
                href={`tel:${TODD_CONTACT.phoneTel}`}
                onClick={() =>
                  sendReferralEvent("call_clicked", { provider_id: "todd_hall", action: "call" })
                }
                className="bg-red hover:bg-red-dark text-paper font-bold uppercase tracking-wide rounded-md px-5 py-2.5 text-sm"
              >
                Call Todd
              </a>
              <a
                href={`sms:${TODD_CONTACT.phoneTel}`}
                onClick={() =>
                  sendReferralEvent("text_clicked", { provider_id: "todd_hall", action: "text" })
                }
                className="border border-gold text-[#F7FAFF] font-bold uppercase tracking-wide rounded-md px-5 py-2.5 text-sm"
              >
                Text Todd
              </a>
              <a
                href={`mailto:${TODD_CONTACT.email}?subject=${encodeURIComponent(
                  TODD_CONTACT.emailSubject
                )}&body=${encodeURIComponent(TODD_CONTACT.emailBody)}`}
                onClick={() =>
                  sendReferralEvent("email_clicked", { provider_id: "todd_hall", action: "email" })
                }
                className="border border-gold text-[#F7FAFF] font-bold uppercase tracking-wide rounded-md px-5 py-2.5 text-sm"
              >
                Email Todd
              </a>
            </div>
            <dl className="text-sm grid grid-cols-2 gap-3 max-w-sm">
              <div>
                <dt className="text-muted">Phone</dt>
                <dd>{TODD_CONTACT.phoneDisplay}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="break-all">{TODD_CONTACT.email}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted mt-5">
              Todd is a connection resource, not an emergency service or a substitute for
              medical care.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* FULTON RESOURCES */}
      <section className="py-14 bg-[#0A1422]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-red font-bold uppercase tracking-wide text-xs mb-2">
            Fulton County Board of Health
          </p>
          <h2 id="results-heading" tabIndex={-1} className="font-display text-3xl md:text-4xl mb-3">
            TRUSTED ATLANTA-AREA RESOURCES
          </h2>
          <p className="text-sm mb-8">
            General assistance:{" "}
            <a href={`tel:+1${FULTON_BOARD_OF_HEALTH.generalPhone.replace(/\D/g, "")}`} className="text-red">
              {FULTON_BOARD_OF_HEALTH.generalPhone}
            </a>{" "}
            • PrEP Clinic information:{" "}
            <a href={`tel:+1${FULTON_BOARD_OF_HEALTH.prepPhone.replace(/\D/g, "")}`} className="text-red">
              {FULTON_BOARD_OF_HEALTH.prepPhone}
            </a>{" "}
            •{" "}
            <a
              href={FULTON_BOARD_OF_HEALTH.locationsPage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red"
            >
              All locations ↗
            </a>
          </p>

          <ClinicMap
            pins={[...FULTON_LOCATIONS, ...MORE_RESOURCES].map((loc) => ({
              id: loc.id,
              name: loc.name,
              address: loc.address,
              phone: loc.phone,
              lat: loc.lat,
              lng: loc.lng,
            }))}
          />

          <div className="grid md:grid-cols-2 gap-5">
            {orderedFulton.map((loc) => (
              <ResourceCard key={loc.id} loc={loc} selectedService={selectedService} />
            ))}
          </div>

          <p className="text-xs text-muted mt-6 max-w-2xl">
            {FULTON_BOARD_OF_HEALTH.costNote}
          </p>
          <p className="text-xs text-muted mt-1">Last verified: {LAST_VERIFIED}</p>
        </div>
      </section>

      {/* MORE RESOURCES */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl mb-6">MORE WAYS TO GET CONNECTED</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {MORE_RESOURCES.map((loc) => (
              <MoreResourceCard key={loc.id} loc={loc} />
            ))}
          </div>

          <div className="rounded-xl border border-[#304055] p-6">
            <h3 className="font-display text-xl mb-2">Find Testing Near You</h3>
            <p className="text-sm mb-4">
              Search for confidential free or low-cost HIV, STI, and related testing services
              by ZIP code.
            </p>
            <a
              href="https://gettested.cdc.gov/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                sendReferralEvent("official_site_clicked", { provider_id: "cdc_locator", action: "official_site" })
              }
              className="inline-block border border-gold text-[#F7FAFF] font-bold uppercase tracking-wide rounded-md px-5 py-2.5 text-sm"
            >
              Search by ZIP Code ↗
            </a>
          </div>
        </div>
      </section>

      {/* CONNECT FORM */}
      <section id="connect-form" className="py-16 bg-black text-paper">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-[1fr_1.3fr] gap-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              WANT SOMEONE TO HELP YOU CONNECT?
            </h2>
            <p className="text-muted mb-4">
              Share only what is needed for a follow-up. Please do not include medical
              details, your HIV status, or other sensitive health information.
            </p>
            <p className="text-xs text-muted">
              END IT ATLANTA uses the information in this form only to respond to your
              connection request. END IT ATLANTA does not provide medical diagnosis or
              treatment. Please do not submit medical information. See our{" "}
              <a href="/privacy" className="text-gold underline">
                Privacy Notice
              </a>{" "}
              for details about access, retention, and deletion.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            onFocus={() => {
              if (!formStarted) {
                setFormStarted(true);
                sendReferralEvent("help_form_started", { source: "get_connected_page" });
              }
            }}
            className="flex flex-col gap-4 bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6"
          >
            {submitResult === "error" && (
              <p role="alert" className="text-red text-sm font-semibold">
                Please fill in your name, contact method, contact info, what you&apos;d like
                help with, and check the consent box. If it still doesn&apos;t go through, use
                one of the phone or clinic options above.
              </p>
            )}

            <div>
              <label htmlFor="field-name" className="block text-sm font-semibold mb-1">
                First name or nickname
              </label>
              <input
                id="field-name"
                name="name"
                autoComplete="given-name"
                required
                maxLength={100}
                className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2"
              />
            </div>

            <fieldset>
              <legend className="block text-sm font-semibold mb-1">
                Preferred contact method
              </legend>
              <div className="flex gap-4 text-sm">
                {(["phone", "text", "email"] as const).map((m) => (
                  <label key={m} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="contact_method"
                      value={m}
                      required
                      checked={contactMethod === m}
                      onChange={() => setContactMethod(m)}
                    />
                    {m === "phone" ? "Phone call" : m === "text" ? "Text" : "Email"}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="field-contact-value" className="block text-sm font-semibold mb-1">
                {contactMethod === "email" ? "Email address" : "Phone number or email address"}
              </label>
              <input
                id="field-contact-value"
                name="contact_value"
                required
                maxLength={254}
                inputMode={contactMethod === "email" ? "email" : "tel"}
                className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2"
              />
              <p className="text-xs text-muted mt-1">
                We&apos;ll use this only to follow up on your request.
              </p>
            </div>

            <div>
              <label htmlFor="field-zip" className="block text-sm font-semibold mb-1">
                ZIP code <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="field-zip"
                name="zip_code"
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                autoComplete="postal-code"
                className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="field-interest" className="block text-sm font-semibold mb-1">
                What do you want help with?
              </label>
              <select
                id="field-interest"
                name="service_interest"
                required
                defaultValue=""
                className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2"
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="testing">Testing</option>
                <option value="prep">PrEP</option>
                <option value="pep">PEP</option>
                <option value="sti">STI services</option>
                <option value="unsure">Not sure</option>
              </select>
            </div>

            <div>
              <label htmlFor="field-time" className="block text-sm font-semibold mb-1">
                Best general time to reach you{" "}
                <span className="text-muted font-normal">(optional)</span>
              </label>
              <select
                id="field-time"
                name="preferred_time"
                defaultValue=""
                className="w-full rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2"
              >
                <option value="">No preference</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-xs">
              <input type="checkbox" name="consent" required className="mt-1" />
              <span>
                I agree that END IT ATLANTA or its designated connection contact may use the
                information I provided to contact me about this request. I understand this
                form is not for emergencies or medical advice.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide rounded-md px-5 py-3"
            >
              {submitting ? "Sending…" : "Send My Request"}
            </button>

            {submitResult === "ok" && (
              <p role="status" aria-live="polite" className="text-sm font-semibold text-[#F7FAFF]">
                Your request has been received. If you need immediate help, use one of the
                phone or clinic options above.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
