import { NextResponse } from 'next/server';

// Cache en mémoire pour stocker les tentatives par IP
const rateLimitCache = new Map();

// Configuration du rate limiting par endpoint
const RATE_LIMITS = {
  '/api/contact': { requests: 5, window: 15 * 60 * 1000 }, // 5 requêtes par 15 min
  '/api/auth/login': { requests: 3, window: 15 * 60 * 1000 }, // 3 tentatives par 15 min
  default: { requests: 100, window: 15 * 60 * 1000 } // 100 requêtes par 15 min
};

/**
 * Middleware de rate limiting
 * @param {Request} request - Requête Next.js
 * @param {string} endpoint - Endpoint à protéger
 * @returns {object} - { allowed: boolean, remaining: number, resetTime: Date }
 */
export function rateLimit(request, endpoint = 'default') {
  // Obtenir l'IP du client
  const clientIP = getClientIP(request);
  
  // Obtenir la configuration pour cet endpoint
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  
  // Clé unique pour cet IP + endpoint
  const key = `${clientIP}:${endpoint}`;
  
  // Nettoyer les entrées expirées
  cleanExpiredEntries();
  
  // Vérifier les tentatives actuelles
  const now = Date.now();
  const userAttempts = rateLimitCache.get(key) || { count: 0, resetTime: now + config.window };
  
  // Si la fenêtre de temps est expirée, réinitialiser
  if (now > userAttempts.resetTime) {
    userAttempts.count = 0;
    userAttempts.resetTime = now + config.window;
  }
  
  // Incrémenter le compteur
  userAttempts.count++;
  rateLimitCache.set(key, userAttempts);
  
  // Vérifier si la limite est dépassée
  const allowed = userAttempts.count <= config.requests;
  const remaining = Math.max(0, config.requests - userAttempts.count);
  
  return {
    allowed,
    remaining,
    resetTime: new Date(userAttempts.resetTime),
    limit: config.requests
  };
}

/**
 * Extraire l'IP du client depuis les headers
 */
function getClientIP(request) {
  // Vérifier les headers de proxy en cascade
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwardedFor) {
    // Prendre la première IP si plusieurs (proxy chain)
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (remoteAddr) {
    return remoteAddr;
  }
  
  // Fallback IP si aucune n'est trouvée
  return '127.0.0.1';
}

/**
 * Nettoyer les entrées expirées du cache
 */
function cleanExpiredEntries() {
  const now = Date.now();
  
  for (const [key, value] of rateLimitCache.entries()) {
    if (now > value.resetTime) {
      rateLimitCache.delete(key);
    }
  }
}

/**
 * Créer une réponse d'erreur rate limit
 */
export function rateLimitResponse(rateLimitResult) {
  const response = NextResponse.json({
    error: 'Trop de requêtes',
    message: 'Vous avez dépassé la limite de requêtes. Veuillez réessayer plus tard.',
    retryAfter: Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000)
  }, { status: 429 });
  
  // Ajouter les headers standard de rate limiting
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toISOString());
  response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 1000).toString());
  
  return response;
}

/**
 * Middleware wrapper pour appliquer rate limiting facilement
 */
export function withRateLimit(handler, endpoint) {
  return async function(request, ...args) {
    // Appliquer le rate limiting
    const rateLimitResult = rateLimit(request, endpoint);
    
    if (!rateLimitResult.allowed) {
      console.warn(`🚨 Rate limit dépassé pour ${getClientIP(request)} sur ${endpoint}`);
      return rateLimitResponse(rateLimitResult);
    }
    
    // Si autorisé, continuer avec le handler original
    const response = await handler(request, ...args);
    
    // Ajouter les headers de rate limiting même en cas de succès
    if (response && response.headers) {
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toISOString());
    }
    
    return response;
  };
}