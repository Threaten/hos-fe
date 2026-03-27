"use client";

import dynamic from "next/dynamic";

const TenantFlipbook = dynamic(() => import("./TenantFlipbook"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-gray-600">Loading menu...</div>
    </div>
  ),
});

interface TenantFlipbookWrapperProps {
  menuUrl: string;
  tenantName: string;
}

export default function TenantFlipbookWrapper({
  menuUrl,
  tenantName,
}: TenantFlipbookWrapperProps) {
  return <TenantFlipbook menuUrl={`${menuUrl}`} tenantName={tenantName} />;
}
