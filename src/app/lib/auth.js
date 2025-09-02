import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyAdminAuth(request) {
  try {
    // Récupérer le token depuis les cookies
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return { error: "Non autorisé - Aucun cookie trouvé", status: 401 };
    }

    const tokenMatch = cookies.match(/authToken=([^;]+)/);
    if (!tokenMatch) {
      return { error: "Non autorisé - Token manquant", status: 401 };
    }

    const token = tokenMatch[1];

    // Vérifier le token JWT
    const { payload } = await jwtVerify(token, secret);

    // Vérifications supplémentaires pour l'admin
    if (!payload.validLogin || 
        payload.userId !== "admin" || 
        payload.username !== process.env.LOGIN) {
      return { error: "Non autorisé - Token invalide", status: 403 };
    }

    return { success: true, payload };
  } catch (error) {
    return { error: "Non autorisé - Token invalide", status: 401 };
  }
}

export function unauthorizedResponse(message = "Non autorisé") {
  return NextResponse.json({ 
    success: false, 
    message 
  }, { status: 401 });
}
