// Script de migration pour ajouter le champ deletedAt
// À exécuter une seule fois après le déploiement

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dbConnect from '../src/app/lib/mongodb.js';

// Charger les variables d'environnement depuis la racine du projet
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });
import Article from '../src/app/models/Article.js';
import Avis from '../src/app/models/Avis.js';
import Secteur from '../src/app/models/Secteur.js';
import Organigramme from '../src/app/models/Organigramme.js';

const runMigration = async () => {
  try {
    console.log('🚀 Début de la migration pour le système de corbeille...');
    
    await dbConnect();
    
    // Migration des Articles
    console.log('📝 Migration des articles...');
    const articlesResult = await Article.updateMany(
      { deletedAt: { $exists: false } },
      { $unset: { deletedAt: 1 } }
    );
    console.log(`   ✅ ${articlesResult.modifiedCount} articles mis à jour`);
    
    // Migration des Avis
    console.log('💬 Migration des avis...');
    const avisResult = await Avis.updateMany(
      { deletedAt: { $exists: false } },
      { $unset: { deletedAt: 1 } }
    );
    console.log(`   ✅ ${avisResult.modifiedCount} avis mis à jour`);
    
    // Migration des Secteurs
    console.log('🏢 Migration des secteurs...');
    const secteursResult = await Secteur.updateMany(
      { deletedAt: { $exists: false } },
      { $unset: { deletedAt: 1 } }
    );
    console.log(`   ✅ ${secteursResult.modifiedCount} secteurs mis à jour`);
    
    // Migration de l'Organigramme
    console.log('👥 Migration de l\'organigramme...');
    const organigrammeResult = await Organigramme.updateMany(
      { deletedAt: { $exists: false } },
      { $unset: { deletedAt: 1 } }
    );
    console.log(`   ✅ ${organigrammeResult.modifiedCount} membres mis à jour`);
    
    console.log('🎉 Migration terminée avec succès !');
    
    // Afficher un résumé
    console.log('\n📊 Résumé de la migration :');
    console.log(`- Articles : ${articlesResult.modifiedCount} mis à jour`);
    console.log(`- Avis : ${avisResult.modifiedCount} mis à jour`);
    console.log(`- Secteurs : ${secteursResult.modifiedCount} mis à jour`);
    console.log(`- Organigramme : ${organigrammeResult.modifiedCount} mis à jour`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error);
  } finally {
    process.exit(0);
  }
};

// Exécuter la migration si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration;