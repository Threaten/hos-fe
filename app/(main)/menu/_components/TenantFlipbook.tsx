"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SkeletonImage from "@/app/components/SkeletonImage";
import { resolveBackendMediaUrl, type BackendMedia } from "@/app/utils/media";

// Set worker path - using CDN for reliability
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface TenantFlipbookProps {
  menuUrl: string;
  tenantName: string;
  imagePages?: BackendMedia[];
  /** The main-site menu page renders its own branch picker as the heading */
  showHeading?: boolean;
}

export default function TenantFlipbook({
  menuUrl,
  tenantName,
  imagePages = [],
  showHeading = true,
}: TenantFlipbookProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pageWidth, setPageWidth] = useState(500);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  const imagePageUrls = imagePages
    .map((page) => resolveBackendMediaUrl(page))
    .filter(Boolean);
  const isPdf = menuUrl.toLowerCase().split("?")[0].endsWith(".pdf");
  const imageMenuPages = imagePageUrls.length > 0 ? imagePageUrls : !isPdf && menuUrl ? [menuUrl] : [];
  const totalPages = isPdf ? numPages : imageMenuPages.length;

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
    setCurrentPage(0);
    setError(null);
    if (!isPdf) {
      setIsLoading(false);
      setNumPages(imageMenuPages.length);
    } else {
      setIsLoading(true);
      setNumPages(0);
    }
  }, [isPdf, menuUrl, imageMenuPages.length]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    setError(`Menu could not be opened: ${error.message}`);
    setIsLoading(false);
  }

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

  return (
    <div className="w-full flex flex-col items-center pb-16 md:pb-[112px]">
      {showHeading && (
        <header className="w-full hos-gutter pt-12 md:pt-[78px] text-center">
          <p className="hos-label mb-3" style={{ color: "var(--foreground)" }}>
            Our menu
          </p>
          <h1 className="hos-display lowercase" style={{ color: "var(--color-main)" }}>
            {tenantName}
          </h1>
        </header>
      )}

      {isLoading && (
        <p className="mt-16 animate-pulse" style={{ color: "var(--color-ink-muted)" }} role="status">
          Opening the menu…
        </p>
      )}

      {error && (
        <div className="mt-16 text-center hos-gutter">
          <p className="mb-6" style={{ color: "var(--color-ink)" }}>{error}</p>
          <button onClick={() => window.location.reload()} className="hos-btn hos-btn-solid">
            Try again
          </button>
        </div>
      )}

      {isPdf ? (
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
      ) : null}

      {/* Flipbook display */}
      {!isLoading && !error && totalPages > 0 && (
        <>
          <div
            className="flex justify-center items-center w-full relative mt-8 md:mt-[34px] py-8 md:py-14 overflow-hidden"
            style={{
              minHeight: isMobile ? "564px" : "862px",
              backgroundColor: "var(--paper-2)",
            }}
          >
            {isPdf ? (
              <Document file={menuUrl} options={pdfOptions}>
                <HTMLFlipBook
                  ref={flipBookRef}
                  width={pageWidth}
                  height={isMobile ? 500 : 750}
                  size="fixed"
                  maxShadowOpacity={0.5}
                  showCover={false}
                  mobileScrollSupport={true}
                  onFlip={onFlip}
                  className="shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--foreground)_45%,transparent)]"
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
            ) : (
              <HTMLFlipBook
                ref={flipBookRef}
                width={pageWidth}
                height={isMobile ? 500 : 750}
                size="fixed"
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                onFlip={onFlip}
                className="shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--foreground)_45%,transparent)]"
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
                {imageMenuPages.map((pageUrl, index) => (
                  <div
                    key={`${pageUrl}-${index}`}
                    className="bg-white flex items-center justify-center overflow-hidden relative"
                  >
                    <SkeletonImage
                      src={pageUrl}
                      alt={`${tenantName} menu page ${index + 1}`}
                      fill
                      quality={90}
                      sizes={isMobile ? "100vw" : "500px"}
                      className="object-contain"
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 md:mt-8 flex items-center gap-6 md:gap-10">
            <button
              onClick={prevPage}
              disabled={currentPage <= 0}
              className="hos-btn hos-btn-outline min-h-0 w-12 h-12 p-0 rounded-full disabled:opacity-30 disabled:pointer-events-none"
              style={{ color: "var(--color-main)" }}
              aria-label="Previous page"
            >
              <ChevronLeft strokeWidth={1.25} className="w-5 h-5" />
            </button>

            <span className="font-serif text-[1.375rem] tabular-nums min-w-[7ch] text-center" style={{ color: "var(--color-ink)" }} aria-live="polite">
              {isMobile
                ? `${currentPage + 1} / ${totalPages}`
                : `${currentPage + 1}–${Math.min(currentPage + 2, totalPages)} / ${totalPages}`}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - (isMobile ? 1 : 2)}
              className="hos-btn hos-btn-outline min-h-0 w-12 h-12 p-0 rounded-full disabled:opacity-30 disabled:pointer-events-none"
              style={{ color: "var(--color-main)" }}
              aria-label="Next page"
            >
              <ChevronRight strokeWidth={1.25} className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-3 text-[14px]" style={{ color: "var(--color-ink-muted)" }}>
            Drag a corner or tap the arrows to turn the page
          </p>
        </>
      )}
    </div>
  );
}
