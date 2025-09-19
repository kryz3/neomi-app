# 🚀 Guide de Déploiement en Production - Neomi App

Ce guide vous accompagne pour déployer l'application Neomi en production avec une base de données MongoDB sécurisée.

## 📋 Prérequis

- Serveur Linux (Ubuntu/Debian recommandé)
- Node.js 18+ installé
- MongoDB 6.0+ installé
- Accès root/sudo au serveur
- Nom de domaine configuré (optionnel mais recommandé)

## 🔧 Installation MongoDB en Production

### 1. Installation MongoDB sur Ubuntu/Debian

```bash
# Importer la clé publique MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajouter le repository MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Mettre à jour et installer
sudo apt update
sudo apt install -y mongodb-org

# Démarrer et activer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Configuration Sécurisée de MongoDB

#### A. Modifier le fichier de configuration

```bash
sudo nano /etc/mongod.conf
```

Ajoutez/modifiez ces lignes :

```yaml
# /etc/mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1  # Écoute uniquement localhost en production

# Activer l'authentification
security:
  authorization: enabled

# Optionnel : SSL/TLS pour connexions distantes
# net:
#   ssl:
#     mode: requireSSL
#     PEMKeyFile: /path/to/mongodb.pem
```

#### B. Redémarrer MongoDB

```bash
sudo systemctl restart mongod
sudo systemctl status mongod
```

## 🔐 Configuration de l'Utilisateur MongoDB

### 1. Créer l'utilisateur administrateur

```bash
# Se connecter à MongoDB (sans auth pour la première fois)
mongosh

# Dans mongosh, exécuter :
use admin

