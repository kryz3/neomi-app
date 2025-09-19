import { SignJWT } from "jose";
import { loginSchema, validateAndSanitize, validationErrorResponse } from '../lib/validation.js';
import { applySecureCacheHeaders } from '../lib/security.js';
import crypto from 'crypto';

export async function loginUser(req) {
  try {
    const body = await req.json();

    // Validation et sanitisation
    const validation = validateAndSanitize(loginSchema, body);
    
    if (!validation.success) {
      const response = new Response(
        JSON.stringify(validationErrorResponse(validation.errors)), 
        { status: 400 }
      );
      applySecureCacheHeaders(response, 'no-cache');
      return response;
    }

    const { username, password } = validation.data;

    // Vérifier avec les variables d'environnement
    if (username !== process.env.LOGIN || password !== process.env.PASSWORD) {
      console.warn(`🚨 Tentative de connexion échouée pour: ${username} depuis ${req.headers.get('x-forwarded-for') || 'IP inconnue'}`);
      
      const response = new Response(
        JSON.stringify({ error: "Identifiants incorrects" }), 
        { status: 401 }
      );
      applySecureCacheHeaders(response, 'no-cache');
      return response;
    }

  // Créer le token JWT avec des claims spécifiques et plus de sécurité
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ 
    userId: "admin", 
    username: username,
    iat: Math.floor(Date.now() / 1000),
    loginTime: Date.now(),
    validLogin: true, // Claim spécifique pour valider que c'est un vrai login
    sessionId: crypto.randomUUID() // Identifiant unique de session
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  console.log(`✅ Connexion réussie pour: ${username} depuis ${req.headers.get('x-forwarded-for') || 'IP inconnue'}`);

  // Créer la réponse avec le cookie sécurisé
  const response = new Response(JSON.stringify({ 
    message: "Connexion réussie",
    user: { username, role: "admin" }
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });

  // Cookie sécurisé avec toutes les protections
  const isProduction = process.env.NODE_ENV === 'production';
  response.headers.set("Set-Cookie", 
    `authToken=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${isProduction ? '; Secure' : ''}`
  );

  applySecureCacheHeaders(response, 'no-cache');
  return response;

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    
    const response = new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }), 
      { status: 500 }
    );
    applySecureCacheHeaders(response, 'no-cache');
    return response;
  }
}
