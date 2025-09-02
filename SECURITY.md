# Sécurisation des Routes API - Résumé

## Routes sécurisées (ADMIN SEULEMENT)

### Upload de fichiers
- `POST /api/upload/avis` - Upload d'images pour les avis
- `POST /api/upload/secteurs` - Upload d'icônes pour les secteurs  
- `POST /api/upload/organigramme` - Upload de photos pour l'organigramme

### Gestion des avis
- `POST /api/avis` - Création d'avis
- `PUT /api/avis/[id]` - Modification d'avis
- `PATCH /api/avis/[id]` - Modification partielle d'avis
- `DELETE /api/avis/[id]` - Suppression d'avis
- `DELETE /api/avis/[id]/hard` - Suppression définitive d'avis
- `PATCH /api/avis/[id]/field/[field]` - Modification d'un champ spécifique

### Gestion des secteurs
- `POST /api/secteurs` - Création de secteur
- `PUT /api/secteurs/[id]` - Modification de secteur
- `DELETE /api/secteurs/[id]` - Suppression de secteur

### Gestion de l'organigramme
- `POST /api/organigrammes` - Création de membre
- `PUT /api/organigrammes/[id]` - Modification de membre
- `DELETE /api/organigrammes/[id]` - Suppression de membre

## Routes publiques (accessibles sans authentification)

### Lecture de données
- `GET /api/avis` - Récupération de tous les avis
- `GET /api/avis/[id]` - Récupération d'un avis spécifique
- `GET /api/secteurs` - Récupération de tous les secteurs
- `GET /api/organigrammes` - Récupération de tous les membres

### Autres
- `POST /api/contact` - Envoi de formulaire de contact
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/logout` - Déconnexion admin

## Mécanisme de sécurité

1. **Fonction utilitaire** : `verifyAdminAuth()` dans `/lib/auth.js`
2. **Vérification JWT** : Validation du token depuis les cookies
3. **Contrôles supplémentaires** : Vérification des claims du token
4. **Réponses d'erreur** : Messages d'erreur standardisés avec codes HTTP appropriés

## Utilisation

Toutes les routes sécurisées vérifient automatiquement :
- Présence du cookie `authToken`
- Validité du token JWT
- Claims appropriés (userId=admin, username=LOGIN env var)

En cas d'échec, retour automatique d'une erreur 401 ou 403.
