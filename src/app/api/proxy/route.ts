import { NextRequest, NextResponse } from "next/server";

// Chuyển đổi Google Drive share link sang direct download URL
function convertGoogleDriveUrl(url: string): string | null {
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }
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

function isValidProxyUrl(urlString: string): { valid: boolean; reason?: string; urlObj?: URL } {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Chỉ chấp nhận giao thức https:' };
    }
    if (parsed.username || parsed.password) {
      return { valid: false, reason: 'Không chấp nhận URL chứa thông tin xác thực' };
    }
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return { valid: false, reason: 'Không cho phép truy cập địa chỉ IP nội bộ (SSRF Blocked)' };
    }

    const defaultAllowlist = [
      'drive.google.com',
      'docs.google.com',
      'googleusercontent.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'storage.googleapis.com',
      'giac.ngo',
      'onglao.giac.ngo',
      '18.139.27.179',
      '103.165.145.137'
    ];
    const customAllowed = (process.env.ALLOWED_PROXY_HOSTNAMES || '')
      .split(',')
      .map(h => h.trim().toLowerCase())
      .filter(Boolean);

    const allowedHosts = [...defaultAllowlist, ...customAllowed];
    const isAllowedHost = allowedHosts.some(allowed => hostname === allowed || hostname.endsWith('.' + allowed));

    if (!isAllowedHost) {
      return { valid: false, reason: `Tên miền ${hostname} không nằm trong danh sách được phép proxy` };
    }

    return { valid: true, urlObj: parsed };
  } catch (e: any) {
    return { valid: false, reason: 'Cấu trúc URL không hợp lệ' };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const ssrfCheck = isValidProxyUrl(targetUrl);
  if (!ssrfCheck.valid) {
    return new NextResponse(`SSRF Protection: ${ssrfCheck.reason}`, { status: 403 });
  }

  // Bỏ qua tài khoản Cloudinary bị disabled
  const isCloudinaryDisabled = targetUrl.includes("res.cloudinary.com/dmpy1yv4c");
  if (isCloudinaryDisabled) {
    console.warn("Skipping disabled Cloudinary account dmpy1yv4c for URL:", targetUrl);
    return new NextResponse("Tài nguyên Cloudinary bị vô hiệu hóa", { status: 410 });
  }

  try {
    // Tự động convert Google Drive share link nếu cần
    const isGDrive = targetUrl.includes("drive.google.com");
    if (isGDrive) {
      const converted = convertGoogleDriveUrl(targetUrl);
      if (converted) targetUrl = converted;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const res = await fetch(targetUrl, {
      headers: FETCH_HEADERS,
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`Fetch failed for URL ${targetUrl} (Status ${res.status}): ${res.statusText}`);
      return new NextResponse(`Không thể tải tài nguyên từ nguồn (HTTP ${res.status})`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";

    // Nếu GDrive trả về HTML => có thể là trang virus-scan confirm
    if (isGDrive && contentType.includes("text/html")) {
      const html = await res.text();
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
            return new NextResponse(`Không thể tải file Google Drive (HTTP ${retryRes.status})`, { status: retryRes.status });
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
    console.error("Proxy error:", error?.message || error);
    return new NextResponse(`Lỗi kết nối proxy: ${error?.message || 'Không thể tải tệp'}`, { status: 502 });
  }
}
