'use strict';

const LoggerScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idLogger: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_loger'
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'level',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'message',
    },
    meta: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'meta',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'timestamp',
    },
  };
};

module.exports = {
  LoggerScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const Logger = sequelizeInstance
      .define(
        'Logger',
        LoggerScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_address',
          modelName: 'Logger',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
      
    return Logger;
  },
};
