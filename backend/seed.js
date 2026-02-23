// backend/seed.js
const bcrypt = require('bcryptjs');
const { User } = require('./models');
const sequelize = require('./config/database');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la DB réussie pour le seeding');
    
    // Vérifier si l'admin existe déjà
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@sonabel.bf',
        role: 'admin',
        nom: 'ADMIN',
        prenom: 'System'
      });
      console.log('✅ Utilisateur admin créé (admin/admin)');
    } else {
      console.log("ℹ️ L'utilisateur admin existe déjà");
    }

    // Vérifier si l'utilisateur test existe déjà
    const testExists = await User.findOne({ where: { username: 'test' } });
    
    if (!testExists) {
      const hashedPasswordTest = await bcrypt.hash('test', 10);
      await User.create({
        username: 'test',
        password: hashedPasswordTest,
        email: 'test@sonabel.bf',
        role: 'user',
        nom: 'TEST',
        prenom: 'User'
      });
      console.log('✅ Utilisateur test créé (test/test)');
    } else {
      console.log("ℹ️ L'utilisateur test existe déjà");
    }
  } catch (error) {
    console.error('❌ Erreur de seeding:', error);
  } finally {
    process.exit();
  }
}

seed();