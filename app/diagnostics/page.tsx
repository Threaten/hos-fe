"use client";

import { useEffect, useState } from "react";
import { API_URL, GRAPHQL_ENDPOINT } from "@/api/queries";

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState({
    apiUrl: "",
    graphqlEndpoint: "",
    isServer: typeof window === "undefined",
    hostname: "",
    subdomain: "",
    nodeEnv: process.env.NODE_ENV,
    backendReachable: null as boolean | null,
    graphqlWorking: null as boolean | null,
    errorMessage: "",
  });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || API_URL;
    const graphqlEndpoint =
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || GRAPHQL_ENDPOINT;

    setDiagnostics((prev) => ({
      ...prev,
      apiUrl,
      graphqlEndpoint,
      hostname: window.location.hostname,
      subdomain: window.location.hostname.split(".")[0],
    }));

    // Test backend connectivity
    const testBackend = async () => {
      try {
        const response = await fetch(apiUrl + "/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "{ __typename }" }),
        });

        if (response.ok) {
          const data = await response.json();
          setDiagnostics((prev) => ({
            ...prev,
            backendReachable: true,
            graphqlWorking: !!data.data,
          }));
        } else {
          setDiagnostics((prev) => ({
            ...prev,
            backendReachable: true,
            graphqlWorking: false,
            errorMessage: `HTTP ${response.status}: ${response.statusText}`,
          }));
        }
      } catch (error: any) {
        setDiagnostics((prev) => ({
          ...prev,
          backendReachable: false,
          graphqlWorking: false,
          errorMessage: error.message,
        }));
      }
    };

    testBackend();
  }, []);

  const Status = ({
    value,
    label,
  }: {
    value: boolean | null;
    label: string;
  }) => {
    if (value === null)
      return <span className="text-yellow-600">⏳ Testing...</span>;
    if (value)
      return <span className="text-green-600">✅ {label} Working</span>;
    return <span className="text-red-600">❌ {label} Failed</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          🔧 Frontend Diagnostics
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Environment Configuration
          </h2>
          <div className="space-y-3 font-mono text-sm">
            <div>
              <span className="font-semibold">NODE_ENV:</span>{" "}
              <span className="text-blue-600">{diagnostics.nodeEnv}</span>
            </div>
            <div>
              <span className="font-semibold">NEXT_PUBLIC_API_URL:</span>{" "}
              <span className="text-blue-600">
                {diagnostics.apiUrl || "❌ NOT SET"}
              </span>
            </div>
            <div>
              <span className="font-semibold">
                NEXT_PUBLIC_GRAPHQL_ENDPOINT:
              </span>{" "}
              <span className="text-blue-600">
                {diagnostics.graphqlEndpoint || "❌ NOT SET"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Current Request Info
          </h2>
          <div className="space-y-3 font-mono text-sm">
            <div>
              <span className="font-semibold">Hostname:</span>{" "}
              <span className="text-blue-600">{diagnostics.hostname}</span>
            </div>
            <div>
              <span className="font-semibold">Detected Subdomain:</span>{" "}
              <span className="text-blue-600">{diagnostics.subdomain}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Backend Connectivity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Status value={diagnostics.backendReachable} label="Backend" />
            </div>
            <div className="flex items-center gap-3">
              <Status value={diagnostics.graphqlWorking} label="GraphQL" />
            </div>
            {diagnostics.errorMessage && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 font-semibold mb-2">Error:</p>
                <p className="text-red-600 font-mono text-sm">
                  {diagnostics.errorMessage}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-900">
            💡 Troubleshooting Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              ✓ <strong>For Local Dev:</strong> Make sure backend is running on
              localhost:3000
            </li>
            <li>
              ✓ <strong>For Production:</strong> Set environment variables in
              your deployment platform
            </li>
            <li>
              ✓ <strong>CORS Issues:</strong> Backend must allow requests from
              your frontend domain
            </li>
            <li>
              ✓ <strong>Check Backend:</strong> Visit{" "}
              <code className="bg-blue-100 px-1 rounded">
                {diagnostics.apiUrl}/api/graphql
              </code>{" "}
              in browser
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
