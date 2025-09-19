import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Cache des tokens CSRF (en production, utilisez Redis ou une base de données)
const csrfTokens = new Map();

// Durée de vie d'un token CSRF (30 minutes)
const CSRF_TOKEN_LIFETIME = 30 * 60 * 1000;

/**
 * Générer un token CSRF sécurisé
 */
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Créer et stocker un token CSRF pour une session
 */
export function createCSRFToken(sessionId = null) {
  const token = generateCSRFToken();
  const expiresAt = Date.now() + CSRF_TOKEN_LIFETIME;
  
  // Si pas de sessionId, créer un identifiant unique
  const id = sessionId || crypto.randomBytes(16).toString('hex');
  
  csrfTokens.set(token, {
    sessionId: id,
    expiresAt,
    used: false
  });
  
  // Nettoyer les tokens expirés
  cleanExpiredTokens();
  
  return { token, sessionId: id };
}

/**
 * Valider un token CSRF
 */
export function validateCSRFToken(token, sessionId = null) {
  if (!token) {
    return { valid: false, error: 'Token CSRF manquant' };
  }
  
  const tokenData = csrfTokens.get(token);
  
  if (!tokenData) {
    return { valid: false, error: 'Token CSRF invalide' };
  }
  
  // Vérifier l'expiration
  if (Date.now() > tokenData.expiresAt) {
    csrfTokens.delete(token);
    return { valid: false, error: 'Token CSRF expiré' };
  }
  
  // Vérifier la session si fournie
  if (sessionId && tokenData.sessionId !== sessionId) {
    return { valid: false, error: 'Token CSRF invalide pour cette session' };
  }
  
  // Vérifier si le token a déjà été utilisé (protection contre replay)
  if (tokenData.used) {
    return { valid: false, error: 'Token CSRF déjà utilisé' };
  }
  
  // Marquer le token comme utilisé
  tokenData.used = true;
  
  return { valid: true };
}

/**
 * Nettoyer les tokens expirés
 */
function cleanExpiredTokens() {
  const now = Date.now();
  
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    }
  }
}

/**
 * Middleware de protection CSRF
 */
export function withCSRFProtection(handler, options = {}) {
  return async function(request, ...args) {
    const method = request.method;
    
    // Ignorer GET, HEAD, OPTIONS par défaut
    const safeMethods = options.safeMethods || ['GET', 'HEAD', 'OPTIONS'];
    
    if (safeMethods.includes(method)) {
      return handler(request, ...args);
    }
    
    // Vérifier le token CSRF pour les autres méthodes
    const token = getCSRFTokenFromRequest(request);
    const sessionId = getSessionIdFromRequest(request);
    
    const validation = validateCSRFToken(token, sessionId);
    
    if (!validation.valid) {
      console.warn(`🚨 Protection CSRF: ${validation.error} pour ${request.url}`);
      return NextResponse.json({
        error: 'Protection CSRF',
        message: validation.error
      }, { status: 403 });
    }
    
    return handler(request, ...args);
  };
}

/**
 * Extraire le token CSRF de la requête
 */
function getCSRFTokenFromRequest(request) {
  // Vérifier dans les headers en priorité
  const headerToken = request.headers.get('X-CSRF-Token') || request.headers.get('X-XSRF-Token');
  
  if (headerToken) {
    return headerToken;
  }
  
  // Si pas dans les headers, vérifier dans le body (pour les formulaires)
  // Note: ceci nécessite que le body soit parsé avant
  try {
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      // Pour JSON, le token doit être dans les headers
      return null;
    }
    
    // Pour les formulaires, on peut chercher dans le body
    // Mais c'est plus complexe avec Next.js, donc on privilégie les headers
    return null;
  } catch {
    return null;
  }
}

/**
 * Extraire l'identifiant de session de la requête
 */
function getSessionIdFromRequest(request) {
  // Chercher dans les cookies
  const sessionCookie = request.cookies.get('sessionId');
  
  if (sessionCookie) {
    return sessionCookie.value;
  }
  
  // Chercher dans les headers
  return request.headers.get('X-Session-ID');
}

/**
 * Créer une réponse avec un nouveau token CSRF
 */
export function responseWithCSRFToken(data = {}, sessionId = null) {
  const { token, sessionId: newSessionId } = createCSRFToken(sessionId);
  
  const response = NextResponse.json({
    ...data,
    csrfToken: token
  });
  
  // Ajouter le token dans les headers aussi
  response.headers.set('X-CSRF-Token', token);
  
  // Si nouveau sessionId, l'ajouter dans un cookie
  if (!sessionId) {
    response.cookies.set('sessionId', newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: CSRF_TOKEN_LIFETIME / 1000
    });
  }
  
  return response;
}

/**
 * Endpoint pour obtenir un token CSRF
 */
export async function getCSRFTokenEndpoint(request) {
  const sessionId = getSessionIdFromRequest(request);
  
  return responseWithCSRFToken({
    message: 'Token CSRF généré'
  }, sessionId);
}