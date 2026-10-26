"use client";

import type { Tenant } from "@/api/queries";

interface InstagramEmbedProps {
  tenant?: Tenant | null;
}

type SocialNetwork = {
  key: "facebook" | "instagram" | "tiktok" | "youtube";
  label: string;
  href: string;
};

const SOCIAL_META = {
  instagram: { label: "Instagram", baseUrl: "https://www.instagram.com/" },
  facebook: { label: "Facebook", baseUrl: "https://www.facebook.com/" },
  tiktok: { label: "TikTok", baseUrl: "https://www.tiktok.com/@" },
  youtube: { label: "YouTube", baseUrl: "https://www.youtube.com/" },
} as const;

function normalizeSocialUrl(
  value: string | undefined,
  key: keyof typeof SOCIAL_META,
) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return `${SOCIAL_META[key].baseUrl}${handle}`;
}

export function buildSocials(tenant?: Tenant | null): SocialNetwork[] {
  if (!tenant) return [];
  // Instagram first: it is the primary "Follow us" destination
  return (["instagram", "facebook", "tiktok", "youtube"] as const).flatMap(
    (key) => {
      const href = normalizeSocialUrl(tenant[key], key);
      return href ? [{ key, label: SOCIAL_META[key].label, href }] : [];
    },
  );
}

/** Reference "Follow us": one outline button, secondary networks as text links. */
export default function InstagramEmbed({ tenant }: InstagramEmbedProps) {
  const socials = buildSocials(tenant);
  if (socials.length === 0) return null;

  const [primary, ...rest] = socials;
  const name = tenant?.name || "House of Senses";

  return (
    <div className="flex flex-col items-center gap-5" style={{ color: "var(--color-main)" }}>
      <a
        href={primary.href}
        target="_blank"
        rel="noopener noreferrer"
        className="hos-btn hos-btn-outline min-w-[114px] md:min-w-[157px]"
        aria-label={`Follow ${name} on ${primary.label}`}
      >
        <span>Follow us</span>
      </a>
      {rest.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[15px]" style={{ color: "var(--color-ink)" }}>
          {rest.map((social) => (
            <li key={social.key}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hos-link"
                aria-label={`${name} on ${social.label}`}
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
