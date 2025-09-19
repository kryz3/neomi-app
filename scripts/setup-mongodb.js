// Script de configuration MongoDB pour Neomi App
// Ce fichier contient les commandes à exécuter dans mongosh

/*
INSTRUCTIONS DE CONFIGURATION :

1. Assurez-vous que MongoDB est démarré (sans authentification pour le moment)
2. Ouvrez mongosh : mongosh
3. Copiez et exécutez les commandes suivantes :

// Utiliser la base de données admin
use admin

// Créer un utilisateur pour la base de données Neomi
db.createUser({
  user: "neomi_user",
  pwd: "N3om1DB_P@ssw0rd2025$",
  roles: [
    {
      role: "readWrite",
      db: "neomi-db"
    },
    {
      role: "dbAdmin", 
      db: "neomi-db"
    }
  ]
})

// Vérifier que l'utilisateur a été créé
db.getUsers()

// Basculer vers la base de données neomi-db
use neomi-db

// Créer une collection de test
db.test.insertOne({ message: "Configuration réussie", timestamp: new Date() })

// Vérifier l'insertion
db.test.find()

4. Après avoir créé l'utilisateur, redémarrez MongoDB avec l'authentification :
   - Arrêtez MongoDB
   - Redémarrez avec : mongod --auth
   
5. Testez la connexion avec le nouvel utilisateur :
   mongosh -u neomi_user -p N3om1DB_P@ssw0rd2025$ --authenticationDatabase admin neomi-db

IMPORTANT : 
- Changez le mot de passe en production
- Assurez-vous que MongoDB utilise l'authentification
- Vérifiez que le firewall protège le port 27017
*/

console.log("📋 Instructions de configuration MongoDB disponibles dans ce fichier");
console.log("🔧 Suivez les étapes dans les commentaires ci-dessus");