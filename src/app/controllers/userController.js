import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { SignJWT } from "jose";

export async function registerUser(req) {
  await connectToDatabase();

  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Tous les champs sont requis" }), { status: 400 });
  }

  // Vérif si l'utilisateur existe déjà
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "Nom d'utilisateur déjà pris" }), { status: 400 });
  }

  // Création du nouvel utilisateur
  const newUser = new User({ username, password });
  await newUser.save();

  return new Response(JSON.stringify({ message: "Utilisateur créé avec succès" }), { status: 201 });
}

export async function loginUser(req) {
  await connectToDatabase();

  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Tous les champs sont requis" }), { status: 400 });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "Mot de passe incorrect" }), { status: 401 });
  }

  // Créer le token JWT
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ userId: user._id, username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  // Créer la réponse avec le cookie
  const response = new Response(JSON.stringify({ 
    message: "Connexion réussie",
    user: { id: user._id, username: user.username }
  }), { status: 200 });

  // Définir le cookie avec le token
  response.headers.set("Set-Cookie", 
    `authToken=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
  );

  return response;
}
