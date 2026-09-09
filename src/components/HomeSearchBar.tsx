"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/discover?q=${encodeURIComponent(q)}` : "/discover");
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search the app…"
        className="w-full rounded-full border border-[#304055] bg-[#0A1422] text-[#F7FAFF] placeholder:text-[#98ADC7] px-4 py-3 text-sm outline-none focus:border-gold"
      />
    </form>
  );
}
