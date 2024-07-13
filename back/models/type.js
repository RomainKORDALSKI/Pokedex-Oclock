import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Type extends Model {}
Type.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Type',
  tableName: 'type',
  timestamps: false
});

