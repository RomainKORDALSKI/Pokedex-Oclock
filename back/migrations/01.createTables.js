import "dotenv/config";

import { sequelize } from "../models/index.js"; // Import du client de connexion (pour fermeture en fin de script)

console.log("💀 Dropping tables..."); // Notamment pour relancer le script plusieurs fois si on veut faire un reset:db
await sequelize.drop();

console.log("🚧 Creating tables..."); // Synchroniser le modèle séquelize avec la BDD, ie, créer les tables à partir du modèle Sequelize
await sequelize.sync();

console.log("✅ Done ! Closing DB connection..."); // On ferme le tunnel de connexion pour que le script s'arrête bien
await sequelize.close();