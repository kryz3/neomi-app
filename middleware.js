import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies?.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    
    // Vérifications supplémentaires pour éviter les tokens forgés
    if (!payload.validLogin || 
        payload.userId !== "admin" || 
        payload.username !== process.env.LOGIN) {
      throw new Error("Token invalide");
    }
    
    const userId = payload.userId;

    // Ajouter les informations utilisateur aux headers pour les utiliser dans les pages
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", userId);


    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
  } catch (error) {
    console.error("Token JWT invalide:", error.message);
    // Supprimer le cookie invalide
    const response = NextResponse.redirect(new URL("/", req.url));
    response.headers.set("Set-Cookie", 
      "authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
    );
    return response;
  }
}

// Apply middleware to both /profile and /admin
export const config = {
  matcher: ["/admin/:path*"],
};