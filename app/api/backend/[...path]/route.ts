import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://admin.houseofsenses.vn";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const target = new URL(`/api/${path.join("/")}`, BACKEND_URL);
  target.search = request.nextUrl.search;

  const response = await fetch(target, {
    method: request.method,
    headers: {
      ...(request.headers.get("Content-Type")
        ? { "Content-Type": request.headers.get("Content-Type") as string }
        : {}),
      ...(request.headers.get("Accept")
        ? { Accept: request.headers.get("Accept") as string }
        : {}),
      ...(request.headers.get("Range")
        ? { Range: request.headers.get("Range") as string }
        : {}),
    },
    body: ["GET", "HEAD", "OPTIONS"].includes(request.method)
      ? undefined
      : await request.arrayBuffer(),
    cache: "no-store",
  });

  const contentType =
    response.headers.get("Content-Type") || "application/json";
  const body = await response.arrayBuffer();
  const headers = new Headers();
  headers.set("Content-Type", contentType);

  [
    "Accept-Ranges",
    "Content-Length",
    "Content-Range",
    "Content-Disposition",
    "Cache-Control",
    "ETag",
    "Last-Modified",
  ].forEach((header) => {
    const value = response.headers.get(header);
    if (value) headers.set(header, value);
  });

  return new NextResponse(body, {
    status: response.status,
    headers,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
