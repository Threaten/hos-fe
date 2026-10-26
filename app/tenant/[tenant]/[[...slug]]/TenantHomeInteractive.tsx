"use client";

import { useState, useEffect } from "react";
import Gallery from "../../../(main)/home/_components/Gallery";
import NewMenuModal from "../../../(main)/components/NewMenuModal";
import type { Tenant } from "@/api/queries";

interface GalleryImage {
  src: string;
  alt: string;
  branch: string;
  caption: string;
}

interface NewMenuImage {
  src?: {
    url: string;
    filename: string;
  };
  id?: string;
}

interface TenantHomeInteractiveProps {
  transformedImages: GalleryImage[];
  newMenu: NewMenuImage[];
  tenantName: string;
  galleryText?: string;
  tenant: Tenant | null;
}

export default function TenantHomeInteractive({
  transformedImages,
  newMenu,
  tenantName,
  galleryText,
  tenant,
}: TenantHomeInteractiveProps) {
  const [showNewMenuModal, setShowNewMenuModal] = useState(
    newMenu != null && newMenu.length > 0,
  );

  const handleCloseModal = () => {
    setShowNewMenuModal(false);
  };

  return (
    <>
      <Gallery
        images={transformedImages}
        galleryText={galleryText}
        tenant={tenant}
      />
      <NewMenuModal
        images={newMenu}
        isOpen={showNewMenuModal}
        onClose={handleCloseModal}
        tenantName={tenantName}
      />
    </>
  );
}
