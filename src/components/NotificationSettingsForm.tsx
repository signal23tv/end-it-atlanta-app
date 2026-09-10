"use client";

import { useState, useTransition } from "react";
import {
  updateNotificationPreference,
  unsubscribePush,
  type NotificationPreferences,
} from "@/app/notifications/actions";
import { sendTestNotification } from "@/app/settings/notifications/actions";
import EnablePushButton from "@/components/EnablePushButton";

type Device = {
  endpoint: string;
  last_seen_at: string;
  revoked_at: string | null;
};

const CATEGORIES: { key: keyof NotificationPreferences; label: string }[] = [
  { key: "category_service", label: "Account & service updates" },
  { key: "category_messages", label: "Messages from eligible members" },
  { key: "category_navigator", label: "Navigator messages" },
  { key: "category_events", label: "Event updates" },
  { key: "category_education", label: "Education & community updates" },
  { key: "category_prep_tv", label: "PrEP TV" },
  { key: "category_ambassador", label: "Ambassador assignments" },
  { key: "category_reminders", label: "Health reminders you create" },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors ${
          checked ? "bg-red" : "bg-black/20"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
}

export default function NotificationSettingsForm({
  initialPrefs,
  devices,
}: {
  initialPrefs: NotificationPreferences;
  devices: Device[];
}) {
  const [prefs, setPrefs] = useState(initialPrefs);
  const [, startTransition] = useTransition();
  const [testStatus, setTestStatus] = useState<Record<string, string>>({});

  function set<K extends keyof NotificationPreferences>(
    key: K,
    value: boolean
  ) {
    setPrefs((p) => ({ ...p, [key]: value }));
    startTransition(async () => {
      await updateNotificationPreference(key, value);
    });
  }

  const activeDevices = devices.filter((d) => !d.revoked_at);

  return (
    <div className="flex flex-col gap-6">
      <EnablePushButton />

      <section className="bg-white border border-black/10 rounded-xl p-5">
        <Toggle
          checked={prefs.master}
          onChange={(v) => set("master", v)}
          label="Notifications (master switch)"
        />
        <p className="text-xs text-muted mt-1">
          Turning this off stops future notifications on all your devices.
          Your browser or device settings can also block notifications
          independently of this switch.
        </p>
      </section>

      <section className="bg-white border border-black/10 rounded-xl p-5">
        <h2 className="font-semibold mb-1">Categories</h2>
        <div className="divide-y divide-black/5">
          {CATEGORIES.map((c) => (
            <Toggle
              key={c.key}
              checked={prefs[c.key]}
              onChange={(v) => set(c.key, v)}
              label={c.label}
            />
          ))}
        </div>
      </section>

      <section className="bg-white border border-black/10 rounded-xl p-5">
        <h2 className="font-semibold mb-2">Your devices</h2>
        {activeDevices.length === 0 ? (
          <p className="text-sm text-muted">
            No device is set up for push notifications yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {activeDevices.map((d) => (
              <li
                key={d.endpoint}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium">Device setup active</p>
                  <p className="text-muted text-xs">
                    Last seen {new Date(d.last_seen_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setTestStatus((s) => ({ ...s, [d.endpoint]: "sending" }));
                      const res = await sendTestNotification(d.endpoint);
                      setTestStatus((s) => ({
                        ...s,
                        [d.endpoint]: res.ok ? "sent" : "failed",
                      }));
                    }}
                    className="text-xs font-semibold underline"
                  >
                    {testStatus[d.endpoint] === "sending"
                      ? "Sending…"
                      : testStatus[d.endpoint] === "sent"
                      ? "Sent"
                      : testStatus[d.endpoint] === "failed"
                      ? "Failed"
                      : "Send test"}
                  </button>
                  <button
                    onClick={() => unsubscribePush(d.endpoint)}
                    className="text-xs font-semibold text-red-dark underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