# Créer un utilisateur admin principal
db.createUser({
  user: "mongoAdmin",
  pwd: "VOTRE_MOT_DE_PASSE_ADMIN_ULTRA_SECURISE",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

# Quitter mongosh
exit
```

### 2. Créer l'utilisateur pour l'application Neomi

```bash
# Se reconnecter avec l'admin
mongosh -u mongoAdmin -p --authenticationDatabase admin

# Créer l'utilisateur spécifique à Neomi
use admin
db.createUser({
  user: "neomi_prod_user",
  pwd: "VOTRE_MOT_DE_PASSE_NEOMI_PRODUCTION",
  roles: [
    { role: "readWrite", db: "neomi-prod-db" },
    { role: "dbAdmin", db: "neomi-prod-db" }
  ]
})

# Vérifier la création
db.getUsers()

# Tester la base de données
use neomi-prod-db
db.test.insertOne({message: "Test de production", timestamp: new Date()})
db.test.find()

exit
```

### 3. Script automatisé de création d'utilisateur

Créez un fichier `setup-prod-user.js` :

```javascript
// setup-prod-user.js
use admin;

// Variables à modifier
const NEOMI_USER = "neomi_prod_user";
const NEOMI_PASSWORD = "CHANGEZ_MOI_PRODUCTION_2025";
const DB_NAME = "neomi-prod-db";

// Créer l'utilisateur
db.createUser({
  user: NEOMI_USER,
  pwd: NEOMI_PASSWORD,
  roles: [
    { role: "readWrite", db: DB_NAME },
    { role: "dbAdmin", db: DB_NAME }
  ]
});

print("✅ Utilisateur " + NEOMI_USER + " créé avec succès");
print("🔐 Base de données: " + DB_NAME);
print("⚠️  N'oubliez pas de mettre à jour le fichier .env.production");

// Test de connexion
use(DB_NAME);
db.test.insertOne({
  message: "Configuration de production réussie",
  timestamp: new Date(),
  environment: "production"
});

print("✅ Test d'insertion réussi dans " + DB_NAME);
```

Exécution :

```bash
# Modifier d'abord les variables dans le script
nano setup-prod-user.js

# Exécuter avec l'admin
mongosh -u mongoAdmin -p --authenticationDatabase admin < setup-prod-user.js
```

## 🌐 Déploiement de l'Application

### 1. Cloner et installer l'application

```bash
# Cloner le repository
git clone https://github.com/kryz3/neomi-app.git
cd neomi-app

# Installer les dépendances
npm install

# Créer le build de production
npm run build
```

### 2. Configuration des variables d'environnement

```bash
# Créer le fichier .env.production
cp .env.example .env.production
nano .env.production
```

Contenu du fichier `.env.production` :

```env
# Variables d'authentification - CHANGEZ TOUTES CES VALEURS !
JWT_SECRET=VOTRE_CLE_JWT_ULTRA_SECURISEE_PRODUCTION_2025
LOGIN=votre_admin_production
PASSWORD=VotreMotDePasseAdminProduction2025

# Configuration MongoDB Production
MONGODB_URI=mongodb://neomi_prod_user:VOTRE_MOT_DE_PASSE_NEOMI_PRODUCTION@localhost:27017/neomi-prod-db?authSource=admin

# Configuration SMTP Production
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_USER=noreply@votre-domaine.com
SMTP_PASS=votre_mot_de_passe_smtp
CONTACT_EMAIL=contact@votre-domaine.com

# Configuration Next.js
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre_secret_nextauth_production
```

### 3. Tester la connexion

```bash
# Test de connexion MongoDB
mongosh -u neomi_prod_user -p 'VOTRE_MOT_DE_PASSE_NEOMI_PRODUCTION' --authenticationDatabase admin neomi-prod-db --eval "db.runCommand('ping')"

# Test de l'application
NODE_ENV=production npm start
```

## 🔒 Sécurisation Supplémentaire

### 1. Firewall

```bash
# Installer UFW si pas déjà fait
sudo apt install ufw

# Règles de base
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autoriser SSH
sudo ufw allow ssh

# Autoriser HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# MongoDB : NE PAS exposer publiquement
# sudo ufw allow 27017  # <- NE PAS FAIRE ÇA

# Activer le firewall
sudo ufw enable
sudo ufw status
```

### 2. SSL/HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir un certificat (remplacez votre-domaine.com)
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Nginx Configuration

```nginx
# /etc/nginx/sites-available/neomi
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Headers de sécurité
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer la configuration :

```bash
sudo ln -s /etc/nginx/sites-available/neomi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔄 Déploiement avec PM2

### 1. Installation PM2

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Créer le fichier de configuration
nano ecosystem.config.js
```

Contenu du fichier `ecosystem.config.js` :

```javascript
module.exports = {
  apps: [{
    name: 'neomi-app',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/neomi-error.log',
    out_file: '/var/log/pm2/neomi-out.log',
    log_file: '/var/log/pm2/neomi-combined.log',
    time: true
  }]
};
```

### 2. Démarrage avec PM2

```bash
# Créer le dossier de logs
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Démarrer l'application
pm2 start ecosystem.config.js --env production

# Sauvegarder la configuration PM2
pm2 save

# Démarrage automatique au boot
pm2 startup
# Suivre les instructions affichées

# Vérifier le statut
pm2 status
pm2 logs neomi-app
```

## 📊 Monitoring et Maintenance

### 1. Monitoring MongoDB

```bash
# Créer un script de monitoring
cat > /home/$USER/monitor-mongo.sh << 'EOF'
#!/bin/bash
echo "=== MongoDB Status ==="
sudo systemctl status mongod --no-pager
echo ""
echo "=== MongoDB Connections ==="
mongosh -u mongoAdmin -p --authenticationDatabase admin --eval "db.serverStatus().connections"
echo ""
echo "=== Database Size ==="
mongosh -u neomi_prod_user -p --authenticationDatabase admin neomi-prod-db --eval "db.stats()"
EOF

chmod +x /home/$USER/monitor-mongo.sh
```

### 2. Sauvegarde automatique

```bash
# Créer un script de sauvegarde
cat > /home/$USER/backup-mongo.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="neomi-prod-db"

mkdir -p $BACKUP_DIR

mongodump --uri="mongodb://neomi_prod_user:VOTRE_MOT_DE_PASSE_NEOMI_PRODUCTION@localhost:27017/$DB_NAME?authSource=admin" --out=$BACKUP_DIR/$DATE

# Garder seulement les 7 dernières sauvegardes
find $BACKUP_DIR -type d -name "20*" -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $BACKUP_DIR/$DATE"
EOF

chmod +x /home/$USER/backup-mongo.sh

# Programmer la sauvegarde quotidienne
crontab -e
# Ajouter : 0 2 * * * /home/$USER/backup-mongo.sh >> /var/log/mongodb-backup.log 2>&1
```

## ✅ Checklist de Déploiement

- [ ] MongoDB installé et sécurisé
- [ ] Utilisateur MongoDB créé avec permissions limitées
- [ ] Firewall configuré (port 27017 NON exposé)
- [ ] Variables d'environnement de production configurées
- [ ] Application buildée et testée
- [ ] HTTPS configuré avec certificat SSL
- [ ] Nginx configuré comme reverse proxy
- [ ] PM2 configuré pour la gestion des processus
- [ ] Sauvegardes automatiques configurées
- [ ] Monitoring en place
- [ ] Tests de sécurité effectués

## 🆘 Dépannage

### Problèmes courants

1. **Erreur de connexion MongoDB** :
   ```bash
   # Vérifier le statut
   sudo systemctl status mongod
   
   # Vérifier les logs
   sudo tail -f /var/log/mongodb/mongod.log
   ```

2. **Erreur d'authentification** :
   ```bash
   # Tester la connexion
   mongosh -u neomi_prod_user -p --authenticationDatabase admin neomi-prod-db
   ```

3. **Application qui ne démarre pas** :
   ```bash
   # Vérifier les logs PM2
   pm2 logs neomi-app
   
   # Redémarrer l'application
   pm2 restart neomi-app
   ```

## 🔗 Liens Utiles

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Guide de sécurité MongoDB](https://docs.mongodb.com/manual/security/)
- [Documentation Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

**⚠️ Important** : Changez TOUS les mots de passe par défaut avant la mise en production !

**📞 Support** : En cas de problème, vérifiez les logs en priorité : MongoDB (`/var/log/mongodb/mongod.log`) et PM2 (`pm2 logs`).