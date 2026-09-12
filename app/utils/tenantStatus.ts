import type { Tenant } from "@/api/queries";

export function tenantStatusLabel(status: Tenant["status"]): string {
  if (status === "closed") return "Closed";
  if (status === "temporarily-closed" || status === "temporarily_closed") return "Temporarily closed";
  return "";
}

export function tenantBranchLabel(tenant: Pick<Tenant, "name" | "status">): string {
  const status = tenantStatusLabel(tenant.status);
  return status ? `${tenant.name} (${status})` : tenant.name;
}

export function tenantHoursOrStatus(tenant: Pick<Tenant, "status" | "openingHours">): string {
  return tenantStatusLabel(tenant.status) || tenant.openingHours?.trim() || "";
}
