"use client";

const ICON = "/assets/endit/v1/icons";

/**
 * Opens the global `GetAppSheet` (mounted once in the root layout) by
 * dispatching a window event, rather than duplicating install logic
 * here. Styled to match the other real `.eit-menu-row` links on this
 * page even though it's a button, not a Link (nothing to navigate to).
 */
export default function GetAppMenuRow() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("eia:open-get-app"))}
      className="eit-menu-row w-full text-left"
    >
      <span className="eit-menu-icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ICON}/download.svg`} alt="" width={20} height={20} />
      </span>
      <span>
        <strong>Get the App</strong>
        <small>Install END IT ATLANTA on your phone -- no app store needed</small>
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ICON}/chevron-left.svg`}
        alt=""
        className="eit-chevron"
        style={{ transform: "rotate(180deg)" }}
      />
    </button>
  );
}
