"use client";

import { useState, useEffect } from "react";
import Gallery from "../../../(main)/home/_components/Gallery";
import NewMenuModal from "../../../(main)/components/NewMenuModal";

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
}

export default function TenantHomeInteractive({
  transformedImages,
  newMenu,
  tenantName,
  galleryText,
}: TenantHomeInteractiveProps) {
  const [showNewMenuModal, setShowNewMenuModal] = useState(
    newMenu != null && newMenu.length > 0,
  );

  const handleCloseModal = () => {
    setShowNewMenuModal(false);
  };

  return (
    <>
      <Gallery images={transformedImages} galleryText={galleryText} />
      <NewMenuModal
        images={newMenu}
        isOpen={showNewMenuModal}
        onClose={handleCloseModal}
        tenantName={tenantName}
      />
    </>
  );
}
