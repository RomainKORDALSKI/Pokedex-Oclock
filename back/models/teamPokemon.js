import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";
import { Pokemon } from "./pokemon.js";
import { Team } from "./team.js";

export class TeamPokemon extends Model {}
TeamPokemon.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pokemon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pokemon,
      key: 'id'
    }
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Team,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'TeamPokemon',
  tableName: 'team_pokemon',
  timestamps: false
});