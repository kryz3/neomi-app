# 📝 API Avis - Documentation

Système complet de gestion des avis clients pour l'application Neomi.

## 🏗️ Architecture

### Modèle de données
```javascript
{
  _id: ObjectId,
  entreprise: String (requis, max 100 caractères),
  logo: String (optionnel, chemin vers l'image),
  referent: String (requis, max 100 caractères),
  role: String (requis, max 100 caractères),
  recommandation: String (requis, max 2000 caractères),
  isActive: Boolean (défaut: true),
  ordre: Number (défaut: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 📡 Endpoints API

### Routes CRUD principales

#### `GET /api/avis`
Récupère tous les avis actifs triés par ordre
```json
{
  "success": true,
  "data": [...],
  "count": 6
}
```

#### `POST /api/avis`
Crée un nouvel avis
```json
{
  "entreprise": "Mon Entreprise",
  "logo": "/logos/mon-logo.webp",
  "referent": "Jean Dupont",
  "role": "Directeur",
  "recommandation": "Excellent service...",
  "ordre": 1
}
```

#### `GET /api/avis/[id]`
Récupère un avis spécifique par son ID

#### `PUT /api/avis/[id]`
Met à jour un avis complet

#### `DELETE /api/avis/[id]`
Supprime un avis (suppression douce - désactivation)

### Routes spécialisées

#### `PATCH /api/avis/[id]/field/[field]`
**Modifie un champ spécifique d'un avis**

Champs autorisés : `entreprise`, `logo`, `referent`, `role`, `recommandation`, `isActive`, `ordre`

**Exemple :**
```bash
curl -X PATCH http://localhost:3000/api/avis/64f123456789/field/recommandation \
  -H "Content-Type: application/json" \
  -d '{"value": "Nouvelle recommandation mise à jour"}'
```

#### `DELETE /api/avis/[id]/hard`
Suppression définitive d'un avis (administration)

#### `POST /api/migrate-avis`
Migration des avis existants vers la base de données

## 🛠️ Utilisation dans React

### Hook useAvis
```javascript
import { useAvis } from '../hooks/useAvis';

function MonComposant() {
  const { avis, loading, error, refetch } = useAvis();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {avis.map(avis => (
        <div key={avis.id}>{avis.entreprise}</div>
      ))}
    </div>
  );
}
```

### Fonctions utilitaires
```javascript
import { 
  createAvis, 
  updateAvis, 
  updateAvisField, 
  deleteAvis 
} from '../hooks/useAvis';

// Créer un avis
const nouvelAvis = await createAvis({
  entreprise: "Nouvelle Entreprise",
  referent: "Marie Martin",
  role: "CEO",
  recommandation: "Très satisfait..."
});

// Modifier un champ spécifique
await updateAvisField("64f123456789", "recommandation", "Nouvelle recommandation");

// Mettre à jour complètement
await updateAvis("64f123456789", { entreprise: "Nouveau nom" });

// Supprimer
await deleteAvis("64f123456789");
```

## 🚀 Migration

### Automatique via API
```bash
curl -X POST http://localhost:3000/api/migrate-avis
```

### Manuel via script
```bash
node src/app/scripts/migrateAvis.js
```

## 🎯 Exemples d'usage

### Modifier uniquement la recommandation d'un avis
```javascript
// Récupérer l'ID de l'avis à modifier
const avisXEFI = avis.find(a => a.entreprise === "XEFI");

// Modifier seulement la recommandation
await updateAvisField(avisXEFI.id, "recommandation", 
  "Partenariat exceptionnel depuis 8 ans. Service irréprochable !"
);
```

### Réorganiser l'ordre d'affichage
```javascript
// Mettre l'avis Natreflexo en premier
await updateAvisField(natreflexoId, "ordre", 1);

// Ajuster les autres ordres
await updateAvisField(xefiId, "ordre", 2);
await updateAvisField(osignId, "ordre", 3);
```

### Désactiver temporairement un avis
```javascript
await updateAvisField(avisId, "isActive", false);
```

## 🔧 Fichiers du système

- **Modèle :** `src/app/models/Avis.js`
- **Contrôleur :** `src/app/controllers/avisController.js`
- **Routes API :** `src/app/api/avis/**`
- **Hook React :** `src/app/hooks/useAvis.js`
- **Migration :** `src/app/scripts/migrateAvis.js`

## ⚠️ Notes importantes

1. **Suppression douce :** Par défaut, la suppression désactive l'avis (`isActive: false`) au lieu de le supprimer définitivement
2. **Validation :** Tous les champs requis sont validés côté serveur
3. **Ordre d'affichage :** Les avis sont triés par `ordre` puis par `createdAt`
4. **Images :** Les logos sont stockés comme chemins relatifs vers les fichiers dans `/public/avis/`

## 🐛 Gestion d'erreurs

L'API retourne des codes d'erreur HTTP appropriés :
- `200` : Succès
- `201` : Création réussie
- `400` : Données invalides
- `403` : Champ non autorisé
- `404` : Avis non trouvé
- `500` : Erreur serveur

Toutes les réponses incluent un objet avec `success`, `error` et `details` le cas échéant.
