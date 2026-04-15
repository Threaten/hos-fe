"use client";
import React, { useState, useEffect, useRef } from "react";

// ─── Calendar Picker ─────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function CalendarPicker({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    selected?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selected?.getMonth() ?? today.getMonth(),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const select = (day: number) => {
    const yyyy = viewYear;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setOpen(false);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };
  const isSelected = (day: number) =>
    !!selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === day;
  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const displayValue = selected
    ? selected.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-0 py-3 border-0 border-b-2 focus:ring-0 focus:border-gray-900 outline-none transition-all bg-transparent text-left flex justify-between items-center ${
          hasError ? "border-red-500" : "border-gray-200"
        }`}
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || "Date"}
        </span>
        <svg
          className="w-4 h-4 text-gray-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 pb-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array(firstDayOfWeek)
              .fill(null)
              .map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const disabled = isDisabled(day);
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => select(day)}
                  className={[
                    "w-8 h-8 mx-auto flex items-center justify-center text-sm rounded-full transition-colors",
                    disabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer",
                    sel ? "bg-gray-900 text-white hover:bg-gray-800" : "",
                    tod && !sel ? "border border-gray-900 font-semibold text-gray-900" : "",
                    !disabled && !sel && !tod ? "text-gray-700 hover:bg-gray-100" : "",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
import {
  fetchTenants,
  fetchTenantBySlug,
  getCustomerByPhone,
  createCustomer,
  createReservation,
  type Tenant,
} from "@/api/queries";

interface FormData {
  name: string;
  phone: string;
  branch: string;
  date: string;
  time: string;
  quantity: number;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  branch?: string;
  date?: string;
  time?: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const ReservationForm = ({
  initialBranch,
  currentTenant,
}: {
  initialBranch?: string;
  currentTenant?: string;
}) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentBranchTenant, setCurrentBranchTenant] = useState<Tenant | null>(
    null,
  );
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // Fetch tenants from API and detect subdomain
  useEffect(() => {
    const loadTenants = async () => {
      try {
        // Detect if we're on a tenant subdomain
        const { getCurrentSubdomain } = await import("@/app/utils/domain");
        const subdomainSlug = getCurrentSubdomain();

        // If on subdomain, fetch that specific tenant
        if (subdomainSlug && subdomainSlug !== "admin") {
          const tenant = await fetchTenantBySlug(subdomainSlug);
          if (tenant) {
            setCurrentBranchTenant(tenant);
            setTenants([tenant]);
            setSelectedBranch(tenant.name);
          }
        } else {
          // Otherwise fetch all tenants
          const data = await fetchTenants();
          if (data.length > 0) {
            setTenants(data);

            console.log("ReservationForm - currentTenant:", currentTenant);
            console.log(
              "ReservationForm - available tenants:",
              data.map((t) => ({ domain: t.domain, name: t.name })),
            );

            // Auto-select branch based on currentTenant (subdomain) or initialBranch
            if (currentTenant) {
              // Try exact match first, then case-insensitive match
              let tenant = data.find((t: Tenant) => t.domain === currentTenant);
              if (!tenant) {
                tenant = data.find(
                  (t: Tenant) =>
                    t.domain?.toLowerCase() === currentTenant.toLowerCase(),
                );
              }
              console.log("ReservationForm - matched tenant:", tenant);
              if (tenant) {
                setSelectedBranch(tenant.name);
              }
            } else if (initialBranch) {
              const decodedBranch = decodeURIComponent(
                initialBranch.replace(/\+/g, " "),
              );
              setSelectedBranch(decodedBranch);
            } else {
              setSelectedBranch(data[0].name);
            }
          }
        }
      } catch (error) {
        console.error("Error loading tenants:", error);
      }
    };

    loadTenants();
  }, [currentTenant, initialBranch]);

  const branchAddresses: Record<string, string> = tenants.reduce(
    (acc, tenant) => {
      if (tenant.address) {
        acc[tenant.name] = tenant.address;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    branch: "",
    date: "",
    time: "",
    quantity: 2,
    notes: "",
  });

  // Update form data when selectedBranch changes
  useEffect(() => {
    if (selectedBranch) {
      setFormData((prev) => ({
        ...prev,
        branch: selectedBranch,
      }));
    }
  }, [selectedBranch]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const validateVietnamesePhone = (phone: string): boolean => {
    // Vietnamese phone number patterns:
    // Mobile: 03, 05, 07, 08, 09 + 8 digits
    // Landline: 02 + 9 digits
    const mobileRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    const landlineRegex = /^02[0-9]{9}$/;
    const cleanPhone = phone.replace(/\s+/g, "");
    return mobileRegex.test(cleanPhone) || landlineRegex.test(cleanPhone);
  };

  const validateDate = (date: string, time: string): string | null => {
    if (!date) return "Date is required";

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Date must be today or later";
    }

    // If date is today, check if time is valid
    if (selectedDate.getTime() === today.getTime() && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const currentTime = new Date();
      const selectedDateTime = new Date();
      selectedDateTime.setHours(hours, minutes, 0, 0);

      if (selectedDateTime <= currentTime) {
        return "For today's reservation, please select a time later than now";
      }
    }

    return null;
  };

  const validateTime = (time: string): string | null => {
    if (!time) return "Time is required";

    const [hours, minutes] = time.split(":").map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const startTime = 16 * 60; // 16:00
    const endTime = 22 * 60; // 22:00

    if (timeInMinutes < startTime || timeInMinutes > endTime) {
      return "Time must be between 16:00 and 22:00";
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 5) {
      newErrors.name = "Name must be at least 5 characters";
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validateVietnamesePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid Vietnamese phone number";
    }

    // Validate date
    const dateError = validateDate(formData.date, formData.time);
    if (dateError) {
      newErrors.date = dateError;
    }

    // Validate time
    const timeError = validateTime(formData.time);
    if (timeError) {
      newErrors.time = timeError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First, check if customer exists by phone
      let customer = await getCustomerByPhone(formData.phone);

      // If customer doesn't exist, create them
      if (!customer) {
        console.log("Customer not found, creating new customer...");
        customer = await createCustomer(formData.name, formData.phone);
        console.log("Customer created:", customer);
      } else {
        console.log("Existing customer found:", customer);
      }

      // Ensure customer exists
      if (!customer) {
        throw new Error("Failed to create or retrieve customer");
      }

      // Find the branch/tenant ID by name
      const selectedTenant = tenants.find((t) => t.name === formData.branch);
      if (!selectedTenant) {
        throw new Error("Branch not found");
      }

      // Combine date and time into ISO datetime string
      const reservationDateTime = new Date(
        `${formData.date}T${formData.time}`,
      ).toISOString();

      // Now create the reservation with the customer ID
      await createReservation(
        customer.id,
        reservationDateTime,
        formData.quantity,
        formData.notes || undefined,
        selectedTenant.id,
      );

      console.log("Reservation submitted:", formData);

      // Show success toast
      setToast({
        message: "Reservation submitted successfully!",
        type: "success",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        branch: selectedBranch || tenants[0]?.name || "",
        date: "",
        time: "",
        quantity: 2,
        notes: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Reservation error:", error);
      // Show error toast
      setToast({
        message: "Failed to submit reservation. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToast(null);
      }, 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-background py-16 px-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg z-50 transition-all ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side - Info */}
        <div className="space-y-12 sm:pt-8">
          {/* Title Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Our Restaurant
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Experience fine dining at its best. Reserve your table and let us
              create an unforgettable culinary experience for you.
            </p>
          </div>

          {/* Location Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Hotline
            </h3>
            <label className="text-base text-gray-600">
              For last-minute reservations or special occasion arrangements,
              please contact us directly.
            </label>
            <div className="space-y-2 text-gray-600 mt-4">
              {(() => {
                const tenant =
                  currentBranchTenant ||
                  tenants.find((t) => t.name === selectedBranch);
                return (
                  <>
                    <p className="font-medium">
                      {tenant?.name.toLowerCase() || "houseofsenses.vn"}
                    </p>
                    <a
                      href={`tel:${tenant?.phone}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {tenant?.phone}
                    </a>
                    <br />
                    <p className="hover:text-gray-900">
                      {tenant?.address || "No address available"}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Our Contact
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-medium text-gray-900 mb-1">Email</p>
                {(() => {
                  const tenant =
                    currentBranchTenant ||
                    tenants.find((t) => t.name === selectedBranch);
                  const email = tenant?.email;
                  return email ? (
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {email}
                    </a>
                  ) : (
                    <p className="text-gray-400">No email available</p>
                  );
                })()}
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Phone</p>
                {(() => {
                  const tenant =
                    currentBranchTenant ||
                    tenants.find((t) => t.name === selectedBranch);
                  const phone = tenant?.phone;
                  return phone ? (
                    <a
                      href={`tel:${phone}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {phone}
                    </a>
                  ) : (
                    <p className="text-gray-400">No phone available</p>
                  );
                })()}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Follow us
            </h3>
            <div className="flex gap-4">
              {(() => {
                const tenant =
                  currentBranchTenant ||
                  tenants.find((t) => t.name === selectedBranch);
                return (
                  <>
                    {tenant?.facebook && (
                      <a
                        href={tenant.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110"
                        aria-label="Facebook"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {tenant?.instagram && (
                      <a
                        href={tenant.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110"
                        aria-label="Instagram"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    {tenant?.tiktok && (
                      <a
                        href={tenant.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110"
                        aria-label="TikTok"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      </a>
                    )}
                    {tenant?.youtube && (
                      <a
                        href={tenant.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110"
                        aria-label="YouTube"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="sm:border sm:border-gray-200 sm:rounded-2xl sm:px-8 lg:px-12 sm:pb-8 lg:pb-12 sm:pt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Reservation
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-0 py-3 border-0 border-b-2 focus:ring-0 focus:border-gray-900 outline-none transition-all bg-transparent ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-0 py-3 border-0 border-b-2 focus:ring-0 focus:border-gray-900 outline-none transition-all bg-transparent ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Phone"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Branch */}
            <div>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                disabled={!!currentTenant}
                className={`w-full px-0 py-3 border-0 border-b-2 focus:ring-0 focus:border-gray-900 outline-none transition-all bg-transparent appearance-none text-gray-900 ${
                  errors.branch ? "border-red-500" : "border-gray-200"
                } ${currentTenant ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
                style={{
                  backgroundImage: currentTenant
                    ? "none"
                    : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundPosition: "right center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  pointerEvents: currentTenant ? "none" : "auto",
                }}
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.name}>
                    {tenant.name}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <p className="mt-1 text-sm text-red-500">{errors.branch}</p>
              )}
              {formData.branch && (
                <p className="mt-2 text-sm text-gray-600">
                  {branchAddresses[formData.branch]}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <CalendarPicker
                value={formData.date}
                hasError={!!errors.date}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, date: value }));
                  setErrors((prev) => ({ ...prev, date: undefined }));
                }}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <div
                className={`flex items-center gap-2 border-b-2 py-3 transition-all focus-within:border-gray-900 ${
                  errors.time ? "border-red-500" : "border-gray-200"
                }`}
              >
                <select
                  value={formData.time ? formData.time.split(":")[0] : ""}
                  onChange={(e) => {
                    const minute = formData.time
                      ? formData.time.split(":")[1]
                      : "00";
                    setFormData((prev) => ({
                      ...prev,
                      time: `${e.target.value}:${minute || "00"}`,
                    }));
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }}
                  className={`flex-1 bg-transparent border-0 outline-none focus:ring-0 appearance-none cursor-pointer ${
                    formData.time && formData.time.split(":")[0] ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <option value="" disabled>
                    Hour
                  </option>
                  {[16, 17, 18, 19, 20, 21, 22].map((h) => (
                    <option key={h} value={String(h).padStart(2, "0")}>
                      {String(h).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="text-gray-400 font-semibold">:</span>
                <select
                  value={formData.time ? formData.time.split(":")[1] : ""}
                  onChange={(e) => {
                    const hour = formData.time
                      ? formData.time.split(":")[0]
                      : "16";
                    setFormData((prev) => ({
                      ...prev,
                      time: `${hour || "16"}:${e.target.value}`,
                    }));
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }}
                  className={`flex-1 bg-transparent border-0 outline-none focus:ring-0 appearance-none cursor-pointer ${
                    formData.time && formData.time.split(":")[1] ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  <option value="" disabled>
                    Min
                  </option>
                  {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-4 h-4 text-gray-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Last order: 30 minutes before closing.
              </p>
            </div>

            {/* Quantity */}
            <div>
              <select
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-900 outline-none transition-all bg-transparent appearance-none text-gray-900"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundPosition: "right center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-900 outline-none transition-all bg-transparent resize-none"
                placeholder="Special Requests (Optional)"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border-black border-2 text-black hover:text-white py-4 rounded-lg font-medium hover:bg-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-8 button-ripple focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              aria-label="Submit reservation"
            >
              {isSubmitting ? "Submitting..." : "Reserve"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
