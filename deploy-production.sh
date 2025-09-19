#!/bin/bash

# 🚀 Script de Déploiement Automatisé - Neomi App
# Auteur: Neomi Team
# Version: 1.0
# Date: $(date +%Y-%m-%d)

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions d'affichage
print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🚀 NEOMI APP - DEPLOIEMENT EN PRODUCTION${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    print_info "Vérification des prérequis..."
    
    # Vérifier si l'utilisateur est root/sudo
    if [[ $EUID -eq 0 ]]; then
        print_error "Ne pas exécuter ce script en tant que root. Utilisez un utilisateur avec sudo."
        exit 1
    fi
    
    # Vérifier sudo
    if ! sudo -n true 2>/dev/null; then
        print_error "Accès sudo requis. Exécutez: sudo -v"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé. Installez Node.js 18+ d'abord."
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé."
        exit 1
    fi
    
    print_success "Prérequis validés"
}

# Installation de MongoDB
install_mongodb() {
    print_info "Installation de MongoDB..."
    
    if command -v mongosh &> /dev/null; then
        print_warning "MongoDB semble déjà installé"
        read -p "Voulez-vous continuer l'installation ? (y/N): " confirm
        if [[ ! $confirm =~ ^[Yy]$ ]]; then
            return 0
        fi
    fi
    
    # Import de la clé MongoDB
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    
    # Ajouter le repository
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    
    # Installation
    sudo apt update
    sudo apt install -y mongodb-org
    
    # Démarrer MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    print_success "MongoDB installé et démarré"
}

# Configuration sécurisée de MongoDB
configure_mongodb() {
    print_info "Configuration sécurisée de MongoDB..."
    
    # Backup de la configuration existante
    sudo cp /etc/mongod.conf /etc/mongod.conf.backup.$(date +%Y%m%d_%H%M%S)
    
    # Créer la nouvelle configuration
    cat << 'EOF' | sudo tee /etc/mongod.conf > /dev/null
# mongod.conf - Configuration sécurisée pour production

storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
  logRotate: reopen

net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
  fork: true
  pidFilePath: /var/lib/mongodb/mongod.pid

operationProfiling:
  slowOpThresholdMs: 100
  mode: slowOp
EOF
    
    print_success "Configuration MongoDB mise à jour"
}

# Création des utilisateurs MongoDB
create_mongodb_users() {
    print_info "Création des utilisateurs MongoDB..."
    
    # Demander les mots de passe
    echo ""
    print_warning "Configuration des mots de passe MongoDB"
    read -s -p "Mot de passe pour l'administrateur MongoDB: " MONGO_ADMIN_PASSWORD
    echo ""
    read -s -p "Mot de passe pour l'utilisateur Neomi: " NEOMI_DB_PASSWORD
    echo ""
    
    # Arrêter MongoDB temporairement pour créer le premier utilisateur
    sudo systemctl stop mongod
    
    # Démarrer MongoDB sans authentification
    sudo -u mongodb mongod --config /etc/mongod.conf --noauth &
    MONGOD_PID=$!
    
    sleep 5  # Attendre que MongoDB démarre
    
    # Créer l'utilisateur admin
    mongosh --eval "
    use admin;
    db.createUser({
      user: 'mongoAdmin',
      pwd: '$MONGO_ADMIN_PASSWORD',
      roles: [
        { role: 'userAdminAnyDatabase', db: 'admin' },
        { role: 'readWriteAnyDatabase', db: 'admin' },
        { role: 'dbAdminAnyDatabase', db: 'admin' }
      ]
    });
    print('✅ Utilisateur administrateur créé');
    "
    
    # Créer l'utilisateur Neomi
    mongosh --eval "
    use admin;
    db.createUser({
      user: 'neomi_prod_user',
      pwd: '$NEOMI_DB_PASSWORD',
      roles: [
        { role: 'readWrite', db: 'neomi-prod-db' },
        { role: 'dbAdmin', db: 'neomi-prod-db' }
      ]
    });
    print('✅ Utilisateur Neomi créé');
    "
    
    # Arrêter MongoDB temporaire
    kill $MONGOD_PID
    wait $MONGOD_PID 2>/dev/null || true
    
    # Redémarrer MongoDB avec authentification
    sudo systemctl start mongod
    
    # Tester la connexion
    if mongosh -u neomi_prod_user -p "$NEOMI_DB_PASSWORD" --authenticationDatabase admin neomi-prod-db --eval "db.runCommand('ping')" &>/dev/null; then
        print_success "Utilisateurs MongoDB créés et testés"
        
        # Sauvegarder les credentials dans un fichier sécurisé
        cat > ~/.neomi_credentials << EOF
# Credentials MongoDB Neomi - GARDEZ CE FICHIER SECRET !
MONGO_ADMIN_USER=mongoAdmin
MONGO_ADMIN_PASSWORD=$MONGO_ADMIN_PASSWORD
NEOMI_DB_USER=neomi_prod_user
NEOMI_DB_PASSWORD=$NEOMI_DB_PASSWORD
NEOMI_DB_NAME=neomi-prod-db
EOF
        chmod 600 ~/.neomi_credentials
        print_success "Credentials sauvegardés dans ~/.neomi_credentials"
    else
        print_error "Erreur lors du test de connexion MongoDB"
        exit 1
    fi
}

