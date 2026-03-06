"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);

    // Skip 404 errors
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
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#000",
          color: "#666",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p>Redirecting...</p>
        </div>
      </body>
    </html>
  );
}
