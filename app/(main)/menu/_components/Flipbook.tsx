// DO NOT TOUCH THE CODE BELOW //

"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import SkeletonImage from "@/app/components/SkeletonImage";
import HTMLFlipBook from "react-pageflip";

const Flipbook = ({ initialBranch }: { initialBranch?: string }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Decode and memoize the initial branch
  const decodedBranch = useMemo(() => {
    if (!initialBranch) return "Red Bistro";
    const decoded = decodeURIComponent(initialBranch.replace(/\+/g, " "));
    console.log("Initial Branch:", initialBranch, "Decoded:", decoded);
    return decoded === "Blue Bistro" ? "Blue Bistro" : "Red Bistro";
  }, [initialBranch]);

  const [selectedBranch, setSelectedBranch] = useState(decodedBranch);
  const [key, setKey] = useState(0); // Add key to force re-render
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Red Bistro menu images
  const redBistroPages = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1580554530778-ca36943938b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  ];

  // Blue Bistro menu images
  const blueBistroPages = [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1580554530778-ca36943938b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  ];

  const pages =
    selectedBranch === "Red Bistro" ? redBistroPages : blueBistroPages;

  const totalPages = pages.length;

  const nextPage = () => {
    if (flipBookRef.current && currentPage < totalPages - (isMobile ? 1 : 2)) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (flipBookRef.current && currentPage > 0) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const onFlip = (e: { data: number }) => {
    setCurrentPage(e.data);
  };

  const handleBranchChange = (newBranch: string) => {
    setSelectedBranch(newBranch);
    setCurrentPage(0);
    setKey((prev) => prev + 1); // Force flipbook to remount
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4">
      <h2 className="text-3xl font-bold text-black mt-12 shrink-0">
        {selectedBranch.toLowerCase()} menu
      </h2>

      {/* Branch Selection */}
      <div className="shrink-0 mt-8">
        <select
          value={selectedBranch}
          onChange={(e) => handleBranchChange(e.target.value)}
          className="px-6  border-gray-900 border-b focus:ring-0 focus:border-gray-900 outline-none transition-all bg-transparent appearance-none text-gray-900"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          <option value="Red Bistro">red bistro</option>
          <option value="Blue Bistro">blue bistro</option>
        </select>
      </div>

      {/* Flipbook Container */}
      <div
        className="flex justify-center items-center w-full shrink-0 relative"
        style={{ height: isMobile ? "600px" : "800px" }}
      >
        <div className="relative">
          {/* Book Spine Overlay - Only visible on desktop */}
          {!isMobile && (
            <div
              className="absolute z-10 pointer-events-none"
              style={{
                width: "20px",
                height: "600px",
                background:
                  "linear-gradient(to right, " +
                  "rgba(40,30,20,0.8) 0%, " +
                  "rgba(60,45,30,0.6) 10%, " +
                  "rgba(80,60,40,0.4) 20%, " +
                  "rgba(90,70,50,0.3) 40%, " +
                  "rgba(100,80,60,0.2) 50%, " +
                  "rgba(90,70,50,0.3) 60%, " +
                  "rgba(80,60,40,0.4) 80%, " +
                  "rgba(60,45,30,0.6) 90%, " +
                  "rgba(40,30,20,0.8) 100%)",
                boxShadow:
                  "inset 0 0 15px rgba(0,0,0,0.6), " +
                  "inset -2px 0 8px rgba(0,0,0,0.4), " +
                  "inset 2px 0 8px rgba(0,0,0,0.4), " +
                  "0 0 20px rgba(0,0,0,0.3)",
                left: "50%",
                top: "0",
                transform: "translateX(-50%)",
                borderRadius: "2px",
              }}
            >
              {/* Add subtle texture lines for realistic spine effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "1px",
                  height: "100%",
                  background:
                    "repeating-linear-gradient(" +
                    "to bottom, " +
                    "transparent 0px, " +
                    "transparent 8px, " +
                    "rgba(255,255,255,0.1) 8px, " +
                    "rgba(255,255,255,0.1) 10px)",
                }}
              />
            </div>
          )}
          <HTMLFlipBook
            key={key}
            width={isMobile ? 400 : 1000}
            height={isMobile ? 600 : 800}
            minWidth={isMobile ? 300 : 800}
            maxWidth={isMobile ? 500 : 1400}
            minHeight={isMobile ? 450 : 600}
            maxHeight={isMobile ? 600 : 800}
            ref={flipBookRef}
            size="stretch"
            maxShadowOpacity={1}
            showCover={false}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="shadow-2xl"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={600}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={50}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {pages.map((page, index) => (
              <div
                key={index}
                className="page bg-white flex items-center justify-center relative"
              >
                <SkeletonImage
                  src={page}
                  alt={`Page ${index + 1}`}
                  fill
                  quality={85}
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {/* Page Counter */}
      <div className="text-lg text-gray-600 mb-6 shrink-0 h-7">
        {isMobile
          ? `Page ${currentPage + 1} of ${totalPages}`
          : `Page ${currentPage + 1}-${currentPage + 2} of ${totalPages}`}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center gap-4 shrink-0">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="bg-white text-black font-bold text-xl rounded-lg hover:bg-gray-100 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          style={{ width: "52px", height: "52px" }}
        >
          ←
        </button>
        <button
          onClick={nextPage}
          disabled={
            isMobile
              ? currentPage >= totalPages - 1
              : currentPage >= totalPages - 2
          }
          className="bg-white text-black font-bold text-xl rounded-lg hover:bg-gray-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all flex items-center justify-center"
          style={{ width: "52px", height: "52px" }}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Flipbook;

// DO NOT TOUCH THE CODE ABOVE //
