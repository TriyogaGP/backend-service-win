'use strict';

const LoggerAdminScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idLoggerAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_log_login_admin'
    },
    idAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_admin'
    },
    latitude: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'latitude',
    },
    longitude: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'longitude',
    },
    provinsi: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'provinsi',
    },
    kota: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'kota',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'created_at',
    },
  };
};

module.exports = {
  LoggerAdminScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const LoggerAdmin = sequelizeInstance
      .define(
        'LoggerAdmin',
        LoggerAdminScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_log_login_admin',
          modelName: 'LoggerAdmin',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );

    LoggerAdmin.associate = models => {
      models.LoggerAdmin.belongsTo(models.Admin, {
        foreignKey: 'idAdmin',
        constraint: false
      });
    }  
    return LoggerAdmin;
  },
};
