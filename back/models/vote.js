import { Model, DataTypes } from 'sequelize';
import {sequelize} from './sequelize.js'; 

export class Vote extends Model {}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pokemonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Vote',
    tableName: 'votes', 
    timestamps: false,
  }
);


