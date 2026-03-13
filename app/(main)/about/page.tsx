"use client";

import React from "react";
import Image from "next/image";
import CTA from "../components/CTA";
import RichTextRenderer from "../../components/RichTextRenderer";
import { useTenant } from "@/app/contexts/TenantContext";
import { Tenant, API_URL } from "@/api/queries";

export default function AboutPage() {
  const { tenant } = useTenant();

  const tenantName = tenant ? tenant.name.toLowerCase() : "elementa";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="absolute inset-0">
          <Image
            src={
              tenant?.aboutusHero?.url
                ? `${API_URL}${tenant.aboutusHero.url}`
                : "/media/IMG_0050.JPG"
            }
            alt="Restaurant interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wide">
            about {tenantName}
          </h1>
          <p className="text-xl md:text-2xl font-light">
            A Journey of Culinary Excellence
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {tenant?.aboutus ? (
            <RichTextRenderer data={tenant.aboutus} className="text-lg" />
          ) : (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  Our Story
                </h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  Founded in 2015, {tenantName} was born from a passion for
                  creating unforgettable dining experiences. Our name reflects
                  our philosophy: returning to the beauty of fresh ingredients,
                  expertly prepared with care and creativity.
                </p>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  We believe that great food brings people together. Every dish
                  we serve tells a story, combining traditional techniques with
                  innovative approaches to create flavors that surprise and
                  delight.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our commitment to sustainability and locally-sourced
                  ingredients ensures that every meal not only tastes
                  exceptional but also supports our community and environment.
                </p>
              </div>
              <div className="relative h-[500px]">
                <Image
                  src="/media/IMG_0050.JPG"
                  alt="Chef preparing food"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Spacer */}
      <div className="h-20"></div>

      {/* CTA Section */}
      <CTA />

      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
}
