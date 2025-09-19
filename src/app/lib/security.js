/**
 * Headers de sécurité HTTP pour Next.js
 * Protection contre XSS, clickjacking, MITM, etc.
 */

export const securityHeaders = [
  // Forcer HTTPS
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  // Empêcher le MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Protection XSS
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Empêcher l'embedding en iframe
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // Contrôler les referrers
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Permissions Policy (anciennement Feature Policy)
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hcaptcha.com https://newassets.hcaptcha.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://newassets.hcaptcha.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com",
      "frame-src https://newassets.hcaptcha.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

/**
 * Appliquer les headers de sécurité à une réponse Next.js
 */
export function applySecurityHeaders(response) {
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Middleware pour appliquer les headers de sécurité
 */
export function withSecurityHeaders(handler) {
  return async function(request, ...args) {
    const response = await handler(request, ...args);
    
    if (response && response.headers) {
      applySecurityHeaders(response);
    }
    
    return response;
  };
}

/**
 * Headers CORS sécurisés
 */
export function applyCORSHeaders(response, request) {
  const origin = request.headers.get('Origin');
  
  // Liste blanche des domaines autorisés (à adapter selon vos besoins)
  const allowedOrigins = [
    'https://votre-domaine.com',
    'https://www.votre-domaine.com'
  ];
  
  // En développement, autoriser localhost
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
  }
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 heures
  
  return response;
}

/**
 * Headers de cache sécurisé
 */
export function applySecureCacheHeaders(response, cacheType = 'no-cache') {
  switch (cacheType) {
    case 'no-cache':
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      break;
      
    case 'short':
      response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      break;
      
    case 'medium':
      response.headers.set('Cache-Control', 'public, max-age=3600'); // 1 heure
      break;
      
    case 'long':
      response.headers.set('Cache-Control', 'public, max-age=86400'); // 24 heures
      break;
      
    case 'static':
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 an
      break;
  }
  
  return response;
}