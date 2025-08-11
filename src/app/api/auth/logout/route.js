export async function POST() {
  const response = new Response(JSON.stringify({ message: "Déconnexion réussie" }), { 
    status: 200 
  });

  // Supprimer le cookie d'authentification
  response.headers.set("Set-Cookie", 
    "authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
  );

  return response;
}
