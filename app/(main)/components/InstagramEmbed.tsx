"use client";

import { useEffect } from "react";

interface InstagramEmbedProps {
  url: string;
}

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
  useEffect(() => {
    // Load Instagram embed script
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [url]);

  // Instagram only supports post/reel embeds, not profile pages.
  // We render a polished profile card that links to the profile.
  const handle = url.replace(/\/$/, "").split("/").pop() ?? "";

  return (
    <section
      className="w-full flex flex-col items-center py-20 px-8"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Label */}
      <span
        className="text-[10px] tracking-[0.38em] uppercase mb-8"
        style={{ color: "var(--color-sand)" }}
      >
        Follow us
      </span>

      {/* Profile card */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-5 transition-opacity duration-300 hover:opacity-80"
      >
        {/* Instagram gradient ring */}
        <div
          className="w-24 h-24 rounded-full p-[3px]"
          style={{
            background:
              "radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--background)" }}
          >
            {/* Instagram icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-10 h-10"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "var(--foreground)" }}
              />
              <circle
                cx="12"
                cy="12"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "var(--foreground)" }}
              />
              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                style={{ color: "var(--foreground)" }}
              />
            </svg>
          </div>
        </div>

        {/* Handle */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-[15px] font-semibold tracking-[0.04em]"
            style={{ color: "var(--foreground)" }}
          >
            @{handle}
          </span>
          <span
            className="text-[11px] tracking-[0.12em]"
            style={{ color: "var(--foreground)", opacity: 0.55 }}
          >
            instagram.com
          </span>
        </div>

        {/* Follow button */}
        {/* <div
          className="px-10 py-2.5 text-[11px] tracking-[0.28em] uppercase font-medium transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(135deg, #fd5949 0%, #d6249f 50%, #285AEB 100%)",
            color: "#fff",
          }}
        >
          Follow
        </div> */}
      </a>
    </section>
  );
}
