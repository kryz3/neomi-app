# 🛡️ Configuration hCaptcha pour neomi.fr

## 📋 Étapes de configuration

### 1. Connectez-vous à votre dashboard hCaptcha
- Allez sur : https://dashboard.hcaptcha.com/
- Connectez-vous avec votre compte

### 2. Configurez votre site
- Cliquez sur votre site existant ou créez-en un nouveau
- Dans **"Domains"**, ajoutez :
  - `neomi.fr`
  - `www.neomi.fr`
  - `localhost` (pour les tests en développement si nécessaire)

### 3. Vérifiez vos clés
Vos clés actuelles dans `.env` :
```env
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET_KEY=
```

### 4. Test en local
Si vous voulez tester en local, ajoutez temporairement `localhost:3000` dans les domaines autorisés.

## ⚠️ Points importants

### En développement (localhost)
- Le CAPTCHA peut ne pas fonctionner si `localhost` n'est pas autorisé
- Solution : Ajouter `localhost:3000` dans votre configuration hCaptcha

### En production (neomi.fr)
- ✅ Le CAPTCHA fonctionnera parfaitement avec `neomi.fr` et `www.neomi.fr`
- ✅ Protection complète contre les bots
- ✅ Validation côté serveur obligatoire

## 🧪 Test de fonctionnement

### Vérification manuelle
1. Allez sur votre formulaire de contact
2. Remplissez le formulaire
3. **Le CAPTCHA doit s'afficher** et être interactif
4. Après validation du CAPTCHA, le bouton "Envoyer" se débloque
5. L'envoi doit fonctionner

### Logs côté serveur
Surveillez les logs pour voir :
```
🛡️ Vérification CAPTCHA: Succès
```

Ou en cas d'erreur :
```
🛡️ Vérification CAPTCHA: Échec (invalid-input-response)
```

## 🎯 Configuration finale

Votre configuration est maintenant **prête pour la production** :
- ✅ Pas de contournement en développement
- ✅ Validation obligatoire du CAPTCHA
- ✅ Logs détaillés pour le debugging
- ✅ Protection complète contre les bots

**Le formulaire fonctionne maintenant exactement comme en production !** 🚀