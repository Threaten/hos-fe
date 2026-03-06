"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { fetchTenantBySlug, type Tenant } from "@/api/queries";
import { getCurrentSubdomain } from "@/app/utils/domain";

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  setTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  setTenant: () => {},
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    const loadTenant = async () => {
      setLoading(true);
      
      // Check if we're on /tenant/[slug] route
      const tenantSlug = Array.isArray(params?.tenant)
        ? params.tenant[0]
        : params?.tenant;

      if (tenantSlug && typeof tenantSlug === "string") {
        console.log("📍 Loading tenant from route param:", tenantSlug);
        const data = await fetchTenantBySlug(tenantSlug);
        setTenant(data);
        setLoading(false);
        return;
      }

      // Check if we're on a subdomain
      const subdomain = getCurrentSubdomain();
      if (subdomain && subdomain !== "www" && subdomain !== "admin") {
        console.log("📍 Loading tenant from subdomain:", subdomain);
        const data = await fetchTenantBySlug(subdomain);
        setTenant(data);
        setLoading(false);
        return;
      }

      // No tenant context
      setTenant(null);
      setLoading(false);
    };

    loadTenant();
  }, [params?.tenant, pathname]);

  return (
    <TenantContext.Provider value={{ tenant, loading, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
}
