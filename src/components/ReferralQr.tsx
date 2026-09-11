"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function ReferralQr({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 220,
      margin: 1,
      color: { dark: "#060B13", light: "#F7FAFF" },
    }).then((data) => {
      if (!cancelled) setDataUrl(data);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-[#F7FAFF] p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR code for your referral link" width={180} height={180} />
        ) : (
          <div className="w-[180px] h-[180px] animate-pulse bg-black/10 rounded" />
        )}
      </div>
      <p className="text-xs text-[#98ADC7] break-all text-center max-w-xs">{url}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="rounded-md border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide text-xs px-4 py-2 transition-colors"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        {dataUrl && (
          <a
            href={dataUrl}
            download="end-it-atlanta-qr.png"
            className="rounded-md border border-[#304055] hover:border-gold text-[#F7FAFF] font-bold uppercase tracking-wide text-xs px-4 py-2 transition-colors"
          >
            Download QR
          </a>
        )}
      </div>
    </div>
  );
}
