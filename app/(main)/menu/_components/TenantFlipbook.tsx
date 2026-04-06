"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

// Set worker path - using CDN for reliability
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface TenantFlipbookProps {
  menuUrl: string;
  tenantName: string;
}

export default function TenantFlipbook({
  menuUrl,
  tenantName,
}: TenantFlipbookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pageWidth, setPageWidth] = useState(500);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);

  const pdfOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Mobile: single page width, Desktop: page width for book view
      setPageWidth(mobile ? Math.min(window.innerWidth - 40, 400) : 500);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    console.log("Loading PDF from:", menuUrl);
  }, [menuUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setError(`Failed to load menu: ${error.message}`);
    setIsLoading(false);
  }

  const nextPage = () => {
    if (flipBookRef.current && currentPage < numPages - (isMobile ? 1 : 2)) {
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 pb-12">
      <h2 className="text-3xl font-bold text-black mt-12">{tenantName} Menu</h2>

      {isLoading && (
        <div className="mt-8 p-8 text-center">
          <div className="text-gray-600">Loading menu...</div>
        </div>
      )}

      {error && (
        <div className="mt-8 p-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Hidden Document wrapper for loading PDF metadata */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
        }}
      >
        <Document
          file={menuUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          options={pdfOptions}
        >
          <Page pageNumber={1} width={1} />
        </Document>
      </div>

      {/* Flipbook display */}
      {!isLoading && !error && numPages > 0 && (
        <>
          <div
            className="flex justify-center items-center w-full relative mt-8 px-4"
            style={{ minHeight: isMobile ? "500px" : "800px" }}
          >
            <Document file={menuUrl} options={pdfOptions}>
              <HTMLFlipBook
                ref={flipBookRef}
                width={isMobile ? pageWidth : pageWidth}
                height={isMobile ? 500 : 750}
                size="fixed"
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                onFlip={onFlip}
                className="shadow-2xl"
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
                style={{}}
                minWidth={0}
                maxWidth={pageWidth * 2}
                minHeight={0}
                maxHeight={isMobile ? 500 : 750}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <div
                    key={`page-${index}`}
                    className="bg-white flex items-start justify-center overflow-hidden"
                  >
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={pageWidth}
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </Document>
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center gap-6">
            <button
              onClick={prevPage}
              disabled={currentPage <= 0}
              className="px-6 py-2 bg-gray-900 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors rounded"
            >
              Previous
            </button>

            <span className="text-gray-900 font-medium">
              {isMobile
                ? `Page ${currentPage + 1} of ${numPages}`
                : `Page ${currentPage + 1}-${currentPage + 2} of ${numPages}`}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage >= numPages - (isMobile ? 1 : 2)}
              className="px-6 py-2 bg-gray-900 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
