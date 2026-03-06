"use client";

import { useEffect } from "react";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Main route error caught:", error);

    // Skip 404 errors - let not-found.tsx handle them
    if (
      error.message?.includes("404") ||
      error.message?.includes("NEXT_NOT_FOUND")
    ) {
      return;
    }

    // Redirect to /somethingwentwrong (strips subdomain)
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Get base domain (remove subdomain)
    const parts = hostname.split(".");
    const baseDomain = parts.length > 2 ? parts.slice(-2).join(".") : hostname;

    // For localhost, just use localhost without subdomain
    const targetDomain = hostname.includes("localhost")
      ? "localhost"
      : baseDomain;

    const portPart = port ? `:${port}` : "";
    const targetUrl = `${protocol}//${targetDomain}${portPart}/somethingwentwrong`;

    window.location.href = targetUrl;
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
