'use strict';

const NPLScheme = Sequelize => {
  const { DataTypes } = Sequelize;

  return {
    idNpl: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_npl'
    },
    idPembelianNPL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_pembelian_npl'
    },
    idPeserta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_peserta'
    },
    idEvent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_event'
    },
    noNpl: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'no_npl',
    },
    npl: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'npl',
    },
    statusNPL: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status_npl'
    },
    statusAktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'status_aktif',
    },
    createBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'create_by'
    },
    updateBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'update_by'
    },
    deleteBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'delete_by'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
      field: 'deleted_at',
    },
  };
};

module.exports = {
  NPLScheme,
  ModelFn: (sequelizeInstance, Sequelize) => {
    const NPL = sequelizeInstance
      .define(
        'NPL',
        NPLScheme(Sequelize),
        {
          sequelizeInstance,
          tableName: 'm_npl',
          modelName: 'NPL',
          underscored: true,
          timestamps: false,
          paranoid: true,
        },
      );
    
    NPL.associate = models => {
      models.NPL.belongsTo(models.User, {
        foreignKey: 'idPeserta',
        constraint: false
      });
      models.NPL.belongsTo(models.Event, {
        foreignKey: 'idEvent',
        constraint: false
      });
      models.NPL.belongsTo(models.PembelianNPL, {
        foreignKey: 'idPembelianNPL',
        constraint: false
      });
    }
    return NPL;
  },
};
