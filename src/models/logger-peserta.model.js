'use strict';

const LoggerPesertaScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idLoggerPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_log_login_peserta'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
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
  LoggerPesertaScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const LoggerPeserta = sequelizeInstance
      .define(
        'LoggerPeserta',
        LoggerPesertaScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 't_log_login_peserta',
          modelName: 'LoggerPeserta',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    LoggerPeserta.associate = models => {
      models.LoggerPeserta.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
    }
    return LoggerPeserta;
  },
};
