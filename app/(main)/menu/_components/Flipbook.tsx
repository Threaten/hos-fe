"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchMenuByBranch,
  fetchTenants,
  type MenuItem,
  type Tenant,
} from "@/api/queries";
import { resolveBackendMediaUrl } from "@/app/utils/media";
import TenantFlipbook from "./TenantFlipbook";

const Flipbook = ({ initialBranch }: { initialBranch?: string }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuLoading, setIsMenuLoading] = useState(false);

  const initialBranchName = useMemo(() => {
    if (!initialBranch) return "";
    return decodeURIComponent(initialBranch.replace(/\+/g, " "));
  }, [initialBranch]);

  useEffect(() => {
    let cancelled = false;

    const loadTenants = async () => {
      try {
        const data = await fetchTenants();
        if (cancelled) return;

        setTenants(data);
        const initialTenant =
          data.find((tenant) => tenant.name === initialBranchName) ||
          data.find((tenant) => tenant.domain === initialBranchName) ||
          data[0];
        setSelectedTenantId(initialTenant?.id || "");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadTenants();

    return () => {
      cancelled = true;
    };
  }, [initialBranchName]);

  const selectedTenant = tenants.find((tenant) => tenant.id === selectedTenantId);

  useEffect(() => {
    let cancelled = false;

    const loadMenu = async () => {
      if (!selectedTenantId) {
        setSelectedMenu(null);
        return;
      }

      setIsMenuLoading(true);
      try {
        const menu = await fetchMenuByBranch(selectedTenantId);
        if (!cancelled) setSelectedMenu(menu);
      } finally {
        if (!cancelled) setIsMenuLoading(false);
      }
    };

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [selectedTenantId]);

  const menuUrl = resolveBackendMediaUrl(
    selectedMenu?.file || selectedMenu?.pages?.[0] || selectedTenant?.menu,
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center hos-gutter pb-16">
      <div className="shrink-0 mt-12 md:mt-[78px] flex flex-col items-center gap-3">
        <label htmlFor="menu-branch" className="hos-label" style={{ color: "var(--foreground)" }}>
          Our menu
        </label>
        <select
          id="menu-branch"
          value={selectedTenantId}
          onChange={(event) => setSelectedTenantId(event.target.value)}
          className="font-serif text-[length:var(--text-display)] leading-[1.1] pl-2 pr-12 border-b outline-none bg-transparent appearance-none cursor-pointer"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "0.6em 0.6em",
            color: "var(--color-main)",
            borderColor: "var(--color-line)",
          }}
        >
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name.toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="mt-10" style={{ color: "var(--color-ink)" }}>Loading menus...</div>
      )}

      {!isLoading && isMenuLoading && (
        <div className="mt-10" style={{ color: "var(--color-ink)" }}>Opening selected menu...</div>
      )}

      {!isLoading && !selectedTenant && (
        <div className="mt-10" style={{ color: "var(--color-ink)" }}>No branches found.</div>
      )}

      {!isLoading && !isMenuLoading && selectedTenant && !menuUrl && (
        <div className="mt-10" style={{ color: "var(--color-ink)" }}>
          No published menu for this branch yet.
        </div>
      )}

      {!isLoading && !isMenuLoading && selectedTenant && menuUrl && (
        <TenantFlipbook
          key={selectedMenu?.id || selectedTenant.id}
          menuUrl={menuUrl}
          tenantName={selectedTenant.name}
          imagePages={selectedMenu?.pages}
          showHeading={false}
        />
      )}
    </div>
  );
};

export default Flipbook;
