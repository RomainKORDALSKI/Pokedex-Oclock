import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";
import { Pokemon } from "./pokemon.js";
import { Type } from "./type.js";

export class PokemonType extends Model {}
PokemonType.init({
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
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Type,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'PokemonType',
  tableName: 'pokemon_type',
  timestamps: false
});