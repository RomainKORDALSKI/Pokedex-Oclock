import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Team extends Model {}
Team.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Team',
  tableName: 'team',
  timestamps: false
});