import { NextRequest, NextResponse } from "next/server";

// Chuyển đổi Google Drive share link sang direct download URL
function convertGoogleDriveUrl(url: string): string | null {
  // Dạng: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }
  // Dạng: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?export=download&id=${openMatch[1]}`;
  }
  return null;
}

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "*/*",
};

function returnFallbackResponse(url: string) {
  const lowercaseUrl = url.toLowerCase();
  
  // If it's an image, return 1x1 transparent PNG
  if (lowercaseUrl.includes(".png") || lowercaseUrl.includes(".jpg") || lowercaseUrl.includes(".jpeg") || lowercaseUrl.includes("/image/upload")) {
    const transparentPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const buffer = Buffer.from(transparentPngBase64, 'base64');
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  
  // If it's a video or audio, return an empty 200 response with correct content type
  let contentType = "application/octet-stream";
  if (lowercaseUrl.includes(".mp4")) contentType = "video/mp4";
  else if (lowercaseUrl.includes(".webm")) contentType = "video/webm";
  else if (lowercaseUrl.includes(".mov")) contentType = "video/quicktime";
  else if (lowercaseUrl.includes(".mp3")) contentType = "audio/mpeg";
  else if (lowercaseUrl.includes(".wav")) contentType = "audio/wav";
  
  return new NextResponse(new ArrayBuffer(0), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Bỏ qua tài khoản Cloudinary bị disabled
  const isCloudinaryDisabled = targetUrl.includes("res.cloudinary.com/dmpy1yv4c");
  if (isCloudinaryDisabled) {
    console.warn("Skipping disabled Cloudinary account dmpy1yv4c for URL:", targetUrl);
    return returnFallbackResponse(targetUrl);
  }

  try {
    // Tự động convert Google Drive share link nếu cần
    const isGDrive = targetUrl.includes("drive.google.com");
    if (isGDrive) {
      const converted = convertGoogleDriveUrl(targetUrl);
      if (converted) targetUrl = converted;
    }

    // Lần fetch đầu — có thể trả về trang HTML confirm (virus scan) với file lớn
    const res = await fetch(targetUrl, {
      headers: FETCH_HEADERS,
      redirect: "follow",
    });

    if (!res.ok) {
      console.warn(`Fetch failed for URL ${targetUrl} (Status ${res.status}): ${res.statusText}. Returning fallback.`);
      return returnFallbackResponse(targetUrl);
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";

    // Nếu GDrive trả về HTML => có thể là trang virus-scan confirm
    if (isGDrive && contentType.includes("text/html")) {
      const html = await res.text();
      // Tìm confirm token trong HTML
      const confirmMatch = html.match(/confirm=([a-zA-Z0-9_-]+)/);
      if (confirmMatch) {
        const fileIdMatch = targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (fileIdMatch) {
          const retryUrl = `https://drive.google.com/uc?export=download&confirm=${confirmMatch[1]}&id=${fileIdMatch[1]}`;
          const retryRes = await fetch(retryUrl, {
            headers: FETCH_HEADERS,
            redirect: "follow",
          });
          if (!retryRes.ok) {
            return returnFallbackResponse(targetUrl);
          }
          const buffer = await retryRes.arrayBuffer();
          const ct = retryRes.headers.get("content-type") || "video/mp4";
          return new NextResponse(buffer, {
            headers: {
              "Content-Type": ct,
              "Cache-Control": "public, max-age=86400",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      }
      // Không tìm được confirm token => báo lỗi rõ ràng
      return new NextResponse("Google Drive yêu cầu đăng nhập hoặc file không công khai", { status: 403 });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Proxy error, returning fallback:", error);
    return returnFallbackResponse(targetUrl);
  }
}

