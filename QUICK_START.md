# 🚀 Guide de Démarrage Rapide - Production

## 📦 Déploiement Automatisé (Recommandé)

```bash
# 1. Cloner le projet
git clone https://github.com/kryz3/neomi-app.git
cd neomi-app

# 2. Exécuter le script de déploiement automatisé
./deploy-production.sh
```

Le script automatisé va :
- ✅ Installer et sécuriser MongoDB
- ✅ Créer les utilisateurs avec des mots de passe forts
- ✅ Configurer le firewall
- ✅ Builder l'application
- ✅ Configurer PM2
- ✅ Démarrer l'application

## ⚡ Déploiement Manuel (Expert)

### 1. Prérequis
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y curl git nodejs npm
```

### 2. MongoDB
```bash
# Installation MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update && sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Créer l'utilisateur (remplacez MOT_DE_PASSE)
mongosh --eval "
use admin;
db.createUser({
  user: 'neomi_prod_user',
  pwd: 'MOT_DE_PASSE_FORT_ICI',
  roles: [
    { role: 'readWrite', db: 'neomi-prod-db' },
    { role: 'dbAdmin', db: 'neomi-prod-db' }
  ]
});
"

# Activer l'authentification
sudo sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf
sudo systemctl restart mongod
```

### 3. Application
```bash
# Cloner et installer
git clone https://github.com/kryz3/neomi-app.git
cd neomi-app
npm ci
npm run build

# Configuration
cp .env.example .env.production
nano .env.production  # Modifiez les variables

# PM2
sudo npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Nginx + SSL
```bash
# Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Configuration
sudo cp nginx.conf.template /etc/nginx/sites-available/neomi
sed -i 's/VOTRE_DOMAINE.com/votre-domaine.com/g' /etc/nginx/sites-available/neomi
sudo ln -s /etc/nginx/sites-available/neomi /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d votre-domaine.com
```

## 🔧 Commandes de Maintenance

```bash
# Statut général
pm2 status
sudo systemctl status mongod
sudo systemctl status nginx

# Logs
pm2 logs neomi-app
sudo tail -f /var/log/mongodb/mongod.log
sudo tail -f /var/log/nginx/neomi_error.log

# Redémarrages
pm2 restart neomi-app
sudo systemctl restart mongod
sudo systemctl reload nginx

# Sauvegarde MongoDB
mongodump --uri="mongodb://neomi_prod_user:MOT_DE_PASSE@localhost:27017/neomi-prod-db?authSource=admin"

# Mise à jour de l'app
git pull
npm ci
npm run build
pm2 restart neomi-app
```

## 🔒 Checklist Sécurité

- [ ] MongoDB avec authentification activée
- [ ] Firewall configuré (port 27017 fermé publiquement)
- [ ] Certificat SSL/HTTPS actif
- [ ] Variables d'environnement sécurisées
- [ ] Sauvegardes automatiques configurées
- [ ] Monitoring en place

## 🆘 Dépannage Rapide

**MongoDB ne démarre pas :**
```bash
sudo systemctl status mongod
sudo tail -f /var/log/mongodb/mongod.log
```

**Application ne répond pas :**
```bash
pm2 logs neomi-app
pm2 restart neomi-app
```

**Erreur 502 Bad Gateway :**
```bash
# Vérifier que l'app fonctionne
curl http://localhost:3000
# Vérifier Nginx
sudo nginx -t
```

**Problème de permissions :**
```bash
# Dossiers MongoDB
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb

# Dossiers application
sudo chown -R $USER:$USER /path/to/neomi-app
```

## 📞 Support

En cas de problème, vérifiez en priorité :
1. Les logs PM2 : `pm2 logs neomi-app`
2. Les logs MongoDB : `sudo tail -f /var/log/mongodb/mongod.log`  
3. Les logs Nginx : `sudo tail -f /var/log/nginx/neomi_error.log`

---

**🎯 L'application devrait être accessible via https://votre-domaine.com après la configuration complète !**