import { jwtVerify } from "jose";

export async function GET(req) {
  const token = req.cookies?.get("authToken")?.value;

  if (!token) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Vérifications supplémentaires pour éviter les tokens forgés
    if (!payload.validLogin || 
        payload.userId !== "admin" || 
        payload.username !== process.env.LOGIN) {
      throw new Error("Token invalide");
    }
    
    return new Response(JSON.stringify({ 
      authenticated: true,
      user: { id: payload.userId, username: payload.username }
    }), { status: 200 });
    
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
