"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useTenant } from "@/app/contexts/TenantContext";

const CTA = () => {
  const { tenant } = useTenant();

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any = null;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !sectionRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        // Set initial states
        gsap.set(
          [
            labelRef.current,
            titleRef.current,
            textRef.current,
            buttonsRef.current,
          ],
          {
            opacity: 0,
            y: 36,
          },
        );
        gsap.set(ruleRef.current, {
          scaleX: 0,
          transformOrigin: "center center",
        });

        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.7 })
          .to(
            titleRef.current,
            { opacity: 1, y: 0, duration: 1, ease: "power4.out" },
            "-=0.3",
          )
          .to(
            ruleRef.current,
            { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
            "-=0.4",
          )
          .to(textRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
          .to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3");
      }, sectionRef);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tenantName = tenant ? tenant.name.toLowerCase() : "houseofsenses.vn";
  const ctaTitle = tenant?.ctaTitle || `Experience ${tenantName} Today`;
  const ctaText =
    tenant?.ctaText || "Join us for an unforgettable culinary journey";

  return (
    <section
      ref={sectionRef}
      className="px-8 md:px-14 bg-background mt-0 mb-10"
      aria-labelledby="cta-heading"
    >
      {/* Full-width separator */}
      <div
        className="w-full mb-10"
        style={{
          height: "1px",
          backgroundColor: "var(--color-sand)",
          opacity: 0.25,
        }}
      />
      <div className="max-w-2xl mx-auto text-center">
        {/* Label */}
        <p
          ref={labelRef}
          className="text-xs tracking-[0.35em] uppercase mb-4"
          style={{ color: "var(--color-sand)" }}
        >
          Make it memorable
        </p>

        <h2
          id="cta-heading"
          ref={titleRef}
          className="font-bold leading-tight mb-4"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          {ctaTitle}
        </h2>

        {/* Thin warm rule — centered */}
        <div
          ref={ruleRef}
          className="mb-5 h-px w-12 mx-auto"
          style={{ backgroundColor: "var(--color-sand)" }}
        />

        <p
          ref={textRef}
          className="text-sm font-light leading-relaxed mb-8"
          style={{ color: "var(--color-sand)" }}
        >
          {ctaText}
        </p>

        <div
          ref={buttonsRef}
          className="flex items-center justify-center gap-6 flex-wrap"
        >
          {/* Primary: filled earth brown */}
          <Link
            href="/reservation"
            className="inline-flex items-center px-7 py-3.5 text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-300 button-ripple"
            style={{
              backgroundColor: "var(--color-earth)",
              color: "var(--color-cream)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-earth-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-earth)")
            }
            aria-label={`Make a reservation at ${tenantName}`}
          >
            Reserve a Table
          </Link>

          {/* Secondary: text link */}
          <Link
            href="/menu"
            className="text-xs tracking-[0.18em] uppercase font-light transition-opacity duration-300 hover:opacity-50"
            style={{
              color: "var(--foreground)",
              textDecoration: "underline",
              textUnderlineOffset: "5px",
              textDecorationColor: "var(--color-sand)",
            }}
            aria-label={`View ${tenantName}'s menu`}
          >
            Explore Menu →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
