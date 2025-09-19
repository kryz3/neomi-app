import { getCSRFTokenEndpoint } from '../../lib/csrf.js';
import { withSecurityHeaders, applySecureCacheHeaders } from '../../lib/security.js';
import { withRateLimit } from '../../lib/rateLimit.js';

async function csrfHandler(request) {
  const response = await getCSRFTokenEndpoint(request);
  applySecureCacheHeaders(response, 'no-cache');
  return response;
}

// GET /api/csrf - Obtenir un token CSRF
export const GET = withSecurityHeaders(
  withRateLimit(csrfHandler, '/api/csrf')
);