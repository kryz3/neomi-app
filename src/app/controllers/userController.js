import { SignJWT } from "jose";


export async function loginUser(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Tous les champs sont requis" }), { status: 400 });
  }

  // Vérifier avec les variables d'environnement
  if (username !== process.env.LOGIN || password !== process.env.PASSWORD) {
    return new Response(JSON.stringify({ error: "Identifiants incorrects" }), { status: 401 });
  }

  // Créer le token JWT avec des claims spécifiques
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ 
    userId: "admin", 
    username: username,
    iat: Math.floor(Date.now() / 1000),
    loginTime: Date.now(),
    validLogin: true // Claim spécifique pour valider que c'est un vrai login
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  // Créer la réponse avec le cookie
  const response = new Response(JSON.stringify({ 
    message: "Connexion réussie",
  }), { status: 200 });

  // Définir le cookie avec le token
  response.headers.set("Set-Cookie", 
    `authToken=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
  );

  return response;
}