# Configuration du firewall
configure_firewall() {
    print_info "Configuration du firewall..."
    
    if ! command -v ufw &> /dev/null; then
        sudo apt install -y ufw
    fi
    
    # Configuration UFW
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Règles essentielles
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    
    # NE PAS exposer MongoDB
    print_warning "MongoDB (port 27017) restera fermé au public pour la sécurité"
    
    # Activer le firewall
    sudo ufw --force enable
    
    print_success "Firewall configuré"
    sudo ufw status numbered
}

# Installation des dépendances de l'application
install_app_dependencies() {
    print_info "Installation des dépendances de l'application..."
    
    if [[ ! -f "package.json" ]]; then
        print_error "Fichier package.json non trouvé. Êtes-vous dans le bon répertoire ?"
        exit 1
    fi
    
    # Installation des dépendances
    npm ci --production=false
    
    # Build de production
    print_info "Construction du build de production..."
    npm run build
    
    print_success "Application buildée avec succès"
}

# Configuration de l'environnement de production
configure_environment() {
    print_info "Configuration de l'environnement de production..."
    
    # Charger les credentials
    source ~/.neomi_credentials
    
    # Générer des secrets sécurisés
    JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Demander les informations de configuration
    echo ""
    print_warning "Configuration de l'environnement de production"
    read -p "Nom de domaine (ex: example.com): " DOMAIN_NAME
    read -p "Email de contact: " CONTACT_EMAIL
    read -p "Nom d'utilisateur admin: " ADMIN_USERNAME
    read -s -p "Mot de passe admin: " ADMIN_PASSWORD
    echo ""
    
    # Créer le fichier .env.production
    cat > .env.production << EOF
# Configuration de Production Neomi App
# Généré automatiquement le $(date)

# Variables d'authentification
JWT_SECRET=$JWT_SECRET
LOGIN=$ADMIN_USERNAME
PASSWORD=$ADMIN_PASSWORD

# Configuration MongoDB
MONGODB_URI=mongodb://$NEOMI_DB_USER:$NEOMI_DB_PASSWORD@localhost:27017/$NEOMI_DB_NAME?authSource=admin

# Configuration Next.js
NODE_ENV=production
NEXTAUTH_URL=https://$DOMAIN_NAME
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Configuration Email
CONTACT_EMAIL=$CONTACT_EMAIL
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=$CONTACT_EMAIL
SMTP_PASS=CHANGEZ_MOI_MOT_DE_PASSE_APP

# Configuration serveur
PORT=3000
EOF
    
    # Sécuriser le fichier
    chmod 600 .env.production
    
    print_success "Fichier .env.production créé"
    print_warning "N'oubliez pas de configurer SMTP_PASS dans .env.production"
}

# Installation de PM2
install_pm2() {
    print_info "Installation de PM2..."
    
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
    
    # Créer la configuration PM2
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'neomi-app',
    script: 'npm',
    args: 'start',
    env: {
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
EOF
    
    # Créer le dossier de logs
    sudo mkdir -p /var/log/pm2
    sudo chown $USER:$USER /var/log/pm2
    
    print_success "PM2 configuré"
}

# Démarrage de l'application
start_application() {
    print_info "Démarrage de l'application..."
    
    # Copier le fichier d'environnement
    cp .env.production .env
    
    # Démarrer avec PM2
    pm2 start ecosystem.config.js --env production
    
    # Sauvegarder la configuration
    pm2 save
    
    # Configuration du démarrage automatique
    pm2 startup
    
    print_success "Application démarrée avec PM2"
    
    # Afficher le statut
    pm2 status
}

# Test final
final_test() {
    print_info "Tests finaux..."
    
    # Test MongoDB
    source ~/.neomi_credentials
    if mongosh -u "$NEOMI_DB_USER" -p "$NEOMI_DB_PASSWORD" --authenticationDatabase admin "$NEOMI_DB_NAME" --eval "db.runCommand('ping')" &>/dev/null; then
        print_success "MongoDB: ✅ Connexion réussie"
    else
        print_error "MongoDB: ❌ Problème de connexion"
    fi
    
    # Test de l'application (attendre un peu)
    sleep 10
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Application: ✅ Répond sur le port 3000"
    else
        print_warning "Application: ⚠️  Vérifiez les logs PM2"
    fi
    
    # Afficher les informations finales
    echo ""
    print_header
    print_success "🎉 DÉPLOIEMENT TERMINÉ !"
    echo ""
    print_info "Prochaines étapes:"
    echo "1. Configurez Nginx comme reverse proxy"
    echo "2. Installez un certificat SSL (Let's Encrypt)"
    echo "3. Configurez SMTP_PASS dans .env.production"
    echo "4. Testez votre application"
    echo ""
    print_info "Commandes utiles:"
    echo "• pm2 status                 - Statut de l'application"
    echo "• pm2 logs neomi-app         - Logs de l'application"
    echo "• pm2 restart neomi-app      - Redémarrer l'application"
    echo "• sudo systemctl status mongod - Statut MongoDB"
    echo ""
    print_warning "Credentials sauvegardés dans: ~/.neomi_credentials"
}

# Script principal
main() {
    print_header
    
    print_info "Début du déploiement automatisé..."
    echo ""
    
    # Demander confirmation
    read -p "Voulez-vous continuer le déploiement en production ? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_info "Déploiement annulé"
        exit 0
    fi
    
    # Exécution des étapes
    check_prerequisites
    install_mongodb
    configure_mongodb
    create_mongodb_users
    configure_firewall
    install_app_dependencies
    configure_environment
    install_pm2
    start_application
    final_test
}

# Gestion des erreurs
trap 'print_error "Erreur détectée à la ligne $LINENO. Déploiement interrompu."; exit 1' ERR

# Exécution du script principal
main "$@"