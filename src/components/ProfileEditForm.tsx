"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import {
  updateProfile,
  type ProfileEditState,
} from "@/app/settings/profile/actions";
import Avatar from "@/components/Avatar";
import { resizeImageToDataUrl } from "@/lib/resizeImage";

const AVATAR_SWATCHES: { value: string; hex: string; label: string }[] = [
  { value: "red", hex: "#e5161c", label: "Red" },
  { value: "gold", hex: "#d5a94b", label: "Gold" },
  { value: "blue", hex: "#3b82f6", label: "Blue" },
  { value: "purple", hex: "#8b5cf6", label: "Purple" },
  { value: "cyan", hex: "#06b6d4", label: "Cyan" },
];

const initialState: ProfileEditState = {};

export default function ProfileEditForm({
  displayName,
  bio,
  avatarUrl,
  avatarColor,
}: {
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  avatarColor: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );

  const [name, setName] = useState(displayName);
  const [color, setColor] = useState(avatarColor ?? "gold");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const hasExistingPhoto = Boolean(avatarUrl);
  const showingPhoto: string | null =
    photoDataUrl ?? (!removePhoto && avatarUrl ? avatarUrl : null);

  async function onPhotoPicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    try {
      setPhotoError(null);
      const dataUrl = await resizeImageToDataUrl(file);
      setPhotoDataUrl(dataUrl);
      setRemovePhoto(false);
    } catch {
      setPhotoError("Couldn't use that photo -- try a different one.");
    }
  }

  return (
    <form
      action={formAction}
      className="bg-[#101A28] border border-[#304055] text-[#F7FAFF] rounded-xl p-6 flex flex-col gap-4"
    >
      <h1 className="text-2xl">Edit profile</h1>

      <input type="hidden" name="avatar_color" value={color} />
      <input type="hidden" name="avatar_data_url" value={photoDataUrl ?? ""} />
      <input
        type="hidden"
        name="remove_avatar_photo"
        value={removePhoto ? "1" : ""}
      />

      <div className="flex items-center gap-4">
        <label className="relative shrink-0 cursor-pointer group">
          {showingPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={showingPhoto}
              alt=""
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <Avatar
              src={null}
              color={color}
              name={name || "?"}
              size={64}
              className="ring-2 ring-white/10"
            />
          )}
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0A1422] border border-[#304055] flex items-center justify-center group-hover:border-gold transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/endit/v1/icons/camera.svg"
              alt=""
              width={12}
              height={12}
              style={{ filter: "invert(1)" }}
            />
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoPicked}
            className="sr-only"
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-[#98ADC7]">
            {photoDataUrl
              ? "New photo -- tap to change again"
              : "Tap the circle to add or change your photo"}
          </p>
          <div className="flex items-center gap-2">
            {AVATAR_SWATCHES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  setColor(s.value);
                  setPhotoDataUrl(null);
                  setRemovePhoto(true);
                }}
                aria-label={`Use ${s.label} avatar`}
                aria-pressed={!showingPhoto && color === s.value}
                className={`w-5 h-5 rounded-full border-2 ${
                  !showingPhoto && color === s.value
                    ? "border-[#7DD3FC]"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: s.hex }}
              />
            ))}
            {(hasExistingPhoto && !removePhoto) || photoDataUrl ? (
              <button
                type="button"
                onClick={() => {
                  setPhotoDataUrl(null);
                  setRemovePhoto(true);
                }}
                className="text-xs text-[#98ADC7] hover:text-[#FF91A2] underline ml-1"
              >
                Remove photo
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {photoError && (
        <p className="text-[#FF91A2] text-xs font-semibold -mt-2">{photoError}</p>
      )}

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Display name
        <input
          name="display_name"
          type="text"
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2 text-base font-normal outline-none focus:border-gold"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Bio
        <textarea
          name="bio"
          rows={3}
          maxLength={280}
          defaultValue={bio}
          className="resize-none rounded-md border border-[#304055] bg-[#0A1422] text-[#F7FAFF] px-3 py-2 text-base font-normal outline-none focus:border-gold"
        />
      </label>

      {state?.error && (
        <p role="alert" className="text-[#FF91A2] text-sm font-semibold">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-red hover:bg-red-dark disabled:opacity-60 text-paper font-bold uppercase tracking-wide rounded-md py-3 transition-colors"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
