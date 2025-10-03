# Système de Corbeille - Neomi App

## 📋 Vue d'ensemble

Le système de corbeille implémente une **suppression logique** pour tous les éléments de l'administration (Articles, Avis, Secteurs, Organigramme). Au lieu de supprimer définitivement les données, elles sont marquées comme supprimées et peuvent être restaurées si nécessaire.

## 🎯 Fonctionnalités

### ✅ Suppression Logique
- Les éléments supprimés ne sont pas effacés de la base de données
- Ajout d'un champ `deletedAt` avec la date de suppression
- Les éléments supprimés sont exclus automatiquement des requêtes standard

### 🗑️ Interface de Corbeille
- Visualisation de tous les éléments supprimés
- Filtrage par type d'élément (Article, Avis, Secteur, Organigramme)
- Statistiques en temps réel
- Actions : Restaurer ou Supprimer définitivement

### 🔄 Opérations Disponibles
1. **Restaurer** : Remet l'élément en service
2. **Supprimer définitivement** : Suppression physique irréversible
3. **Vider la corbeille** : Supprime tous les éléments définitivement

## 🏗️ Architecture

### Modèles Modifiés
Tous les modèles ont été mis à jour avec :
```javascript
deletedAt: {
  type: Date,
  default: null
}
```

### Nouveau Modèle Trash
```javascript
// Suivi centralisé des suppressions
const TrashSchema = {
  itemId: ObjectId,        // ID de l'élément supprimé
  itemType: String,        // Type : Article, Avis, Secteur, Organigramme
  itemData: Mixed,         // Copie des données au moment de la suppression
  deletedBy: String,       // Qui a supprimé (défaut: Admin)
  deletedAt: Date,         // Quand
  originalCollection: String // Collection d'origine
}
```

### Contrôleurs Mis à Jour
Chaque contrôleur dispose maintenant de :
- `delete()` : Suppression logique → corbeille
- `restore()` : Restauration depuis la corbeille
- `permanentDelete()` : Suppression physique définitive

## 🔧 API Endpoints

### Corbeille
- `GET /api/trash` - Liste des éléments supprimés
- `GET /api/trash?type=Article` - Filtrer par type
- `DELETE /api/trash` - Vider la corbeille
- `GET /api/trash/stats` - Statistiques

### Actions sur éléments
- `POST /api/trash/[id]` - Restaurer un élément
- `DELETE /api/trash/[id]?type=Article` - Suppression définitive

## 🚀 Migration

Un script de migration est fourni pour les données existantes :

```bash
node scripts/migrate-trash-system.js
```

## 💡 Utilisation

### Dans l'interface Admin
1. Accédez à `/admin/corbeille`
2. Visualisez les éléments supprimés
3. Filtrez par type si nécessaire
4. Restaurez ou supprimez définitivement

### Garde-fous
- **Double confirmation** pour les suppressions définitives
- **Sauvegarde automatique** dans le modèle Trash
- **Filtres automatiques** pour exclure les éléments supprimés

## 📊 Avantages

1. **Sécurité** : Protection contre les suppressions accidentelles
2. **Récupération** : Possibilité de restaurer des données
3. **Audit** : Historique des suppressions
4. **Performance** : Les requêtes standards restent rapides
5. **Flexibilité** : Gestion granulaire par type d'élément

## ⚠️ Important

- Les éléments dans la corbeille **ne sont pas visibles** sur le site public
- La **suppression définitive est irréversible**
- Le script de migration doit être exécuté **une seule fois**
- Les **contraintes d'unicité** (slugs, ordres) ignorent les éléments supprimés

## 🔮 Évolutions Futures

- Suppression automatique après X jours
- Notifications de corbeille pleine
- Logs d'audit plus détaillés
- Export/Import de corbeille