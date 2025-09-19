import mongoose from "mongoose";

// Configuration MongoDB sécurisée
const MONGODB_URI = process.env.MONGODB_URI;

// Vérification de la présence de l'URI MongoDB
if (!MONGODB_URI) {
  throw new Error(
    "⚠️  MONGODB_URI n'est pas défini dans les variables d'environnement.\n" +
    "Ajoutez MONGODB_URI=mongodb://username:password@localhost:27017/database?authSource=admin dans votre fichier .env"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Si déjà connecté, retourner la connexion existante
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // Options de sécurité et performance - warnings deprecated supprimés
      maxPoolSize: 10, // Limite le nombre de connexions simultanées
      serverSelectionTimeoutMS: 5000, // Timeout pour la sélection du serveur
      socketTimeoutMS: 45000, // Timeout pour les opérations
      family: 4, // Utilise IPv4, évite les retards IPv6
      // Options de sécurité
      retryWrites: true,
      w: 'majority', // Attend la confirmation d'écriture de la majorité
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Connexion MongoDB établie avec succès");
        console.log(`📊 Base de données: ${mongoose.connection.name}`);
        console.log(`🔒 Authentification: ${mongoose.connection.user ? 'Activée' : 'Désactivée'}`);
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ Erreur de connexion MongoDB:");
        console.error("📍 URI:", MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Masque les credentials
        console.error("💥 Détail:", err.message);
        
        // Messages d'erreur spécifiques
        if (err.message.includes('authentication failed')) {
          console.error("🔐 Erreur d'authentification: Vérifiez le nom d'utilisateur et le mot de passe");
        } else if (err.message.includes('ECONNREFUSED')) {
          console.error("🔌 Connexion refusée: Vérifiez que MongoDB est démarré");
        } else if (err.message.includes('ENOTFOUND')) {
          console.error("🌐 Hôte introuvable: Vérifiez l'adresse du serveur MongoDB");
        }
        
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset le cache en cas d'erreur pour permettre une nouvelle tentative
    cached.promise = null;
    throw error;
  }
}

// Gestion de la fermeture propre des connexions
process.on('SIGINT', async () => {
  if (cached.conn) {
    await cached.conn.connection.close();
    console.log('🔌 Connexion MongoDB fermée proprement');
    process.exit(0);
  }
});

export default dbConnect;
