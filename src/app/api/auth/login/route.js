import { loginUser } from "@/app/controllers/userController.js";
import { withRateLimit } from '../../../lib/rateLimit.js';
import { withSecurityHeaders } from '../../../lib/security.js';

// Appliquer les protections à la route de login
const securedLoginUser = withSecurityHeaders(
  withRateLimit(loginUser, '/api/auth/login')
);

export async function POST(req) {
  return await securedLoginUser(req);
}
